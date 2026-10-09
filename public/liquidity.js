function shortAddress(value) {
  const text = String(value || "");
  return text.length > 16 ? `${text.slice(0, 8)}...${text.slice(-6)}` : text;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

const poolChainNames = {cookchain:'Cookchain',bsc:'BNB Chain',base:'Base',arc:'Arc',robinhood:'Robinhood Chain',ethereum:'Ethereum',solana:'Solana',arbitrum:'Arbitrum',optimism:'Optimism',polygon:'Polygon',avalanche:'Avalanche',sonic:'Sonic',blast:'Blast',monad:'Monad',fantom:'Fantom',linea:'Linea'};
function poolChainBadge(pool) {
  const chain = String(pool.chain || '').toLowerCase();
  const name = poolChainNames[chain] || chain.toUpperCase() || 'Unknown chain';
  const source = chain === 'cookchain' ? '/assets/token-default.svg' : /^[a-z0-9-]+$/.test(chain) ? `https://cookdex.net/media/chains/${chain}.webp` : '';
  return `<span class="pool-chain-badge" title="${escapeHtml(name)}">${source ? `<img src="${source}" alt="${escapeHtml(name)}" width="30" height="30" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span hidden>${escapeHtml(name.slice(0,2).toUpperCase())}</span>` : escapeHtml(name.slice(0,2).toUpperCase())}</span>`;
}
function filterPoolCatalog() {
  const selected = document.getElementById('poolChainFilter')?.value || '';
  let visible = 0;
  for (const card of document.querySelectorAll('#poolCatalogList [data-pool-chain]')) {
    const show = !selected || card.dataset.poolChain === selected;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  }
  const count = document.getElementById('poolCatalogCount');
  if (count) count.textContent = `${visible} ${visible === 1 ? 'pool' : 'pools'}`;
}
function updatePoolChainFilter(items) {
  const select = document.getElementById('poolChainFilter');
  if (!select) return;
  const previous = select.value;
  const chains = [...new Set(items.map(pool => String(pool.chain || '').toLowerCase()).filter(Boolean))].sort((a,b)=>(poolChainNames[a]||a).localeCompare(poolChainNames[b]||b));
  select.innerHTML = '<option value="">All chains</option>' + chains.map(chain=>`<option value="${escapeHtml(chain)}">${escapeHtml(poolChainNames[chain]||chain.toUpperCase())}</option>`).join('');
  select.value = chains.includes(previous) ? previous : '';
  filterPoolCatalog();
}

async function connectedWallet(chain = "") {
  let wallet = window.dexWallet?.getState?.() || {};
  if (!wallet.address) wallet = await window.dexWallet.connect();
  if (chain && wallet.chainName !== chain) wallet = await window.dexWallet.switchToChain(chain);
  return wallet;
}

function countdownText(value) {
  const remaining = Date.parse(value) - Date.now();
  if (!Number.isFinite(remaining)) return "Launch date unavailable";
  if (remaining <= 0) return "Ready to launch";
  const seconds = Math.ceil(remaining / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return `${days ? `${days}d ` : ""}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function localDateTimeValue(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function poolTradingFeePercent(pool = {}) {
  const protocol = String(pool.protocolVersion || pool.poolVersion || "v2").toLowerCase();
  const rawTier = pool.poolFeeBps ?? pool.feeBps;
  const feeTier = rawTier == null || rawTier === "" ? NaN : Number(rawTier);
  if (Number.isFinite(feeTier) && feeTier >= 0) {
    return protocol === "v3" ? feeTier / 10_000 : feeTier / 100;
  }
  const direct = pool.feePercent == null || pool.feePercent === "" ? NaN : Number(pool.feePercent);
  return Number.isFinite(direct) && direct >= 0 ? direct : null;
}

function formatPoolFee(pool = {}) {
  const fee = poolTradingFeePercent(pool);
  return fee === null ? "—" : `${fee.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(fee) ? 0 : 2, maximumFractionDigits: 4 })}%`;
}

function poolProtocolFeeLabel(pool = {}) {
  return `CookDEX ${String(pool.protocolVersion || pool.poolVersion || "v2").toUpperCase()} - ${formatPoolFee(pool)}`;
}

function showPoolSuccess(label) {
  let notice = document.getElementById("poolSuccessNotice");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "poolSuccessNotice";
    notice.className = "pool-success-notice";
    document.body.append(notice);
  }
  notice.innerHTML = `<span aria-hidden="true">✓</span><strong>${escapeHtml(label)}</strong>`;
  notice.classList.add("is-visible");
  clearTimeout(showPoolSuccess.timer);
  showPoolSuccess.timer = setTimeout(() => notice.classList.remove("is-visible"), 3200);
}

function poolProtocolFeeMarkup(pool = {}) {
  const version = escapeHtml(String(pool.protocolVersion || pool.poolVersion || "v2").toUpperCase());
  return `CookDEX ${version} - <span class="pool-fee-value">${escapeHtml(formatPoolFee(pool))}</span>`;
}

function positionSummaryMarkup(pool) {
  const position = pool.positionSummary;
  if (!position || !Number(position.positionCount || 0)) return '<div class="pool-position-summary pool-position-summary--empty">No removable wallet position in this pool.</div>';
  return `<div class="pool-position-summary"><span>My position · ${Number(position.positionCount).toLocaleString()} ${Number(position.positionCount) === 1 ? "position" : "positions"}</span><strong>${Number(position.sharePercent || 0).toLocaleString(undefined, { maximumFractionDigits: 4 })}% of pool</strong><small>${displayAmount(position.tokenAmount)} ${escapeHtml(position.tokenSymbol)} + ${displayAmount(position.nativeAmount)} ${escapeHtml(position.nativeSymbol)}</small></div>`;
}

function claimFeesMarkup(pool) {
  const status = pool.feeStatus;
  if (!status) return `<span class="pool-draft-state">${escapeHtml(pool.status || "Submitted")}</span>`;
  return `<section class="pool-claim-section" aria-label="Claimable fees">
    <div class="pool-claim-heading"><strong>Claimable fees</strong><small>Pool fee ${formatPoolFee(pool)}</small></div>
    <dl class="pool-claim-amounts">${status.fees.map(fee => `<div><dt>${escapeHtml(fee.symbol)}</dt><dd>${displayAmount(fee.claimable)}</dd></div>`).join("")}</dl>
    <button type="button" class="pool-claim-button" data-claim-pool="${escapeHtml(pool.poolAddress)}" data-chain="${escapeHtml(pool.chain)}" data-protocol="${escapeHtml(pool.protocolVersion || "v2")}" ${!status.hasFees || !status.canClaim ? "disabled" : ""}>Claim fees</button>
  </section>`;
}

function publicPositionMarkup(pool) {
  const positionSummary = managedPositionByPool.get(`${String(pool.chain).toLowerCase()}:${String(pool.pairAddress || "").toLowerCase()}`);
  return positionSummary ? positionSummaryMarkup({ ...pool, positionSummary }) : "";
}

function scheduledPoolActions(pool) {
  const ready = Number.isFinite(Date.parse(pool.startsAt)) && Date.parse(pool.startsAt) <= Date.now();
  return `<div class="pool-liquidity-actions pool-scheduled-actions">
    <span class="pool-launch-countdown" data-countdown-to="${escapeHtml(pool.startsAt)}">${escapeHtml(countdownText(pool.startsAt))}</span>
    <button type="button" class="submit-button" data-launch-scheduled="${escapeHtml(pool.id)}"
      data-chain="${escapeHtml(pool.chain)}" data-protocol="${escapeHtml(pool.protocolVersion || "v2")}" data-token="${escapeHtml(pool.tokenA)}"
      data-price="${escapeHtml(pool.targetPriceUsd || "")}" data-fee="${escapeHtml(pool.poolFeeBps || 30)}" data-token-b="${escapeHtml(pool.erc20Pair ? pool.tokenB : '')}"
      data-token-amount="${escapeHtml(pool.tokenAmount || "")}" data-native-amount="${escapeHtml(pool.nativeAmount || "")}" data-native-price="${escapeHtml(pool.nativePriceUsd || "")}" 
      data-lock-mode="${escapeHtml(pool.lockMode || "unlocked")}" data-unlock-at="${escapeHtml(pool.unlockAt || "")}" ${ready ? "" : "disabled"}>Launch now</button>
  </div>`;
}

let poolLoadRequest = 0;
let ownPoolsLoadingWallet = null;
async function readPoolListResponse(response) {
  const fail = message => new Error(message);
  if (response.status === 401 || response.status === 403) throw fail("Wallet session expired. Connect your wallet again and refresh.");
  if (response.status === 429) throw fail("Too many requests. Wait a moment and refresh.");
  if (response.status >= 500) throw fail("The pool service is temporarily unavailable. Please refresh.");
  if (!response.ok || response.redirected) throw fail("Pool query failed. Please refresh.");
  let payload;
  try { payload = await response.json(); }
  catch { throw fail("Pool data unavailable. Please refresh."); }
  if (payload?.success !== true || !Array.isArray(payload.items)) throw fail("Pool data unavailable. Please refresh.");
  return payload;
}
function emptyOwnPoolsMarkup(wallet = {}) {
  const network = escapeHtml(String(wallet.chainName || wallet.chainIdHex || "unknown").toUpperCase());
  return `<div class="account-empty" role="status"><p>No pools found for this wallet.</p><p>Wallet network: <strong>${network}</strong></p><p>If your pool is on another network, switch to that network and refresh.</p></div>`;
}
function setOwnPoolsLoading(loading) {
  const button = document.getElementById("refreshPools");
  if (!button) return;
  if (loading && !button.disabled) button.dataset.idleLabel = button.textContent;
  button.disabled = loading;
  button.classList.toggle("is-loading", loading);
  button.setAttribute("aria-busy", String(loading));
  button.textContent = loading ? "Loading pools…" : (button.dataset.idleLabel || "Refresh");
}
async function loadPools() {
  const list = document.getElementById("poolList");
  const status = document.getElementById("poolIntegrationStatus");
  if (!list || !status) return;
  const wallet = window.dexWallet?.getState?.() || {};
  const owner = String(wallet.address || "").toLowerCase();
  if (owner && ownPoolsLoadingWallet === owner) return;
  const request = ++poolLoadRequest;
  ownPoolsLoadingWallet = owner || null;
  if (!wallet.address) {
    setOwnPoolsLoading(false);
    managedPositionByPool.clear();
    list.innerHTML = '<p class="account-empty">Connect Wallet to see your positions.</p>';
    status.textContent = "";
    return;
  }
  setOwnPoolsLoading(true);
  status.textContent = "";
  try {
    const response = await fetch(`/api/cookdex/api/pools?owner=${encodeURIComponent(wallet.address)}`, { cache: "no-store", signal: AbortSignal.timeout(60000) });
    const payload = await readPoolListResponse(response);
    if (request !== poolLoadRequest) return;
    if (!response.ok || !payload.success) throw new Error(payload.detail || "Pools could not be loaded.");
    managedPositionByPool.clear();
    for (const pool of payload.items || []) if (pool.poolAddress && pool.positionSummary) managedPositionByPool.set(`${String(pool.chain).toLowerCase()}:${String(pool.poolAddress).toLowerCase()}`, pool.positionSummary);
    status.textContent = "";
    list.dataset.loaded='true'; list.innerHTML = payload.items.length ? payload.items.map((pool) => `
      <article class="pool-list-item">
        ${poolChainBadge(pool)}
        <div class="pool-catalog-identity"><img src="${escapeHtml(pool.tokenLogo ? new URL(pool.tokenLogo,"https://cookdex.net").href : DEFAULT_TOKEN_LOGO)}" onerror="this.src='${DEFAULT_TOKEN_LOGO}'" alt="" /><div><span>${pool.source === "presalescript" ? "Cook Nexus" : "CookDEX"} · ${escapeHtml(String(pool.chain || "").toUpperCase())} · ${poolProtocolFeeMarkup(pool)}</span><strong>${escapeHtml(pool.tokenSymbol || "TOKEN")} / ${escapeHtml(pool.quoteSymbol || "TOKEN")}</strong><small title="${escapeHtml(pool.tokenContract || pool.tokenA || "")}">${escapeHtml(shortAddress(pool.tokenContract || pool.tokenA))}</small></div></div>
        <dl><div><dt>Pool</dt><dd class="address-with-copy">${escapeHtml(shortAddress(pool.poolAddress || pool.txHash || pool.id))}${window.dexCopyIconMarkup?.(pool.poolAddress || pool.txHash || pool.id, "Copy pair") || ""}</dd></div><div><dt>Fee position</dt><dd>${poolProtocolFeeMarkup(pool)}</dd></div></dl>
        <div class="pool-fee-actions">${positionSummaryMarkup(pool)}${claimFeesMarkup(pool)}</div>
        ${pool.status === "scheduled" ? scheduledPoolActions(pool) : String(pool.id || "").startsWith("pool_") ? `<div class="pool-liquidity-actions">
          <button type="button" class="secondary-button" data-add-liquidity="${escapeHtml(pool.id)}" data-chain="${escapeHtml(pool.chain)}" data-protocol="${escapeHtml(pool.protocolVersion || "v2")}" data-token="${escapeHtml(pool.tokenA)}" data-pair="${escapeHtml(pool.poolAddress || pool.pairAddress || "")}" data-symbol="${escapeHtml(pool.tokenSymbol || "TOKEN")}" data-quote-symbol="${escapeHtml(pool.quoteSymbol || pool.nativeSymbol || "NATIVE")}" data-logo="${escapeHtml(pool.tokenLogo ? new URL(pool.tokenLogo,"https://cookdex.net").href : DEFAULT_TOKEN_LOGO)}" data-fee="${escapeHtml(pool.poolFeeBps || 30)}">Add liquidity</button>
          ${pool.lockVerifiedOnChain === false ? '<span class="pool-draft-state">Lock/burn proof not verified. Please refresh or check the transaction receipt.</span>' : pool.lockMode === "burned" ? '<span class="pool-draft-state">Registered LP amount burned</span>' : pool.lockMode === "locked" ? `<button type="button" class="secondary-button" data-release-liquidity="${escapeHtml(pool.id)}" data-chain="${escapeHtml(pool.chain)}" ${pool.unlockAt && Date.parse(pool.unlockAt) > Date.now() ? "disabled" : ""}>Release after ${escapeHtml(pool.unlockAt ? new Date(pool.unlockAt).toLocaleString() : "unlock date")}</button>` : `<button type="button" class="danger-button" data-remove-liquidity="${escapeHtml(pool.id)}" data-chain="${escapeHtml(pool.chain)}" data-protocol="${escapeHtml(pool.protocolVersion || "v2")}" data-token="${escapeHtml(pool.tokenA)}" data-pair="${escapeHtml(pool.poolAddress || pool.pairAddress || "")}" data-symbol="${escapeHtml(pool.tokenSymbol || "TOKEN")}" data-quote-symbol="${escapeHtml(pool.quoteSymbol || pool.nativeSymbol || "NATIVE")}" data-logo="${escapeHtml(pool.tokenLogo ? new URL(pool.tokenLogo,"https://cookdex.net").href : DEFAULT_TOKEN_LOGO)}" data-fee="${escapeHtml(pool.poolFeeBps || 30)}">Remove liquidity</button>`}
        </div>` : ""}
        ${pool.manageUrl ? `<a class="pool-manage-link" href="${escapeHtml(pool.manageUrl)}" target="_blank" rel="noopener">Manage in Cook Nexus</a>` : ""}
      </article>`).join("") : emptyOwnPoolsMarkup(wallet);
    void loadPoolCatalog();
  } catch (error) {
    if (request !== poolLoadRequest) return;
    status.textContent = ["TimeoutError", "AbortError"].includes(error.name)
      ? "Die Poolsuche hat zu lange gedauert. Bitte erneut aktualisieren."
      : error instanceof TypeError ? "Verbindung zum Pooldienst fehlgeschlagen. Bitte erneut aktualisieren." : error.message;
  } finally {
    if (request === poolLoadRequest) { ownPoolsLoadingWallet = null; setOwnPoolsLoading(false); }
  }
}

