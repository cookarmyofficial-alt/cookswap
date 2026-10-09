import crypto from 'node:crypto';
import {getPool,publicMysqlConfig} from './admin.mjs';
export async function applyDatabaseStatistics(value,now=Date.now()){
 if(value.databaseStatus!=='available')throw Error('TRADE_HISTORY_NOT_COMPLETE');
 const config=publicMysqlConfig('charts');if(!config.passwordSet&&!config.hasStoredConfig)throw Error('MYSQL_NOT_CONFIGURED');
 const db=await getPool('charts');const[stored]=await db.query({sql:'SELECT 1 FROM pool_trades LIMIT 1',timeout:8000});if(!stored.length)throw Error('DATABASE_HISTORY_EMPTY');const history=[];let errors=0;
 for(const p of value.pools){const contracts=[p.token,p.quoteTokenAddress].filter(Boolean),keys=[...new Set(contracts.map(a=>crypto.createHash('sha256').update(p.chain+':'+p.address.toLowerCase()+':'+a.toLowerCase()).digest('hex')))];if(!keys.length)continue;
  try{const [rows]=await db.query({sql:`SELECT FLOOR(ts/86400000) day, COUNT(*) swaps, SUM(usd) volume, COUNT(usd) priced, SUM(ts>=?) swaps24, SUM(CASE WHEN ts>=? THEN usd END) volume24, SUM(ts>=? AND usd IS NOT NULL) priced24 FROM (SELECT trade_id, MAX(trade_timestamp) ts, MAX(CASE WHEN JSON_TYPE(JSON_EXTRACT(payload,'$.volumeUsd')) IN ('INTEGER','DOUBLE','DECIMAL') THEN CAST(JSON_UNQUOTE(JSON_EXTRACT(payload,'$.volumeUsd')) AS DECIMAL(38,12)) ELSE NULL END) usd FROM pool_trades WHERE history_key IN (${keys.map(()=>'?').join(',')}) AND trade_timestamp>=? AND trade_timestamp<=? AND JSON_UNQUOTE(JSON_EXTRACT(payload,'$.kind')) IN ('buy','sell','swap') GROUP BY trade_id) events GROUP BY day`,timeout:8000},[now-86400000,now-86400000,now-86400000,...keys,now-7*86400000,now]);
   delete p.databaseUnavailable;const count=rows.reduce((n,r)=>n+Number(r.swaps24||0),0),priced=rows.reduce((n,r)=>n+Number(r.priced24||0),0);p.swaps24h=count;p.volume24h=priced?rows.reduce((n,r)=>n+Number(r.volume24||0),0):count?null:0;p.pricedSwaps24h=priced;
   for(const r of rows)history.push({chain:p.chain,date:new Date(Number(r.day)*86400000).toISOString().slice(0,10),swaps:Number(r.swaps),volumeUsd:Number(r.volume||0),pricedSwaps:Number(r.priced)});
  }catch{errors++;p.databaseUnavailable=true;}
 }
 if(errors===value.pools.length&&errors)throw Error('DATABASE_UNAVAILABLE');
 const sum=rows=>({pools:rows.length,volume24h:rows.reduce((s,p)=>s+(p.volume24h||0),0),swaps24h:rows.reduce((s,p)=>s+(p.swaps24h||0),0),liquidityUsd:rows.reduce((s,p)=>s+(p.liquidityUsd||0),0),curveRealUsd:rows.reduce((s,p)=>s+(p.curveRealUsd||0),0),volumeCoverage:rows.filter(p=>p.volume24h!==null&&!p.databaseUnavailable).length,swapCoverage:rows.filter(p=>p.swaps24h!==null&&!p.databaseUnavailable).length,pricedSwaps24h:rows.reduce((s,p)=>s+(p.pricedSwaps24h||0),0)});
 value.totals=sum(value.pools);value.chains=value.chains.map(c=>({...c,...sum(value.pools.filter(p=>p.chain===c.chain))}));value.history=history;value.source='CookDEX MySQL pool_trades';value.databaseStatus=errors?'partial':'available';value.databaseErrors=errors;return value;
}
