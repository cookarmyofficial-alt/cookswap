import {COOKDEX_ORIGIN,PRIMARY} from './settings.mjs';
import {readFileSync} from 'node:fs';
const seed=JSON.parse(readFileSync(new URL('./networks.json',import.meta.url)));
const address=v=>typeof v==='string'&&/^0x(?!0{40})[a-f0-9]{40}$/i.test(v);
const url=v=>{try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}};
export function normalizeNetworks(rows){
 if(!Array.isArray(rows)||rows.length>200)throw Error('Invalid chain discovery response');
 const result=[],seen=new Set();
 for(let row of rows){
  if(!row||!/^[a-z][a-z0-9_]{0,39}$/.test(row.key)||seen.has(row.key))continue;
  if(row.family==='solana'){const old=seed.find(n=>n.key===row.key);if(old){result.push({...old,name:String(row.name||old.name).slice(0,80),logo:row.logo||old.logo});seen.add(row.key);}continue;}
  if(row.isEvm!==true||!Number.isSafeInteger(row.chainId)||row.chainId<=0||!address(row.wrapped)||!url(row.rpc))continue;
  const sources=(Array.isArray(row.sources)?row.sources:[]).filter(s=>['v2','v3'].includes(s?.type)&&address(s.router)).slice(0,20).map(s=>({name:String(s.name||'Configured DEX').slice(0,80),type:s.type,router:s.router,...(address(s.factory)?{factory:s.factory}:{}),...(address(s.quoter)?{quoter:s.quoter}:{})}));
  if(!((address(row.v2Factory)&&address(row.v2Router))||(address(row.v3Factory)&&address(row.v3Router))||(row.factories?.some(address)&&row.routers?.some(address)&&sources.length)))continue;
  let logo=null;try{const u=new URL(row.logo,'https://cookdex.net');if(u.protocol==='https:'&&['cookdex.net','cookscan.net'].includes(u.hostname)&&!u.username&&!u.password)logo=u.href;}catch{}
  const previous=seed.find(n=>n.key===row.key);
  row={...row,stablecoins:[...new Set([...(row.stablecoins||[]),...(previous?.stablecoins||[])].filter(address))]};
  result.push({...row,key:row.key,name:String(row.name||row.key).slice(0,80),nativeSymbol:String(row.nativeSymbol||'Native').slice(0,24),logo,rpc:url(row.rpc),fallback:(row.fallback||[]).map(url).filter(Boolean).slice(0,4),wrapped:row.wrapped.toLowerCase(),v2Factory:address(row.v2Factory)?row.v2Factory:'',v2Router:address(row.v2Router)?row.v2Router:'',v3Factory:address(row.v3Factory)?row.v3Factory:'',v3Router:address(row.v3Router)?row.v3Router:'',routers:(row.routers||[]).filter(address).slice(0,20),sources,stablecoins:(row.stablecoins||[]).filter(address).slice(0,6),explorer:url(row.explorer)||''});seen.add(row.key);
 }
 if(!result.some(n=>n.key===PRIMARY.key))throw Error('Primary network missing from discovery');
 return result;
}
export function createDiscovery(fetcher=fetch,now=Date.now){
 let current=seed,time=0,pending=null,retryAt=0;
 const refresh=()=>{
  if(pending)return pending;
  pending=(async()=>{const response=await fetcher(COOKDEX_ORIGIN+'/api/public/swap-networks',{redirect:'error',signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('Discovery unavailable');const body=await response.json();if(!body.success)throw Error('Discovery unavailable');current=normalizeNetworks(body.items);time=now();return current;})().catch(error=>{retryAt=now()+30000;console.warn('Swap chain discovery:',error.message);return current;}).finally(()=>pending=null);
  return pending;
 };
 return {async networks(){if(!COOKDEX_ORIGIN)return seed;if(now()<retryAt)return current;if(!time)return refresh();if(now()-time>=60000)refresh();return current;},refresh};
}
const discovery=createDiscovery();
export const discoveredNetworks=()=>discovery.networks();