async function loadPoolCatalog() {
  const list = document.getElementById("poolCatalogList");
  if (!list) return;
  try {
    const response = await fetch("/api/cookdex/api/pools/catalog", { cache: "no-store", signal: AbortSignal.timeout(60000) });
    const payload = await readPoolListResponse(response);
    if (!response.ok || !payload.success) throw new Error(payload.detail || "Pool catalog could not be loaded.");
    list.dataset.loaded='true'; list.innerHTML = payload.items.length ? payload.items.map((pool) => `
      <article class="pool-list-item pool-catalog-item" data-pool-chain="${escapeHtml(String(pool.chain || '').toLowerCase())}">
        ${poolChainBadge(pool)}
        <div class="pool-catalog-identity"><img src="${escapeHtml(pool.logoUrl ? new URL(pool.logoUrl,"https://cookdex.net").href : DEFAULT_TOKEN_LOGO)}" onerror="this.src='${DEFAULT_TOKEN_LOGO}'" alt="" /><div><span>${escapeHtml(String(pool.chain || "").toUpperCase())} · ${poolProtocolFeeMarkup(pool)}</span><strong>${escapeHtml(pool.symbol || "TOKEN")} / ${escapeHtml(pool.quoteSymbol || pool.nativeSymbol || "NATIVE")}</strong><small>${escapeHtml(shortAddress(pool.tokenA))}</small></div></div>
        <dl>${pool.status === "scheduled" ? `<div><dt>Launch</dt><dd class="pool-launch-countdown" data-countdown-to="${escapeHtml(pool.startsAt)}">${escapeHtml(countdownText(pool.startsAt))}</dd></div><div><dt>Status</dt><dd>Scheduled</dd></div>` : `<div><dt>TVL</dt><dd>${displayUsd(pool.liquidityUsd)}</dd></div><div><dt>24h volume</dt><dd>${displayUsd(pool.volume24h)}</dd></div><div><dt>APR estimate</dt><dd>${pool.aprEstimate == null ? "--" : `${Number(pool.aprEstimate).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`}</dd></div>`}<div><dt>Fee</dt><dd>${formatPoolFee(pool)}</dd></div></dl>
        ${publicPositionMarkup(pool)}
        <div class="pool-fee-position">Fee position: <span>${poolProtocolFeeMarkup(pool)}</span>${pool.lockMode === "burned" ? '<span> · LP permanently burned</span>' : ""}</div>
        ${pool.externalDex ? `<a class="submit-button" href="https://cookdex.net/token/${encodeURIComponent(pool.chain)}/${encodeURIComponent(pool.tokenA)}?pair=${encodeURIComponent(pool.pairAddress)}">Open ${escapeHtml(pool.dexName || "pool")}</a>` : pool.verificationPending ? '<p class="status-text">On-chain verification temporarily unavailable. Please refresh.</p>' : pool.status === "scheduled" ? "" : `<div class="pool-liquidity-actions">
          <button type="button" class="submit-button" data-add-liquidity="${escapeHtml(pool.id)}" data-chain="${escapeHtml(pool.chain)}" data-protocol="${escapeHtml(pool.protocolVersion || "v2")}" data-token="${escapeHtml(pool.tokenA)}" data-pair="${escapeHtml(pool.pairAddress || "")}" data-symbol="${escapeHtml(pool.symbol || "TOKEN")}" data-quote-symbol="${escapeHtml(pool.quoteSymbol || pool.nativeSymbol || "NATIVE")}" data-logo="${escapeHtml(pool.logoUrl ? new URL(pool.logoUrl,"https://cookdex.net").href : DEFAULT_TOKEN_LOGO)}" data-fee="${escapeHtml(pool.poolFeeBps || 30)}">Add liquidity</button>
          <button type="button" class="danger-button" data-catalog-remove="${escapeHtml(pool.id)}" data-chain="${escapeHtml(pool.chain)}" data-protocol="${escapeHtml(pool.protocolVersion || "v2")}" data-token="${escapeHtml(pool.tokenA)}" data-pair="${escapeHtml(pool.pairAddress)}" data-symbol="${escapeHtml(pool.symbol || "TOKEN")}" data-quote-symbol="${escapeHtml(pool.quoteSymbol || pool.nativeSymbol || "NATIVE")}" data-logo="${escapeHtml(pool.logoUrl ? new URL(pool.logoUrl,"https://cookdex.net").href : DEFAULT_TOKEN_LOGO)}" data-fee="${escapeHtml(pool.poolFeeBps || 30)}">Remove my liquidity</button>
        </div>`}
      </article>`).join("") : '<p class="account-empty">No CookDEX pools have been created yet.</p>';
    updatePoolChainFilter(payload.items);
  } catch (error) { if(!list.dataset.loaded)list.innerHTML = `<p class="status-text">${escapeHtml(error.message)}</p>`; }
}

