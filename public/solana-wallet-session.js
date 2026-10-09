(()=>{
 const choiceKey='cookswap:solana-wallet',offKey='cookswap:solana-disconnected';
 let chosen=localStorage.getItem(choiceKey)|| (window.phantom?.solana?'phantom':window.solflare?'solflare':'metamask'),mm,pending;
 const watched=new WeakSet();
 const changed=()=>window.dispatchEvent(new Event('cookswap:solana-changed'));
 const valid=p=>p&&/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(p.toString());
 async function get(rpc){
  let w;
  if(chosen==='metamask'){
   if(!mm)mm=(async()=>{if(!window.cookMetaMaskSolana)await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='/metamask-solana.js?v=20261005';s.onload=resolve;s.onerror=()=>reject(Error('MetaMask Solana module could not load. Please retry.'));document.head.append(s);});return window.cookMetaMaskSolana(rpc);})().catch(e=>{mm=null;throw e;});
   w=await mm;
  }else w=chosen==='solflare'?window.solflare:window.phantom?.solana||(window.solana?.isPhantom?window.solana:null);
  if(!w)throw Error('Open this page in '+(chosen==='solflare'?'Solflare':'Phantom')+' or install its extension.');
  if(!watched.has(w)){watched.add(w);w.on?.('accountChanged',changed);w.on?.('disconnect',changed);w.on?.('connect',changed);}
  return w;
 }
 window.cookSolanaWallet={get,valid,disabled:()=>localStorage.getItem(offKey)==='1',choice:()=>chosen,
  select(name){if(!['phantom','metamask','solflare'].includes(name))return;chosen=name;localStorage.setItem(choiceKey,name);changed();},
  async connect(rpc){if(!pending){localStorage.removeItem(offKey);pending=(async()=>{const w=await get(rpc);const r=await w.connect();const p=r?.publicKey||w.publicKey;if(!valid(p))throw Error('No valid Solana account returned by the wallet.');return p.toString();})().finally(()=>pending=null);}return pending;},
  async restore(rpc){if(this.disabled())return '';const w=await get(rpc);if(!w.isConnected||!valid(w.publicKey)){const r=await w.connect({onlyIfTrusted:true});if(!valid(r?.publicKey||w.publicKey))return '';}return valid(w.publicKey)?w.publicKey.toString():'';},
  async disconnect(rpc){localStorage.setItem(offKey,'1');changed();const w=await get(rpc);await w.disconnect?.();}
 };
 window.addEventListener('storage',e=>{if(e.key===offKey)changed();});
})();
