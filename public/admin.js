const status=document.querySelector('#status'),form=document.querySelector('#mysql');
async function api(path,body){const r=await fetch('/api/admin/'+path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,credentials:'same-origin',cache:'no-store'});const v=await r.json();if(!r.ok)throw Error(v.error||'Request failed');return v;}
async function load(){const c=await api('mysql');void loadProfiles();document.querySelector('#login').hidden=true;document.querySelector('#settings').hidden=false;const tunnel=await api('tunnel');document.querySelector('#tunnel-status').textContent=tunnel.connected?'SSH tunnel connected · encrypted transport active':'SSH tunnel unavailable · the service will reconnect automatically';form.elements.password.placeholder=c.passwordSet?'Saved password — leave blank to keep':'Enter database password';}
async function busy(fn){for(const b of document.querySelectorAll('button'))b.disabled=true;status.textContent='Please wait…';try{await fn();}catch(e){status.textContent=e.shortMessage||e.message;}finally{for(const b of document.querySelectorAll('button'))b.disabled=false;}}
document.querySelector('#connect').onclick=()=>busy(async()=>{if(!window.ethereum)throw Error('Open this page in a browser with MetaMask or another Ethereum wallet.');const c=await api('challenge',{}),provider=new ethers.BrowserProvider(window.ethereum),signer=await provider.getSigner();if((await signer.getAddress()).toLowerCase()!==c.address)throw Error('Select the CookDEX administrator wallet.');const signature=await signer.signMessage(c.message);await api('login',{nonce:c.nonce,signature});await load();status.textContent='Signed in.';});
document.querySelector('#logout').onclick=()=>busy(async()=>{await api('logout',{});location.reload();});
async function action(save){const body=Object.fromEntries(new FormData(form));body.tls=false;const r=await api('mysql/'+(save?'save':'test'),body);status.textContent=r.message+' Stored trades: '+(r.trades==null?'Not indexed yet':r.trades)+(save?' Settings saved.':'');if(save){form.elements.password.value='';await load();}}
document.querySelector('#test').onclick=()=>busy(()=>action(false));form.onsubmit=e=>{e.preventDefault();busy(()=>action(true));};

async function loadProfiles(){await Promise.all([...document.querySelectorAll('[data-database-profile]')].map(async f=>{
 const feedback=f.querySelector('[data-profile-status]');
 try{const c=await api('databases/'+f.dataset.databaseProfile);for(const key of ['host','port','database','user'])f.elements[key].value=c[key];f.elements.password.placeholder=c.passwordSet?'Saved password — leave blank to keep':'Enter database password';feedback.textContent=c.passwordSet?'Connection configured.':'Not configured.';}catch(e){feedback.textContent=e.message;}
}));}
document.querySelectorAll('[data-database-profile]').forEach(f=>{
 const run=async save=>{const feedback=f.querySelector('[data-profile-status]');feedback.textContent='Testing connection…';try{const r=await api('databases/'+f.dataset.databaseProfile+'/'+(save?'save':'test'),Object.fromEntries(new FormData(f)));feedback.textContent=r.message+(r.trades!==null?' Stored trades: '+r.trades:'')+(save?' Settings saved.':'');status.textContent=feedback.textContent;if(save){f.elements.password.value='';f.elements.password.placeholder='Saved password — leave blank to keep';}}catch(e){feedback.textContent=e.message;throw e;}};
 f.onsubmit=e=>{e.preventDefault();void busy(()=>run(true));};f.querySelector('[data-profile-test]').onclick=()=>{if(f.reportValidity())void busy(()=>run(false));};
});

load().catch(()=>{});