const addLiquidityState = { quote: null, edited: "token", requestId: 0, autoBuy: null, autoBuyTimer: null, autoBuyRequestId: 0, affordable: true };

function scheduleAutoBuyQuote() {
  ++addLiquidityState.autoBuyRequestId;
  addLiquidityState.autoBuy = null;
  addLiquidityState.affordable = false;
  clearTimeout(addLiquidityState.autoBuyTimer);
  addLiquidityState.autoBuyTimer = setTimeout(refreshAutoBuyQuote, 350);
}

async function refreshAutoBuyQuote() {
  const requestId = ++addLiquidityState.autoBuyRequestId;
  const form = document.getElementById("addLiquidityForm");
  const preview = document.getElementById("addLiquidityAutoBuy");
  const rangeWrap = document.getElementById("addLiquidityNativeRange")?.closest("label");
  if (!form || !preview || !addLiquidityState.quote) return;
  const requiredToken = Number(form.elements.tokenAmount.value || 0);
  const tokenBalance = Number(addLiquidityState.quote.balances?.token || 0);
  const nativeBalance = Number(addLiquidityState.quote.balances?.native || 0);
  const nativeForPool = Number(form.elements.nativeAmount.value || 0);
  const missing = Math.max(0, requiredToken - tokenBalance);
  addLiquidityState.autoBuy = null;
  const gasReserve = addLiquidityState.quote.erc20Pair ? 0 : Math.max(0.0005, nativeBalance * 0.002);
  addLiquidityState.affordable = nativeForPool + gasReserve <= nativeBalance;
  preview.className = "pool-auto-buy-preview";
  rangeWrap?.classList.toggle("is-insufficient", !addLiquidityState.affordable);
  if (!(requiredToken > 0) || !(nativeForPool > 0)) { preview.textContent = "Choose a native amount to calculate whether tokens must be bought."; return; }
  if (!(missing > 0)) {
    preview.textContent = `Enough tokens available. No purchase required (${displayAmount(tokenBalance)} ${addLiquidityState.quote.tokenSymbol}).`;
    preview.classList.add(addLiquidityState.affordable ? "is-ready" : "is-insufficient");
    if (!addLiquidityState.affordable) preview.textContent += " Insufficient native balance including gas reserve.";
    return;
  }
  if (!form.elements.autoBuyMissing.checked) {
    addLiquidityState.affordable = false;
    rangeWrap?.classList.add("is-insufficient");
    preview.classList.add("is-insufficient");
    preview.textContent = `${displayAmount(missing)} ${addLiquidityState.quote.tokenSymbol} are missing. Enable the exact automatic purchase or reduce liquidity.`;
    return;
  }
  addLiquidityState.affordable = false;
  preview.textContent = `Calculating exact purchase for ${displayAmount(missing)} missing ${addLiquidityState.quote.tokenSymbol}...`;
  try {
    const response = await fetch("/api/cookdex/api/pools/auto-buy-quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chain: form.elements.chain.value, protocolVersion: form.elements.protocolVersion.value, token: form.elements.tokenA.value, requiredToken }) });
    const payload = await response.json().catch(() => ({}));
    if (requestId !== addLiquidityState.autoBuyRequestId) return;
    if (!response.ok || !payload.success) throw new Error(payload.detail || "Missing-token purchase could not be quoted.");
    addLiquidityState.autoBuy = payload.buy;
    const buyMaximum = Number(payload.buy?.maximumNative || 0);
    const totalRequired = nativeForPool + buyMaximum + gasReserve;
    addLiquidityState.affordable = totalRequired <= nativeBalance;
    rangeWrap?.classList.toggle("is-insufficient", !addLiquidityState.affordable);
    preview.classList.add(addLiquidityState.affordable ? "is-ready" : "is-insufficient");
    preview.textContent = `${displayAmount(payload.missingToken)} ${addLiquidityState.quote.tokenSymbol} missing · exact buy max. ${displayAmount(buyMaximum)} ${addLiquidityState.quote.nativeSymbol} · LP ${displayAmount(nativeForPool)} ${addLiquidityState.quote.nativeSymbol} · gas reserve ${displayAmount(gasReserve)} ${addLiquidityState.quote.nativeSymbol}${addLiquidityState.affordable ? "" : " · insufficient native balance"}`;
  } catch (error) {
    if (requestId !== addLiquidityState.autoBuyRequestId) return;
    addLiquidityState.affordable = false;
    rangeWrap?.classList.add("is-insufficient");
    preview.classList.add("is-insufficient");
    preview.textContent = error.message;
  }
}

function setDialogIdentity(prefix, button) {
  const logo = document.getElementById(`${prefix}Logo`);
  logo.src = button.dataset.logo || DEFAULT_TOKEN_LOGO;
  logo.onerror = () => { logo.src = DEFAULT_TOKEN_LOGO; };
  document.getElementById(`${prefix}Pair`).textContent = `${button.dataset.symbol || "TOKEN"} / ${button.dataset.quoteSymbol || "NATIVE"}`;
  document.getElementById(`${prefix}Meta`).textContent = `${String(button.dataset.chain || "").toUpperCase()} · ${String(button.dataset.protocol || "v2").toUpperCase()} · ${Number(button.dataset.fee || 30) / (String(button.dataset.protocol || "v2").toLowerCase() === "v3" ? 10_000 : 100)}% · ${shortAddress(button.dataset.pair)}`;
}

function closePoolDialog(dialog) {
  if (dialog?.open) dialog.close();
}

function applyLiquidityAmounts() {
  const form = document.getElementById("addLiquidityForm");
  const quote = addLiquidityState.quote;
  if (!form || !quote) return;
  const tokenReserve = Number(quote.tokenReserve);
  const nativeReserve = Number(quote.nativeReserve);
  if (!(tokenReserve > 0) || !(nativeReserve > 0)) return;
  if (addLiquidityState.edited === "native") {
    const amount = Number(form.elements.nativeAmount.value);
    form.elements.tokenAmount.value = amount > 0 ? compactNumber(amount * tokenReserve / nativeReserve) : "";
  } else {
    const amount = Number(form.elements.tokenAmount.value);
    form.elements.nativeAmount.value = amount > 0 ? compactNumber(amount * nativeReserve / tokenReserve) : "";
  }
  setPoolBalance("addLiquidityTokenBalance", quote.balances?.token, form.elements.tokenAmount.value, quote.tokenSymbol, true);
  setPoolBalance("addLiquidityNativeBalance", quote.balances?.native, form.elements.nativeAmount.value, quote.nativeSymbol, true);
  scheduleAutoBuyQuote();
}

async function openAddLiquidityDialog(button) {
  const dialog = document.getElementById("addLiquidityDialog");
  const form = document.getElementById("addLiquidityForm");
  const status = document.getElementById("addLiquidityStatus");
  setDialogIdentity("addLiquidity", button);
  form.reset();
  clearTimeout(addLiquidityState.autoBuyTimer);
  ++addLiquidityState.autoBuyRequestId;
  addLiquidityState.autoBuy = null;
  addLiquidityState.affordable = false;
  for (const name of ["chain", "protocolVersion", "tokenA", "poolAddress", "poolFeeBps"]) {
    const source = { chain: "chain", protocolVersion: "protocol", tokenA: "token", poolAddress: "pair", poolFeeBps: "fee" }[name];
    form.elements[name].value = button.dataset[source] || "";
  }
  addLiquidityState.quote = null;
  addLiquidityState.edited = "token";
  document.getElementById("addLiquidityTokenLabel").textContent = `${button.dataset.symbol || "Token"} amount`;
  document.getElementById("addLiquidityNativeLabel").textContent = `${button.dataset.quoteSymbol || "Native"} amount`;
  document.getElementById("addLiquidityRatio").textContent = "Loading current pool balance...";
  status.textContent = "";
  dialog.showModal();
  const requestId = ++addLiquidityState.requestId;
  try {
    const wallet = await connectedWallet(button.dataset.chain);
    const params = new URLSearchParams({
      chain: button.dataset.chain,
      protocolVersion: button.dataset.protocol || "v2",
      token: button.dataset.token,
      poolAddress: button.dataset.pair,
      poolFeeBps: button.dataset.fee || "30",
      owner: wallet.address,
    });
    const response = await fetch(`/api/cookdex/api/pools/liquidity-quote?${params}`, { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.success) throw new Error(payload.detail || "Pool balance could not be loaded.");
    if (requestId !== addLiquidityState.requestId) return;
    addLiquidityState.quote = payload.quote;
    form.elements.autoBuyMissing.checked = !payload.quote.erc20Pair;
    form.elements.autoBuyMissing.disabled = Boolean(payload.quote.erc20Pair);
    document.getElementById("addLiquidityTokenLabel").textContent = `${payload.quote.tokenSymbol} amount`;
    document.getElementById("addLiquidityNativeLabel").textContent = `${payload.quote.nativeSymbol} amount`;
    document.getElementById("addLiquidityRatio").textContent = `Current pool balance: ${displayAmount(payload.quote.tokenReserve)} ${payload.quote.tokenSymbol} / ${displayAmount(payload.quote.nativeReserve)} ${payload.quote.nativeSymbol}. The matching side is calculated with this ratio.`;
    setPoolBalance("addLiquidityTokenBalance", payload.quote.balances?.token, 0, payload.quote.tokenSymbol, true);
    setPoolBalance("addLiquidityNativeBalance", payload.quote.balances?.native, 0, payload.quote.nativeSymbol, true);
    applyLiquidityAmounts();
    status.textContent = "Pool balance ready.";
    scheduleAutoBuyQuote();
  } catch (error) {
    if (requestId === addLiquidityState.requestId) status.textContent = `Error: ${error.message}`;
  }
}

function openRemoveLiquidityDialog(button, source) {
  const dialog = document.getElementById("removeLiquidityDialog");
  const form = document.getElementById("removeLiquidityForm");
  const id = source === "catalog" ? button.dataset.catalogRemove : button.dataset.removeLiquidity;
  form.reset();
  form.elements.source.value = source;
  form.elements.id.value = id;
  form.elements.chain.value = button.dataset.chain || "";
  form.elements.protocolVersion.value = button.dataset.protocol || "v2";
  form.elements.token.value = button.dataset.token || "";
  form.elements.poolAddress.value = button.dataset.pair || "";
  form.elements.percent.value = "100";
  document.getElementById("removeLiquidityPercentValue").value = "100%";
  form.elements.positionTokenId.value = "";
  document.getElementById("removePositionField").classList.toggle("hidden", form.elements.protocolVersion.value !== "v3" || source !== "catalog");
  document.getElementById("removeLiquidityStatus").textContent = "";
  setDialogIdentity("removeLiquidity", button);
  dialog.showModal();
}

async function claimPoolFees(button) {
  const status = document.getElementById("poolIntegrationStatus");
  try {
    await connectedWallet(button.dataset.chain);
    status.textContent = "Building pool fee claim...";
    const response = await fetch("/api/cookdex/api/pools/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chain: button.dataset.chain, poolAddress: button.dataset.claimPool, protocolVersion: button.dataset.protocol || "v2" }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.success) throw new Error(payload.detail || "Pool fees could not be claimed.");
    status.textContent = "Confirm fee claim in your wallet...";
    const txHash = await window.dexWallet.sendTransaction(payload.claim.transaction);
    status.textContent = `Fee claim sent: ${shortAddress(txHash)}`;
    setTimeout(loadPools, 4_000);
  } catch (error) {
    status.textContent = `Error: ${error.message || "Fee claim failed."}`;
  }
}

async function releasePoolLiquidity(button) {
  const id = button.dataset.releaseLiquidity;
  const status = document.getElementById("poolIntegrationStatus");
  try {
    await connectedWallet(button.dataset.chain);
    const response = await fetch("/api/cookdex/api/pools/manage/build", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "release" }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.success) throw new Error(payload.detail || "Liquidity release could not be built.");
    const hash = await window.dexWallet.sendTransaction(payload.build.transaction);
    await window.dexWallet.waitForTransaction(hash);
    await fetch("/api/cookdex/api/pools/manage/released", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, txHash: hash }) });
    status.textContent = "Liquidity lock released.";
    await loadPools();
  } catch (error) { status.textContent = `Error: ${error.message}`; }
}

