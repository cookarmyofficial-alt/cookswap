# CookSwap

A self-hosted EVM swap application extracted from the current CookSwap implementation. Use it as a starting point for your own swap interface. The application code is MIT licensed. This repository does not contain production credentials, wallet keys, databases, private configurations, relayers or the complete CookDEX backend.

You are welcome to use the existing CookDEX router and factory deployments in your own interface. The public network configuration retains their addresses, so your frontend can route swaps through the existing CookDEX pools. Deploying new routers or factories is not required. Verify the selected chain and addresses before use.

## Technical documentation

[Cookchain / CookDEX technical reference](docs/TECHNICAL_INFORMATION.md) covers V2/V3 factories and routers, EasyLaunch and system curves, official wCOOK contracts, bridge infrastructure and the statistics API. It includes links to the styled web reference and the contract listing PDF. Contract snapshot: 8 October 2026; documentation synchronized on 10 October 2026.

## Quick start

Requires Node.js 24 and npm. Use the release ZIP or clone this repository:

```sh
git clone https://github.com/cookarmyofficial-alt/cookswap.git
cd cookswap
cp .env.example .env
npm ci --ignore-scripts
npm test
npm start
```

Open http://localhost:5012/ . Startup checks the configured primary chain ID, genesis when configured, and V2/V3 router/factory/wrapped-token relationships. An unavailable RPC or mismatched deployment prevents startup. Wallets sign approvals and swaps; the server has no private wallet key and does not sign transactions.

The default primary network is Cookchain. `networks.json` contains a public snapshot of EVM deployments; review addresses and RPC availability before use. Change `DEFAULT_NETWORK` to another configured EVM key, or add your own network. Set `COOK_RPC` to its primary RPC if you need an override. Keep `EXPECTED_GENESIS` consistent with that chain. For custom networks provide `key`, `name`, `isEvm`, `chainId`, `nativeSymbol`, `wrapped`, `rpc`, `fallback`, `stablecoins`, `routers`, `sources`, and at least one compatible factory/router pair (`v2Factory`/`v2Router` or `v3Factory`/`v3Router`). The quote engine currently supports Uniswap V2-compatible and supported legacy/Router02 V3 interfaces, not every router implementation.

## What runs independently

- Wallet connection, chain selection and token import.
- EVM V2/V3 quote comparison and transaction construction using the configured chain's actual pools.
- Native wrapping/unwrapping where the chain supports it.
- Amount slider, slippage controls and browser UI.
- In-memory balance caching; optional local MySQL persistence.

## Optional service integrations

These require additional services and are not complete standalone products inside this repository:

| Feature | Required service |
| --- | --- |
| Limit orders and execution | CookDEX-compatible order API and its deployed contracts/execution infrastructure |
| EasyLaunch and system curve discovery | CookDEX-compatible public catalogs plus deployed compatible curves |
| Liquidity management | CookDEX-compatible wallet authentication and pool quote/build/registration endpoints |
| Charts | A compatible chart embed service |
| DEX statistics | A compatible statistics API; optional matching CookDEX MySQL schemas |
| Bridge | Compatible Cookscan bridge APIs, artifacts, contracts and relayer infrastructure |

Set `COOKDEX_ORIGIN`, `CHART_ORIGIN` and `BRIDGE_ORIGIN` explicitly to enable adapters. They default to disabled. Public CookDEX services may be used for evaluation where available; availability, permission to operate third-party frontends, service limits and compatibility are not guaranteed. Hosting the interface does not grant access to CookDEX databases or deploy contracts, orders or a bridge.

Solana was excluded from the independent default distribution: its production integrations use additional vendor bundles and service infrastructure. This release supports EVM trading. Solana wallet helper references remain in the upstream-derived UI but no Solana network is offered by the default configuration.

## Administration and databases

Admin access is disabled until you set **your own** `ADMIN_WALLET` and `APP_ORIGIN`. The production administrator's wallet is not a default. Use HTTPS for admin sessions; the signed challenge is bound to your configured origin and sessions use Secure/HttpOnly cookies. `SWAP_ADMIN_DATA` stores private database profiles outside the public directory. Keep it excluded from version control and back it up privately. The data directory must be writable only by the operator. Never publish `.env` or runtime profile files.

Optional database profiles expect existing CookDEX-compatible schemas. Main, charts and tokens connections are read-only. The user/cache database requires a separate restricted read/write account; it does not enable user login. `DB_HOST`, `DEX_DB_PORT` and `USER_DB_PORT` select server-side connectivity. The package does not create an SSH tunnel or a production database. Restrict MySQL at the network and account levels.

## Docker

```sh
docker compose up --build -d
```

The container serves both the UI and API. Port 5012 binds to host loopback. Put an HTTPS reverse proxy in front for public deployment. Container database access uses `DB_HOST`; `127.0.0.1` inside a container refers to the container itself. Supply an appropriate service/host address if you enable MySQL.

## Rebranding and publishing

Customize HTML/CSS, the title and navigation, network configuration, token lists and service endpoints. Generic placeholder assets are included; production logos and third-party logos are omitted. The source license does not grant trademark rights or imply affiliation with Cookchain, CookDEX or wallet/DEX providers. Review routes, contracts, dependencies and your deployment before handling real funds. This repository is a reusable starting point, not a completed security audit.

## Verification and release status

The release has syntax checks, quote-math tests and mocked startup/API smoke tests. A read-only startup against public Cookchain RPC is checked separately when reachable. No real swap, approval, bridge or limit order is signed as part of release verification. MIT applies to this project's application code; dependencies retain their own licenses, listed in `THIRD_PARTY_NOTICES.md` and their installed packages.

Original deployment: https://swap.cookscan.net/ . Technical information: https://swap.cookscan.net/technical-information.html .
