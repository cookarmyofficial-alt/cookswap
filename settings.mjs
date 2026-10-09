import {readFileSync} from 'node:fs';
export const NETWORKS=JSON.parse(readFileSync(new URL('./networks.json',import.meta.url)));
export const PRIMARY=NETWORKS.find(n=>n.key===(process.env.DEFAULT_NETWORK||'cookchain'));
if(!PRIMARY?.isEvm||!PRIMARY.chainId||!PRIMARY.wrapped)throw Error('DEFAULT_NETWORK must identify an EVM entry in networks.json');
if(process.env.COOK_RPC)PRIMARY.rpc=process.env.COOK_RPC;
function service(value){if(!value)return '';const u=new URL(value);if(!['http:','https:'].includes(u.protocol)||u.username||u.password||u.search||u.hash)throw Error('Service URL must be an HTTP(S) origin without credentials');return u.origin;}
export const COOKDEX_ORIGIN=service(process.env.COOKDEX_ORIGIN);
export const BRIDGE_ORIGIN=service(process.env.BRIDGE_ORIGIN);
export const CHART_ORIGIN=service(process.env.CHART_ORIGIN||COOKDEX_ORIGIN);
