import {COOKDEX_ORIGIN} from './settings.mjs';
// Only public trading and wallet-authorized pool endpoints are exposed here.
const allowed = /^(?:\/api\/public\/(?:token-navigator|updated-tokens|swap-token-catalog|token-logos|wallet-chains)|\/api\/public\/native-market\/[a-z]+|\/api\/public\/token\/[a-z]+\/[A-Za-z0-9]+\/market|\/api\/public\/meme-easy-launch|\/api\/pools(?:\/(?:catalog(?:\/remove)?|config|routers|quote|liquidity-quote|auto-buy-quote|build|claim|manage\/(?:build|released)|drafts))?|\/api\/user\/(?:challenge|login|logout|session)|\/api\/limit-orders\/[a-z]+(?:\/mine|\/0x[0-9a-fA-F]{64}\/cancel)?|\/api\/swap\/[a-z]+\/(?:build|token\/[A-Za-z0-9]+))$/;
export function installCookdexProxy(app) {
 const publicCache=new Map(),pending=new Map();
 app.use('/api/cookdex', async (req,res,next)=>{
  if(!COOKDEX_ORIGIN)return res.status(503).json({error:'This feature requires a configured CookDEX-compatible service.'});const pathname=req.path;const orderRead=/^\/api\/limit-orders\/[a-z]+\/mine$/.test(pathname);const orderWrite=/^\/api\/limit-orders\/[a-z]+(?:\/0x[0-9a-fA-F]{64}\/cancel)?$/.test(pathname);if((orderRead||pathname==='/api/public/wallet-chains')&&req.method!=='GET'||orderWrite&&req.method!=='POST')return res.status(405).json({error:'Method unavailable.'});if(['/api/public/token-navigator','/api/public/swap-token-catalog','/api/public/updated-tokens','/api/public/token-logos'].includes(pathname)&&req.method!=='GET')return res.status(405).json({error:'Read-only endpoint.'});
  if(!allowed.test(pathname)||!['GET','POST'].includes(req.method)) return res.status(404).json({error:'Endpoint unavailable.'});
  if(req.method==='GET'&&['/api/pools/catalog','/api/pools/config'].includes(pathname)){
   const cached=publicCache.get(pathname);
   const refresh=()=>{
    if(pending.has(pathname))return pending.get(pathname);
    const task=fetch(COOKDEX_ORIGIN+pathname,{redirect:'error',signal:AbortSignal.timeout(25000)}).then(async r=>{const body=await r.json();if(!r.ok||!body.success)throw Error('Pool service temporarily unavailable.');const row={body,time:Date.now()};publicCache.set(pathname,row);return row;}).finally(()=>pending.delete(pathname));pending.set(pathname,task);return task;
   };
   if(cached){if(Date.now()-cached.time>30000)refresh().catch(()=>{});return res.json({...cached.body,cacheAgeSeconds:Math.floor((Date.now()-cached.time)/1000)});}
   try{return res.json((await refresh()).body);}catch(e){return next(e);}
  }
  try {
   const headers={'Accept':'application/json'};
   const session=String(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('dex_user_session='));
   if(session)headers.Cookie=session;
   if(req.method==='POST')headers['Content-Type']='application/json';
   const upstream=await fetch(COOKDEX_ORIGIN+pathname+(req.url.includes('?')?req.url.slice(req.url.indexOf('?')):''),{method:req.method,headers,body:req.method==='POST'?JSON.stringify(req.body):undefined,redirect:'error',signal:AbortSignal.timeout(55000)});
   // Keep the wallet session on this host; never forward Cookdex admin cookies.
   for(const c of upstream.headers.getSetCookie()) if(/^dex_user_session=/i.test(c))res.append('Set-Cookie',c.replace(/;\s*Domain=[^;]+/gi,'').replace(/;\s*Path=[^;]+/gi,'')+'; Path=/api/cookdex; Secure; HttpOnly; SameSite=Lax');
   const data=await upstream.text();
   if(!upstream.headers.get('content-type')?.includes('application/json'))return res.status(502).json({error:'Cookdex pool service is temporarily unavailable.'});
   res.status(upstream.status).type('application/json').send(data);
  }catch(error){next(error);}
 });
}