function preparePoolAddition(button) {
  openAddLiquidityDialog(button);
}

function prepareScheduledLaunch(button) {
  const form = document.getElementById("poolDraftForm");
  if (!form || button.disabled) return;
  form.elements.chain.value = button.dataset.chain;
  updateProtocolOptions(form);
  form.elements.protocolVersion.value = button.dataset.protocol || "v2";
  updateProtocolOptions(form);
  form.elements.tokenA.value = button.dataset.token;
  form.elements.tokenB.value = button.dataset.tokenB || '';
  form.elements.priceUsd.value = button.dataset.price || "";
  form.elements.poolFeeBps.value = button.dataset.fee || "30";
  form.elements.tokenAmount.value = button.dataset.tokenAmount || "";
  form.elements.nativeAmount.value = button.dataset.nativeAmount || "";
  form.elements.nativePriceUsd.value = button.dataset.nativePrice || "";
  form.elements.lockMode.value = button.dataset.lockMode || "unlocked";
  form.elements.unlockAt.value = localDateTimeValue(button.dataset.unlockAt);
  form.elements.startMode.value = "now";
  form.elements.startsAt.value = "";
  form.elements.draftId.value = button.dataset.launchScheduled;
  document.getElementById("poolStartsAtField")?.classList.add("hidden");
  form.elements.startsAt.required = false;
  form.querySelector('button[type="submit"]').textContent = "Launch scheduled pool in wallet";
  form.closest('details')?.setAttribute('open',''); form.scrollIntoView({ behavior: "smooth", block: "start" });
  if (!solanaPool()) schedulePoolQuote();
}

