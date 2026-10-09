export function createTransferSourceCache({getPool, configured, now = Date.now}) {
  const entries = new Map(), pending = new Map();
  let schema, retryAt = 0;
  const maxAge = 7 * 86400000;
  async function pool() {
    if (!configured() || now() < retryAt) return null;
    try {
      const p = await getPool();
      if (!schema) schema = p.query(`CREATE TABLE IF NOT EXISTS bridge_transfer_cache (
        chain_id INT UNSIGNED NOT NULL, transaction_hash CHAR(66) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
        source_json TEXT NOT NULL, checked_at BIGINT UNSIGNED NOT NULL,
        PRIMARY KEY(chain_id,transaction_hash), INDEX(checked_at)
      ) ENGINE=InnoDB`).catch(e => {schema = null; throw e;});
      await schema; return p;
    } catch {retryAt = now() + 30000; return null;}
  }
  function valid(value, chain, hash) {
    return value?.chainId === chain && value.transactionHash?.toLowerCase() === hash &&
      value.confirmed === true && typeof value.succeeded === 'boolean' &&
      Number.isSafeInteger(value.blockNumber) && value.blockNumber >= 0 &&
      Number.isFinite(Date.parse(value.checkedAt)) && Date.parse(value.checkedAt) <= now() + 5000 &&
      now() - Date.parse(value.checkedAt) < maxAge;
  }
  async function get(chain, hash, load) {
    chain = Number(chain); hash = hash.toLowerCase();
    if (!Number.isInteger(chain) || chain <= 0 || chain > 0xffffffff || !/^0x[0-9a-f]{64}$/.test(hash)) throw Error('Invalid transfer');
    const key = chain + ':' + hash;
    const existing = entries.get(key);
    if (valid(existing, chain, hash) && now() - Date.parse(existing.checkedAt) < 10000) return {...existing, fromCache: true};
    if (pending.has(key)) return pending.get(key);
    const work = (async () => {
      let saved = existing;
      const p = await pool();
      if (!saved && p) try {
        const [rows] = await p.execute('SELECT source_json FROM bridge_transfer_cache WHERE chain_id=? AND transaction_hash=?', [chain, hash]);
        const value = JSON.parse(rows[0]?.source_json || 'null');
        if (valid(value, chain, hash)) saved = value;
      } catch {}
      try {
        const value = await load();
        if (value?.chainId !== chain || value.transactionHash?.toLowerCase() !== hash) throw Error('Source status mismatch');
        if (valid(value, chain, hash)) {
          entries.delete(key); entries.set(key, value);
          while (entries.size > 1000) entries.delete(entries.keys().next().value);
          if (p) try {
            await p.execute(`INSERT INTO bridge_transfer_cache(chain_id,transaction_hash,source_json,checked_at)
              VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE
              source_json=IF(VALUES(checked_at)>=checked_at,VALUES(source_json),source_json),
              checked_at=GREATEST(checked_at,VALUES(checked_at))`,
            [chain, hash, JSON.stringify(value), Date.parse(value.checkedAt)]);
          } catch {}
        }
        return value;
      } catch (e) {
        if (valid(saved, chain, hash)) {
          entries.set(key, saved);
          return {...saved, cached: true, statusWarning: 'Source RPC temporarily unavailable. Last confirmed status retained.'};
        }
        throw e;
      }
    })().finally(() => pending.delete(key));
    pending.set(key, work); return work;
  }
  return {get};
}
