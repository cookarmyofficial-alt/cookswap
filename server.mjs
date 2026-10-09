import express from 'express';
import {JsonRpcProvider,FetchRequest} from 'ethers';
import {readFileSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {PRIMARY,COOKDEX_ORIGIN,CHART_ORIGIN,BRIDGE_ORIGIN} from './settings.mjs';
import {CHAIN,WRAPPED,DEPLOY,metadata,verify} from './core.mjs';
import {installMultichain} from './multichain.mjs';
import {discoveredNetworks} from './network-discovery.mjs';
import {installCookdexProxy} from './cookdex-proxy.mjs';
import {installBridgeProxy} from './bridge-proxy.mjs';
import {installAdmin} from './admin.mjs';
import {walletBalanceCache} from './balance-cache.mjs';
import {applyDatabaseStatistics} from './database-statistics.mjs';

export async function createApp({provider,checkNetwork=true}={}){
 if(!provider){const request=new FetchRequest(process.env.COOK_RPC||PRIMARY.rpc);request.timeout=12000;provider=new JsonRpcProvider(request,CHAIN,{staticNetwork:true,batchMaxCount:1});}
 if(checkNetwork)await verify(provider);
 const genesis=(await provider.getBlock(0)).hash;
 const expected=process.env.EXPECTED_GENESIS||(PRIMARY.key==='cookchain'?'0xcf5b9cb3565f307806ee9f9e7652e405827b20655621ab284c0e80afea85a397':'');
 if(expected&&genesis.toLowerCase()!==expected.toLowerCase())throw Error('Primary network genesis mismatch');
 const tokens=[{address:'native',symbol:PRIMARY.nativeSymbol||'Native',name:PRIMARY.name,decimals:18,logo:'/assets/token-default.svg'}];
 for(const address of [...new Set([WRAPPED,...PRIMARY.stablecoins||[]])])try{tokens.push({...await metadata(provider,address),logo:'/assets/token-default.svg'});}catch{}
 const app=express();app.disable('x-powered-by');app.set('trust proxy','loopback');app.use(express.json({limit:'16kb'}));
 app.use((req,res,next)=>{res.set('X-Content-Type-Options','nosniff');res.set('Cache-Control','no-store');next();});
 const counters=new Map();
 app.use('/api',(req,res,next)=>{const now=Date.now(),key=req.ip;let row=counters.get(key);if(!row||now-row.at>60000){row={at:now,count:0};counters.set(key,row);}if(++row.count>90)return res.status(429).json({error:'Too many requests. Try again later.'});if(counters.size>5000)for(const[k,v]of counters)if(now-v.at>60000)counters.delete(k);next();});
 const vendor=readFileSync(new URL('./node_modules/ethers/dist/ethers.umd.min.js',import.meta.url));
 app.get('/api/vendor/ethers-6.15.0.js',(req,res)=>res.type('application/javascript').send(vendor));
 app.get('/api/client-config.js',(req,res)=>res.type('application/javascript').send('window.cookSwapConfig='+JSON.stringify({defaultNetwork:PRIMARY.key,cookdexOrigin:COOKDEX_ORIGIN,chartOrigin:CHART_ORIGIN,features:{cookdex:!!COOKDEX_ORIGIN,bridge:!!BRIDGE_ORIGIN}})+';'));
 installAdmin(app);
 app.get('/api/admin/balance-cache',(req,res)=>res.json(walletBalanceCache.status()));
 installCookdexProxy(app);installBridgeProxy(app);
 app.get('/api/networks',async(req,res,next)=>{try{res.json(await discoveredNetworks());}catch(e){next(e);}});
 app.get('/api/dex-statistics',async(req,res,next)=>{try{if(!COOKDEX_ORIGIN)return res.status(503).json({error:'Statistics service is not configured.'});const r=await fetch(COOKDEX_ORIGIN+'/api/public/dex-statistics',{signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('Statistics unavailable');let value=await r.json();try{value=await applyDatabaseStatistics(structuredClone(value));}catch{}res.json(value);}catch(e){next(e);}});
 installMultichain(app,provider,{chainId:CHAIN,genesis,wrapped:WRAPPED,deployments:DEPLOY,tokens});
 app.get('/api/health',async(req,res,next)=>{try{res.json({ok:true,chainId:CHAIN,block:await provider.getBlockNumber()});}catch(e){next(e);}});
 app.get('/api/config',(req,res)=>res.json({chainId:CHAIN,genesis,wrapped:WRAPPED,deployments:DEPLOY,tokens}));
 app.use(express.static(fileURLToPath(new URL('./public/',import.meta.url))));
 app.use((error,req,res,next)=>{console.error(error.shortMessage||error.message);res.status(400).json({error:error.code==='CALL_EXCEPTION'?'Token or pool query failed.':error.shortMessage||error.message||'Request failed.'});});
 return {app,provider};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const{app}=await createApp();const host=process.env.HOST||'127.0.0.1',port=Number(process.env.PORT||5012);app.listen(port,host,()=>console.log(`CookSwap listening on ${host}:${port}`));
}