function refreshPoolCountdowns() {
  document.querySelectorAll("[data-countdown-to]").forEach((node) => {
    node.textContent = countdownText(node.dataset.countdownTo);
    const button = node.closest(".pool-list-item")?.querySelector("[data-launch-scheduled]");
    if (button && Date.parse(node.dataset.countdownTo) <= Date.now()) button.disabled = false;
  });
}

const DEFAULT_TOKEN_LOGO = "/assets/token-default.svg";
const managedPositionByPool = new Map();
const poolBuilder = { edited: "token", quote: null, requestId: 0 };
let quoteTimer = null;

function updateProtocolOptions(form) {
  if (!form) return;
  const versions = String(form.elements.chain.selectedOptions[0]?.dataset.versions || "").split(",").filter(Boolean);
  const protocolSelect = form.elements.protocolVersion;
  const previous = protocolSelect.value;
  protocolSelect.innerHTML = versions.map((version) => `<option value="${version}">CookDEX ${version.toUpperCase()}</option>`).join("");
  if (versions.includes(previous)) protocolSelect.value = previous;
  const protocol = protocolSelect.value || versions[0] || "v2";
  const fees = protocol === "v3"
    ? [[100, "0.01%"], [1000, "0.10%"], [3000, "0.30%"], [10000, "1.00%"]]
    : [[30, "0.30% (standard V2)"]];
  form.elements.poolFeeBps.innerHTML = fees.map(([value, label]) => `<option value="${value}"${value === (protocol === "v3" ? 3000 : 30) ? " selected" : ""}>${label}</option>`).join("");
}

function compactNumber(value, significantDigits = 12) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "";
  return Number(number.toPrecision(significantDigits)).toString();
}

function displayAmount(value, maximumFractionDigits = 8) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString(undefined, { maximumFractionDigits }) : "--";
}

