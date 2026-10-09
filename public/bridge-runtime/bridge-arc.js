window.bridgeChainLabel=n=>({cookchain:'Cookchain',base:'Base',bsc:'BNB Smart Chain',arc:'Arc',robinhood:'Robinhood',sonic:"Sonic",blast:"Blast",fantom:"Fantom Opera",arbitrum:"Arbitrum One",avalanche:"Avalanche C-Chain",polygon:"Polygon PoS",monad:"Monad",linea:"Linea"}[n]||n);
'use strict';
window.bridgeChainLabel=n=>({base:'Base',bsc:'BSC',arc:'Arc',robinhood:'Robinhood',cookchain:'Cookchain'}[n]||n);
window.bridgeArcFees=async(p,request)=>{const fee=await p.getFeeData(),b=await p.getBlock('latest');request.maxPriorityFeePerGas=fee.maxPriorityFeePerGas||0n;request.maxFeePerGas=fee.maxFeePerGas||((b.baseFeePerGas||0n)*2n+request.maxPriorityFeePerGas);if(request.maxFeePerGas<20000000000n)request.maxFeePerGas=20000000000n;};
