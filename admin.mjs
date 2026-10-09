import crypto from 'node:crypto';
import net from 'node:net';
import fs from 'node:fs';
import {verifyMessage} from 'ethers';
import mysql from 'mysql2/promise';
const root=process.env.SWAP_ADMIN_DATA||'./data/admin';
const admin=String(process.env.ADMIN_WALLET||'').toLowerCase();
const origin=process.env.APP_ORIGIN||'http://localhost:5012';
const challenges=new Map(),sessions=new Map(),attempts=new Map();
const profiles={main:{file:'mysql.json',database:'cook_dex',user:'swap',port:Number(process.env.DEX_DB_PORT||13306),readonly:true},charts:{file:'mysql-charts.json',database:'chartdata',user:'swap',port:Number(process.env.DEX_DB_PORT||13306),readonly:true},tokens:{file:'mysql-tokens.json',database:'tokendata',user:'swap',port:Number(process.env.DEX_DB_PORT||13306),readonly:true},users:{file:'mysql-users.json',database:'cook_swap',user:'cook_swap',port:Number(process.env.USER_DB_PORT||3306),readonly:false}};
function profile(name='main'){if(!Object.hasOwn(profiles,name))throw Error('Unknown database profile.');return profiles[name];}
function file(name='main'){return root+'/'+profile(name).file;}
function read(name='main'){const p=profile(name);let c={database:p.database,user:p.user,password:''};try{c={...c,...JSON.parse(fs.readFileSync(file(name),'utf8'))};}catch{}return {...c,host:process.env.DB_HOST||'127.0.0.1',port:p.port,tls:false,transport:p.readonly?'ssh-tunnel':'local',readonly:p.readonly};}
function safe(c){return {...c,password:undefined,passwordSet:!!c.password};}
const pools=new Map();
export function publicMysqlConfig(name='main'){const c=read(name);return{passwordSet:!!c.password,hasStoredConfig:!!c.password,database:c.database};}
export async function getPool(name='main'){const c=read(name);if(!c.password)throw Error('MYSQL_NOT_CONFIGURED');const key=JSON.stringify(c),old=pools.get(name);if(old?.key===key)return old.pool;if(old)await old.pool.end();const pool=mysql.createPool({host:c.host,port:c.port,user:c.user,password:c.password,database:c.database,connectTimeout:7000,connectionLimit:2,queueLimit:20,waitForConnections:true,multipleStatements:false});pools.set(name,{key,pool});return pool;}
export function validateGrants(rows,name,database){
 const p=profile(name),allowed=new Set(p.readonly?['USAGE','SELECT','SHOW VIEW']:['USAGE','SELECT','INSERT','UPDATE','DELETE','CREATE','ALTER','INDEX','SHOW VIEW','ALL PRIVILEGES','DROP','REFERENCES','CREATE TEMPORARY TABLES','LOCK TABLES','CREATE VIEW','CREATE ROUTINE','ALTER ROUTINE','EXECUTE','EVENT','TRIGGER']);const found=new Set();
 for(const row of rows)for(const grant of Object.values(row)){
  const m=String(grant).match(/^GRANT (.*?) ON (.*?) TO /i);
  if(!m||/WITH GRANT OPTION/i.test(grant))throw Error('Database permissions are not allowed for this connection.');
  const privileges=m[1].split(',').map(v=>v.trim().toUpperCase());
  if(privileges.some(v=>!allowed.has(v)))throw Error(p.readonly?'This user has permissions beyond read-only. Restrict it to SELECT.':'Use a dedicated user with permissions only for the local user database.');
  if(!p.readonly&&privileges.some(v=>v!=='USAGE')){const scope=m[2].replace(/`/g,'').replace(/\\([_%])/g,'$1');if(scope!==database+'.*')throw Error('The local database user must be restricted to this database.');}
  privileges.forEach(v=>found.add(v));if(!p.readonly&&privileges.includes('ALL PRIVILEGES'))['SELECT','INSERT','UPDATE','DELETE'].forEach(v=>found.add(v));
 }
 if(!p.readonly&&['SELECT','INSERT','UPDATE','DELETE'].some(v=>!found.has(v)))throw Error('The local user database requires SELECT, INSERT, UPDATE and DELETE permissions.');
}
export function installAdmin(app){
 if(!/^0x[0-9a-f]{40}$/.test(admin)){app.use('/api/admin',(req,res)=>res.status(503).json({error:'Administrator wallet is not configured.'}));return;}
 app.use('/api/admin',(req,res,next)=>{res.set('Cache-Control','no-store');if(req.method!=='GET'&&req.headers.origin!==origin)return res.status(403).json({error:'Invalid origin'});next();});
 app.post('/api/admin/challenge',(req,res)=>{const now=Date.now(),key=req.ip,a=attempts.get(key)||{at:now,n:0};if(now-a.at>60000){a.at=now;a.n=0;}attempts.set(key,a);if(++a.n>10)return res.status(429).json({error:'Please wait before retrying.'});for(const[k,v]of challenges)if(v.expires<now)challenges.delete(k);if(challenges.size>1000)return res.sendStatus(503);const nonce=crypto.randomBytes(24).toString('hex'),message=`CookSwap admin login\nDomain: ${new URL(origin).host}\nWallet: ${admin}\nNonce: ${nonce}\nIssued: ${new Date(now).toISOString()}\nThis signature grants administrative access for one hour. No transaction is sent.`;challenges.set(nonce,{message,expires:now+120000});res.json({nonce,message,address:admin});});
 app.post('/api/admin/login',(req,res)=>{const{nonce,signature}=req.body||{},c=challenges.get(nonce);challenges.delete(nonce);try{if(!c||c.expires<Date.now()||typeof signature!=='string'||signature.length>300||verifyMessage(c.message,signature).toLowerCase()!==admin)throw Error();const token=crypto.randomBytes(32).toString('hex');for(const[k,v]of sessions)if(v<Date.now())sessions.delete(k);sessions.set(token,Date.now()+3600000);res.set('Set-Cookie',`swap_admin=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=3600`).json({ok:true});}catch{res.status(401).json({error:'Admin wallet signature required.'});}});
 app.use('/api/admin',(req,res,next)=>{const token=String(req.headers.cookie||'').match(/(?:^|;\s*)swap_admin=([a-f0-9]{64})(?:;|$)/)?.[1];if(!token||!(sessions.get(token)>Date.now()))return res.status(401).json({error:'Please sign in with the administrator wallet.'});req.adminToken=token;next();});
 app.post('/api/admin/logout',(req,res)=>{sessions.delete(req.adminToken);res.set('Set-Cookie','swap_admin=; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=0').json({ok:true});});
 app.get('/api/admin/mysql',(req,res)=>res.json(safe(read())));
 app.get('/api/admin/tunnel',async(req,res)=>{const connected=await new Promise(resolve=>{const socket=net.createConnection({host:'127.0.0.1',port:Number(process.env.DEX_DB_PORT||13306)});let done=false;const finish=value=>{if(done)return;done=true;socket.destroy();resolve(value);};socket.setTimeout(1500);socket.once('data',data=>finish(data.length>=5));socket.once('error',()=>finish(false));socket.once('timeout',()=>finish(false));socket.once('end',()=>finish(false));});res.json({connected,transport:'SSH',localPort:13306,destination:'CookDEX MySQL'});});
 const action=(save,fixed=null)=>async(req,res)=>{let connection;try{
  const name=fixed||req.params.profile,p=profile(name),b=req.body||{},old=read(name);
  if(b.host!=='127.0.0.1'||Number(b.port)!==p.port||!/^[-a-zA-Z0-9_]{1,64}$/.test(String(b.database||''))||!/^[-a-zA-Z0-9_]{1,80}$/.test(String(b.user||'')))throw Error('Use the displayed local host/port and a valid database and user name.');
  const c={host:process.env.DB_HOST||'127.0.0.1',port:p.port,database:b.database,user:b.user,password:typeof b.password==='string'&&b.password?b.password:old.password,tls:false,transport:p.readonly?'ssh-tunnel':'local',readonly:p.readonly};
  if(!c.password||c.password.length>512)throw Error('Database password required.');
  connection=await mysql.createConnection({host:c.host,port:c.port,database:c.database,user:c.user,password:c.password,connectTimeout:7000,multipleStatements:false});
  const[grants]=await connection.query('SHOW GRANTS FOR CURRENT_USER()');validateGrants(grants,name,c.database);
  let trades=null,tableAvailable=true;
  if(name==='main'||name==='charts')try{const[rows]=await connection.query({sql:'SELECT COUNT(*) AS count FROM pool_trades',timeout:8000});trades=Number(rows[0].count);}catch(error){if(error.code!=='ER_NO_SUCH_TABLE')throw error;tableAvailable=false;}
  else if(name==='tokens')try{await connection.query({sql:'SELECT 1 FROM tokens LIMIT 1',timeout:5000});}catch(error){if(error.code!=='ER_NO_SUCH_TABLE')throw error;tableAvailable=false;}
  else await connection.query('SELECT DATABASE() AS db');
  if(save){fs.mkdirSync(root,{recursive:true,mode:0o700});const target=file(name),temp=target+'.tmp';fs.writeFileSync(temp,JSON.stringify(c),{mode:0o600});fs.renameSync(temp,target);}
  res.json({ok:true,saved:save,profile:name,trades,tableAvailable,dataStatus:!tableAvailable?'missing-table':trades===0?'empty':'available',message:name==='users'?'Local database connection and restricted read/write permissions verified. Login is not enabled.':!tableAvailable?'Connection successful. Read-only permissions verified. Data tables are not initialized yet.':'Connection successful. Read-only permissions verified.'});
 }catch(e){const code=String(e.code||'');res.status(400).json({error:code?`Database connection failed (${code}). Check this database user’s password and permissions.`:e.message});}finally{if(connection)await connection.end().catch(()=>{});}};
 app.post('/api/admin/mysql/test',action(false,'main'));app.post('/api/admin/mysql/save',action(true,'main'));
 app.get('/api/admin/databases/:profile',(req,res)=>{try{res.json(safe(read(req.params.profile)));}catch{res.status(404).json({error:'Unknown database profile.'});}});
 app.post('/api/admin/databases/:profile/test',action(false));app.post('/api/admin/databases/:profile/save',action(true));

}
