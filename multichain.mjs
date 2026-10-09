import {PRIMARY} from './settings.mjs';
import {systemCurves} from './system-curve-quotes.mjs';
import {walletBalanceCache} from './balance-cache.mjs';
import {readFileSync} from 'node:fs';
import {JsonRpcProvider,Contract,getAddress,id,FetchRequest,ZeroAddress} from 'ethers';
import {ERC,V2,V3,metadata,quote} from './core.mjs';
import {discoveredNetworks} from './network-discovery.mjs';
const revisions=new Map();
const providers=new Map(),configs=new Map();
export function installMultichain(app,cookProvider,cookConfig){
 providers.set(PRIMARY.key,cookProvider);
 const route=f=>(req,res,next)=>Promise.resolve(f(req,res)).catch(next);
 async function config(key){const networks=await discoveredNetworks();const n=networks.find(n=>n.key===key);if(!n?.isEvm)throw Error('Select an EVM network.');const revision=JSON.stringify(n);if(configs.has(key)&&revisions.get(key)===revision)return configs.get(key);configs.delete(key);revisions.set(key,revision);const task=(async()=>{
  const urls=[...(key==='arc'?['https://rpc.blockdaemon.mainnet.arc.io']:key==='base'?['https://base-rpc.publicnode.com']:[]),n.rpc,...n.fallback.slice(0,4)];let p,activeRpc;
  for(const url of [...new Set(urls)]){const request=new FetchRequest(url);request.timeout=7000;request.setThrottleParams({maxAttempts:2,slotInterval:200});const candidate=new JsonRpcProvider(request,n.chainId,{staticNetwork:true,batchMaxCount:1});try{if(Number(BigInt(await candidate.send('eth_chainId',[])))===n.chainId){p=candidate;activeRpc=url;break;}}catch{}candidate.destroy();}if(!p)throw Error(n.name+' RPC is temporarily unavailable.');
  const v2routers=[];
  await Promise.all([...new Set([n.v2Router,...n.routers,...n.sources.filter(s=>s.type==='v2').map(s=>s.router)].filter(Boolean).map(a=>a.toLowerCase()))].map(async router=>{try{const c=new Contract(router,V2,p),[factory,wrapped]=await Promise.all([c.factory(),c.WETH()]);if(n.wrapped&&wrapped.toLowerCase()!==n.wrapped.toLowerCase()&&!(key==='arc'&&n.nativeToken==='0x3600000000000000000000000000000000000000'&&wrapped===ZeroAddress))return;if(router.toLowerCase()===String(n.v2Router||'').toLowerCase()&&n.v2Factory&&factory.toLowerCase()!==n.v2Factory.toLowerCase())return;if(await p.getCode(factory)==='0x')return;v2routers.push({router:router.toLowerCase(),factory:factory.toLowerCase(),name:router.toLowerCase()===String(n.v2Router||'').toLowerCase()?'Cookdex V2':n.sources.find(s=>s.router.toLowerCase()===router.toLowerCase())?.name||'Configured V2'});}catch{}}));
  const v3routers=[];
  const sources=[...new Map([{name:'Cookdex V3',router:n.v3Router,factory:n.v3Factory},...n.sources.filter(s=>s.type==='v3')].filter(s=>s.router).map(s=>[s.router.toLowerCase(),s])).values()];
  await Promise.all(sources.map(async source=>{try{
   const code=(await p.getCode(source.router)).toLowerCase();
   const legacy=id('exactInput((bytes,address,uint256,uint256,uint256))').slice(2,10),router02=id('exactInput((bytes,address,uint256,uint256))').slice(2,10);
   const profile=code.includes(legacy)?'legacy':code.includes(router02)?'router02':null;if(!profile)return;
   const c=new Contract(source.router.toLowerCase(),[...V3,'function factoryV3() view returns(address)'],p);const factory=await c.factory().catch(()=>c.factoryV3());
   if(source.factory&&factory.toLowerCase()!==source.factory.toLowerCase()||await p.getCode(factory)==='0x')return;
   const wrapped=await c.WETH9();if(n.wrapped&&wrapped.toLowerCase()!==n.wrapped.toLowerCase()&&!(key==='arc'&&n.nativeToken==='0x3600000000000000000000000000000000000000'&&wrapped===ZeroAddress))return;
   v3routers.push({router:source.router.toLowerCase(),factory:factory.toLowerCase(),profile,name:source.name});
  }catch{}}));
  const v3=v3routers.find(r=>r.name==='Cookdex V3')||v3routers[0]||null;
  const context={...n,rpc:activeRpc,stablecoins:n.stablecoins.map(a=>a.toLowerCase()),wrapped:n.wrapped.toLowerCase(),v2routers,v3routers,deployments:{v2:v2routers[0]||null,v3},nativeToken:key==='arc'?'0x3600000000000000000000000000000000000000':null,noNativeWrap:key==='robinhood',intermediate:n.wrapped.toLowerCase()};if(key===PRIMARY.key){context.stablecoins=[...new Set([...context.stablecoins,...cookConfig.tokens.filter(t=>['USDC','USDT','DAI'].includes(t.symbol.toUpperCase())).map(t=>t.address.toLowerCase())])];context.intermediate=cookConfig.tokens.find(t=>t.symbol.toUpperCase()==='WETH')?.address.toLowerCase()||context.intermediate;}p.swapContext=context;providers.set(key,p);
  const chainLogo=n.logo?new URL(n.logo,'https://cookdex.net').href:null;
  const tokens=[{address:'native',name:n.nativeSymbol,symbol:n.nativeSymbol,decimals:key==='arc'?6:18,logo:key==='arc'?'/assets/token-default.svg':key==='bsc'?'/assets/token-default.svg':n.nativeSymbol==='ETH'?'/assets/token-default.svg':chainLogo}];
  for(const a of [...new Set([n.wrapped,...n.stablecoins.slice(0,3)].filter(Boolean).map(a=>a.toLowerCase()))].filter(a=>a!==context.nativeToken))try{const t=await metadata(p,a);tokens.push({...t,logo:a.toLowerCase()===n.wrapped.toLowerCase()?(n.nativeSymbol==='ETH'?'/assets/token-default.svg':chainLogo):t.symbol.toUpperCase()==='USDC'?'/assets/token-default.svg':null});}catch{}
  if(key==='arc')tokens.push({...await metadata(p,'0x128cc466b61f542da60c70e3aa11c10e19b84edb'),logo:'/assets/token-default.svg'});
  if(key==='robinhood'){
   tokens.shift();
   try{tokens.push({...await metadata(p,'0x64CE7a75ae2F0Ab86A8ae1d2Ea8F412f44F94A5B'),logo:'/assets/token-default.svg'});}catch{}
  }
  if(key===PRIMARY.key)for(const t of cookConfig.tokens)if(!tokens.some(v=>v.address.toLowerCase()===t.address.toLowerCase()))tokens.push(t);
  if(tokens.length<2)throw Error('Token configuration unavailable.');
  if(!v2routers.length&&!v3routers.length)throw Error('No compatible deployed router and factory found on this network.');
  return {...context,tokens,routers:[...v2routers.map(r=>r.router),...v3routers.map(r=>r.router)],genesis:null};
 })();configs.set(key,task);try{return await task;}catch(e){configs.delete(key);throw e;}}
 app.get('/api/network/:chain/system-curves',route(async(req,res)=>{const key=req.params.chain;if(!(await discoveredNetworks()).some(n=>n.key===key&&n.isEvm))return res.status(404).json({error:'Unknown EVM network.'});res.json({items:await systemCurves(key)});}));
 app.get('/api/network/:chain/config',route(async(req,res)=>res.json(await config(req.params.chain))));
 app.get('/api/network/:chain/token/:address',route(async(req,res)=>{await config(req.params.chain);res.json(await metadata(providers.get(req.params.chain),req.params.address));}));
 app.get('/api/network/:chain/balance/:token/:owner',route(async(req,res)=>{const c=await config(req.params.chain),p=providers.get(req.params.chain),owner=getAddress(req.params.owner),token=req.params.token;res.json(await walletBalanceCache.get({chain:req.params.chain,token,owner},async()=>{const raw=token==='native'&&!c.nativeToken?await p.getBalance(owner):await new Contract(token==='native'?c.nativeToken:getAddress(token),ERC,p).balanceOf(owner);return raw.toString();},{force:req.query.refresh==='1'}));}));
 app.get('/api/network/:chain/gas-price',route(async(req,res)=>{const c=await config(req.params.chain),p=providers.get(req.params.chain),raw=BigInt(await p.send('eth_gasPrice',[]));res.json({gasPrice:String(raw>(req.params.chain==='arc'?20000000000n:10000n)?raw:req.params.chain==='arc'?20000000000n:10000n)});}));
 let active=0;app.post('/api/network/:chain/quote',route(async(req,res)=>{if(active>=4)throw Error('Quotes are busy. Please retry.');active++;try{await config(req.params.chain);res.json(await quote(providers.get(req.params.chain),req.body));}finally{active--;}}));
}

