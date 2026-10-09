/* Balance percentages use integer token units, including the existing Max gas reserve. */
window.cookAmountSlider = (() => {
  let host, cache, pending, lastAttempt, epoch = 0;
  const el = id => document.getElementById(id);
  const key = s => [s.chain,s.account,s.input?.address,s.input?.decimals].join(':');
  function update() {
    if (!host) return;
    const s=host.state(), k=key(s), ready=cache?.key===k;
    el('amount-slider').disabled=s.busy||!s.account||!ready||cache.raw===0n;
    let percentage=0;
    if(ready&&cache.raw>0n)try{percentage=Number(ethers.parseUnits(s.amount||'0',s.input.decimals)*100n/cache.raw);}catch{}
    percentage=Math.max(0,Math.min(100,percentage));
    el('amount-slider').value=percentage;el('amount-percent').textContent=percentage+'%';
    el('amount-slider').style.setProperty('--fill',percentage+'%');
    if(s.account&&!s.busy&&(!ready||Date.now()-cache.time>30000)&&pending!==k&&(lastAttempt?.key!==k||Date.now()-lastAttempt.time>30000)) refresh().catch(()=>{});
  }
  async function refresh(force=false) {
    const s=host.state(), k=key(s);
    if(!s.account||!s.input)return;
    if(!force&&cache?.key===k&&Date.now()-cache.time<30000)return cache;
    const request=++epoch;pending=k;lastAttempt={key:k,time:Date.now()};
    try {
      const d=await host.api('balance/'+s.input.address+'/'+s.account);
      let raw=BigInt(d.balanceRaw);
      if(s.input.address==='native') {
        const fee=s.chain==='solana'?{}:await host.api('gas-price');
        raw-=s.chain==='solana'?10000000n:BigInt(fee.gasPrice)*750000n/(s.config.nativeToken?1000000000000n:1n);
      }
      if(request!==epoch||key(host.state())!==k)return;
      cache={key:k,raw:raw>0n?raw:0n,time:Date.now()};return cache;
    } finally {if(request===epoch){pending=null;update();}}
  }
  function apply(percent) {
    const s=host.state();if(s.busy||!cache||cache.key!==key(s))return;
    host.setAmount(ethers.formatUnits(cache.raw*BigInt(percent)/100n,s.input.decimals));update();
  }
  return {update,async max(){try{if(!host.state().account)await host.connect();const row=await refresh(true);if(row)apply(100);}catch(e){host.status(e.message);}},init(h){host=h;el('amount-slider').oninput=()=>apply(Number(el('amount-slider').value));update();}};
})();
