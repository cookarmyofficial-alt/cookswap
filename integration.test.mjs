import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from './server.mjs';
const mock={async getBlock(){return{hash:'0xcf5b9cb3565f307806ee9f9e7652e405827b20655621ab284c0e80afea85a397'};},async getBlockNumber(){return 42;},async getCode(){return '0x';}};
test('fresh deployment serves UI and rejects unconfigured administrative and external services',async()=>{
 const{app}=await createApp({provider:mock,checkNetwork:false});const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));const origin='http://127.0.0.1:'+server.address().port;
 try{
  const home=await fetch(origin+'/');assert.equal(home.status,200);assert.match(await home.text(),/Market/);
  const health=await (await fetch(origin+'/api/health')).json();assert.equal(health.chainId,20261001);assert.equal(health.block,42);
  assert.equal((await fetch(origin+'/api/admin/mysql')).status,503);
  assert.equal((await fetch(origin+'/api/cookdex/api/admin/config')).status,503);
  assert.equal((await fetch(origin+'/api/read/bridge-token/x')).status,503);
  assert.equal((await fetch(origin+'/api/dex-statistics')).status,503);
  assert.equal((await fetch(origin+'/api/vendor/ethers-6.15.0.js')).status,200);
  const networks=await (await fetch(origin+'/api/networks')).json();assert.ok(networks.some(n=>n.key==='cookchain'));assert.ok(networks.every(n=>n.isEvm));
  assert.equal((await fetch(origin+'/.env')).status,404);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
test('wrong genesis prevents startup',async()=>{
 await assert.rejects(createApp({provider:{...mock,async getBlock(){return{hash:'0xwrong'};}},checkNetwork:false}),/genesis mismatch/);
});
