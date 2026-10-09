'use strict';
(function(root){
function identity(chainId,address){if(!Number.isSafeInteger(Number(chainId))||Number(chainId)<=0||!/^0x[0-9a-f]{40}$/i.test(address||''))throw Error('Invalid asset identity');return Number(chainId)+':'+address.toLowerCase();}
function describe(route){if(!route?.enabled||!route.networks?.[route.collateralChain])throw Error('Inactive or incomplete bridge route');const origin=route.networks[route.collateralChain];const original=identity(origin.chainId,route.collateral);const aliases=Object.entries(route.networks).map(([chain,net])=>({chain,chainId:net.chainId,address:chain===route.collateralChain?route.collateral:net.router,identity:identity(net.chainId,chain===route.collateralChain?route.collateral:net.router),kind:chain===route.collateralChain?'original':'bridge-representation'}));return{assetId:original,originChain:route.collateralChain,originAddress:route.collateral,aliases,status:'bridge-origin-registered',crossOriginEquivalence:'not-approved'};}
function sameOriginal(a,b){return describe(a).assetId===describe(b).assetId;}
const api={identity,describe,sameOriginal};if(typeof module==='object'&&module.exports)module.exports=api;else root.CookAssetIdentity=api;
})(typeof window!=='undefined'?window:globalThis);
