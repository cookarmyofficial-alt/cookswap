import {getPool, publicMysqlConfig} from './admin.mjs';
import {createBalanceCache} from './balance-cache-core.mjs';
export const walletBalanceCache = createBalanceCache({
  getPool: () => getPool('users'), configured: () => publicMysqlConfig('users').passwordSet,
});
