'use strict';
(()=>{
 const $=id=>document.getElementById(id),names={hyperevm:'HyperEVM',cookchain:'Cookchain',base:'Base',arc:'Arc',bsc:'BNB Smart Chain',robinhood:'Robinhood',polygon:"Polygon",monad:"Monad",avalanche:"Avalanche",linea:"Linea",sonic:"Sonic",fantom:"Fantom",arbitrum:"Arbitrum",blast:"Blast"};
 const address=(r,n)=>window.CookBridgeRoute.asset(r,n);
 function routeName(r){return r.symbol==='USDT'&&r.automatic&&['bsc','base'].includes(r.collateralChain)?'USDT · '+(r.collateralChain==='bsc'?'BSC':'Base'):(r.name||r.symbol);}
 function tokens(reg,source){const groups=new Map();for(const r of reg.routes.filter(r=>r.enabled&&r.networks[source])){const addr=address(r,source);if(!addr)continue;const key=addr.toLowerCase();if(!groups.has(key))groups.set(key,{address:addr,symbol:source===r.collateralChain?r.symbol:(r.wrappedSymbol||r.symbol),name:routeName(r),routes:[]});groups.get(key).routes.push(r);}return [...groups.values()];}
 function destinations(token,source){return [...new Set(token?.routes.flatMap(r=>Object.keys(r.networks).filter(n=>n!==source))||[])];}
 window.CookBridgeSwapModel={tokens,destinations,address};
const tokenIcons={
"hyperevm:0x327f195c268aa3910c6b4c15360b92b924724d0a":"wcook.webp",
"bsc:0x85dec769279e1303a6c4479beb3a578397024f44":"wcook.webp",
"arc:0xf1df4d18da9d31cbed16a7b1ef6846f77cf69ce0":"wcook.webp",
"robinhood:0xbe602d85593638894bd492cac1591afe7d92919d":"wcook.webp",
"sonic:0x14f68f3753d179a8da17d85e2f54445a416e925e":"wcook.webp",
"blast:0xfad5552b3bc8c62d66745e69485f33b81673fd6c":"wcook.webp",
"fantom:0xa2b11f59be5b81970b21a76b657b60708c0dc905":"wcook.webp",
"avalanche:0x130890d3fa866392edd99976e8f86bad9da6aff8":"wcook.webp",
"polygon:0xf62df06e93340c8f632b0691f444a159d0cddcaa":"wcook.webp",
"monad:0x56df9df1c148e5a146640965a0fd372c40faf2ad":"wcook.webp",
"linea:0x3cd633981b01a8341f59a015b3d5f00ee25af53d":"wcook.webp",

"sonic:0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38":"ws.webp",
"blast:0x4300000000000000000000000000000000000004":"weth.webp",
"fantom:0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83":"wftm.webp",
"arbitrum:0x82af49447d8a07e3bd95bd0d56f35241523fbab1":"weth.webp",
"avalanche:0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7":"wavax.webp",
"polygon:0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270":"wpol.webp",
"monad:0x3bd359c1119da7da1d913d1c4d2b7c461115433a":"wmon.webp",
"linea:0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f":"weth.webp",
"cookchain:0xd321b16f6501db36537a5718062425fe52d82ea8":"ws.webp",
"cookchain:0x26af958cd7a09fef420795e7d68b19a0dc89a9e6":"weth.webp",
"cookchain:0xb9fc593cd988a25ab1b51e1398d3207ac78103e9":"wftm.webp",
"cookchain:0x694423d43fee72223ef90bf3413bc75ca1d56988":"wavax.webp",
"cookchain:0x5c2e5dec72280f2ad5bb7f9befc0ef877aedf62d":"wpol.webp",
"cookchain:0xa8c69e1b3dba07717bbe7db9a03e3581f57fc4f7":"wmon.webp",

 "polygon:0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270":"wpol.webp",
 "monad:0x3bd359c1119da7da1d913d1c4d2b7c461115433a":"wmon.webp",
 "avalanche:0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7":"wavax.webp",
 "linea:0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f":"weth.webp",
 "sonic:0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38":"ws.webp",
 "fantom:0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83":"wftm.webp",
 "arbitrum:0x82af49447d8a07e3bd95bd0d56f35241523fbab1":"weth.webp",
 "blast:0x4300000000000000000000000000000000000004":"weth.webp",
 "cookchain:0xd321b16f6501db36537a5718062425fe52d82ea8":"ws.webp",
 "cookchain:0x26af958cd7a09fef420795e7d68b19a0dc89a9e6":"weth.webp",

 'robinhood:0x0bd7d308f8e1639fab988df18a8011f41eacad73':'weth.webp',
 'robinhood:0x64ce7a75ae2f0ab86a8ae1d2ea8f412f44f94a5b':'usdc.webp',
 'cookchain:0xf800bf07394e8290807b4ce579f4e9f99c3da869':'wcook.webp',
 'base:0xfad5552b3bc8c62d66745e69485f33b81673fd6c':'wcook.webp',
 'cookchain:0xa28324ec703c1620ae798b1cd540bb90a2712d4a':'usdc.webp',
 'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913':'usdc.webp',
 'arc:0x3600000000000000000000000000000000000000':'usdc.webp',
 'bsc:0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d':'usdc.webp',
 'bsc:0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c':'bnb.webp',
 'cookchain:0x91d50ae88ff486fe67f3a7dc3c5d0873181bede':'bnb.webp',
 'cookchain:0x26af958cd7a09fef420795e7d68b19a0dc89a9e6':'weth.webp',
 'base:0x4200000000000000000000000000000000000006':'weth.webp',
 'arc:0x128cc466b61f542da60c70e3aa11c10e19b84edb':'weth.webp',
 'bsc:0x2170ed0880ac9a755fd29b2688956bd959f933f8':'weth.webp'
};
function showIcon(id,addr,chain){const img=$(id),file=tokenIcons[chain+':'+addr?.toLowerCase()];img.hidden=!file;if(file){img.src='/api/bridge-assets/bridge-token-logos/'+file;img.classList.toggle('cook-token-icon',file==='cook.webp');}}
 let ready=false,syncing=false,selected='',balanceSeq=0;
 const reg=()=>window.bridgeUI?.getRegistry();
 const option=(value,text)=>{const o=document.createElement('option');o.value=value;o.textContent=text;return o;};
 const source=()=>$('swap-source').value;
 const token=()=>tokens(reg(),source()).find(t=>t.address.toLowerCase()===selected);
 function drawTokens(){const q=$('swap-token-search').value.trim().toLowerCase(),items=tokens(reg(),source()).filter(t=>[t.symbol,t.name,t.address].join(' ').toLowerCase().includes(q));$('swap-token').replaceChildren(option('','Select a token'),...items.slice(0,30).map(t=>option(t.address.toLowerCase(),t.symbol+' · '+t.name+' · '+t.address.slice(0,6)+'…'+t.address.slice(-4))));if(items.some(t=>t.address.toLowerCase()===selected))$('swap-token').value=selected;$('swap-token-count').textContent=items.length>30?'Showing 30 of '+items.length+' tokens — use search':items.length+' available token'+(items.length===1?'':'s');}
 function drawDestination(){const files={hyperevm:'hyperevm.webp',base:"base.webp",arc:"arc.webp",bsc:"bsc.webp",cookchain:"cook.webp",robinhood:"robinhood.webp",polygon:"polygon.webp",monad:"monad.webp",avalanche:"avalanche.webp",linea:"linea.webp",sonic:"sonic.webp",fantom:"fantom.webp",arbitrum:"arbitrum.webp",blast:"blast.webp"};$("swap-source-logo").src="/api/bridge-assets/bridge-chain-logos/"+(files[source()]||source()+'.webp');const t=token(),old=$('swap-target').value,choices=t?destinations(t,source()):Object.keys(reg()?.chains||{}).filter(n=>n!==source());$('swap-target').replaceChildren(...choices.map(n=>option(n,names[n])));if(choices.includes(old))$('swap-target').value=old;$('swap-target').disabled=choices.length<2;$('swap-target-logo').src='/api/bridge-assets/bridge-chain-logos/'+(files[$('swap-target').value]||$('swap-target').value+'.webp');const gasAssets={hyperevm:['HYPE','hype.webp'],base:['ETH','weth.webp'],arc:['USDC','usdc.webp'],bsc:['BNB','bnb.webp'],cookchain:['COOK','cook.webp'],robinhood:['ETH','weth.webp'],sonic:["S", "ws.webp"],blast:["ETH", "weth.webp"],fantom:["FTM", "wftm.webp"],arbitrum:["ETH", "weth.webp"],avalanche:["AVAX", "wavax.webp"],polygon:["POL", "wpol.webp"],monad:["MON", "wmon.webp"],linea:["ETH", "weth.webp"]};for(const [side,net]of [['source',source()],['target',$('swap-target').value]]){const box=$('swap-'+side+'-gas');box.replaceChildren();const img=document.createElement('img');img.src='/api/bridge-assets/bridge-token-logos/'+(gasAssets[net]||[reg().chains[net]?.nativeSymbol||'Gas','cook.webp'])[1];img.alt='';img.width=16;img.height=16;box.append(img,document.createTextNode('Gas: '+(gasAssets[net]||[reg().chains[net]?.nativeSymbol||'Gas','cook.webp'])[0]));}const r=t?.routes.find(r=>r.networks[$('swap-target').value]);$('swap-destination-symbol').textContent=r?(source()===r.collateralChain?(r.wrappedSymbol||r.symbol):r.symbol):'Destination token';$('swap-destination-name').textContent=r?routeName(r):'Linked automatically after token check';const addr=r?address(r,$('swap-target').value):null;showIcon('swap-source-token-logo',t?.address,source());showIcon('swap-target-token-logo',addr,$('swap-target').value);const link=$('swap-destination-contract');link.hidden=!addr;if(addr){link.textContent=addr;link.href=($('swap-target').value==='hyperevm'?'https://hyperevmscan.io/token/':$('swap-target').value==='cookchain'?'https://cookscan.net/explorer/token/':$('swap-target').value==='base'?'https://basescan.org/token/':$('swap-target').value==='bsc'?'https://bscscan.com/token/':$('swap-target').value==="sonic"?"https://sonicscan.org/token/":$('swap-target').value==="blast"?"https://blastscan.io/token/":$('swap-target').value==="fantom"?"https://ftmscan.com/token/":$('swap-target').value==="arbitrum"?"https://arbiscan.io/token/":$('swap-target').value==="avalanche"?"https://snowtrace.io/token/":$('swap-target').value==="polygon"?"https://polygonscan.com/token/":$('swap-target').value==="monad"?"https://monadscan.com/token/":$('swap-target').value==="linea"?"https://lineascan.build/token/":$('swap-target').value==='robinhood'?'https://robinhoodchain.blockscout.com/token/':'https://explorer.arc.io/token/')+addr;}}
 function apply(){if(!ready||syncing)return;syncing=true;try{const src=source(),dst=$('swap-target').value,pair=src==='cookchain'?dst:src,t=token(),r=t?.routes.find(r=>r.networks[src]&&r.networks[dst]),typed=$('token-address').value;if($('network').value!==pair){$('network').value=pair;$('network').dispatchEvent(new Event('change'));}if(r){$('route-search').value='';if(!Array.from($('route').options).some(o=>o.value===r.id)){$('network').dispatchEvent(new Event('change'));}$('route').value=r.id;$('route').dispatchEvent(new Event('change'));}$('origin').value=src;$('origin').dispatchEvent(new Event('change'));if(r){$('token-address').value=address(r,src);}else{$('route').value='';$('token-address').value=typed;$('send').disabled=true;}window.dispatchEvent(new Event('bridge-context'));window.dispatchEvent(new Event('bridge-max-refresh'));if(r){window.bridgeUI.message('Ready. Enter an amount and confirm the transfer in your wallet.');}else{$('send').disabled=true;window.bridgeUI.message('Choose an available token or check a token contract to create its route.');}}finally{syncing=false;}drawDestination();refreshBalance();}
 async function refreshBalance(){const seq=++balanceSeq,t=token(),src=source(),addr=t?.address||$('token-address').value.trim();$('swap-balance').textContent='Wallet balance: connect your wallet';try{const accounts=await window.cookWallet?.request({method:'eth_accounts'})||[];if(!accounts[0]||!/^0x[0-9a-f]{40}$/i.test(addr))return;$('swap-balance').textContent='Checking wallet balance…';const response=await fetch('/api/read/bridge-balance/'+src+'/'+addr+'/'+accounts[0],{cache:'no-store',signal:AbortSignal.timeout(12000)});const d=await response.json();if(!response.ok)throw Error(d.error||'Balance unavailable');let decimals=t?.routes[0].decimals;if(decimals===undefined){const v=await fetch('/api/read/bridge-token/'+src+'/'+addr,{signal:AbortSignal.timeout(12000)});const metadata=await v.json();if(!v.ok||metadata.decimals===null)throw Error('Token metadata unavailable');decimals=metadata.decimals;}if(seq!==balanceSeq)return;$('swap-balance').textContent='Wallet balance: '+ethers.formatUnits(BigInt(d.balanceRaw),decimals)+' '+(t?.symbol||'tokens');}catch{if(seq===balanceSeq)$('swap-balance').textContent='Wallet balance temporarily unavailable';}}
 function reflect(){if(syncing||!ready)return;const r=reg()?.routes.find(r=>r.id===$('route').value),src=$('origin').value;if(!r||!src||!r.networks[src])return;syncing=true;try{$('swap-source').value=src;selected=address(r,src).toLowerCase();const dst=Object.keys(r.networks).find(n=>n!==src);drawTokens();drawDestination();$('swap-target').value=dst;drawDestination();}finally{syncing=false;}refreshBalance();}
 function init(){if(!reg()){setTimeout(init,150);return;}for(const [key,n]of Object.entries(reg().chains)){names[key]||=n.name||key;if(!Array.from($('swap-source').options).some(o=>o.value===key))$('swap-source').append(option(key,names[key]));if(key!=='cookchain'&&!Array.from($('network').options).some(o=>o.value===key))$('network').append(option(key,names[key]));}ready=true;$('swap-source').value=$('origin').value||'base';const r=reg().routes.find(r=>r.id===$('route').value);selected=r?address(r,source())?.toLowerCase()||'':'';drawTokens();drawDestination();apply();
 $('swap-source').onchange=()=>{selected='';$('swap-token-search').value='';$('token-address').value='';drawTokens();drawDestination();apply();};
 $('swap-token-search').oninput=drawTokens;
 $('swap-token').onchange=()=>{selected=$('swap-token').value;drawDestination();apply();};
 $('swap-target').onchange=apply;
 $('token-address').addEventListener('input',()=>{selected='';$('swap-token').value='';drawDestination();$('send').disabled=true;balanceSeq++;$('swap-balance').textContent='Check the token contract to view its balance';});
 $('check-token').addEventListener('click',()=>{refreshBalance();});
 $('swap-connect').onclick=async()=>{try{if(!window.ethereum)throw Error('Please use MetaMask');await window.cookWallet.request({method:'eth_requestAccounts'});refreshBalance();window.dispatchEvent(new Event('bridge-max-refresh'));$('swap-connect').textContent='Wallet connected';}catch(e){window.bridgeUI.message(e.message);}};
 window.addEventListener('bridge-max-refresh',()=>{if(!syncing)queueMicrotask(reflect);});window.ethereum?.on?.('accountsChanged',refreshBalance);setInterval(refreshBalance,20000);}
 init();
})();