function displayUsd(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "--";
  return `$${number.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function setPoolBalance(id, balance, required, symbol, connected) {
  const node = document.getElementById(id);
  if (!node) return;
  node.classList.remove("pool-balance--enough", "pool-balance--insufficient");
  if (!connected) {
    node.textContent = "Connect wallet to check balance";
    return;
  }
  if (!Number.isFinite(Number(balance))) {
    node.textContent = "Wallet balance unavailable";
    return;
  }
  const enough = !(Number(required) > 0) || Number(required) <= Number(balance);
  node.textContent = enough
    ? `Wallet: ${displayAmount(balance)} ${symbol}`
    : `Insufficient balance · Wallet: ${displayAmount(balance)} ${symbol}`;
  node.classList.add(enough ? "pool-balance--enough" : "pool-balance--insufficient");
}

function resetPoolToken() {
  poolBuilder.quote = null;
  const logo = document.getElementById("poolTokenLogo");
  if (logo) logo.src = DEFAULT_TOKEN_LOGO;
  const identity = document.getElementById("poolTokenIdentity");
  if (identity) identity.innerHTML = "<strong>Token not loaded</strong><span>Enter a contract to resolve the token.</span>";
  document.getElementById("poolMarketPrice")?.classList.add("hidden");
  document.getElementById("poolResultPrice").textContent = "--";
  document.getElementById("poolResultRatio").textContent = "Enter both liquidity amounts";
}

function applyPoolQuote(form, quote, requested) {
  poolBuilder.quote = quote;
  form.elements.priceUsd.required = !quote.manualAmounts;
  form.elements.priceUsd.closest('label').classList.toggle('hidden',Boolean(quote.erc20Pair));
  document.getElementById('poolTokenBIdentity').textContent = quote.erc20Pair ? `${quote.nativeSymbol}${quote.tokenBName ? ` · ${quote.tokenBName}` : ''}` : '';
  document.getElementById('poolNativeAmountLabel').textContent = `${quote.nativeSymbol} amount`;
  form.elements.nativePriceUsd.value = String(quote.nativePriceUsd || "");
  const logo = document.getElementById("poolTokenLogo");
  logo.src = quote.tokenLogo ? new URL(quote.tokenLogo, "https://cookdex.net").href : DEFAULT_TOKEN_LOGO;
  logo.onerror = () => { logo.src = DEFAULT_TOKEN_LOGO; };
  document.getElementById("poolTokenIdentity").innerHTML = `<strong>${escapeHtml(quote.tokenSymbol)}${quote.tokenName ? ` · ${escapeHtml(quote.tokenName)}` : ''}</strong><span>${escapeHtml(shortAddress(quote.token))}</span>`;

  const marketButton = document.getElementById("poolMarketPrice");
  if (Number(quote.marketPriceUsd) > 0) {
    marketButton.dataset.price = String(quote.marketPriceUsd);
    marketButton.textContent = `Main pool: ${displayUsd(quote.marketPriceUsd)} · ${quote.marketDexName || "DEX"} · use price`;
    marketButton.classList.remove("hidden");
  } else {
    marketButton.classList.add("hidden");
  }

  if (quote.calculated) {
    if (!quote.manualAmounts) {
      if (requested.edited === "native") form.elements.tokenAmount.value = compactNumber(quote.tokenAmount);
      else form.elements.nativeAmount.value = compactNumber(quote.nativeAmount);
    }
    document.getElementById("poolResultPrice").textContent = displayUsd(quote.resultingPriceUsd);
    document.getElementById("poolResultRatio").textContent = `1 ${quote.tokenSymbol} = ${displayAmount(Number(quote.nativeAmount) / Number(quote.tokenAmount), 12)} ${quote.nativeSymbol}`;
    document.getElementById("poolQuote").textContent = `${displayAmount(quote.tokenAmount)} ${quote.tokenSymbol} + ${displayAmount(quote.nativeAmount)} ${quote.nativeSymbol}. Each side is worth about ${displayUsd(Number(quote.totalValueUsd) / 2)}; total starting liquidity ${displayUsd(quote.totalValueUsd)} via ${quote.routerName}.`;
  } else {
    document.getElementById("poolResultPrice").textContent = "--";
    document.getElementById("poolResultRatio").textContent = quote.manualAmounts ? "Enter both liquidity amounts" : "Enter a target price and one liquidity amount";
    document.getElementById("poolQuote").textContent = "Token found. Enter a target price and either amount to calculate the matching pool side.";
  }

  const wallet = window.dexWallet?.getState?.() || {};
  if (quote.manualAmounts) {
    document.getElementById("poolResultPrice").textContent = "USD price unavailable";
    document.getElementById("poolQuote").textContent = "No COOK/USD price yet. Enter both token and COOK amounts; their ratio sets the initial pool price. A small pool price is easily moved by trades.";
    if (quote.erc20Pair) {
      document.getElementById('poolResultPrice').textContent = Number(quote.tokenAmount)>0 ? `1 ${quote.tokenSymbol} = ${displayAmount(Number(quote.nativeAmount)/Number(quote.tokenAmount),12)} ${quote.nativeSymbol}` : '--';
      document.getElementById('poolQuote').textContent = `Enter both ${quote.tokenSymbol} and ${quote.nativeSymbol} amounts. Their ratio sets the initial price; both are transferred as ERC20 tokens.`;
    }
  }
  setPoolBalance("poolTokenBalance", quote.balances?.token, form.elements.tokenAmount.value, quote.tokenSymbol, Boolean(wallet.address));
  setPoolBalance("poolNativeBalance", quote.balances?.native, form.elements.nativeAmount.value, quote.nativeSymbol, Boolean(wallet.address));
}

async function refreshPoolQuote() {
  const form = document.getElementById("poolDraftForm");
  if (!form) return;
  const status = document.getElementById("poolStatus");
  const chain = form.elements.chain.value;
  const nativeSymbol = form.elements.chain.selectedOptions[0]?.dataset.native || "NATIVE";
  document.getElementById("poolNativeAmountLabel").textContent = `${nativeSymbol} amount`;
  const token = form.elements.tokenA.value.trim();
  if (!/^0x[0-9a-f]{40}$/i.test(token)) {
    resetPoolToken();
    status.textContent = token ? "Enter a complete EVM token contract." : "";
    return;
  }
  const wallet = window.dexWallet?.getState?.() || {};
  const requested = {
    edited: poolBuilder.edited,
    protocolVersion: form.elements.protocolVersion.value,
    tokenAmount: form.elements.tokenAmount.value,
    nativeAmount: form.elements.nativeAmount.value,
    priceUsd: form.elements.priceUsd.value,
  };
  const params = new URLSearchParams({ chain, token, ...requested });
  if (form.elements.tokenB.value.trim()) params.set('tokenB',form.elements.tokenB.value.trim());
  if (wallet.address) params.set("owner", wallet.address);
  const requestId = ++poolBuilder.requestId;
  status.textContent = "Reading token and calculating pool ratio...";
  try {
    let response, payload;
    for (let attempt = 0; attempt < 2; attempt++) {
      response = await fetch(`/api/cookdex/api/pools/quote?${params.toString()}`, { cache: "no-store" });
      payload = await response.json().catch(() => ({}));
      if (response.ok && payload.success) break;
      if (attempt || !/RPC call unavailable|temporarily unavailable/i.test(payload.detail || payload.error || "")) break;
      if (requestId !== poolBuilder.requestId) return;
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    if (!response.ok || !payload.success) throw new Error(payload.detail || "Pool quote failed.");
    if (requestId !== poolBuilder.requestId) return;
    applyPoolQuote(form, payload.quote, requested);
    status.textContent = payload.quote.calculated ? "Pool ratio ready." : "Token found.";
  } catch (error) {
    if (requestId !== poolBuilder.requestId) return;
    resetPoolToken();
    status.textContent = `Error: ${error.message}`;
  }
}

function schedulePoolQuote() {
  clearTimeout(quoteTimer);
  quoteTimer = setTimeout(refreshPoolQuote, 400);
}

async function requestPoolBuild(body) {
  const response = await fetch("/api/cookdex/api/pools/build", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.success) throw new Error(payload.detail || "Pool transaction could not be built.");
  return payload.build;
}

const pendingPoolRegistrationKey = 'cookdex:pending-pool-registrations:v1';
let recoveringPoolRegistrations = false;
function pendingPoolRegistrations() {
  try { return JSON.parse(localStorage.getItem(pendingPoolRegistrationKey) || '{}'); }
  catch { return {}; }
}
function rememberPoolRegistration(body, remove = false) {
  try {
    const entries = pendingPoolRegistrations();
    if (remove) delete entries[body.txHash];
    else entries[body.txHash] = body;
    localStorage.setItem(pendingPoolRegistrationKey, JSON.stringify(entries));
  } catch (error) { console.warn('Pool registration recovery storage unavailable', error); }
}
async function saveConfirmedPool(body) {
  const response = await fetch('/api/cookdex/api/pools/drafts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.success) throw new Error(payload.detail || 'Pool registration is pending. Do not send liquidity again; reopen My Pools to retry saving.');
  return payload;
}
async function recoverPoolRegistrations() {
  const owner = window.dexWallet?.getState?.().address;
  if (!owner || recoveringPoolRegistrations) return;
  recoveringPoolRegistrations = true;
  try {
    for (const body of Object.values(pendingPoolRegistrations())) {
      if (String(body.ownerWallet).toLowerCase() !== owner.toLowerCase()) continue;
      try {
        await saveConfirmedPool(body);
        rememberPoolRegistration(body, true);
        const status = document.getElementById('poolStatus');
        if (status) status.textContent = 'Confirmed pool recovered and saved. Check its lock/burn status before further actions.';
      } catch (error) {
        if (error.message === 'Liquidity transaction reverted on-chain.') rememberPoolRegistration(body, true);
        else console.warn('Pool registration will be retried', body.txHash, error.message);
      }
    }
  } finally { recoveringPoolRegistrations = false; }
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function mintedPositionTokenId(receipt, owner) {
  const transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
  const ownerTopic = `0x${String(owner || "").toLowerCase().replace(/^0x/, "").padStart(64, "0")}`;
  const log = (receipt?.logs || []).find((item) => String(item.topics?.[0] || "").toLowerCase() === transferTopic && /^0x0{64}$/i.test(String(item.topics?.[1] || "")) && String(item.topics?.[2] || "").toLowerCase() === ownerTopic);
  return log?.topics?.[3] ? BigInt(log.topics[3]).toString() : "";
}

function mintedV2Liquidity(receipt, owner, pairAddress) {
  const transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
  const ownerTopic = `0x${String(owner || "").toLowerCase().replace(/^0x/, "").padStart(64, "0")}`;
  const log = (receipt?.logs || []).find((item) => String(item.address || "").toLowerCase() === String(pairAddress || "").toLowerCase() && String(item.topics?.[0] || "").toLowerCase() === transferTopic && String(item.topics?.[2] || "").toLowerCase() === ownerTopic);
  return log?.data ? BigInt(log.data).toString() : "";
}

function liquidityErrorMessage(error, fallback) {
  const message = String(error?.message || fallback);
  return /user (?:denied|rejected)|signature.*(?:denied|rejected)|modal closed|4001/i.test(message) ? "Transaction cancelled in wallet." : message;
}

async function runLiquidityTransactions(build, status) {
  for (const step of build.preparationTransactions || []) {
    status.textContent = `${step.label} in your wallet...`;
    const hash = await window.dexWallet.sendTransaction(step.transaction);
    await window.dexWallet.waitForTransaction(hash);
  }
  status.textContent = "Confirm the liquidity transaction in your wallet...";
  let last = null;
  for (const transaction of build.transactions || [build.transaction || build.liquidityTransaction]) {
    const hash = await window.dexWallet.sendTransaction(transaction);
    const receipt = await window.dexWallet.waitForTransaction(hash);
    last = { hash, receipt };
  }
  return last;
}

async function submitAddLiquidity(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("addLiquidityStatus");
  const submit = form.querySelector('button[type="submit"]');
  if (submit.disabled) return;
  submit.disabled = true;
  try {
    if (!addLiquidityState.quote) throw new Error("Wait until the current pool balance has loaded.");
    const body = Object.fromEntries(new FormData(form).entries());
    if (addLiquidityState.quote.erc20Pair) body.tokenB = addLiquidityState.quote.tokenB;
    if (!(Number(body.tokenAmount) > 0) || !(Number(body.nativeAmount) > 0)) throw new Error("Enter a liquidity amount greater than zero.");
    const wallet = await connectedWallet(body.chain);
    clearTimeout(addLiquidityState.autoBuyTimer);
    ++addLiquidityState.autoBuyRequestId;
    const balanceParams = new URLSearchParams({ chain: body.chain, protocolVersion: body.protocolVersion, token: body.tokenA, poolAddress: body.poolAddress, poolFeeBps: body.poolFeeBps });
    const balanceResponse = await fetch(`/api/cookdex/api/pools/liquidity-quote?${balanceParams}`, { cache: "no-store" });
    const balancePayload = await balanceResponse.json();
    if (!balanceResponse.ok || !balancePayload.success || balancePayload.quote?.balances?.native == null || balancePayload.quote?.balances?.token == null) throw new Error("Current wallet balance is unavailable.");
    addLiquidityState.quote = balancePayload.quote;
    await refreshAutoBuyQuote();
    const currentBody=Object.fromEntries(new FormData(form).entries());
    if (addLiquidityState.quote.erc20Pair) currentBody.tokenB=addLiquidityState.quote.tokenB;
    if (JSON.stringify(body) !== JSON.stringify(currentBody)) throw new Error("Amounts changed. Please submit again for a current quote.");
    if (!addLiquidityState.affordable) throw new Error("Native balance is insufficient or the current purchase quote is unavailable.");
    const purchase = addLiquidityState.autoBuy;
    if (body.autoBuyMissing === "on" && purchase?.swapTransaction) {
      const estimate = await window.dexWallet.estimateTransaction(purchase.swapTransaction);
      if (!estimate.enough) throw new Error("Insufficient native balance for the purchase and network fee.");
      if (JSON.stringify(body) !== JSON.stringify(Object.fromEntries(new FormData(form).entries()))) throw new Error("Amounts changed. Please submit again for a current quote.");
      status.textContent = `Buy exactly ${displayAmount(purchase.amountOut)} missing ${addLiquidityState.quote.tokenSymbol} first...`;
      const buyHash = await window.dexWallet.sendTransaction(purchase.swapTransaction);
      await window.dexWallet.waitForTransaction(buyHash);
    }
    status.textContent = "Building add-liquidity transaction...";
    const build = await requestPoolBuild({ ...body, token: body.tokenA, lockMode: "unlocked", startMode: "now", poolCreationSent: true });
    if (!build.liquidityTransaction) throw new Error("The add-liquidity transaction is not ready yet.");
    const result = await runLiquidityTransactions(build, status);
    const positionTokenId = body.protocolVersion === "v3" ? mintedPositionTokenId(result.receipt, wallet.address) : "";
    const saved = await fetch("/api/cookdex/api/pools/drafts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, ownerWallet: wallet.address, pairAddress: build.pairAddress || body.poolAddress, positionTokenId, txHash: result.hash, startMode: "now" }) });
    const savedPayload = await saved.json().catch(() => ({}));
    if (!saved.ok || !savedPayload.success) throw new Error(savedPayload.detail || "Liquidity was added, but the position could not be saved.");
    status.textContent = `✓ Liquidity added: ${shortAddress(result.hash)}`;
    showPoolSuccess("Liquidity successfully added");
    await Promise.all([loadPoolCatalog(), loadPools()]);
    setTimeout(() => closePoolDialog(document.getElementById("addLiquidityDialog")), 900);
  } catch (error) {
    status.textContent = `Error: ${liquidityErrorMessage(error, "Liquidity could not be added.")}`;
  } finally {
    submit.disabled = false;
  }
}

async function submitRemoveLiquidity(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("removeLiquidityStatus");
  const submit = form.querySelector('button[type="submit"]');
  const body = Object.fromEntries(new FormData(form).entries());
  try {
    if (!(Number(body.percent) > 0)) throw new Error("Choose more than 0% liquidity to remove.");
    await connectedWallet(body.chain);
    submit.disabled = true;
    status.textContent = `Building ${body.percent}% liquidity removal...`;
    const url = body.source === "catalog" ? "/api/cookdex/api/pools/catalog/remove" : "/api/cookdex/api/pools/manage/build";
    const requestBody = body.source === "catalog"
      ? { chain: body.chain, protocolVersion: body.protocolVersion, token: body.token, poolAddress: body.poolAddress, positionTokenId: body.positionTokenId, percent: body.percent }
      : { id: body.id, action: "remove", percent: body.percent };
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestBody) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.success) throw new Error(payload.detail || "Liquidity removal could not be built.");
    const result = await runLiquidityTransactions(payload.build, status);
    status.textContent = `✓ ${body.percent}% liquidity removed: ${shortAddress(result.hash)}`;
    showPoolSuccess("Liquidity successfully removed");
    await Promise.all([loadPoolCatalog(), loadPools()]);
    setTimeout(() => closePoolDialog(document.getElementById("removeLiquidityDialog")), 900);
  } catch (error) {
    status.textContent = `Error: ${liquidityErrorMessage(error, "Liquidity could not be removed.")}`;
  } finally {
    submit.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try { await window.cookLiquidityReady; } catch (error) { document.getElementById("poolStatus").textContent=error.message; return; }
  const form = document.getElementById("poolDraftForm");
  const solanaPool = () => form?.elements.chain.selectedOptions[0]?.dataset.family === "solana";
  const updatePoolFamily = () => {
    if (!form) return;
    const solana = solanaPool();
    document.getElementById("solanaPoolProviderField")?.classList.toggle("hidden", !solana);
    document.getElementById("solanaPoolNotice")?.classList.toggle("hidden", !solana);
    document.getElementById("poolTokenContractLabel").textContent = solana ? "Token mint" : "Token A contract";
    document.getElementById('poolTokenBField')?.classList.toggle('hidden',solana);
    form.elements.tokenA.placeholder = solana ? "Solana token mint" : "0x token contract";
    form.querySelector('button[type="submit"]').textContent = solana ? "Continue to official pool creator" : "Create pool in wallet";
  };
  document.getElementById("refreshPools")?.addEventListener("click", loadPools);
  document.getElementById("refreshPoolCatalog")?.addEventListener("click", loadPoolCatalog);
  document.getElementById('poolChainFilter')?.addEventListener('change', filterPoolCatalog);
  document.getElementById("poolList")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-claim-pool]");
    if (button && !button.disabled) claimPoolFees(button);
    const add = event.target.closest("[data-add-liquidity]");
    const remove = event.target.closest("[data-remove-liquidity]");
    const release = event.target.closest("[data-release-liquidity]");
    const launch = event.target.closest("[data-launch-scheduled]");
    if (add) preparePoolAddition(add);
    if (remove && !remove.disabled) openRemoveLiquidityDialog(remove, "managed");
    if (release && !release.disabled) releasePoolLiquidity(release);
    if (launch && !launch.disabled) prepareScheduledLaunch(launch);
  });
  document.getElementById("poolCatalogList")?.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add-liquidity]");
    const remove = event.target.closest("[data-catalog-remove]");
    if (add) preparePoolAddition(add);
    if (remove && !remove.disabled) openRemoveLiquidityDialog(remove, "catalog");
  });
  document.getElementById("addLiquidityForm")?.addEventListener("submit", submitAddLiquidity);
  document.getElementById("removeLiquidityForm")?.addEventListener("submit", submitRemoveLiquidity);
  document.getElementById("removeLiquidityPercent")?.addEventListener("input", (event) => {
    document.getElementById("removeLiquidityPercentValue").value = `${event.target.value}%`;
  });
  document.getElementById("addLiquidityForm")?.elements.tokenAmount.addEventListener("input", () => { addLiquidityState.edited = "token"; applyLiquidityAmounts(); });
  document.getElementById("addLiquidityForm")?.elements.nativeAmount.addEventListener("input", () => { addLiquidityState.edited = "native"; applyLiquidityAmounts(); });
  document.getElementById("addLiquidityNativeRange")?.addEventListener("input", (event) => {
    const balance = Number(addLiquidityState.quote?.balances?.native || 0);
    document.getElementById("addLiquidityNativeRangeValue").value = `${event.target.value}%`;
    const form = document.getElementById("addLiquidityForm");
    if (form && balance >= 0) {
      form.elements.nativeAmount.value = compactNumber(balance * Number(event.target.value) / 100);
      addLiquidityState.edited = "native";
      applyLiquidityAmounts();
    }
  });
  document.getElementById("addLiquidityForm")?.elements.autoBuyMissing.addEventListener("change", scheduleAutoBuyQuote);
  document.querySelectorAll("[data-close-pool-dialog]").forEach((button) => button.addEventListener("click", () => closePoolDialog(button.closest("dialog"))));
  document.querySelectorAll(".pool-dialog").forEach((dialog) => dialog.addEventListener("click", (event) => { if (event.target === dialog) closePoolDialog(dialog); }));
  updateProtocolOptions(form);
  form?.elements.chain.addEventListener("change", () => { form.elements.tokenB.value=''; updateProtocolOptions(form); updatePoolFamily(); resetPoolToken(); document.getElementById('poolTokenBField').classList.toggle('hidden',solanaPool()); if (!solanaPool()) schedulePoolQuote(); });
  form?.elements.protocolVersion.addEventListener("change", () => { updateProtocolOptions(form); resetPoolToken(); schedulePoolQuote(); });
  form?.elements.lockMode.addEventListener("change", () => {
    const locked = form.elements.lockMode.value === "locked";
    document.getElementById("poolUnlockAtField")?.classList.toggle("hidden", !locked);
    form.elements.unlockAt.required = locked;
    if (locked && !form.elements.unlockAt.min) form.elements.unlockAt.min = localDateTimeValue(Date.now() + 120_000);
  });
  form?.elements.startMode.addEventListener("change", () => {
    const scheduled = form.elements.startMode.value === "scheduled";
    form.elements.draftId.value = "";
    document.getElementById("poolStartsAtField")?.classList.toggle("hidden", !scheduled);
    form.elements.startsAt.required = scheduled;
    form.elements.startsAt.min = scheduled ? localDateTimeValue(Date.now() + 60_000) : "";
    form.querySelector('button[type="submit"]').textContent = scheduled ? "Schedule pool launch" : "Create pool in wallet";
  });
  form?.elements.tokenA.addEventListener("input", schedulePoolQuote);
  form?.elements.tokenB.addEventListener('input', schedulePoolQuote);
  form?.elements.tokenAmount.addEventListener("input", () => { poolBuilder.edited = "token"; schedulePoolQuote(); });
  form?.elements.nativeAmount.addEventListener("input", () => { poolBuilder.edited = "native"; schedulePoolQuote(); });
  form?.elements.priceUsd.addEventListener("input", schedulePoolQuote);
  document.getElementById("poolMarketPrice")?.addEventListener("click", () => {
    const price = document.getElementById("poolMarketPrice").dataset.price;
    if (Number(price) > 0) form.elements.priceUsd.value = compactNumber(price);
    schedulePoolQuote();
  });
  window.addEventListener("dex:wallet-state-changed", schedulePoolQuote);
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("poolStatus");
    const submit = form.querySelector('button[type="submit"]');
    if (submit.disabled) return;
    submit.disabled = true;
    let confirmedPool = null;
    try {
      const body = Object.fromEntries(new FormData(form).entries());
      if (solanaPool()) {
        if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(body.tokenA)) throw new Error("Enter a complete Solana token mint.");
        const destinations = { meteora: "https://app.meteora.ag/pools", raydium: "https://raydium.io/liquidity/create-pool/", orca: "https://www.orca.so/create-pool" };
        const destination = destinations[body.solanaProvider];
        if (!destination) throw new Error("Select a supported Solana pool provider.");
        sessionStorage.setItem("cookdex:solana-pool-draft", JSON.stringify({ provider: body.solanaProvider, tokenMint: body.tokenA, tokenAmount: body.tokenAmount, solAmount: body.nativeAmount, priceUsd: body.priceUsd }));
        status.textContent = `Opening ${body.solanaProvider.toUpperCase()} pool creator...`;
        window.open(destination, "_blank", "noopener,noreferrer");
        return;
      }
      if (body.unlockAt) body.unlockAt = new Date(body.unlockAt).toISOString();
      if (body.startsAt) body.startsAt = new Date(body.startsAt).toISOString();
      if (!(Number(body.nativeAmount) > 0)) throw new Error("Wait for a valid native amount quote.");
      if (!poolBuilder.quote?.manualAmounts && !(Number(body.priceUsd) > 0)) throw new Error("Enter a valid target price.");
      const wallet = await connectedWallet(body.chain);
      const pending = Object.values(pendingPoolRegistrations()).some(entry => String(entry.ownerWallet).toLowerCase() === wallet.address.toLowerCase() && entry.chain === body.chain && String(entry.tokenA).toLowerCase() === String(body.tokenA).toLowerCase() && String(entry.tokenB || '').toLowerCase() === String(body.tokenB || '').toLowerCase());
      if (pending) throw new Error('A previous liquidity transaction is awaiting registration. Refresh My Pools to recover it; do not send liquidity again.');
      if (body.startMode === "scheduled" && !body.draftId) {
        if (!body.startsAt || Date.parse(body.startsAt) < Date.now() + 60_000) throw new Error("Choose a launch time at least one minute in the future.");
        status.textContent = "Saving scheduled pool launch...";
        const saved = await fetch("/api/cookdex/api/pools/drafts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, ownerWallet: wallet.address }) });
        const savedPayload = await saved.json().catch(() => ({}));
        if (!saved.ok || !savedPayload.success) throw new Error(savedPayload.detail || "Scheduled pool could not be saved.");
        status.textContent = `Pool scheduled for ${new Date(body.startsAt).toLocaleString()}. No wallet funds have been moved.`;
        form.reset();
        updateProtocolOptions(form);
        document.getElementById("poolStartsAtField")?.classList.add("hidden");
        document.getElementById("poolUnlockAtField")?.classList.add("hidden");
        form.querySelector('button[type="submit"]').textContent = "Create pool in wallet";
        await Promise.all([loadPools(), loadPoolCatalog()]);
        return;
      }
      status.textContent = `Building ${body.chain.toUpperCase()} liquidity transaction...`;
      let build = await requestPoolBuild(body);
      if (build.poolCreationTransaction) {
        const feePercent = body.protocolVersion === "v3" ? Number(body.poolFeeBps) / 10_000 : Number(body.poolFeeBps) / 100;
        status.textContent = `Create ${feePercent}% CookDEX ${body.protocolVersion.toUpperCase()} pool in your wallet...`;
        const createHash = await window.dexWallet.sendTransaction(build.poolCreationTransaction);
        await window.dexWallet.waitForTransaction(createHash);
        for (let attempt = 0; attempt < 45; attempt += 1) {
          await delay(2_000);
          build = await requestPoolBuild({ ...body, poolCreationSent: true });
          if (!build.pendingPoolCreation) break;
        }
        if (build.pendingPoolCreation || !build.liquidityTransaction) throw new Error("Pool creation is still pending on-chain. Wait for confirmation and try again.");
      }
      for (const step of build.preparationTransactions || []) {
        status.textContent = `${step.label} in your wallet...`;
        const preparationHash = await window.dexWallet.sendTransaction(step.transaction);
        await window.dexWallet.waitForTransaction(preparationHash);
      }
      status.textContent = `Confirm liquidity on ${build.routerName}...`;
      const txHash = await window.dexWallet.sendTransaction(build.liquidityTransaction);
      // Store the hash before waiting: recovery only registers, never resends funds.
      const checkpoint = { ...body, ownerWallet: wallet.address, txHash, pairAddress: build.pairAddress || '', positionTokenId: '', lockMode: 'unlocked', lockId: '', unlockAt: '', registrationCheckpoint: true };
      rememberPoolRegistration(checkpoint);
      let liquidityReceipt;
      try { liquidityReceipt = await window.dexWallet.waitForTransaction(txHash); }
      catch (error) {
        if (error.message === 'The transaction reverted on-chain.') rememberPoolRegistration(checkpoint, true);
        throw error;
      }
      let positionTokenId = body.protocolVersion === "v3" ? mintedPositionTokenId(liquidityReceipt, wallet.address) : "";
      checkpoint.positionTokenId = positionTokenId;
      rememberPoolRegistration(checkpoint);
      status.textContent = 'Liquidity confirmed. Saving pool before finalization...';
      confirmedPool = (await saveConfirmedPool(checkpoint)).pool;
      positionTokenId = confirmedPool.positionTokenId || positionTokenId;
      rememberPoolRegistration(checkpoint, true);
      body.draftId = confirmedPool.id;
      await Promise.all([loadPools(), loadPoolCatalog()]);
      build = await requestPoolBuild({ ...body, poolCreationSent: true, positionTokenId });
      if (!build.pairAddress || /^0x0{40}$/i.test(build.pairAddress)) throw new Error("Liquidity was confirmed, but the new pool address could not be resolved yet. Refresh My Pools in a few seconds.");
      const liquidityTokenAmount = body.protocolVersion === "v2" ? mintedV2Liquidity(liquidityReceipt, wallet.address, build.pairAddress) : "";
      build = await requestPoolBuild({ ...body, poolCreationSent: true, positionTokenId, liquidityTokenAmount });
      let lockId = "";
      const finalizationTxHashes = [];
      for (const step of build.finalizationTransactions || []) {
        status.textContent = `${step.label} in your wallet...`;
        const finalizeHash = await window.dexWallet.sendTransaction(step.transaction);
        const finalizeReceipt = await window.dexWallet.waitForTransaction(finalizeHash);
        finalizationTxHashes.push(finalizeHash);
        const lockLog = (finalizeReceipt.logs || []).find((item) => String(item.topics?.[0] || "").toLowerCase() === "0xdb33f9f62ff6492da2ef83ba027f97bce60dc419b8654e5e4d5f87048e209e50");
        if (lockLog?.topics?.[1]) lockId = BigInt(lockLog.topics[1]).toString();
      }
      const completed = { ...body, ownerWallet: wallet.address, pairAddress: build.pairAddress, positionTokenId, lockId, txHash, finalizationTxHashes };
      rememberPoolRegistration(completed);
      await saveConfirmedPool(completed);
      rememberPoolRegistration(completed, true);
      status.textContent = `Pool transaction sent: ${shortAddress(txHash)}`;
      form.elements.draftId.value = "";
      form.querySelector('button[type="submit"]').textContent = "Create pool in wallet";
      await Promise.all([loadPools(), loadPoolCatalog()]);
    } catch (error) {
      status.textContent = confirmedPool ? `Pool created and saved. Finalization incomplete: ${error.message}. Do not create the pool again.` : `Error: ${error.message || "Pool creation failed."}`;
    } finally { submit.disabled = false; }
  });
  schedulePoolQuote();
  updatePoolFamily();
  loadPoolCatalog();
  recoverPoolRegistrations();
  if (document.getElementById("poolList") && window.dexWallet?.getState?.().address) loadPools();
  let lastPoolWallet = window.dexWallet?.getState?.().address || "";
  window.addEventListener("dex:wallet-state-changed", (event) => {
    const address = event.detail?.address || "";
    if (address === lastPoolWallet) return;
    lastPoolWallet = address;
    recoverPoolRegistrations();
    loadPools();
  });
  window.setInterval(refreshPoolCountdowns, 1_000);
  window.setInterval(() => {
    if (document.hidden || document.querySelector("dialog[open]")) return;
    recoverPoolRegistrations();
    loadPoolCatalog();
    if (window.dexWallet?.getState?.().address) loadPools();
  }, 30_000);
});
