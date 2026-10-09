import {BRIDGE_ORIGIN} from './settings.mjs';
import {getPool,publicMysqlConfig} from './admin.mjs';
import {createTransferSourceCache} from './bridge-transfer-cache.mjs';
const sourceCache=createTransferSourceCache({getPool:()=>getPool('users'),configured:()=>publicMysqlConfig('users').passwordSet});
export function installBridgeProxy(app){
 app.use(['/api/read','/api/bridge-assets'],(req,res,next)=>BRIDGE_ORIGIN?next():res.status(503).json({error:'Bridge service is not configured.'}));
 const serve=async(req,res,next,url)=>{try{const r=await fetch(BRIDGE_ORIGIN+url,{redirect:'error',signal:AbortSignal.timeout(15000)});res.status(r.status).type(r.headers.get('content-type')||'application/json').send(Buffer.from(await r.arrayBuffer()));}catch(e){next(e);}};
 app.get('/api/read/:kind/*',(req,res,next)=>{
  if(!['bridge-balance','bridge-token','bridge-transfer'].includes(req.params.kind)||!/^\/[a-zA-Z0-9/]+$/.test('/'+req.params[0]))return res.status(404).end();
  if(req.params.kind==='bridge-transfer'){
    const match=req.params[0].match(/^([0-9]+)\/(0x[0-9a-f]{64})$/i);if(!match)return res.status(400).json({error:'Invalid transfer'});
    sourceCache.get(Number(match[1]),match[2],async()=>{const r=await fetch(BRIDGE_ORIGIN+req.originalUrl,{redirect:'error',signal:AbortSignal.timeout(11000)});if(!r.ok)throw Error('Source status temporarily unavailable');return r.json();}).then(data=>res.json(data)).catch(next);return;
  }
  serve(req,res,next,req.originalUrl);
 });
 app.get('/api/bridge-assets/*',(req,res,next)=>{
  const file=req.params[0];
  const valid=/^(?:bridge-route-registry|bridge-status|bridge-mainnet-(?:artifact|deployment)|(?:bsc-|arc-)?automatic-route-artifact|automatic-route-status(?:-(?:bsc-net|arc-net|robinhood-net))?|bridge-profile-(?:bsc-net|arc-net|robinhood-net)-deployment)\.json$/.test(file)||/^bridge-(?:chain|token)-logos\/[a-z]+\.webp$/.test(file);
  if(!valid)return res.status(404).end();serve(req,res,next,'/static/'+file);
 });
}
