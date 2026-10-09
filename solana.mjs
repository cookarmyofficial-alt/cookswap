import {walletBalanceCache} from './balance-cache.mjs';
import {formatUnits} from 'ethers';
const rpc='https://solana-rpc.publicnode.com',mint='So11111111111111111111111111111111111111112';
export function installSolana(app){
 const route=f=>(req,res,next)=>Promise.resolve(f(req,res)).catch(next);
 async function call(method,params){const r=await fetch(rpc,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal:AbortSignal.timeout(12000)});const j=await r.json();if(!r.ok||j.error)throw Error(j.error?.message||'Solana RPC unavailable.');return j.result;}
 app.get('/api/network/solana/config',(req,res)=>res.json({key:'solana',name:'Solana',rpc,explorer:'https://solscan.io',wrapped:mint,tokens:[{address:'native',symbol:'SOL',name:'Solana',decimals:9},{address:'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',name:'USD Coin',symbol:'USDC',decimals:6,logo:'/assets/usdc.webp'}]}));
 app.get('/api/network/solana/token/:address',route(async(req,res)=>{const a=req.params.address;if(!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(a))throw Error('Invalid Solana mint.');const info=await call('getAccountInfo',[a,{encoding:'jsonParsed',commitment:'confirmed'}]);const data=info.value?.data?.parsed?.info;if(!Number.isInteger(data?.decimals))throw Error('No token mint at this address.');res.json({address:a,name:'Imported Solana token',symbol:'TOKEN',decimals:data.decimals});}));
 app.get('/api/network/solana/balance/:token/:owner',route(async(req,res)=>{const {token,owner}=req.params;res.json(await walletBalanceCache.get({chain:'solana',token,owner},async()=>{if(token==='native'){const r=await call('getBalance',[owner,{commitment:'confirmed'}]);return String(r.value);}const r=await call('getTokenAccountsByOwner',[owner,{mint:token},{encoding:'jsonParsed',commitment:'confirmed'}]);return String(r.value.reduce((sum,a)=>sum+BigInt(a.account.data.parsed.info.tokenAmount.amount),0n));},{force:req.query.refresh==='1'}));}));
}
