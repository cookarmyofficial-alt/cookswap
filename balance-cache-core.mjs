const FRESH_MS = 30000, MAX_STALE_MS = 300000;
export function createBalanceCache({getPool, now = Date.now, configured = () => true, limit = 2000}) {
  const memory = new Map(), pending = new Map(), retries = new Map();
  let db, initializing, databaseRetryAt = 0, lastPrune = 0;
  const stats = {rpcReads: 0, cacheHits: 0, databaseWrites: 0, databaseError: null};
  function keyFor({chain, owner, token}) {
    if (!/^[a-z0-9-]{1,40}$/.test(chain)) throw Error('Invalid chain');
    const valid = chain === 'solana' ? /^[1-9A-HJ-NP-Za-km-z]{32,44}$/ : /^0x[0-9a-f]{40}$/i;
    if (!valid.test(owner) || (token !== 'native' && !valid.test(token))) throw Error('Invalid wallet or token');
    if (chain !== 'solana') { owner = owner.toLowerCase(); token = token.toLowerCase(); }
    return {chain, owner, token, key: chain + ':' + owner + ':' + token};
  }
  function retain(key, value) {
    memory.delete(key); memory.set(key, value);
    while (memory.size > limit) memory.delete(memory.keys().next().value);
  }
  async function pool() {
    if (!configured()) { db = null; return null; }
    if (now() < databaseRetryAt) return null;
    if (db) {
      try { const current = await getPool(); if (current === db) return db; db = null; }
      catch (e) { db = null; stats.databaseError = e.code || 'DATABASE_UNAVAILABLE'; databaseRetryAt = now() + 30000; return null; }
    }
    if (!initializing) initializing = (async () => {
      const p = await getPool();
      await p.query(`CREATE TABLE IF NOT EXISTS wallet_balance_cache (
        chain_key VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
        wallet_address VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
        token_address VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
        balance_raw VARCHAR(78) CHARACTER SET ascii NOT NULL,
        checked_at BIGINT UNSIGNED NOT NULL, changed_at BIGINT UNSIGNED NOT NULL,
        PRIMARY KEY(chain_key,wallet_address,token_address), INDEX(checked_at)
      ) ENGINE=InnoDB`);
      stats.databaseError = null; db = p; return p;
    })().catch(e => {
      stats.databaseError = e.code || 'DATABASE_UNAVAILABLE'; databaseRetryAt = now() + 30000; return null;
    }).finally(() => { initializing = null; });
    return initializing;
  }
  const validRaw = value => /^(0|[1-9][0-9]{0,77})$/.test(String(value));
  async function read(id) {
    const p = await pool(); if (!p) return null;
    try {
      const [rows] = await p.execute('SELECT balance_raw,checked_at FROM wallet_balance_cache WHERE chain_key=? AND wallet_address=? AND token_address=?', [id.chain, id.owner, id.token]);
      const row = rows[0], checkedAt = Number(row?.checked_at);
      if (!row || !validRaw(row.balance_raw) || !Number.isFinite(checkedAt) || checkedAt > now() || now() - checkedAt > MAX_STALE_MS) return null;
      return {raw: String(row.balance_raw), checkedAt, persisted: true};
    } catch (e) { db = null; stats.databaseError = e.code || 'DATABASE_UNAVAILABLE'; databaseRetryAt = now() + 30000; return null; }
  }
  async function persist(id, entry) {
    const p = await pool(); if (!p) return;
    try {
      await p.execute(`INSERT INTO wallet_balance_cache(chain_key,wallet_address,token_address,balance_raw,checked_at,changed_at)
        VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE
        changed_at=IF(balance_raw<>VALUES(balance_raw),VALUES(changed_at),changed_at),
        balance_raw=VALUES(balance_raw),checked_at=VALUES(checked_at)`,
      [id.chain, id.owner, id.token, entry.raw, entry.checkedAt, entry.checkedAt]);
      entry.persisted = true; stats.databaseWrites++;
      if (now() - lastPrune > 300000) { lastPrune = now(); await p.execute('DELETE FROM wallet_balance_cache WHERE checked_at<? LIMIT 1000', [now() - 7 * 86400000]); }
    } catch (e) { db = null; stats.databaseError = e.code || 'DATABASE_UNAVAILABLE'; databaseRetryAt = now() + 30000; }
  }
  async function refresh(id, load) {
    stats.rpcReads++;
    const raw = String(await load());
    if (!validRaw(raw)) throw Error('Invalid RPC balance');
    const entry = {raw, checkedAt: now(), persisted: false};
    retain(id.key, entry); retries.delete(id.key);
    await persist(id, entry); return entry;
  }
  function task(id, work) {
    if (!pending.has(id.key)) pending.set(id.key, Promise.resolve().then(work).finally(() => pending.delete(id.key)));
    return pending.get(id.key);
  }
  function response(entry) {
    return {balanceRaw: entry.raw, balanceCheckedAt: new Date(entry.checkedAt).toISOString(),
      balanceCached: now() > entry.checkedAt, balanceStale: now() - entry.checkedAt >= FRESH_MS,
      balanceCache: entry.persisted ? 'mysql' : 'memory'};
  }
  async function get(identity, load, {force = false} = {}) {
    const id = keyFor(identity), entry = memory.get(id.key);
    if (entry && now() - entry.checkedAt < FRESH_MS && (!force || now() - entry.checkedAt < 1000)) {
      stats.cacheHits++; return response(entry);
    }
    if (!force && entry && now() - entry.checkedAt <= MAX_STALE_MS) {
      stats.cacheHits++;
      if (now() >= (retries.get(id.key) || 0)) task(id, () => refresh(id, load)).catch(() => {
        retries.set(id.key, now() + 10000);
        while (retries.size > limit) retries.delete(retries.keys().next().value);
      });
      return response(entry);
    }
    return response(await task(id, async () => {
      const saved = force ? null : await read(id);
      if (saved && now() - saved.checkedAt < FRESH_MS) { stats.cacheHits++; retain(id.key, saved); return saved; }
      try { return await refresh(id, load); }
      catch (e) {
        const fallback = saved || entry;
        if (!force && fallback && now() - fallback.checkedAt <= MAX_STALE_MS) { retain(id.key, fallback); retries.set(id.key, now() + 10000); return fallback; }
        throw e;
      }
    }));
  }
  return {get, status: () => ({...stats, configured: configured(), databaseReady: !!db, entriesInMemory: memory.size, refreshSeconds: FRESH_MS / 1000, maxStaleSeconds: MAX_STALE_MS / 1000})};
}
