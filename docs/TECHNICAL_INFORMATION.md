# Cookchain / CookDEX Technical Reference

Contract snapshot: **8 October 2026**. Published reference synchronized on **10 October 2026**. This is a dated deployment reference; verify current route activation and contracts before integration.

[Read the styled web documentation](https://swap.cookscan.net/technical-information.html) · [Download the contract listing PDF](https://swap.cookscan.net/documents/Cookchain-CookDEX-Current-Contracts-Listing-Package-English-2026-10-08.pdf)

Includes CookDEX V2/V3, EasyLaunch, system curves, official wCOOK contracts, Cookchain network information, bridge architecture and the public statistics API. Undeployed Solana preparation is not included in this public reference.

## COOKCHAIN / COOKDEX

Whitepaper & DEX Listing Package

Current V2 / V3 deployments, EasyLaunch curves, system curves and official token contracts.

English revision | 08 October 2026 | Snapshot 2026-10-08 15:49 UTC

 | Directory scope | Current snapshot

 | CookDEX AMM networks | 17

 | EasyLaunch factory entries | 96

 | Published system curve markets | 14

 | Official wCOOK representations | 16

 | Stable asset | USDC; no CUSD deployment included

Prepared for GeckoTerminal, DEXTools, DEX Screener and other market-data integrations. Current top-level CookDEX deployment fields and current EasyLaunch factory slots are used. Superseded factory-history entries and unrelated third-party AMM router lists are excluded. Existing published curves retain their actual deployed migration targets.

Official swap ↗ (https://swap.cookscan.net/)

CookDEX ↗ (https://cookdex.net/)

Cookchain explorer / project ↗ (https://cookscan.net/)

Cook Army ↗ (https://bad.cook.army/)

## How to use this package

Submit the normal AMM factory/router pairs for CookDEX V2 and V3. Submit EasyLaunch and system-curve deployments as separate bonding-curve discovery / trading sources. A V3 migration destination does not make the pre-migration curve a concentrated-liquidity V3 pool.

 | Part | Contents

 | Project brief | Architecture, CookSwap, USDC and native COOK rewards

 | Network sheets | Chain identifiers, RPC, wrapped native, current V2/V3 addresses

 | EasyLaunch sheets | Current launch factories, routed V2 execution and V3 fee tiers

 | System curve sheets | Discovery factory, direct curve trading contract, token and quote

 | Official wCOOK directory | One token representation per listed chain

 | Indexer notes | Events, reserves, migration and submission checks

 | API quick reference | Public statistics, pool catalog and trade-history retrieval

### Evidence labels

Configured means the address is in the current deployment configuration. RPC factory match means factory() returned the configured AMM factory and the chain ID matched. Recorded source status reflects the deployment verification record; it is not a fresh independent audit. An unavailable RPC check is reported, never replaced by an assumed success.

Every address is scoped by chain ID. Identical hexadecimal addresses on different chains may represent different contracts. Address links open the corresponding explorer; swap links open preset token pairs and do not initiate a transaction.

## Project brief: Cookchain, CookDEX and CookSwap

Cookchain provides an EVM-compatible execution environment for contracts and transactions. CookDEX provides AMM pools, token metadata and EasyLaunch bonding-curve launches. Cookscan exposes chain activity. CookSwap provides a multi-chain trading interface and compares supported routes by quoted output.

### Trading architecture

CookDEX V2 uses paired token reserves and an AMM factory/router model. CookDEX V3 uses fee tiers, ticks, concentrated liquidity and an NFT position manager. EasyLaunch sells and buys tokens along a launch curve before its configured AMM migration. System curves provide separate project liquidity curves for existing token contracts.

### CookSwap functionality

CookSwap supports configured EVM networks, native and wrapped assets where the execution path supports them, explicit wrap/unwrap controls, configurable slippage and shareable preset links. Approved token logos and launch metadata come from CookDEX. Token selection separates regular tokens, EasyLaunches and system curve pools. A chart panel and DEX statistics page expose market information.

Routing can use CookDEX and other configured venues. EasyLaunch creation is restricted to CookDEX destinations. Quotes and USD values are indicative; the wallet authorizes transactions, token approvals and gas spending. Pool discovery, history indexing and bridge-route activation are separate processes.

### Stable asset: USDC

USDC is the stable asset used in this package. The Cookchain quote representation uses 6 decimals. Cookchain USDC is identified by its chain-specific ERC-20 address below; its bridge representation must not be described as direct issuer minting on Cookchain. No CUSD token or CUSD issuance mechanism is included.

 | Cookchain asset | Contract

 | wCOOK - wrapped native COOK | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://cookscan.net/explorer/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | USDC - stable quote token | 0xa28324ec703c1620ae798b1cd540bb90a2712d4a (https://cookscan.net/explorer/address/0xa28324ec703c1620ae798b1cd540bb90a2712d4a)

## Cookchain native asset and network data

 | Field | Value / evidence

 | Network | Cookchain; EVM / QBFT

 | Chain ID | 20261001 (0x1352889)

 | Native currency | COOK; 18 decimals; no ERC-20 address

 | Wrapped native | 0xf800bf07394e8290807b4ce579f4e9f99c3da869

 | HTTP RPC | https://rpc.cookscan.net/evm

 | Alternative RPC domains | https://rpc.cookdex.net | https://rpc.ldbl.net | https://rpc.zeven.zone

 | WebSocket | wss://rpc.cookscan.net/evm - configured URL; not re-tested in this revision

 | Explorer | https://cookscan.net

 | Alternative explorer | https://blockscout.cookscan.net

 | Client | besu/v26.9.0/linux-x86_64/openjdk-java-25

 | Target block interval | 3 seconds (QBFT configuration)

 | Epoch length | 30,000 blocks (QBFT configuration)

 | Block gas limit | 30000000

 | Latest sampled block | 203098

 | Genesis block hash | 0xcf5b9cb3565f307806ee9f9e7652e405827b20655621ab284c0e80afea85a397

 | Native block reward | 0.001 COOK per block; explorer-reported reward at block 203096

At a constant 3-second block interval, 0.001 COOK per block corresponds to approximately 28.8 COOK/day or 10,512 COOK per 365 days. These are arithmetic projections, not guaranteed emissions or validator returns. The sampled explorer record and configured reward transition agree; beneficiary payout was not independently reconciled in this document.

Gas fees are separate from the native block subsidy. Gas used, base fee, effective gas price and any burned fee component must be measured per transaction/block. The existing staking registry does not establish automatic contract-based validator selection or staking rewards; live QBFT admission remains a separate governance process.

## Current deployment coverage

 | Chain | Chain ID | AMM | Launch slots | System curves

 | Cookchain | 20261001 | V2 + V3 | 6 | 1

 | Arbitrum | 42161 | V2 + V3 | 6 | 1

 | Arc | 5042 | V2 + V3 | 6 | 1

 | Avalanche | 43114 | V2 + V3 | 6 | 1

 | BNB Chain | 56 | V2 + V3 | 6 | 2

 | Base | 8453 | V2 + V3 | 6 | 1

 | Blast | 81457 | V2 + V3 | 6 | 1

 | Ethereum | 1 | V2 | 0 | 0

 | Fantom Opera | 250 | V2 + V3 | 6 | 0

 | HyperEVM | 999 | V2 + V3 | 6 | 1

 | Linea | 59144 | V2 + V3 | 6 | 0

 | Monad | 143 | V2 + V3 | 6 | 0

 | Optimism | 10 | V2 + V3 | 6 | 1

 | Polygon | 137 | V2 + V3 | 6 | 1

 | Robinhood Chain | 4663 | V2 + V3 | 6 | 1

 | Sonic | 146 | V2 + V3 | 6 | 1

 | Unichain | 130 | V2 + V3 | 6 | 1

Only networks with at least one current CookDEX AMM factory are included in the AMM sheets. Other configured networks without a CookDEX deployment are not presented as deployed. Ethereum currently has V2 only and no current EasyLaunch factory slot in this snapshot.

## Cookchain | Current AMM contracts

 | Network field | Value

 | Chain ID | 20261001

 | Native asset | COOK; 18 decimals

 | DEX enabled | True

 | RPC | https://rpc.cookscan.net/evm

 | Explorer | https://cookscan.net

 | Wrapped native token | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://cookscan.net/explorer/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://cookscan.net/explorer/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | CookDEX V2 Swap router | 0x086cf2482f13bfcaad24ae55ae083f02ffbd8ef4 (https://cookscan.net/explorer/address/0x086cf2482f13bfcaad24ae55ae083f02ffbd8ef4)

 | CookDEX V3 AMM factory | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://cookscan.net/explorer/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

 | CookDEX V3 Swap router | 0x1ef53b37a0913834498b640f4b626a2c2e5be0f5 (https://cookscan.net/explorer/address/0x1ef53b37a0913834498b640f4b626a2c2e5be0f5)

 | CookDEX V3 NFT position manager | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://cookscan.net/explorer/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

 | CookDEX V3 Quoter | 0x025fc5e9f8c1f73221c5618f46b4aec6df7a3e6d (https://cookscan.net/explorer/address/0x025fc5e9f8c1f73221c5618f46b4aec6df7a3e6d)

 | CookDEX V3 Quoter V2 | 0x87a67937cd1b7322a518fd7b3c8f3e898ff69039 (https://cookscan.net/explorer/address/0x87a67937cd1b7322a518fd7b3c8f3e898ff69039)

V2: RPC factory match; chain ID confirmed.

V3: RPC factory match; chain ID confirmed.

Cookchain native reward details are given in the network data sheet.

Open CookSwap on Cookchain ↗ (https://swap.cookscan.net/?chain=cookchain)

## Cookchain | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0x58cc4e827f84c8efdd2c7d62ea832f5c880575eb (https://cookscan.net/explorer/address/0x58cc4e827f84c8efdd2c7d62ea832f5c880575eb)

 | Dedicated curve trade router | 0x08caa3c1ec846099f36a046e06ab30968276164f (https://cookscan.net/explorer/address/0x08caa3c1ec846099f36a046e06ab30968276164f)

 | Migration AMM router | 0x086cf2482f13bfcaad24ae55ae083f02ffbd8ef4 (https://cookscan.net/explorer/address/0x086cf2482f13bfcaad24ae55ae083f02ffbd8ef4)

 | Migration AMM factory | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://cookscan.net/explorer/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | Liquidity lock / burn vault | 0x3a1be5d1465463538807df8016c36c1acb1ef156 (https://cookscan.net/explorer/address/0x3a1be5d1465463538807df8016c36c1acb1ef156)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://cookscan.net/explorer/tx/0x4a09d94da70ea18d40b2a5df74797d6bde8a6fb2ceca0b39e36bce776336be19)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0xce65e6b4d8ad31ccaae9bf45ee7b9bdeb38dee21 (https://cookscan.net/explorer/address/0xce65e6b4d8ad31ccaae9bf45ee7b9bdeb38dee21) | 0xa2878195fab7a1293b339ee73284ba85550eea7c (https://cookscan.net/explorer/address/0xa2878195fab7a1293b339ee73284ba85550eea7c)

 | 0.05% / rev. 7 | 0x1d36f69c7deef72b09526e8c00df3ed17c18aad0 (https://cookscan.net/explorer/address/0x1d36f69c7deef72b09526e8c00df3ed17c18aad0) | 0x8cf5393ca916711d9bac8a82c72b96d4f5af7ce3 (https://cookscan.net/explorer/address/0x8cf5393ca916711d9bac8a82c72b96d4f5af7ce3)

 | 0.1% / rev. 7 | 0x126de8015950cdae4b269d6e5f67e2d4dd66742d (https://cookscan.net/explorer/address/0x126de8015950cdae4b269d6e5f67e2d4dd66742d) | 0xe79a786ee5b9fa24bcf77146554c331d28e58766 (https://cookscan.net/explorer/address/0xe79a786ee5b9fa24bcf77146554c331d28e58766)

 | 0.3% / rev. 7 | 0x0572f19c040a642144115664a7d382828b4dd035 (https://cookscan.net/explorer/address/0x0572f19c040a642144115664a7d382828b4dd035) | 0x14c994041746c6d89404ef8412875f251a4e6bfa (https://cookscan.net/explorer/address/0x14c994041746c6d89404ef8412875f251a4e6bfa)

 | 1% / rev. 7 | 0x722ccf77e372c21d48904b4b2b19a5f420a68a55 (https://cookscan.net/explorer/address/0x722ccf77e372c21d48904b4b2b19a5f420a68a55) | 0x5cc76a8652c78af4547015a6e5d2b9f95111d5f6 (https://cookscan.net/explorer/address/0x5cc76a8652c78af4547015a6e5d2b9f95111d5f6)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://cookscan.net/explorer/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

 | AMM swap router | 0x1ef53b37a0913834498b640f4b626a2c2e5be0f5 (https://cookscan.net/explorer/address/0x1ef53b37a0913834498b640f4b626a2c2e5be0f5)

 | AMM factory | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://cookscan.net/explorer/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## Arbitrum | Current AMM contracts

 | Network field | Value

 | Chain ID | 42161

 | Native asset | ETH; 18 decimals

 | DEX enabled | True

 | RPC | https://arb1.arbitrum.io/rpc

 | Explorer | https://arbiscan.io

 | Wrapped native token | 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1 (https://arbiscan.io/address/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://arbiscan.io/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | CookDEX V2 Swap router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://arbiscan.io/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | CookDEX V3 AMM factory | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://arbiscan.io/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

 | CookDEX V3 Swap router | 0x1ef53b37a0913834498b640f4b626a2c2e5be0f5 (https://arbiscan.io/address/0x1ef53b37a0913834498b640f4b626a2c2e5be0f5)

 | CookDEX V3 NFT position manager | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://arbiscan.io/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

V2: Configured address; RPC factory check unavailable in this run.

V3: Configured address; RPC factory check unavailable in this run.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Arbitrum ↗ (https://swap.cookscan.net/?chain=arbitrum)

## Arbitrum | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0x6303bfbc668ce916c7c9b40d6b67889d28a6cf4c (https://arbiscan.io/address/0x6303bfbc668ce916c7c9b40d6b67889d28a6cf4c)

 | Dedicated curve trade router | 0x9256d90dcbc64d0bd7cd1662a9135639b2a638f7 (https://arbiscan.io/address/0x9256d90dcbc64d0bd7cd1662a9135639b2a638f7)

 | Migration AMM router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://arbiscan.io/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | Migration AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://arbiscan.io/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | Liquidity lock / burn vault | 0xe8833c9eb0aeabcc444e48cb882fe6bebf1988d5 (https://arbiscan.io/address/0xe8833c9eb0aeabcc444e48cb882fe6bebf1988d5)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://arbiscan.io/tx/0xb5f84b8c42b64de61b5b01d5b0e8e78970d08e3997476a2a23eee33d430dc601)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0x3a0195e8d40b9dfb45aae4d55859b80721ca8be2 (https://arbiscan.io/address/0x3a0195e8d40b9dfb45aae4d55859b80721ca8be2) | 0x1507fc46ba8284d749cd21eaf164a2df070b9181 (https://arbiscan.io/address/0x1507fc46ba8284d749cd21eaf164a2df070b9181)

 | 0.05% / rev. 7 | 0x77f545496020c26d4a5bb8c9deb4d4f0d3dfa3f6 (https://arbiscan.io/address/0x77f545496020c26d4a5bb8c9deb4d4f0d3dfa3f6) | 0x90fb0e289bfb5ce3f129847c8666f267f2d7f07a (https://arbiscan.io/address/0x90fb0e289bfb5ce3f129847c8666f267f2d7f07a)

 | 0.1% / rev. 7 | 0x7ec3836d299867f2276948e38766cad22c38c84d (https://arbiscan.io/address/0x7ec3836d299867f2276948e38766cad22c38c84d) | 0xd6a2494cc2484b4bf269e57c852f62f819a21880 (https://arbiscan.io/address/0xd6a2494cc2484b4bf269e57c852f62f819a21880)

 | 0.3% / rev. 7 | 0x4c1044fbd545f860b68bb307b2acc6c704329f4a (https://arbiscan.io/address/0x4c1044fbd545f860b68bb307b2acc6c704329f4a) | 0x267121901a9100c7e950dd71bdea3bcb34cc9e2c (https://arbiscan.io/address/0x267121901a9100c7e950dd71bdea3bcb34cc9e2c)

 | 1% / rev. 7 | 0xc3ccbadec12b3877c193846608d494ea3b1a7fc6 (https://arbiscan.io/address/0xc3ccbadec12b3877c193846608d494ea3b1a7fc6) | 0xfe18b129f892aa8ac6a3087dcacbfbab302c834a (https://arbiscan.io/address/0xfe18b129f892aa8ac6a3087dcacbfbab302c834a)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://arbiscan.io/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

 | AMM swap router | 0x1ef53b37a0913834498b640f4b626a2c2e5be0f5 (https://arbiscan.io/address/0x1ef53b37a0913834498b640f4b626a2c2e5be0f5)

 | AMM factory | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://arbiscan.io/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## Arc | Current AMM contracts

 | Network field | Value

 | Chain ID | 5042

 | Native asset | USDC; 6 decimals

 | DEX enabled | True

 | RPC | https://rpc.mainnet.arc.io/

 | Explorer | https://explorer.arc.io

 | Wrapped native token | 0x3600000000000000000000000000000000000000 (https://explorer.arc.io/address/0x3600000000000000000000000000000000000000)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://explorer.arc.io/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

 | CookDEX V2 Swap router | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://explorer.arc.io/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | CookDEX V3 AMM factory | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://explorer.arc.io/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

 | CookDEX V3 Swap router | 0xbaa02841530d89bd379f80245d3047a0537ab25b (https://explorer.arc.io/address/0xbaa02841530d89bd379f80245d3047a0537ab25b)

 | CookDEX V3 NFT position manager | 0xc70abfcb74b7680aa7e9846410d59a2bb1f78f96 (https://explorer.arc.io/address/0xc70abfcb74b7680aa7e9846410d59a2bb1f78f96)

 | CookDEX V3 Quoter | 0xd6a2494cc2484b4bf269e57c852f62f819a21880 (https://explorer.arc.io/address/0xd6a2494cc2484b4bf269e57c852f62f819a21880)

 | CookDEX V3 Quoter V2 | 0x7ec3836d299867f2276948e38766cad22c38c84d (https://explorer.arc.io/address/0x7ec3836d299867f2276948e38766cad22c38c84d)

V2: Configured address; RPC factory check unavailable in this run.

V3: Configured address; RPC factory check unavailable in this run.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Arc ↗ (https://swap.cookscan.net/?chain=arc)

## Arc | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0xc3ccbadec12b3877c193846608d494ea3b1a7fc6 (https://explorer.arc.io/address/0xc3ccbadec12b3877c193846608d494ea3b1a7fc6)

 | Dedicated curve trade router | No dedicated router configured; curve trades execute directly

 | Migration AMM router | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://explorer.arc.io/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | Migration AMM factory | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://explorer.arc.io/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

 | Liquidity lock / burn vault | 0xfe18b129f892aa8ac6a3087dcacbfbab302c834a (https://explorer.arc.io/address/0xfe18b129f892aa8ac6a3087dcacbfbab302c834a)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://explorer.arc.io/tx/0x94beef33162260f30861adfa5cca87feac91856e37559b4b9315561144237b15)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0x016ba57bac7b1e1f9d9f61c27d2d2e54f02a7035 (https://explorer.arc.io/address/0x016ba57bac7b1e1f9d9f61c27d2d2e54f02a7035) | 0x04b456f41daf49e3f21cb514ad0c35fe2ada70e0 (https://explorer.arc.io/address/0x04b456f41daf49e3f21cb514ad0c35fe2ada70e0)

 | 0.05% / rev. 7 | 0x995926bffa2779753acd614032683600b35c5576 (https://explorer.arc.io/address/0x995926bffa2779753acd614032683600b35c5576) | 0x6506ff52af9bca654d21976ef8c31a3a23b9ef49 (https://explorer.arc.io/address/0x6506ff52af9bca654d21976ef8c31a3a23b9ef49)

 | 0.1% / rev. 7 | 0x8421d82ef3e7679fc98f5a944add91578dd3676a (https://explorer.arc.io/address/0x8421d82ef3e7679fc98f5a944add91578dd3676a) | 0xc3f9990f4769a1405d93807f0d6d204a80a48f91 (https://explorer.arc.io/address/0xc3f9990f4769a1405d93807f0d6d204a80a48f91)

 | 0.3% / rev. 7 | 0x69160216c165663274dd3bea215cc17fa9eb0616 (https://explorer.arc.io/address/0x69160216c165663274dd3bea215cc17fa9eb0616) | 0x7ad0229e231e9168c618cbc31b7c22f00d44e24b (https://explorer.arc.io/address/0x7ad0229e231e9168c618cbc31b7c22f00d44e24b)

 | 1% / rev. 7 | 0xd0c0a6a19fde40ce5fdf265d09efc2365bc6601b (https://explorer.arc.io/address/0xd0c0a6a19fde40ce5fdf265d09efc2365bc6601b) | 0x1662dbff4c53e3636fd760c276bce5d0683953cb (https://explorer.arc.io/address/0x1662dbff4c53e3636fd760c276bce5d0683953cb)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0xc70abfcb74b7680aa7e9846410d59a2bb1f78f96 (https://explorer.arc.io/address/0xc70abfcb74b7680aa7e9846410d59a2bb1f78f96)

 | AMM swap router | 0xbaa02841530d89bd379f80245d3047a0537ab25b (https://explorer.arc.io/address/0xbaa02841530d89bd379f80245d3047a0537ab25b)

 | AMM factory | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://explorer.arc.io/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## Avalanche | Current AMM contracts

 | Network field | Value

 | Chain ID | 43114

 | Native asset | AVAX; 18 decimals

 | DEX enabled | True

 | RPC | https://api.avax.network/ext/bc/C/rpc

 | Explorer | https://snowtrace.io

 | Wrapped native token | 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7 (https://snowtrace.io/address/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0x790919e9ea6ac73595e31ad5c05db8ea5126580e (https://snowtrace.io/address/0x790919e9ea6ac73595e31ad5c05db8ea5126580e)

 | CookDEX V2 Swap router | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://snowtrace.io/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

 | CookDEX V3 AMM factory | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://snowtrace.io/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

 | CookDEX V3 Swap router | 0xbaa02841530d89bd379f80245d3047a0537ab25b (https://snowtrace.io/address/0xbaa02841530d89bd379f80245d3047a0537ab25b)

 | CookDEX V3 NFT position manager | 0xc70abfcb74b7680aa7e9846410d59a2bb1f78f96 (https://snowtrace.io/address/0xc70abfcb74b7680aa7e9846410d59a2bb1f78f96)

 | CookDEX V3 Quoter | 0xe8833c9eb0aeabcc444e48cb882fe6bebf1988d5 (https://snowtrace.io/address/0xe8833c9eb0aeabcc444e48cb882fe6bebf1988d5)

 | CookDEX V3 Quoter V2 | 0x6303bfbc668ce916c7c9b40d6b67889d28a6cf4c (https://snowtrace.io/address/0x6303bfbc668ce916c7c9b40d6b67889d28a6cf4c)

V2: RPC factory match; chain ID confirmed.

V3: RPC factory match; chain ID confirmed.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Avalanche ↗ (https://swap.cookscan.net/?chain=avalanche)

## Avalanche | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0xfe18b129f892aa8ac6a3087dcacbfbab302c834a (https://snowtrace.io/address/0xfe18b129f892aa8ac6a3087dcacbfbab302c834a)

 | Dedicated curve trade router | 0x9fbfea94dcb78a0f20a09755dcd673ad5f5a2999 (https://snowtrace.io/address/0x9fbfea94dcb78a0f20a09755dcd673ad5f5a2999)

 | Migration AMM router | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://snowtrace.io/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

 | Migration AMM factory | 0x790919e9ea6ac73595e31ad5c05db8ea5126580e (https://snowtrace.io/address/0x790919e9ea6ac73595e31ad5c05db8ea5126580e)

 | Liquidity lock / burn vault | 0x7ec3836d299867f2276948e38766cad22c38c84d (https://snowtrace.io/address/0x7ec3836d299867f2276948e38766cad22c38c84d)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://snowtrace.io/tx/0x771fe455e24eaee118266ecc25a1d3b3d260614d7e24a75e321e6cf2a68fcf00)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0x04b456f41daf49e3f21cb514ad0c35fe2ada70e0 (https://snowtrace.io/address/0x04b456f41daf49e3f21cb514ad0c35fe2ada70e0) | 0x69160216c165663274dd3bea215cc17fa9eb0616 (https://snowtrace.io/address/0x69160216c165663274dd3bea215cc17fa9eb0616)

 | 0.05% / rev. 7 | 0x6506ff52af9bca654d21976ef8c31a3a23b9ef49 (https://snowtrace.io/address/0x6506ff52af9bca654d21976ef8c31a3a23b9ef49) | 0x016ba57bac7b1e1f9d9f61c27d2d2e54f02a7035 (https://snowtrace.io/address/0x016ba57bac7b1e1f9d9f61c27d2d2e54f02a7035)

 | 0.1% / rev. 7 | 0xc3f9990f4769a1405d93807f0d6d204a80a48f91 (https://snowtrace.io/address/0xc3f9990f4769a1405d93807f0d6d204a80a48f91) | 0x995926bffa2779753acd614032683600b35c5576 (https://snowtrace.io/address/0x995926bffa2779753acd614032683600b35c5576)

 | 0.3% / rev. 7 | 0x7ad0229e231e9168c618cbc31b7c22f00d44e24b (https://snowtrace.io/address/0x7ad0229e231e9168c618cbc31b7c22f00d44e24b) | 0xe078acccf91da406db4cc8beecaa9e97dd737d57 (https://snowtrace.io/address/0xe078acccf91da406db4cc8beecaa9e97dd737d57)

 | 1% / rev. 7 | 0x1662dbff4c53e3636fd760c276bce5d0683953cb (https://snowtrace.io/address/0x1662dbff4c53e3636fd760c276bce5d0683953cb) | 0x8421d82ef3e7679fc98f5a944add91578dd3676a (https://snowtrace.io/address/0x8421d82ef3e7679fc98f5a944add91578dd3676a)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0xc70abfcb74b7680aa7e9846410d59a2bb1f78f96 (https://snowtrace.io/address/0xc70abfcb74b7680aa7e9846410d59a2bb1f78f96)

 | AMM swap router | 0xbaa02841530d89bd379f80245d3047a0537ab25b (https://snowtrace.io/address/0xbaa02841530d89bd379f80245d3047a0537ab25b)

 | AMM factory | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://snowtrace.io/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## BNB Chain | Current AMM contracts

 | Network field | Value

 | Chain ID | 56

 | Native asset | BNB; 18 decimals

 | DEX enabled | True

 | RPC | https://bsc-rpc.publicnode.com/

 | Explorer | https://bscscan.com

 | Wrapped native token | 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c (https://bscscan.com/address/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://bscscan.com/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

 | CookDEX V2 Swap router | 0xbaa02841530d89bd379f80245d3047a0537ab25b (https://bscscan.com/address/0xbaa02841530d89bd379f80245d3047a0537ab25b)

 | CookDEX V3 AMM factory | 0x1da528f72c0410fcc05625235af0cee9dc2b7d14 (https://bscscan.com/address/0x1da528f72c0410fcc05625235af0cee9dc2b7d14)

 | CookDEX V3 Swap router | 0x2ebe8cf097dfac228d525f39c26a1248686dc5d7 (https://bscscan.com/address/0x2ebe8cf097dfac228d525f39c26a1248686dc5d7)

 | CookDEX V3 NFT position manager | 0x0614c8565a2430d8dffd7b82c4d495b3e9d57413 (https://bscscan.com/address/0x0614c8565a2430d8dffd7b82c4d495b3e9d57413)

 | CookDEX V3 Quoter | 0x92e82fb95112ba5b95d0c88ab8fd3eee3aecae62 (https://bscscan.com/address/0x92e82fb95112ba5b95d0c88ab8fd3eee3aecae62)

 | CookDEX V3 Quoter V2 | 0x77bf212824ec5ffb645f4abe54251df4287bc43b (https://bscscan.com/address/0x77bf212824ec5ffb645f4abe54251df4287bc43b)

V2: Configured address; RPC factory check unavailable in this run.

V3: Configured address; RPC factory check unavailable in this run.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on BNB Chain ↗ (https://swap.cookscan.net/?chain=bsc)

## BNB Chain | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0x8c6e6da84da7a1ae5ff50ed953365a002b0bb070 (https://bscscan.com/address/0x8c6e6da84da7a1ae5ff50ed953365a002b0bb070)

 | Dedicated curve trade router | 0xa2a754d2f38a7ff4ba2e06049ad5ed7f684e0a7c (https://bscscan.com/address/0xa2a754d2f38a7ff4ba2e06049ad5ed7f684e0a7c)

 | Migration AMM router | 0xbaa02841530d89bd379f80245d3047a0537ab25b (https://bscscan.com/address/0xbaa02841530d89bd379f80245d3047a0537ab25b)

 | Migration AMM factory | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://bscscan.com/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

 | Liquidity lock / burn vault | 0x214047841cf1821e9e44fd21863e893ea64cf6aa (https://bscscan.com/address/0x214047841cf1821e9e44fd21863e893ea64cf6aa)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://bscscan.com/tx/0x2df89ce718c8f4ddf84f07ee642f83d28997cf2595bb3915346761f74bfa2fff)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0xf3e86aa9e975d127bce97ab34b7388dd7e1cb34e (https://bscscan.com/address/0xf3e86aa9e975d127bce97ab34b7388dd7e1cb34e) | 0xa25330e25f59156da13c26dd1308b9d0ccb87a88 (https://bscscan.com/address/0xa25330e25f59156da13c26dd1308b9d0ccb87a88)

 | 0.05% / rev. 7 | 0xd2d93aa65ed6e9cafe520ae81849143faa59d5db (https://bscscan.com/address/0xd2d93aa65ed6e9cafe520ae81849143faa59d5db) | 0x9866e0e88fbfe3dc409af779ea2a110179d7f332 (https://bscscan.com/address/0x9866e0e88fbfe3dc409af779ea2a110179d7f332)

 | 0.1% / rev. 7 | 0xdad6802b169aca997136982977f081fe14cf2dfc (https://bscscan.com/address/0xdad6802b169aca997136982977f081fe14cf2dfc) | 0x064b0930b616c11fcbe48e6e2196e49d29ac9732 (https://bscscan.com/address/0x064b0930b616c11fcbe48e6e2196e49d29ac9732)

 | 0.3% / rev. 7 | 0x58e0a3b54b33df548ea5b7e6ed64e71d535eab0f (https://bscscan.com/address/0x58e0a3b54b33df548ea5b7e6ed64e71d535eab0f) | 0x5b0334b245b9eeb05b9f700211d80b1911457b54 (https://bscscan.com/address/0x5b0334b245b9eeb05b9f700211d80b1911457b54)

 | 1% / rev. 7 | 0xcc2068ef54eac08e41375ce10a031f17e3f5c9fb (https://bscscan.com/address/0xcc2068ef54eac08e41375ce10a031f17e3f5c9fb) | 0x75207ff9f3ed3935e1fd82b44c4dd9d1a6308742 (https://bscscan.com/address/0x75207ff9f3ed3935e1fd82b44c4dd9d1a6308742)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0x0614c8565a2430d8dffd7b82c4d495b3e9d57413 (https://bscscan.com/address/0x0614c8565a2430d8dffd7b82c4d495b3e9d57413)

 | AMM swap router | 0x2ebe8cf097dfac228d525f39c26a1248686dc5d7 (https://bscscan.com/address/0x2ebe8cf097dfac228d525f39c26a1248686dc5d7)

 | AMM factory | 0x1da528f72c0410fcc05625235af0cee9dc2b7d14 (https://bscscan.com/address/0x1da528f72c0410fcc05625235af0cee9dc2b7d14)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## Base | Current AMM contracts

 | Network field | Value

 | Chain ID | 8453

 | Native asset | ETH; 18 decimals

 | DEX enabled | True

 | RPC | https://mainnet.base.org/

 | Explorer | https://basescan.org

 | Wrapped native token | 0x4200000000000000000000000000000000000006 (https://basescan.org/address/0x4200000000000000000000000000000000000006)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://basescan.org/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | CookDEX V2 Swap router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://basescan.org/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | CookDEX V3 AMM factory | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://basescan.org/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

 | CookDEX V3 Swap router | 0x1ef53b37a0913834498b640f4b626a2c2e5be0f5 (https://basescan.org/address/0x1ef53b37a0913834498b640f4b626a2c2e5be0f5)

 | CookDEX V3 NFT position manager | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://basescan.org/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

 | CookDEX V3 Quoter | 0xad7a12f9629be1c6924fd95d8de511ca8e92bf52 (https://basescan.org/address/0xad7a12f9629be1c6924fd95d8de511ca8e92bf52)

 | CookDEX V3 Quoter V2 | 0x7faf06cc41b81a52cec1435ba8e084d7d280e6fa (https://basescan.org/address/0x7faf06cc41b81a52cec1435ba8e084d7d280e6fa)

V2: Configured address; RPC factory check unavailable in this run.

V3: Configured address; RPC factory check unavailable in this run.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Base ↗ (https://swap.cookscan.net/?chain=base)

## Base | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0x5b7b146395e0d04b76d3d14952890b0e5eb0abd4 (https://basescan.org/address/0x5b7b146395e0d04b76d3d14952890b0e5eb0abd4)

 | Dedicated curve trade router | 0x6303bfbc668ce916c7c9b40d6b67889d28a6cf4c (https://basescan.org/address/0x6303bfbc668ce916c7c9b40d6b67889d28a6cf4c)

 | Migration AMM router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://basescan.org/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | Migration AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://basescan.org/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | Liquidity lock / burn vault | 0x9dac54f9ae648ce46a92aacf28d2a58904178fb9 (https://basescan.org/address/0x9dac54f9ae648ce46a92aacf28d2a58904178fb9)

Recorded source status: not_verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://basescan.org/tx/0xf5777b686f1b02dc08f57195c46bf98df36342f240f9b2060a9b0516dd0dd129)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0x39568114e37571d87aa3afcc788d3784c59893fa (https://basescan.org/address/0x39568114e37571d87aa3afcc788d3784c59893fa) | 0x0baf88ba16d73bcc024292065b54a7962b161177 (https://basescan.org/address/0x0baf88ba16d73bcc024292065b54a7962b161177)

 | 0.05% / rev. 7 | 0x7aa3376054715c6e8f155b30c1de09adf5994490 (https://basescan.org/address/0x7aa3376054715c6e8f155b30c1de09adf5994490) | 0x7f345ba8a1cc1f7e3155fc01a9d2b61801d195aa (https://basescan.org/address/0x7f345ba8a1cc1f7e3155fc01a9d2b61801d195aa)

 | 0.1% / rev. 7 | 0x79de83ad4033f7438e6a5f58537475b3c67a5eed (https://basescan.org/address/0x79de83ad4033f7438e6a5f58537475b3c67a5eed) | 0xa28a968c195d71617ddab016d7b21cc3523fc48a (https://basescan.org/address/0xa28a968c195d71617ddab016d7b21cc3523fc48a)

 | 0.3% / rev. 7 | 0x28f1d678bb7250ee602ae98642c99ce379ee9b05 (https://basescan.org/address/0x28f1d678bb7250ee602ae98642c99ce379ee9b05) | 0x05e1bafb96595e8a5085be16091ab7a6309ffed8 (https://basescan.org/address/0x05e1bafb96595e8a5085be16091ab7a6309ffed8)

 | 1% / rev. 7 | 0xf4654a8c9284c9bb2e3b44c439cef821ccdd5982 (https://basescan.org/address/0xf4654a8c9284c9bb2e3b44c439cef821ccdd5982) | 0x7d9398ae4eed0a16c50032f201348105e694379e (https://basescan.org/address/0x7d9398ae4eed0a16c50032f201348105e694379e)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://basescan.org/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

 | AMM swap router | 0x1ef53b37a0913834498b640f4b626a2c2e5be0f5 (https://basescan.org/address/0x1ef53b37a0913834498b640f4b626a2c2e5be0f5)

 | AMM factory | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://basescan.org/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## Blast | Current AMM contracts

 | Network field | Value

 | Chain ID | 81457

 | Native asset | ETH; 18 decimals

 | DEX enabled | True

 | RPC | https://rpc.blast.io/

 | Explorer | https://blastscan.io

 | Wrapped native token | 0x4300000000000000000000000000000000000004 (https://blastscan.io/address/0x4300000000000000000000000000000000000004)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://blastscan.io/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | CookDEX V2 Swap router | 0x5264f98afc705042ca049fa4a83578cde9b4e3da (https://blastscan.io/address/0x5264f98afc705042ca049fa4a83578cde9b4e3da)

 | CookDEX V3 AMM factory | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://blastscan.io/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

 | CookDEX V3 Swap router | 0x1ef53b37a0913834498b640f4b626a2c2e5be0f5 (https://blastscan.io/address/0x1ef53b37a0913834498b640f4b626a2c2e5be0f5)

 | CookDEX V3 NFT position manager | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://blastscan.io/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

 | CookDEX V3 Quoter | 0xb82e1234a2f3f01888761bd7a53d0fe02a92514f (https://blastscan.io/address/0xb82e1234a2f3f01888761bd7a53d0fe02a92514f)

 | CookDEX V3 Quoter V2 | 0xa6e6e8099aef40d404f747519ee8adb8b82749f9 (https://blastscan.io/address/0xa6e6e8099aef40d404f747519ee8adb8b82749f9)

V2: RPC factory match; chain ID confirmed.

V3: RPC factory match; chain ID confirmed.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Blast ↗ (https://swap.cookscan.net/?chain=blast)

## Blast | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0x8fb0b82508e04d708c7935e2df152d534000d9bd (https://blastscan.io/address/0x8fb0b82508e04d708c7935e2df152d534000d9bd)

 | Dedicated curve trade router | 0x7486da6c227081f805605091e35209dfd61b0eb5 (https://blastscan.io/address/0x7486da6c227081f805605091e35209dfd61b0eb5)

 | Migration AMM router | 0x5264f98afc705042ca049fa4a83578cde9b4e3da (https://blastscan.io/address/0x5264f98afc705042ca049fa4a83578cde9b4e3da)

 | Migration AMM factory | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://blastscan.io/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | Liquidity lock / burn vault | 0x92175baed829eccc794b95f392aa4db1fd914599 (https://blastscan.io/address/0x92175baed829eccc794b95f392aa4db1fd914599)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://blastscan.io/tx/0x9be2df02ed08f6a0570942c4b8d508110dce0f43195daf93c4b742059fe4b3fd)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0x6551d2e59d4fe354c83bf553287ed7323be078a8 (https://blastscan.io/address/0x6551d2e59d4fe354c83bf553287ed7323be078a8) | 0x086cf2482f13bfcaad24ae55ae083f02ffbd8ef4 (https://blastscan.io/address/0x086cf2482f13bfcaad24ae55ae083f02ffbd8ef4)

 | 0.05% / rev. 7 | 0x6303bfbc668ce916c7c9b40d6b67889d28a6cf4c (https://blastscan.io/address/0x6303bfbc668ce916c7c9b40d6b67889d28a6cf4c) | 0xe8833c9eb0aeabcc444e48cb882fe6bebf1988d5 (https://blastscan.io/address/0xe8833c9eb0aeabcc444e48cb882fe6bebf1988d5)

 | 0.1% / rev. 7 | 0x267121901a9100c7e950dd71bdea3bcb34cc9e2c (https://blastscan.io/address/0x267121901a9100c7e950dd71bdea3bcb34cc9e2c) | 0xa3645d0d1869ec4a938076589ebe0047e2427ba4 (https://blastscan.io/address/0xa3645d0d1869ec4a938076589ebe0047e2427ba4)

 | 0.3% / rev. 7 | 0x9d7f9149957a5713676333ddb58f4e4b6f023755 (https://blastscan.io/address/0x9d7f9149957a5713676333ddb58f4e4b6f023755) | 0x00454fe8115947d40d03920ed04a841c6afa4b08 (https://blastscan.io/address/0x00454fe8115947d40d03920ed04a841c6afa4b08)

 | 1% / rev. 7 | 0x1507fc46ba8284d749cd21eaf164a2df070b9181 (https://blastscan.io/address/0x1507fc46ba8284d749cd21eaf164a2df070b9181) | 0x4c1044fbd545f860b68bb307b2acc6c704329f4a (https://blastscan.io/address/0x4c1044fbd545f860b68bb307b2acc6c704329f4a)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://blastscan.io/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

 | AMM swap router | 0x1ef53b37a0913834498b640f4b626a2c2e5be0f5 (https://blastscan.io/address/0x1ef53b37a0913834498b640f4b626a2c2e5be0f5)

 | AMM factory | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://blastscan.io/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## Ethereum | Current AMM contracts

 | Network field | Value

 | Chain ID | 1

 | Native asset | ETH; 18 decimals

 | DEX enabled | True

 | RPC | https://ethereum-rpc.publicnode.com/

 | Explorer | https://etherscan.io

 | Wrapped native token | 0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2 (https://etherscan.io/address/0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0x8851d83af77f851839f411e7d6d09e99572bd5dd (https://etherscan.io/address/0x8851d83af77f851839f411e7d6d09e99572bd5dd)

 | CookDEX V2 Swap router | 0xda24f7e55673d219a87e3c76852bd1c6332c5753 (https://etherscan.io/address/0xda24f7e55673d219a87e3c76852bd1c6332c5753)

V2: Configured address; RPC factory check unavailable in this run.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Ethereum ↗ (https://swap.cookscan.net/?chain=ethereum)

## Fantom Opera | Current AMM contracts

 | Network field | Value

 | Chain ID | 250

 | Native asset | FTM; 18 decimals

 | DEX enabled | True

 | RPC | https://rpcapi.fantom.network/

 | Explorer | https://explorer.fantom.network

 | Wrapped native token | 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83 (https://explorer.fantom.network/address/0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://explorer.fantom.network/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | CookDEX V2 Swap router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://explorer.fantom.network/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | CookDEX V3 AMM factory | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://explorer.fantom.network/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | CookDEX V3 Swap router | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://explorer.fantom.network/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

 | CookDEX V3 NFT position manager | 0x48362fc32a774cefbbc61fd3c33fa23419ad9d7f (https://explorer.fantom.network/address/0x48362fc32a774cefbbc61fd3c33fa23419ad9d7f)

 | CookDEX V3 Quoter | 0xedf36e8ad12f88d159aa8abac7783910a2981d64 (https://explorer.fantom.network/address/0xedf36e8ad12f88d159aa8abac7783910a2981d64)

 | CookDEX V3 Quoter V2 | 0xa315115f6ce2490a6c79d2108a6c8837ad5dd480 (https://explorer.fantom.network/address/0xa315115f6ce2490a6c79d2108a6c8837ad5dd480)

V2: RPC factory match; chain ID confirmed.

V3: RPC factory match; chain ID confirmed.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Fantom Opera ↗ (https://swap.cookscan.net/?chain=fantom)

## Fantom Opera | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0x9256d90dcbc64d0bd7cd1662a9135639b2a638f7 (https://explorer.fantom.network/address/0x9256d90dcbc64d0bd7cd1662a9135639b2a638f7)

 | Dedicated curve trade router | 0xe9928ef0da897bd21ae7e530d27ca390569830e2 (https://explorer.fantom.network/address/0xe9928ef0da897bd21ae7e530d27ca390569830e2)

 | Migration AMM router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://explorer.fantom.network/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | Migration AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://explorer.fantom.network/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | Liquidity lock / burn vault | 0x9fbfea94dcb78a0f20a09755dcd673ad5f5a2999 (https://explorer.fantom.network/address/0x9fbfea94dcb78a0f20a09755dcd673ad5f5a2999)

Recorded source status: failed; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://explorer.fantom.network/tx/0x7e93f86f27e25264bc92e816705f3201c93208db4a6950166a0b08ca93939886)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0x85dde7cd5825296556fd71bc4e55748ab94aceda (https://explorer.fantom.network/address/0x85dde7cd5825296556fd71bc4e55748ab94aceda) | 0xcb902d115b95e18b8f72bf339145e0fc7afd1e1c (https://explorer.fantom.network/address/0xcb902d115b95e18b8f72bf339145e0fc7afd1e1c)

 | 0.05% / rev. 7 | 0x5770b2a9b539dc7efdada3fa1811a253775ebcd2 (https://explorer.fantom.network/address/0x5770b2a9b539dc7efdada3fa1811a253775ebcd2) | 0x57b1b55f3e3869c539ac0ca692ad66e0abddd5d4 (https://explorer.fantom.network/address/0x57b1b55f3e3869c539ac0ca692ad66e0abddd5d4)

 | 0.1% / rev. 7 | 0x1156d71de6ef7dc15fe71ec41d8577ee6e5e665d (https://explorer.fantom.network/address/0x1156d71de6ef7dc15fe71ec41d8577ee6e5e665d) | 0x84477b9396c0f20315f20bf4a293e2b979acf944 (https://explorer.fantom.network/address/0x84477b9396c0f20315f20bf4a293e2b979acf944)

 | 0.3% / rev. 7 | 0xbc732b1323aac46cb116b98df187c7fdbd53a5ee (https://explorer.fantom.network/address/0xbc732b1323aac46cb116b98df187c7fdbd53a5ee) | 0xa6e6e8099aef40d404f747519ee8adb8b82749f9 (https://explorer.fantom.network/address/0xa6e6e8099aef40d404f747519ee8adb8b82749f9)

 | 1% / rev. 7 | 0x92175baed829eccc794b95f392aa4db1fd914599 (https://explorer.fantom.network/address/0x92175baed829eccc794b95f392aa4db1fd914599) | 0x03f0177936a3118883a4b039bbb778600d929bcc (https://explorer.fantom.network/address/0x03f0177936a3118883a4b039bbb778600d929bcc)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0x48362fc32a774cefbbc61fd3c33fa23419ad9d7f (https://explorer.fantom.network/address/0x48362fc32a774cefbbc61fd3c33fa23419ad9d7f)

 | AMM swap router | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://explorer.fantom.network/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

 | AMM factory | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://explorer.fantom.network/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## HyperEVM | Current AMM contracts

 | Network field | Value

 | Chain ID | 999

 | Native asset | HYPE; 18 decimals

 | DEX enabled | True

 | RPC | https://rpc.hyperliquid.xyz/evm

 | Explorer | https://hyperevmscan.io

 | Wrapped native token | 0x5555555555555555555555555555555555555555 (https://hyperevmscan.io/address/0x5555555555555555555555555555555555555555)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://hyperevmscan.io/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

 | CookDEX V2 Swap router | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://hyperevmscan.io/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | CookDEX V3 AMM factory | 0x028581ea934d06cce20cc582b57b89ea1c0449d1 (https://hyperevmscan.io/address/0x028581ea934d06cce20cc582b57b89ea1c0449d1)

 | CookDEX V3 Swap router | 0xb2ba1249710e09d21bb01c5773cabc414d1ba485 (https://hyperevmscan.io/address/0xb2ba1249710e09d21bb01c5773cabc414d1ba485)

 | CookDEX V3 NFT position manager | 0x1da528f72c0410fcc05625235af0cee9dc2b7d14 (https://hyperevmscan.io/address/0x1da528f72c0410fcc05625235af0cee9dc2b7d14)

 | CookDEX V3 Quoter | 0x6ec2ca0fc70be45fed83ff9662485e9fee0ae15f (https://hyperevmscan.io/address/0x6ec2ca0fc70be45fed83ff9662485e9fee0ae15f)

 | CookDEX V3 Quoter V2 | 0xfed19c0a975ffcf12f9d3c2412a487dd16710282 (https://hyperevmscan.io/address/0xfed19c0a975ffcf12f9d3c2412a487dd16710282)

V2: RPC factory match; chain ID confirmed.

V3: RPC factory match; chain ID confirmed.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on HyperEVM ↗ (https://swap.cookscan.net/?chain=hyperevm)

## HyperEVM | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0xbaa02841530d89bd379f80245d3047a0537ab25b (https://hyperevmscan.io/address/0xbaa02841530d89bd379f80245d3047a0537ab25b)

 | Dedicated curve trade router | No dedicated router configured; curve trades execute directly

 | Migration AMM router | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://hyperevmscan.io/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | Migration AMM factory | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://hyperevmscan.io/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

 | Liquidity lock / burn vault | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://hyperevmscan.io/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://hyperevmscan.io/tx/0x96a209698aa0d16f4bad764323ccea25a12a2666edcbb4811d28daa833a6fbf5)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0xebbe6f90c6491e3e4b1a210210f40e87313b0cbe (https://hyperevmscan.io/address/0xebbe6f90c6491e3e4b1a210210f40e87313b0cbe) | 0xe63d91da8b7bd6280b64948d1a45003e573db1bb (https://hyperevmscan.io/address/0xe63d91da8b7bd6280b64948d1a45003e573db1bb)

 | 0.05% / rev. 7 | 0x8dc6a944ea3ae4cec14119b90a54b5c512cd69e3 (https://hyperevmscan.io/address/0x8dc6a944ea3ae4cec14119b90a54b5c512cd69e3) | 0x44fd7f6cce29e9831696461ad1446187824ae978 (https://hyperevmscan.io/address/0x44fd7f6cce29e9831696461ad1446187824ae978)

 | 0.1% / rev. 7 | 0x570055dcbf3c7ab2b21a37a8aae776719eb402c6 (https://hyperevmscan.io/address/0x570055dcbf3c7ab2b21a37a8aae776719eb402c6) | 0x42995b215c1379c7a7de8e15edb701cf42ce71f9 (https://hyperevmscan.io/address/0x42995b215c1379c7a7de8e15edb701cf42ce71f9)

 | 0.3% / rev. 7 | 0xda24f7e55673d219a87e3c76852bd1c6332c5753 (https://hyperevmscan.io/address/0xda24f7e55673d219a87e3c76852bd1c6332c5753) | 0x8851d83af77f851839f411e7d6d09e99572bd5dd (https://hyperevmscan.io/address/0x8851d83af77f851839f411e7d6d09e99572bd5dd)

 | 1% / rev. 7 | 0x2729cb4ae1503483e27f85ddb877715bd962c888 (https://hyperevmscan.io/address/0x2729cb4ae1503483e27f85ddb877715bd962c888) | 0x4256042944035dfe7318f8299b85f6279c425d6e (https://hyperevmscan.io/address/0x4256042944035dfe7318f8299b85f6279c425d6e)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0x1da528f72c0410fcc05625235af0cee9dc2b7d14 (https://hyperevmscan.io/address/0x1da528f72c0410fcc05625235af0cee9dc2b7d14)

 | AMM swap router | 0xb2ba1249710e09d21bb01c5773cabc414d1ba485 (https://hyperevmscan.io/address/0xb2ba1249710e09d21bb01c5773cabc414d1ba485)

 | AMM factory | 0x028581ea934d06cce20cc582b57b89ea1c0449d1 (https://hyperevmscan.io/address/0x028581ea934d06cce20cc582b57b89ea1c0449d1)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## Linea | Current AMM contracts

 | Network field | Value

 | Chain ID | 59144

 | Native asset | ETH; 18 decimals

 | DEX enabled | True

 | RPC | https://rpc.linea.build/

 | Explorer | https://lineascan.build

 | Wrapped native token | 0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f (https://lineascan.build/address/0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0x42995b215c1379c7a7de8e15edb701cf42ce71f9 (https://lineascan.build/address/0x42995b215c1379c7a7de8e15edb701cf42ce71f9)

 | CookDEX V2 Swap router | 0x570055dcbf3c7ab2b21a37a8aae776719eb402c6 (https://lineascan.build/address/0x570055dcbf3c7ab2b21a37a8aae776719eb402c6)

 | CookDEX V3 AMM factory | 0x0c5100f85e057f2ea46c1f829951c4052a414e32 (https://lineascan.build/address/0x0c5100f85e057f2ea46c1f829951c4052a414e32)

 | CookDEX V3 Swap router | 0xa6753a1ea3d80b1b261a32cb0c1150925d8860f2 (https://lineascan.build/address/0xa6753a1ea3d80b1b261a32cb0c1150925d8860f2)

 | CookDEX V3 NFT position manager | 0x7486da6c227081f805605091e35209dfd61b0eb5 (https://lineascan.build/address/0x7486da6c227081f805605091e35209dfd61b0eb5)

 | CookDEX V3 Quoter | 0x19a8a30527f4fafd359952ff42b528211948fb92 (https://lineascan.build/address/0x19a8a30527f4fafd359952ff42b528211948fb92)

 | CookDEX V3 Quoter V2 | 0xdcca0bf6bf43fc78e011064db2ef055e6e82020c (https://lineascan.build/address/0xdcca0bf6bf43fc78e011064db2ef055e6e82020c)

V2: Configured address; RPC factory check unavailable in this run.

V3: Configured address; RPC factory check unavailable in this run.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Linea ↗ (https://swap.cookscan.net/?chain=linea)

## Linea | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0xb82e1234a2f3f01888761bd7a53d0fe02a92514f (https://lineascan.build/address/0xb82e1234a2f3f01888761bd7a53d0fe02a92514f)

 | Dedicated curve trade router | No dedicated router configured; curve trades execute directly

 | Migration AMM router | 0x570055dcbf3c7ab2b21a37a8aae776719eb402c6 (https://lineascan.build/address/0x570055dcbf3c7ab2b21a37a8aae776719eb402c6)

 | Migration AMM factory | 0x42995b215c1379c7a7de8e15edb701cf42ce71f9 (https://lineascan.build/address/0x42995b215c1379c7a7de8e15edb701cf42ce71f9)

 | Liquidity lock / burn vault | 0x9256d90dcbc64d0bd7cd1662a9135639b2a638f7 (https://lineascan.build/address/0x9256d90dcbc64d0bd7cd1662a9135639b2a638f7)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://lineascan.build/tx/0xcebd8e2a2210a0d6a35372a49c4f704fabddc01a7e0a00efd1de6f1fd4f1a633)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0x85dde7cd5825296556fd71bc4e55748ab94aceda (https://lineascan.build/address/0x85dde7cd5825296556fd71bc4e55748ab94aceda) | 0xcb902d115b95e18b8f72bf339145e0fc7afd1e1c (https://lineascan.build/address/0xcb902d115b95e18b8f72bf339145e0fc7afd1e1c)

 | 0.05% / rev. 7 | 0x5770b2a9b539dc7efdada3fa1811a253775ebcd2 (https://lineascan.build/address/0x5770b2a9b539dc7efdada3fa1811a253775ebcd2) | 0x57b1b55f3e3869c539ac0ca692ad66e0abddd5d4 (https://lineascan.build/address/0x57b1b55f3e3869c539ac0ca692ad66e0abddd5d4)

 | 0.1% / rev. 7 | 0x1156d71de6ef7dc15fe71ec41d8577ee6e5e665d (https://lineascan.build/address/0x1156d71de6ef7dc15fe71ec41d8577ee6e5e665d) | 0x84477b9396c0f20315f20bf4a293e2b979acf944 (https://lineascan.build/address/0x84477b9396c0f20315f20bf4a293e2b979acf944)

 | 0.3% / rev. 7 | 0xbc732b1323aac46cb116b98df187c7fdbd53a5ee (https://lineascan.build/address/0xbc732b1323aac46cb116b98df187c7fdbd53a5ee) | 0xa6e6e8099aef40d404f747519ee8adb8b82749f9 (https://lineascan.build/address/0xa6e6e8099aef40d404f747519ee8adb8b82749f9)

 | 1% / rev. 7 | 0x92175baed829eccc794b95f392aa4db1fd914599 (https://lineascan.build/address/0x92175baed829eccc794b95f392aa4db1fd914599) | 0x03f0177936a3118883a4b039bbb778600d929bcc (https://lineascan.build/address/0x03f0177936a3118883a4b039bbb778600d929bcc)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0x7486da6c227081f805605091e35209dfd61b0eb5 (https://lineascan.build/address/0x7486da6c227081f805605091e35209dfd61b0eb5)

 | AMM swap router | 0xa6753a1ea3d80b1b261a32cb0c1150925d8860f2 (https://lineascan.build/address/0xa6753a1ea3d80b1b261a32cb0c1150925d8860f2)

 | AMM factory | 0x0c5100f85e057f2ea46c1f829951c4052a414e32 (https://lineascan.build/address/0x0c5100f85e057f2ea46c1f829951c4052a414e32)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## Monad | Current AMM contracts

 | Network field | Value

 | Chain ID | 143

 | Native asset | MON; 18 decimals

 | DEX enabled | True

 | RPC | https://rpc.monad.xyz/

 | Explorer | https://monadscan.com

 | Wrapped native token | 0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A (https://monadscan.com/address/0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://monadscan.com/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | CookDEX V2 Swap router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://monadscan.com/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | CookDEX V3 AMM factory | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://monadscan.com/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

 | CookDEX V3 Swap router | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://monadscan.com/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | CookDEX V3 NFT position manager | 0x144a03091e506336c822784c80c22bcc28e3254b (https://monadscan.com/address/0x144a03091e506336c822784c80c22bcc28e3254b)

 | CookDEX V3 Quoter | 0x4256042944035dfe7318f8299b85f6279c425d6e (https://monadscan.com/address/0x4256042944035dfe7318f8299b85f6279c425d6e)

 | CookDEX V3 Quoter V2 | 0x2729cb4ae1503483e27f85ddb877715bd962c888 (https://monadscan.com/address/0x2729cb4ae1503483e27f85ddb877715bd962c888)

V2: RPC factory match; chain ID confirmed.

V3: RPC factory match; chain ID confirmed.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Monad ↗ (https://swap.cookscan.net/?chain=monad)

## Monad | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0x191fafff893b2ddd87978676e5ebaa4e7631f3e7 (https://monadscan.com/address/0x191fafff893b2ddd87978676e5ebaa4e7631f3e7)

 | Dedicated curve trade router | 0x44fd7f6cce29e9831696461ad1446187824ae978 (https://monadscan.com/address/0x44fd7f6cce29e9831696461ad1446187824ae978)

 | Migration AMM router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://monadscan.com/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | Migration AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://monadscan.com/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | Liquidity lock / burn vault | 0x8e9f31885196597430e40db5992fa43acd2664f5 (https://monadscan.com/address/0x8e9f31885196597430e40db5992fa43acd2664f5)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://monadscan.com/tx/0xf4d0c92fbb3e02f5633a1f4891a2bc522e1608588f3b3a33976aeaae15fb30d3)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0xb18161e05e46f0d0e0cc95c1cfeb4f03bd4fa11d (https://monadscan.com/address/0xb18161e05e46f0d0e0cc95c1cfeb4f03bd4fa11d) | 0x121a7e130da6403743ae514a9a093fe8e716e549 (https://monadscan.com/address/0x121a7e130da6403743ae514a9a093fe8e716e549)

 | 0.05% / rev. 7 | 0x59caeccb99fd400c0cecb32f1ac684f1772e5507 (https://monadscan.com/address/0x59caeccb99fd400c0cecb32f1ac684f1772e5507) | 0x7486da6c227081f805605091e35209dfd61b0eb5 (https://monadscan.com/address/0x7486da6c227081f805605091e35209dfd61b0eb5)

 | 0.1% / rev. 7 | 0xedf36e8ad12f88d159aa8abac7783910a2981d64 (https://monadscan.com/address/0xedf36e8ad12f88d159aa8abac7783910a2981d64) | 0x40ee973863886c21a49e83c8abf184b8f6932e75 (https://monadscan.com/address/0x40ee973863886c21a49e83c8abf184b8f6932e75)

 | 0.3% / rev. 7 | 0xa6753a1ea3d80b1b261a32cb0c1150925d8860f2 (https://monadscan.com/address/0xa6753a1ea3d80b1b261a32cb0c1150925d8860f2) | 0x0c5100f85e057f2ea46c1f829951c4052a414e32 (https://monadscan.com/address/0x0c5100f85e057f2ea46c1f829951c4052a414e32)

 | 1% / rev. 7 | 0xe9928ef0da897bd21ae7e530d27ca390569830e2 (https://monadscan.com/address/0xe9928ef0da897bd21ae7e530d27ca390569830e2) | 0xa315115f6ce2490a6c79d2108a6c8837ad5dd480 (https://monadscan.com/address/0xa315115f6ce2490a6c79d2108a6c8837ad5dd480)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0x144a03091e506336c822784c80c22bcc28e3254b (https://monadscan.com/address/0x144a03091e506336c822784c80c22bcc28e3254b)

 | AMM swap router | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://monadscan.com/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | AMM factory | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://monadscan.com/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## Optimism | Current AMM contracts

 | Network field | Value

 | Chain ID | 10

 | Native asset | ETH; 18 decimals

 | DEX enabled | True

 | RPC | https://mainnet.optimism.io/

 | Explorer | https://optimistic.etherscan.io

 | Wrapped native token | 0x4200000000000000000000000000000000000006 (https://optimistic.etherscan.io/address/0x4200000000000000000000000000000000000006)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://optimistic.etherscan.io/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | CookDEX V2 Swap router | 0x5264f98afc705042ca049fa4a83578cde9b4e3da (https://optimistic.etherscan.io/address/0x5264f98afc705042ca049fa4a83578cde9b4e3da)

 | CookDEX V3 AMM factory | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://optimistic.etherscan.io/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

 | CookDEX V3 Swap router | 0xbaa02841530d89bd379f80245d3047a0537ab25b (https://optimistic.etherscan.io/address/0xbaa02841530d89bd379f80245d3047a0537ab25b)

 | CookDEX V3 NFT position manager | 0xc70abfcb74b7680aa7e9846410d59a2bb1f78f96 (https://optimistic.etherscan.io/address/0xc70abfcb74b7680aa7e9846410d59a2bb1f78f96)

 | CookDEX V3 Quoter | 0xa6753a1ea3d80b1b261a32cb0c1150925d8860f2 (https://optimistic.etherscan.io/address/0xa6753a1ea3d80b1b261a32cb0c1150925d8860f2)

 | CookDEX V3 Quoter V2 | 0x121a7e130da6403743ae514a9a093fe8e716e549 (https://optimistic.etherscan.io/address/0x121a7e130da6403743ae514a9a093fe8e716e549)

V2: RPC factory match; chain ID confirmed.

V3: RPC factory match; chain ID confirmed.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Optimism ↗ (https://swap.cookscan.net/?chain=optimism)

## Optimism | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0x9256d90dcbc64d0bd7cd1662a9135639b2a638f7 (https://optimistic.etherscan.io/address/0x9256d90dcbc64d0bd7cd1662a9135639b2a638f7)

 | Dedicated curve trade router | 0x7486da6c227081f805605091e35209dfd61b0eb5 (https://optimistic.etherscan.io/address/0x7486da6c227081f805605091e35209dfd61b0eb5)

 | Migration AMM router | 0x5264f98afc705042ca049fa4a83578cde9b4e3da (https://optimistic.etherscan.io/address/0x5264f98afc705042ca049fa4a83578cde9b4e3da)

 | Migration AMM factory | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://optimistic.etherscan.io/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | Liquidity lock / burn vault | 0x9fbfea94dcb78a0f20a09755dcd673ad5f5a2999 (https://optimistic.etherscan.io/address/0x9fbfea94dcb78a0f20a09755dcd673ad5f5a2999)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://optimistic.etherscan.io/tx/0xf058b05682d8374e7e75e8acdd6b0b9a4ed469bd4ad9866bd0b022fdfc7848e0)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0x85dde7cd5825296556fd71bc4e55748ab94aceda (https://optimistic.etherscan.io/address/0x85dde7cd5825296556fd71bc4e55748ab94aceda) | 0xcb902d115b95e18b8f72bf339145e0fc7afd1e1c (https://optimistic.etherscan.io/address/0xcb902d115b95e18b8f72bf339145e0fc7afd1e1c)

 | 0.05% / rev. 7 | 0x5770b2a9b539dc7efdada3fa1811a253775ebcd2 (https://optimistic.etherscan.io/address/0x5770b2a9b539dc7efdada3fa1811a253775ebcd2) | 0x57b1b55f3e3869c539ac0ca692ad66e0abddd5d4 (https://optimistic.etherscan.io/address/0x57b1b55f3e3869c539ac0ca692ad66e0abddd5d4)

 | 0.1% / rev. 7 | 0x1156d71de6ef7dc15fe71ec41d8577ee6e5e665d (https://optimistic.etherscan.io/address/0x1156d71de6ef7dc15fe71ec41d8577ee6e5e665d) | 0x84477b9396c0f20315f20bf4a293e2b979acf944 (https://optimistic.etherscan.io/address/0x84477b9396c0f20315f20bf4a293e2b979acf944)

 | 0.3% / rev. 7 | 0xbc732b1323aac46cb116b98df187c7fdbd53a5ee (https://optimistic.etherscan.io/address/0xbc732b1323aac46cb116b98df187c7fdbd53a5ee) | 0xa6e6e8099aef40d404f747519ee8adb8b82749f9 (https://optimistic.etherscan.io/address/0xa6e6e8099aef40d404f747519ee8adb8b82749f9)

 | 1% / rev. 7 | 0x92175baed829eccc794b95f392aa4db1fd914599 (https://optimistic.etherscan.io/address/0x92175baed829eccc794b95f392aa4db1fd914599) | 0x03f0177936a3118883a4b039bbb778600d929bcc (https://optimistic.etherscan.io/address/0x03f0177936a3118883a4b039bbb778600d929bcc)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0xc70abfcb74b7680aa7e9846410d59a2bb1f78f96 (https://optimistic.etherscan.io/address/0xc70abfcb74b7680aa7e9846410d59a2bb1f78f96)

 | AMM swap router | 0xbaa02841530d89bd379f80245d3047a0537ab25b (https://optimistic.etherscan.io/address/0xbaa02841530d89bd379f80245d3047a0537ab25b)

 | AMM factory | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://optimistic.etherscan.io/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## Polygon | Current AMM contracts

 | Network field | Value

 | Chain ID | 137

 | Native asset | POL; 18 decimals

 | DEX enabled | True

 | RPC | https://polygon-bor-rpc.publicnode.com/

 | Explorer | https://polygonscan.com

 | Wrapped native token | 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270 (https://polygonscan.com/address/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://polygonscan.com/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | CookDEX V2 Swap router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://polygonscan.com/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | CookDEX V3 AMM factory | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://polygonscan.com/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | CookDEX V3 Swap router | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://polygonscan.com/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

 | CookDEX V3 NFT position manager | 0x48362fc32a774cefbbc61fd3c33fa23419ad9d7f (https://polygonscan.com/address/0x48362fc32a774cefbbc61fd3c33fa23419ad9d7f)

 | CookDEX V3 Quoter | 0x9d7f9149957a5713676333ddb58f4e4b6f023755 (https://polygonscan.com/address/0x9d7f9149957a5713676333ddb58f4e4b6f023755)

 | CookDEX V3 Quoter V2 | 0x086cf2482f13bfcaad24ae55ae083f02ffbd8ef4 (https://polygonscan.com/address/0x086cf2482f13bfcaad24ae55ae083f02ffbd8ef4)

V2: Configured address; RPC factory check unavailable in this run.

V3: Configured address; RPC factory check unavailable in this run.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Polygon ↗ (https://swap.cookscan.net/?chain=polygon)

## Polygon | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0x1507fc46ba8284d749cd21eaf164a2df070b9181 (https://polygonscan.com/address/0x1507fc46ba8284d749cd21eaf164a2df070b9181)

 | Dedicated curve trade router | 0xa315115f6ce2490a6c79d2108a6c8837ad5dd480 (https://polygonscan.com/address/0xa315115f6ce2490a6c79d2108a6c8837ad5dd480)

 | Migration AMM router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://polygonscan.com/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | Migration AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://polygonscan.com/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | Liquidity lock / burn vault | 0x4c1044fbd545f860b68bb307b2acc6c704329f4a (https://polygonscan.com/address/0x4c1044fbd545f860b68bb307b2acc6c704329f4a)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://polygonscan.com/tx/0x877bd9a2baa65a63c4ddacd8ac87fcedbed85c9d9c9db07a0ce4c53273ee80aa)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0x7ec3836d299867f2276948e38766cad22c38c84d (https://polygonscan.com/address/0x7ec3836d299867f2276948e38766cad22c38c84d) | 0xd6a2494cc2484b4bf269e57c852f62f819a21880 (https://polygonscan.com/address/0xd6a2494cc2484b4bf269e57c852f62f819a21880)

 | 0.05% / rev. 7 | 0xc3ccbadec12b3877c193846608d494ea3b1a7fc6 (https://polygonscan.com/address/0xc3ccbadec12b3877c193846608d494ea3b1a7fc6) | 0xfe18b129f892aa8ac6a3087dcacbfbab302c834a (https://polygonscan.com/address/0xfe18b129f892aa8ac6a3087dcacbfbab302c834a)

 | 0.1% / rev. 7 | 0x7ad0229e231e9168c618cbc31b7c22f00d44e24b (https://polygonscan.com/address/0x7ad0229e231e9168c618cbc31b7c22f00d44e24b) | 0xe078acccf91da406db4cc8beecaa9e97dd737d57 (https://polygonscan.com/address/0xe078acccf91da406db4cc8beecaa9e97dd737d57)

 | 0.3% / rev. 7 | 0x77f545496020c26d4a5bb8c9deb4d4f0d3dfa3f6 (https://polygonscan.com/address/0x77f545496020c26d4a5bb8c9deb4d4f0d3dfa3f6) | 0x90fb0e289bfb5ce3f129847c8666f267f2d7f07a (https://polygonscan.com/address/0x90fb0e289bfb5ce3f129847c8666f267f2d7f07a)

 | 1% / rev. 7 | 0x04b456f41daf49e3f21cb514ad0c35fe2ada70e0 (https://polygonscan.com/address/0x04b456f41daf49e3f21cb514ad0c35fe2ada70e0) | 0x69160216c165663274dd3bea215cc17fa9eb0616 (https://polygonscan.com/address/0x69160216c165663274dd3bea215cc17fa9eb0616)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0x48362fc32a774cefbbc61fd3c33fa23419ad9d7f (https://polygonscan.com/address/0x48362fc32a774cefbbc61fd3c33fa23419ad9d7f)

 | AMM swap router | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://polygonscan.com/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

 | AMM factory | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://polygonscan.com/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## Robinhood Chain | Current AMM contracts

 | Network field | Value

 | Chain ID | 4663

 | Native asset | ETH; 18 decimals

 | DEX enabled | True

 | RPC | https://rpc.mainnet.chain.robinhood.com/

 | Explorer | https://robinhoodchain.blockscout.com

 | Wrapped native token | 0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73 (https://robinhoodchain.blockscout.com/address/0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://robinhoodchain.blockscout.com/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

 | CookDEX V2 Swap router | 0x1ef53b37a0913834498b640f4b626a2c2e5be0f5 (https://robinhoodchain.blockscout.com/address/0x1ef53b37a0913834498b640f4b626a2c2e5be0f5)

 | CookDEX V3 AMM factory | 0x028581ea934d06cce20cc582b57b89ea1c0449d1 (https://robinhoodchain.blockscout.com/address/0x028581ea934d06cce20cc582b57b89ea1c0449d1)

 | CookDEX V3 Swap router | 0xb2ba1249710e09d21bb01c5773cabc414d1ba485 (https://robinhoodchain.blockscout.com/address/0xb2ba1249710e09d21bb01c5773cabc414d1ba485)

 | CookDEX V3 NFT position manager | 0x1da528f72c0410fcc05625235af0cee9dc2b7d14 (https://robinhoodchain.blockscout.com/address/0x1da528f72c0410fcc05625235af0cee9dc2b7d14)

 | CookDEX V3 Quoter | 0x1d3bf8cdbed2fbf4375baadf3b4b59d2305e2f21 (https://robinhoodchain.blockscout.com/address/0x1d3bf8cdbed2fbf4375baadf3b4b59d2305e2f21)

 | CookDEX V3 Quoter V2 | 0x660aa6691caad894ebb264bcc0566feaaceaa528 (https://robinhoodchain.blockscout.com/address/0x660aa6691caad894ebb264bcc0566feaaceaa528)

V2: Configured address; RPC factory check unavailable in this run.

V3: Configured address; RPC factory check unavailable in this run.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Robinhood Chain ↗ (https://swap.cookscan.net/?chain=robinhood)

## Robinhood Chain | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0x9dac54f9ae648ce46a92aacf28d2a58904178fb9 (https://robinhoodchain.blockscout.com/address/0x9dac54f9ae648ce46a92aacf28d2a58904178fb9)

 | Dedicated curve trade router | 0x016ba57bac7b1e1f9d9f61c27d2d2e54f02a7035 (https://robinhoodchain.blockscout.com/address/0x016ba57bac7b1e1f9d9f61c27d2d2e54f02a7035)

 | Migration AMM router | 0x1ef53b37a0913834498b640f4b626a2c2e5be0f5 (https://robinhoodchain.blockscout.com/address/0x1ef53b37a0913834498b640f4b626a2c2e5be0f5)

 | Migration AMM factory | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://robinhoodchain.blockscout.com/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

 | Liquidity lock / burn vault | 0x1613d9683d735f9d472769027ac0d8aec7284625 (https://robinhoodchain.blockscout.com/address/0x1613d9683d735f9d472769027ac0d8aec7284625)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://robinhoodchain.blockscout.com/tx/0xdeba40642009b0113641af53e02935658781f626f5985e1c57b4e76ce449448c)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0xc7bdf3a30427baa7e6d451423bdb10a763386c4b (https://robinhoodchain.blockscout.com/address/0xc7bdf3a30427baa7e6d451423bdb10a763386c4b) | 0xbde538674ed0b08489022592f951e8e3d24db138 (https://robinhoodchain.blockscout.com/address/0xbde538674ed0b08489022592f951e8e3d24db138)

 | 0.05% / rev. 7 | 0x00b3f2d6ca1698d4ca1c7f60ffc4d23fc6441a5e (https://robinhoodchain.blockscout.com/address/0x00b3f2d6ca1698d4ca1c7f60ffc4d23fc6441a5e) | 0x06a3476f96546542ad45327766c20a9bda1bdd53 (https://robinhoodchain.blockscout.com/address/0x06a3476f96546542ad45327766c20a9bda1bdd53)

 | 0.1% / rev. 7 | 0x6a61843bf3169533942341c7e07537072e8ad9a0 (https://robinhoodchain.blockscout.com/address/0x6a61843bf3169533942341c7e07537072e8ad9a0) | 0x9d2fdbb56f6056297892053c150992379952d343 (https://robinhoodchain.blockscout.com/address/0x9d2fdbb56f6056297892053c150992379952d343)

 | 0.3% / rev. 7 | 0xec10cc33de51f7cf9ac48ad28d6862ecf474fd91 (https://robinhoodchain.blockscout.com/address/0xec10cc33de51f7cf9ac48ad28d6862ecf474fd91) | 0x5387b492c977e370f144b40d5acfb0e32433957b (https://robinhoodchain.blockscout.com/address/0x5387b492c977e370f144b40d5acfb0e32433957b)

 | 1% / rev. 7 | 0xbbb0e053d62f0679a8ee6d91ad6af4e38a80a920 (https://robinhoodchain.blockscout.com/address/0xbbb0e053d62f0679a8ee6d91ad6af4e38a80a920) | 0xa439218f0387fbd333d5d87055b47bef1faa1b93 (https://robinhoodchain.blockscout.com/address/0xa439218f0387fbd333d5d87055b47bef1faa1b93)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0x1da528f72c0410fcc05625235af0cee9dc2b7d14 (https://robinhoodchain.blockscout.com/address/0x1da528f72c0410fcc05625235af0cee9dc2b7d14)

 | AMM swap router | 0xb2ba1249710e09d21bb01c5773cabc414d1ba485 (https://robinhoodchain.blockscout.com/address/0xb2ba1249710e09d21bb01c5773cabc414d1ba485)

 | AMM factory | 0x028581ea934d06cce20cc582b57b89ea1c0449d1 (https://robinhoodchain.blockscout.com/address/0x028581ea934d06cce20cc582b57b89ea1c0449d1)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## Sonic | Current AMM contracts

 | Network field | Value

 | Chain ID | 146

 | Native asset | S; 18 decimals

 | DEX enabled | True

 | RPC | https://rpc.soniclabs.com/

 | Explorer | https://sonicscan.org

 | Wrapped native token | 0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38 (https://sonicscan.org/address/0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://sonicscan.org/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | CookDEX V2 Swap router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://sonicscan.org/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | CookDEX V3 AMM factory | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://sonicscan.org/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | CookDEX V3 Swap router | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://sonicscan.org/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

 | CookDEX V3 NFT position manager | 0x48362fc32a774cefbbc61fd3c33fa23419ad9d7f (https://sonicscan.org/address/0x48362fc32a774cefbbc61fd3c33fa23419ad9d7f)

 | CookDEX V3 Quoter | 0x84477b9396c0f20315f20bf4a293e2b979acf944 (https://sonicscan.org/address/0x84477b9396c0f20315f20bf4a293e2b979acf944)

 | CookDEX V3 Quoter V2 | 0x1156d71de6ef7dc15fe71ec41d8577ee6e5e665d (https://sonicscan.org/address/0x1156d71de6ef7dc15fe71ec41d8577ee6e5e665d)

V2: RPC factory match; chain ID confirmed.

V3: RPC factory match; chain ID confirmed.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Sonic ↗ (https://swap.cookscan.net/?chain=sonic)

## Sonic | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0x9d7f9149957a5713676333ddb58f4e4b6f023755 (https://sonicscan.org/address/0x9d7f9149957a5713676333ddb58f4e4b6f023755)

 | Dedicated curve trade router | 0xedf36e8ad12f88d159aa8abac7783910a2981d64 (https://sonicscan.org/address/0xedf36e8ad12f88d159aa8abac7783910a2981d64)

 | Migration AMM router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://sonicscan.org/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | Migration AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://sonicscan.org/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | Liquidity lock / burn vault | 0x00454fe8115947d40d03920ed04a841c6afa4b08 (https://sonicscan.org/address/0x00454fe8115947d40d03920ed04a841c6afa4b08)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://sonicscan.org/tx/0xebba4cbcd5f5a477d5227c571800251b8b616b03e5a4763e6bb3b80068f28560)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0xa3645d0d1869ec4a938076589ebe0047e2427ba4 (https://sonicscan.org/address/0xa3645d0d1869ec4a938076589ebe0047e2427ba4) | 0x6303bfbc668ce916c7c9b40d6b67889d28a6cf4c (https://sonicscan.org/address/0x6303bfbc668ce916c7c9b40d6b67889d28a6cf4c)

 | 0.05% / rev. 7 | 0x4c1044fbd545f860b68bb307b2acc6c704329f4a (https://sonicscan.org/address/0x4c1044fbd545f860b68bb307b2acc6c704329f4a) | 0x267121901a9100c7e950dd71bdea3bcb34cc9e2c (https://sonicscan.org/address/0x267121901a9100c7e950dd71bdea3bcb34cc9e2c)

 | 0.1% / rev. 7 | 0x3a0195e8d40b9dfb45aae4d55859b80721ca8be2 (https://sonicscan.org/address/0x3a0195e8d40b9dfb45aae4d55859b80721ca8be2) | 0x1507fc46ba8284d749cd21eaf164a2df070b9181 (https://sonicscan.org/address/0x1507fc46ba8284d749cd21eaf164a2df070b9181)

 | 0.3% / rev. 7 | 0xe8833c9eb0aeabcc444e48cb882fe6bebf1988d5 (https://sonicscan.org/address/0xe8833c9eb0aeabcc444e48cb882fe6bebf1988d5) | 0x6551d2e59d4fe354c83bf553287ed7323be078a8 (https://sonicscan.org/address/0x6551d2e59d4fe354c83bf553287ed7323be078a8)

 | 1% / rev. 7 | 0x77f545496020c26d4a5bb8c9deb4d4f0d3dfa3f6 (https://sonicscan.org/address/0x77f545496020c26d4a5bb8c9deb4d4f0d3dfa3f6) | 0x90fb0e289bfb5ce3f129847c8666f267f2d7f07a (https://sonicscan.org/address/0x90fb0e289bfb5ce3f129847c8666f267f2d7f07a)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0x48362fc32a774cefbbc61fd3c33fa23419ad9d7f (https://sonicscan.org/address/0x48362fc32a774cefbbc61fd3c33fa23419ad9d7f)

 | AMM swap router | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://sonicscan.org/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

 | AMM factory | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://sonicscan.org/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## Unichain | Current AMM contracts

 | Network field | Value

 | Chain ID | 130

 | Native asset | ETH; 18 decimals

 | DEX enabled | True

 | RPC | https://mainnet.unichain.org/

 | Explorer | https://uniscan.xyz

 | Wrapped native token | 0x4200000000000000000000000000000000000006 (https://uniscan.xyz/address/0x4200000000000000000000000000000000000006)

 | Contract role | Current address

 | CookDEX V2 AMM factory | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://uniscan.xyz/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

 | CookDEX V2 Swap router | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://uniscan.xyz/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | CookDEX V3 AMM factory | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://uniscan.xyz/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

 | CookDEX V3 Swap router | 0x1ef53b37a0913834498b640f4b626a2c2e5be0f5 (https://uniscan.xyz/address/0x1ef53b37a0913834498b640f4b626a2c2e5be0f5)

 | CookDEX V3 NFT position manager | 0xbaa02841530d89bd379f80245d3047a0537ab25b (https://uniscan.xyz/address/0xbaa02841530d89bd379f80245d3047a0537ab25b)

 | CookDEX V3 Quoter | 0xf2e097c3357347db7b145f1ccdbe06ea233e752a (https://uniscan.xyz/address/0xf2e097c3357347db7b145f1ccdbe06ea233e752a)

 | CookDEX V3 Quoter V2 | 0x6ec2ca0fc70be45fed83ff9662485e9fee0ae15f (https://uniscan.xyz/address/0x6ec2ca0fc70be45fed83ff9662485e9fee0ae15f)

V2: Configured address; RPC factory check unavailable in this run.

V3: Configured address; RPC factory check unavailable in this run.

Native block rewards on this foreign chain are governed by its own protocol; no fixed CookDEX reward is asserted.

Open CookSwap on Unichain ↗ (https://swap.cookscan.net/?chain=unichain)

## Unichain | EasyLaunch curve deployments

### V2 destination - current launch factory

 | Role | Address

 | EasyLaunch factory (revision 6) | 0x8851d83af77f851839f411e7d6d09e99572bd5dd (https://uniscan.xyz/address/0x8851d83af77f851839f411e7d6d09e99572bd5dd)

 | Dedicated curve trade router | No dedicated router configured; curve trades execute directly

 | Migration AMM router | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://uniscan.xyz/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | Migration AMM factory | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://uniscan.xyz/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

 | Liquidity lock / burn vault | 0xfed19c0a975ffcf12f9d3c2412a487dd16710282 (https://uniscan.xyz/address/0xfed19c0a975ffcf12f9d3c2412a487dd16710282)

Recorded source status: verified; deployment transaction is linked below.

V2 launch factory deployment receipt ↗ (https://uniscan.xyz/tx/0x915764a73d353a887edda866efb56b558da3b1a6c05b9633c9524509862b1396)

### V3 destination - current fee-tier factories

 | Fee / revision | Launch factory | Lock / burn vault

 | 0.01% / rev. 7 | 0x44fd7f6cce29e9831696461ad1446187824ae978 (https://uniscan.xyz/address/0x44fd7f6cce29e9831696461ad1446187824ae978) | 0xebbe6f90c6491e3e4b1a210210f40e87313b0cbe (https://uniscan.xyz/address/0xebbe6f90c6491e3e4b1a210210f40e87313b0cbe)

 | 0.05% / rev. 7 | 0x42995b215c1379c7a7de8e15edb701cf42ce71f9 (https://uniscan.xyz/address/0x42995b215c1379c7a7de8e15edb701cf42ce71f9) | 0x8dc6a944ea3ae4cec14119b90a54b5c512cd69e3 (https://uniscan.xyz/address/0x8dc6a944ea3ae4cec14119b90a54b5c512cd69e3)

 | 0.1% / rev. 7 | 0x4256042944035dfe7318f8299b85f6279c425d6e (https://uniscan.xyz/address/0x4256042944035dfe7318f8299b85f6279c425d6e) | 0x570055dcbf3c7ab2b21a37a8aae776719eb402c6 (https://uniscan.xyz/address/0x570055dcbf3c7ab2b21a37a8aae776719eb402c6)

 | 0.3% / rev. 7 | 0xe63d91da8b7bd6280b64948d1a45003e573db1bb (https://uniscan.xyz/address/0xe63d91da8b7bd6280b64948d1a45003e573db1bb) | 0xda24f7e55673d219a87e3c76852bd1c6332c5753 (https://uniscan.xyz/address/0xda24f7e55673d219a87e3c76852bd1c6332c5753)

 | 1% / rev. 7 | 0x8e9f31885196597430e40db5992fa43acd2664f5 (https://uniscan.xyz/address/0x8e9f31885196597430e40db5992fa43acd2664f5) | 0x2729cb4ae1503483e27f85ddb877715bd962c888 (https://uniscan.xyz/address/0x2729cb4ae1503483e27f85ddb877715bd962c888)

V3 launch router() stores the migration position manager, not a pre-migration AMM swap router. Current V3 curve trading is direct unless a dedicated tradeRouter is configured.

 | V3 migration role | Address

 | NFT position manager | 0xbaa02841530d89bd379f80245d3047a0537ab25b (https://uniscan.xyz/address/0xbaa02841530d89bd379f80245d3047a0537ab25b)

 | AMM swap router | 0x1ef53b37a0913834498b640f4b626a2c2e5be0f5 (https://uniscan.xyz/address/0x1ef53b37a0913834498b640f4b626a2c2e5be0f5)

 | AMM factory | 0xeb812c7c1487f897321e2f3d678ca2b48c53442d (https://uniscan.xyz/address/0xeb812c7c1487f897321e2f3d678ca2b48c53442d)

Only current slots are shown. The fee tier is the destination V3 pool fee, not a claim about curve trade fees. Source links are available by clicking each contract address.

## System curves: discovery and trading roles

The following sheets contain the 14 currently published system curve markets. Existing published contracts are retained even when their migration target belongs to an earlier deployment. This is the address required to index that live curve; it is not listed as the current normal AMM deployment.

The Curve / direct trade contract is the address that receives pre-migration buy/sell calls. Its factory() is the curve discovery factory where confirmed; it is distinct from the migration AMM factory. The migration AMM router and factory fields below come from the deployed curve setup record. A missing discovery field is resolved by the read-only curve factory() result when available. Earlier directly deployed curves can have no separate discovery factory and may not implement factory(); submit their explicit curve address.

wCOOK is the chain-specific token. The quote-token address is included for pair matching. Never treat a bridge vault as the Cookchain wCOOK ERC-20 token. Real collateral and virtual pricing reserves must remain separate in market-data integrations.

## Cookchain | System curve wCOOK/USDC

 | Contract role | Address

 | Curve / direct trade contract | 0xec3adb83b157629fa0f3c166d34171293ede505a (https://cookscan.net/explorer/address/0xec3adb83b157629fa0f3c166d34171293ede505a)

 | Discovery factory | No separate discovery factory recorded (legacy direct deployment)

 | wCOOK token contract | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://cookscan.net/explorer/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | Quote token contract | 0xa28324ec703c1620ae798b1cd540bb90a2712d4a (https://cookscan.net/explorer/address/0xa28324ec703c1620ae798b1cd540bb90a2712d4a)

 | Deployed migration AMM router | 0x086cf2482f13bfcaad24ae55ae083f02ffbd8ef4 (https://cookscan.net/explorer/address/0x086cf2482f13bfcaad24ae55ae083f02ffbd8ef4)

 | Deployed migration AMM factory | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://cookscan.net/explorer/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

Chain ID: 20261001 | Catalog status: active | Discovery source: not recorded / not confirmed

Creation block: Not recorded | Recorded token decimals: 18 | Quote decimals: 6

Saved verification records: curve=verified, token=verified

### Deployment evidence

deploy - 0xda0da3408e1028decb5df655ddfcd73d6cd2ca835d57dca73d36e1b34bcec907 ↗ (https://cookscan.net/explorer/tx/0xda0da3408e1028decb5df655ddfcd73d6cd2ca835d57dca73d36e1b34bcec907)

approve funding - 0xdbf2b2a07fffb37b4fa6f9919f5f40866b3ea274e1a7bb17493ea278a71c4b3d ↗ (https://cookscan.net/explorer/tx/0xdbf2b2a07fffb37b4fa6f9919f5f40866b3ea274e1a7bb17493ea278a71c4b3d)

fund - 0xa5eccfd24ccf9131de1a263d001b3ad1fcbf72a388e73476cf8729e1c5a17d84 ↗ (https://cookscan.net/explorer/tx/0xa5eccfd24ccf9131de1a263d001b3ad1fcbf72a388e73476cf8729e1c5a17d84)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=cookchain&input=0xa28324ec703c1620ae798b1cd540bb90a2712d4a&output=0xf800bf07394e8290807b4ce579f4e9f99c3da869&pair=0xec3adb83b157629fa0f3c166d34171293ede505a)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## Arbitrum | System curve wCOOK/WETH

 | Contract role | Address

 | Curve / direct trade contract | 0x03a624fb9c0e43a28a3ce82aea3aeb7627e6f8b7 (https://arbiscan.io/address/0x03a624fb9c0e43a28a3ce82aea3aeb7627e6f8b7)

 | Discovery factory | 0x016ba57bac7b1e1f9d9f61c27d2d2e54f02a7035 (https://arbiscan.io/address/0x016ba57bac7b1e1f9d9f61c27d2d2e54f02a7035)

 | wCOOK token contract | 0xf62df06e93340c8f632b0691f444a159d0cddcaa (https://arbiscan.io/address/0xf62df06e93340c8f632b0691f444a159d0cddcaa)

 | Quote token contract | 0x82af49447d8a07e3bd95bd0d56f35241523fbab1 (https://arbiscan.io/address/0x82af49447d8a07e3bd95bd0d56f35241523fbab1)

 | Deployed migration AMM router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://arbiscan.io/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | Deployed migration AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://arbiscan.io/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

Chain ID: 42161 | Catalog status: active | Discovery source: deployment record

Creation block: 512648296 | Recorded token decimals: 18 | Quote decimals: 18

Saved verification records: token=verified, factory=verified, curve=verified

### Deployment evidence

deploy discovery factory - 0xafbe0d983f05255ce4088efe15047d789226b918eed24120389ece53f8103e20 ↗ (https://arbiscan.io/tx/0xafbe0d983f05255ce4088efe15047d789226b918eed24120389ece53f8103e20)

create curve - 0x250001dddb23d8d730d497f109b210fd4e403f1c1cfa59f61f46a4a261f0b3d6 ↗ (https://arbiscan.io/tx/0x250001dddb23d8d730d497f109b210fd4e403f1c1cfa59f61f46a4a261f0b3d6)

approve funding - 0x423cf39fbc13c249101ad039823d1e1e78c590f9c59daa0b2a5ad6d72ab85aa1 ↗ (https://arbiscan.io/tx/0x423cf39fbc13c249101ad039823d1e1e78c590f9c59daa0b2a5ad6d72ab85aa1)

fund - 0xf2d7c5dfc095f3aa1e7f04b73e24ac9b06faa1ef568a0941f5daa8485c1e422f ↗ (https://arbiscan.io/tx/0xf2d7c5dfc095f3aa1e7f04b73e24ac9b06faa1ef568a0941f5daa8485c1e422f)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=arbitrum&input=0x82af49447d8a07e3bd95bd0d56f35241523fbab1&output=0xf62df06e93340c8f632b0691f444a159d0cddcaa&pair=0x03a624fb9c0e43a28a3ce82aea3aeb7627e6f8b7)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## Arc | System curve wCOOK/USDC

 | Contract role | Address

 | Curve / direct trade contract | 0x5c5af75ae24497a4ad8af00e361ae8ceb5272a88 (https://explorer.arc.io/address/0x5c5af75ae24497a4ad8af00e361ae8ceb5272a88)

 | Discovery factory | 0x267121901a9100c7e950dd71bdea3bcb34cc9e2c (https://explorer.arc.io/address/0x267121901a9100c7e950dd71bdea3bcb34cc9e2c)

 | wCOOK token contract | 0xf1df4d18da9d31cbed16a7b1ef6846f77cf69ce0 (https://explorer.arc.io/address/0xf1df4d18da9d31cbed16a7b1ef6846f77cf69ce0)

 | Quote token contract | 0x3600000000000000000000000000000000000000 (https://explorer.arc.io/address/0x3600000000000000000000000000000000000000)

 | Deployed migration AMM router | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://explorer.arc.io/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | Deployed migration AMM factory | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://explorer.arc.io/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

Chain ID: 5042 | Catalog status: active | Discovery source: deployment record

Creation block: 24239172 | Recorded token decimals: 18 | Quote decimals: 6

Saved verification records: factory=verified, curve=verified, token=verified

### Deployment evidence

deploy discovery factory - 0xb6410d624500dee9e3e57d101c47435e4175cba6432ff58d7c1e3ff26c8bfc68 ↗ (https://explorer.arc.io/tx/0xb6410d624500dee9e3e57d101c47435e4175cba6432ff58d7c1e3ff26c8bfc68)

create curve - 0x658d71a602cceeb65240d7df7028b537519c33e5d2cb5a284250029e1e748155 ↗ (https://explorer.arc.io/tx/0x658d71a602cceeb65240d7df7028b537519c33e5d2cb5a284250029e1e748155)

approve funding - 0x198a78b35f9276ffdbae36a554f910ba52a671e616bcd08f7914660b51178304 ↗ (https://explorer.arc.io/tx/0x198a78b35f9276ffdbae36a554f910ba52a671e616bcd08f7914660b51178304)

fund - 0xa49e157a703f8390a1c3fafd6091f9bdffd48d7ee005ac3506cbed4669311ff8 ↗ (https://explorer.arc.io/tx/0xa49e157a703f8390a1c3fafd6091f9bdffd48d7ee005ac3506cbed4669311ff8)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=arc&input=0x3600000000000000000000000000000000000000&output=0xf1df4d18da9d31cbed16a7b1ef6846f77cf69ce0&pair=0x5c5af75ae24497a4ad8af00e361ae8ceb5272a88)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## Avalanche | System curve wCOOK/WAVAX

 | Contract role | Address

 | Curve / direct trade contract | 0x3fc26e7ecad7e7f2626373b5787b417be8a2d5d0 (https://snowtrace.io/address/0x3fc26e7ecad7e7f2626373b5787b417be8a2d5d0)

 | Discovery factory | 0x84477b9396c0f20315f20bf4a293e2b979acf944 (https://snowtrace.io/address/0x84477b9396c0f20315f20bf4a293e2b979acf944)

 | wCOOK token contract | 0x130890d3fa866392edd99976e8f86bad9da6aff8 (https://snowtrace.io/address/0x130890d3fa866392edd99976e8f86bad9da6aff8)

 | Quote token contract | 0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7 (https://snowtrace.io/address/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7)

 | Deployed migration AMM router | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://snowtrace.io/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

 | Deployed migration AMM factory | 0x790919e9ea6ac73595e31ad5c05db8ea5126580e (https://snowtrace.io/address/0x790919e9ea6ac73595e31ad5c05db8ea5126580e)

Chain ID: 43114 | Catalog status: active | Discovery source: deployment record

Creation block: 96743710 | Recorded token decimals: 18 | Quote decimals: 18

Saved verification records: factory=verified, curve=verified, token=verified

### Deployment evidence

deploy discovery factory - 0xb5dfd7807f0682c7bf78072970f615c71439823568e2d9a6dfe738445716c691 ↗ (https://snowtrace.io/tx/0xb5dfd7807f0682c7bf78072970f615c71439823568e2d9a6dfe738445716c691)

create curve - 0x344b0c77b823b073d5e8da29056983c7fd899824f5475614afb7bc1150f3f3bb ↗ (https://snowtrace.io/tx/0x344b0c77b823b073d5e8da29056983c7fd899824f5475614afb7bc1150f3f3bb)

approve funding - 0xea5eaa6f903a3f9e49bab0681fb7f5c54868d93ccca00806a9317876d344e93f ↗ (https://snowtrace.io/tx/0xea5eaa6f903a3f9e49bab0681fb7f5c54868d93ccca00806a9317876d344e93f)

fund - 0x6435be8e16ae2d8670e942c93728ff4a59cf188619aa660ebb4a1cb1ab4ec8ba ↗ (https://snowtrace.io/tx/0x6435be8e16ae2d8670e942c93728ff4a59cf188619aa660ebb4a1cb1ab4ec8ba)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=avalanche&input=0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7&output=0x130890d3fa866392edd99976e8f86bad9da6aff8&pair=0x3fc26e7ecad7e7f2626373b5787b417be8a2d5d0)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## Base | System curve wCOOK/WETH

 | Contract role | Address

 | Curve / direct trade contract | 0xfe18b129f892aa8ac6a3087dcacbfbab302c834a (https://basescan.org/address/0xfe18b129f892aa8ac6a3087dcacbfbab302c834a)

 | Discovery factory | No separate discovery factory recorded (legacy direct deployment)

 | wCOOK token contract | 0xfad5552b3bc8c62d66745e69485f33b81673fd6c (https://basescan.org/address/0xfad5552b3bc8c62d66745e69485f33b81673fd6c)

 | Quote token contract | 0x4200000000000000000000000000000000000006 (https://basescan.org/address/0x4200000000000000000000000000000000000006)

 | Deployed migration AMM router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://basescan.org/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | Deployed migration AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://basescan.org/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

Chain ID: 8453 | Catalog status: active | Discovery source: not recorded / not confirmed

Creation block: Not recorded | Recorded token decimals: 18 | Quote decimals: 18

Saved verification records: curve=verified, token=verified

### Deployment evidence

deploy - 0xe3fd6645620990a102b1dead4b5727a90a8da0c4f79dffd197cf05066dfc5eec ↗ (https://basescan.org/tx/0xe3fd6645620990a102b1dead4b5727a90a8da0c4f79dffd197cf05066dfc5eec)

approve funding - 0x30b5c0310f5f439574d6c82cb5f5c52ae92679debed000e141db7134409d0ee7 ↗ (https://basescan.org/tx/0x30b5c0310f5f439574d6c82cb5f5c52ae92679debed000e141db7134409d0ee7)

fund - 0x2d93b18277c2212218cd8d3c9894afa4cacde079ad1711bf21636c7fbbe9bf96 ↗ (https://basescan.org/tx/0x2d93b18277c2212218cd8d3c9894afa4cacde079ad1711bf21636c7fbbe9bf96)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=base&input=0x4200000000000000000000000000000000000006&output=0xfad5552b3bc8c62d66745e69485f33b81673fd6c&pair=0xfe18b129f892aa8ac6a3087dcacbfbab302c834a)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## Blast | System curve wCOOK/WETH

 | Contract role | Address

 | Curve / direct trade contract | 0xdcca0bf6bf43fc78e011064db2ef055e6e82020c (https://blastscan.io/address/0xdcca0bf6bf43fc78e011064db2ef055e6e82020c)

 | Discovery factory | No separate discovery factory recorded (legacy direct deployment)

 | wCOOK token contract | 0xfad5552b3bc8c62d66745e69485f33b81673fd6c (https://blastscan.io/address/0xfad5552b3bc8c62d66745e69485f33b81673fd6c)

 | Quote token contract | 0x4300000000000000000000000000000000000004 (https://blastscan.io/address/0x4300000000000000000000000000000000000004)

 | Deployed migration AMM router | 0x5264f98afc705042ca049fa4a83578cde9b4e3da (https://blastscan.io/address/0x5264f98afc705042ca049fa4a83578cde9b4e3da)

 | Deployed migration AMM factory | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://blastscan.io/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

Chain ID: 81457 | Catalog status: active | Discovery source: not recorded / not confirmed

Creation block: 41151468 | Recorded token decimals: 18 | Quote decimals: 18

Saved verification records: curve=verified, token=verified

### Deployment evidence

deploy - 0xfe3acc4164eafd203e1e715dff4fbde79b4cdcd505efc01ee4f01ba26f3acc7f ↗ (https://blastscan.io/tx/0xfe3acc4164eafd203e1e715dff4fbde79b4cdcd505efc01ee4f01ba26f3acc7f)

approve funding - 0x546c94584e1008d386f1e87944192a1e2dcca35228e7fede95d8b3e6defc7d5f ↗ (https://blastscan.io/tx/0x546c94584e1008d386f1e87944192a1e2dcca35228e7fede95d8b3e6defc7d5f)

fund - 0xf8cf487f6e2eb6fc712bb6ce84205493915239c11cee4b4d020b938229b7049f ↗ (https://blastscan.io/tx/0xf8cf487f6e2eb6fc712bb6ce84205493915239c11cee4b4d020b938229b7049f)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=blast&input=0x4300000000000000000000000000000000000004&output=0xfad5552b3bc8c62d66745e69485f33b81673fd6c&pair=0xdcca0bf6bf43fc78e011064db2ef055e6e82020c)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## BNB Chain | System curve wCOOK/WBNB

 | Contract role | Address

 | Curve / direct trade contract | 0x81214a8ddce2fb44d4bd39d68843d8608c6b1d56 (https://bscscan.com/address/0x81214a8ddce2fb44d4bd39d68843d8608c6b1d56)

 | Discovery factory | 0x34947cb8a52bb35eef8fb55e00a6f3b7aa137c49 (https://bscscan.com/address/0x34947cb8a52bb35eef8fb55e00a6f3b7aa137c49)

 | wCOOK token contract | 0x85dec769279e1303a6c4479beb3a578397024f44 (https://bscscan.com/address/0x85dec769279e1303a6c4479beb3a578397024f44)

 | Quote token contract | 0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c (https://bscscan.com/address/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c)

 | Deployed migration AMM router | 0xbaa02841530d89bd379f80245d3047a0537ab25b (https://bscscan.com/address/0xbaa02841530d89bd379f80245d3047a0537ab25b)

 | Deployed migration AMM factory | 0xf40bef79cd4cba221646ec21bb1277bccc9aab82 (https://bscscan.com/address/0xf40bef79cd4cba221646ec21bb1277bccc9aab82)

Chain ID: 56 | Catalog status: active | Discovery source: deployment record

Creation block: 125702414 | Recorded token decimals: 18 | Quote decimals: 18

Saved verification records: factory=verified, curve=verified, token=verified

### Deployment evidence

deploy discovery factory - 0x39cc8a56d00f2f31119d7f36da182524ba0c44966491c4bafc0b53cd091a4312 ↗ (https://bscscan.com/tx/0x39cc8a56d00f2f31119d7f36da182524ba0c44966491c4bafc0b53cd091a4312)

create curve - 0xb14a6b3ed7508a3585daa0ad87dce87cd598f249be103ffc7846cb63631e06b1 ↗ (https://bscscan.com/tx/0xb14a6b3ed7508a3585daa0ad87dce87cd598f249be103ffc7846cb63631e06b1)

approve funding - 0xf07354191a3bae3dc00949317d8ccb518dab22dd2a76d5d2844fc1cbfbd40625 ↗ (https://bscscan.com/tx/0xf07354191a3bae3dc00949317d8ccb518dab22dd2a76d5d2844fc1cbfbd40625)

fund - 0x2fc8cd037978f95eb023cc5c64bc7c74319ceb3b6cd98e8dba555918430e99b4 ↗ (https://bscscan.com/tx/0x2fc8cd037978f95eb023cc5c64bc7c74319ceb3b6cd98e8dba555918430e99b4)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=bsc&input=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c&output=0x85dec769279e1303a6c4479beb3a578397024f44&pair=0x81214a8ddce2fb44d4bd39d68843d8608c6b1d56)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## BNB Chain | System curve wCOOK/WBNB

 | Contract role | Address

 | Curve / direct trade contract | 0xc65a4c710693978d5471903462863f9f11e0a05c (https://bscscan.com/address/0xc65a4c710693978d5471903462863f9f11e0a05c)

 | Discovery factory | No separate discovery factory recorded (legacy direct deployment)

 | wCOOK token contract | 0x85dec769279e1303a6c4479beb3a578397024f44 (https://bscscan.com/address/0x85dec769279e1303a6c4479beb3a578397024f44)

 | Quote token contract | 0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c (https://bscscan.com/address/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c)

 | Deployed migration AMM router | 0x10ed43c718714eb63d5aa57b78b54704e256024e (https://bscscan.com/address/0x10ed43c718714eb63d5aa57b78b54704e256024e)

 | Deployed migration AMM factory | 0xca143ce32fe78f1f7019d7d551a6402fc5350c73 (https://bscscan.com/address/0xca143ce32fe78f1f7019d7d551a6402fc5350c73)

Chain ID: 56 | Catalog status: active | Discovery source: not recorded / not confirmed

Creation block: 125660160 | Recorded token decimals: 18 | Quote decimals: 18

Saved verification records: curve=verified, token=verified

### Deployment evidence

deploy - 0xc9324ba5fe83445b74bfe9e423cb216ce88daf97c458922c3ce02d9fe2d728df ↗ (https://bscscan.com/tx/0xc9324ba5fe83445b74bfe9e423cb216ce88daf97c458922c3ce02d9fe2d728df)

approve funding - 0x0cbfd9df1a97c5354eebf65d9bdd0893868561b1a69f63b4a4ddc4e5abc0ade1 ↗ (https://bscscan.com/tx/0x0cbfd9df1a97c5354eebf65d9bdd0893868561b1a69f63b4a4ddc4e5abc0ade1)

fund - 0xad67e9bcf75454769c41d42c167d5fbabf100478860d172fb0af1f93c47c0e37 ↗ (https://bscscan.com/tx/0xad67e9bcf75454769c41d42c167d5fbabf100478860d172fb0af1f93c47c0e37)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=bsc&input=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c&output=0x85dec769279e1303a6c4479beb3a578397024f44&pair=0xc65a4c710693978d5471903462863f9f11e0a05c)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## HyperEVM | System curve wCOOK/WHYPE

 | Contract role | Address

 | Curve / direct trade contract | 0x90c66cf688d52604cc08a89484d3efd637995f2a (https://hyperevmscan.io/address/0x90c66cf688d52604cc08a89484d3efd637995f2a)

 | Discovery factory | 0x9fbfea94dcb78a0f20a09755dcd673ad5f5a2999 (https://hyperevmscan.io/address/0x9fbfea94dcb78a0f20a09755dcd673ad5f5a2999)

 | wCOOK token contract | 0x327f195c268aa3910c6b4c15360b92b924724d0a (https://hyperevmscan.io/address/0x327f195c268aa3910c6b4c15360b92b924724d0a)

 | Quote token contract | 0x5555555555555555555555555555555555555555 (https://hyperevmscan.io/address/0x5555555555555555555555555555555555555555)

 | Deployed migration AMM router | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://hyperevmscan.io/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | Deployed migration AMM factory | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://hyperevmscan.io/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

Chain ID: 999 | Catalog status: active | Discovery source: deployment record

Creation block: 47810372 | Recorded token decimals: 18 | Quote decimals: 18

Saved verification records: factory=verified, curve=verified, token=verified

### Deployment evidence

deploy discovery factory - 0xe69a87d06fec4cb94f820f89ab986577f190605c75e8b311278bd1e18f3bfa46 ↗ (https://hyperevmscan.io/tx/0xe69a87d06fec4cb94f820f89ab986577f190605c75e8b311278bd1e18f3bfa46)

create curve - 0xf369ff4ba78c88c0b913f4b402c02df002eca24858568fa3d7070924f9a34bbd ↗ (https://hyperevmscan.io/tx/0xf369ff4ba78c88c0b913f4b402c02df002eca24858568fa3d7070924f9a34bbd)

approve funding - 0x0f6335879a5836531e00c4b63f559e7f4e0c0e875d984188a6d6c3d22d7216a8 ↗ (https://hyperevmscan.io/tx/0x0f6335879a5836531e00c4b63f559e7f4e0c0e875d984188a6d6c3d22d7216a8)

fund - 0x20e2713708a6016fbc04f9de58c96aaf681b0ab7a57c2c0fa3784cd63154877d ↗ (https://hyperevmscan.io/tx/0x20e2713708a6016fbc04f9de58c96aaf681b0ab7a57c2c0fa3784cd63154877d)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=hyperevm&input=0x5555555555555555555555555555555555555555&output=0x327f195c268aa3910c6b4c15360b92b924724d0a&pair=0x90c66cf688d52604cc08a89484d3efd637995f2a)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## Optimism | System curve wCOOK/WETH

 | Contract role | Address

 | Curve / direct trade contract | 0x9e235c7a201b27eb3cdf60556b55e322ba414d09 (https://optimistic.etherscan.io/address/0x9e235c7a201b27eb3cdf60556b55e322ba414d09)

 | Discovery factory | 0x6303bfbc668ce916c7c9b40d6b67889d28a6cf4c (https://optimistic.etherscan.io/address/0x6303bfbc668ce916c7c9b40d6b67889d28a6cf4c)

 | wCOOK token contract | 0xf1df4d18da9d31cbed16a7b1ef6846f77cf69ce0 (https://optimistic.etherscan.io/address/0xf1df4d18da9d31cbed16a7b1ef6846f77cf69ce0)

 | Quote token contract | 0x4200000000000000000000000000000000000006 (https://optimistic.etherscan.io/address/0x4200000000000000000000000000000000000006)

 | Deployed migration AMM router | 0x5264f98afc705042ca049fa4a83578cde9b4e3da (https://optimistic.etherscan.io/address/0x5264f98afc705042ca049fa4a83578cde9b4e3da)

 | Deployed migration AMM factory | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://optimistic.etherscan.io/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

Chain ID: 10 | Catalog status: active | Discovery source: deployment record

Creation block: 157906511 | Recorded token decimals: 18 | Quote decimals: 18

Saved verification records: token=verified, factory=verified, curve=verified

### Deployment evidence

deploy discovery factory - 0xfaf43083798dca5f4b149df33d82c3115eb8e8e606d10a31e48b1d821c53b882 ↗ (https://optimistic.etherscan.io/tx/0xfaf43083798dca5f4b149df33d82c3115eb8e8e606d10a31e48b1d821c53b882)

create curve - 0x367443c9a4d5f4b83141fd5e6f236784dde96c09b24d851f89f8d9867cee73dc ↗ (https://optimistic.etherscan.io/tx/0x367443c9a4d5f4b83141fd5e6f236784dde96c09b24d851f89f8d9867cee73dc)

approve funding - 0x49c537b585ff597edbc84d1d448017e8ceacc03b83b4557fb648491b310e7d7c ↗ (https://optimistic.etherscan.io/tx/0x49c537b585ff597edbc84d1d448017e8ceacc03b83b4557fb648491b310e7d7c)

fund - 0x765af340c696552987fcc8bc268dbf6c812cffbe0770adfd680e3a0923b7ec54 ↗ (https://optimistic.etherscan.io/tx/0x765af340c696552987fcc8bc268dbf6c812cffbe0770adfd680e3a0923b7ec54)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=optimism&input=0x4200000000000000000000000000000000000006&output=0xf1df4d18da9d31cbed16a7b1ef6846f77cf69ce0&pair=0x9e235c7a201b27eb3cdf60556b55e322ba414d09)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## Polygon | System curve wCOOK/WPOL

 | Contract role | Address

 | Curve / direct trade contract | 0xc3a92ac008afe318d6a75a09979ccf94dc055560 (https://polygonscan.com/address/0xc3a92ac008afe318d6a75a09979ccf94dc055560)

 | Discovery factory | 0xa6e6e8099aef40d404f747519ee8adb8b82749f9 (https://polygonscan.com/address/0xa6e6e8099aef40d404f747519ee8adb8b82749f9)

 | wCOOK token contract | 0xf62df06e93340c8f632b0691f444a159d0cddcaa (https://polygonscan.com/address/0xf62df06e93340c8f632b0691f444a159d0cddcaa)

 | Quote token contract | 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270 (https://polygonscan.com/address/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270)

 | Deployed migration AMM router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://polygonscan.com/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | Deployed migration AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://polygonscan.com/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

Chain ID: 137 | Catalog status: active | Discovery source: deployment record

Creation block: 94940192 | Recorded token decimals: 18 | Quote decimals: 18

Saved verification records: factory=verified, curve=verified, token=verified

### Deployment evidence

deploy discovery factory - 0x9c7e87daaba608d2b928a6e431170d0883ee905687b7d3527a358c29f8a43d13 ↗ (https://polygonscan.com/tx/0x9c7e87daaba608d2b928a6e431170d0883ee905687b7d3527a358c29f8a43d13)

create curve - 0xcb86e1fb46e54ebbb52fb3b7ea9aa74e78545b2d7adbe68fc0db214f13136046 ↗ (https://polygonscan.com/tx/0xcb86e1fb46e54ebbb52fb3b7ea9aa74e78545b2d7adbe68fc0db214f13136046)

approve funding - 0xf0c68b6948a4088d1ae1e631fac3ee5637edab6d2475bc64ef441e4265243966 ↗ (https://polygonscan.com/tx/0xf0c68b6948a4088d1ae1e631fac3ee5637edab6d2475bc64ef441e4265243966)

fund - 0xe0b47d4eb83140e4a129d02aa07a581d6dbd8994bdebbd6fb70221569775f1ca ↗ (https://polygonscan.com/tx/0xe0b47d4eb83140e4a129d02aa07a581d6dbd8994bdebbd6fb70221569775f1ca)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=polygon&input=0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270&output=0xf62df06e93340c8f632b0691f444a159d0cddcaa&pair=0xc3a92ac008afe318d6a75a09979ccf94dc055560)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## Robinhood Chain | System curve wCOOK/WETH

 | Contract role | Address

 | Curve / direct trade contract | 0xd10c480743c01522dfaa2f63ada22598cf9ecf29 (https://robinhoodchain.blockscout.com/address/0xd10c480743c01522dfaa2f63ada22598cf9ecf29)

 | Discovery factory | No separate discovery factory recorded (legacy direct deployment)

 | wCOOK token contract | 0xbe602d85593638894bd492cac1591afe7d92919d (https://robinhoodchain.blockscout.com/address/0xbe602d85593638894bd492cac1591afe7d92919d)

 | Quote token contract | 0x0bd7d308f8e1639fab988df18a8011f41eacad73 (https://robinhoodchain.blockscout.com/address/0x0bd7d308f8e1639fab988df18a8011f41eacad73)

 | Deployed migration AMM router | 0x89e5db8b5aa49aa85ac63f691524311aeb649eba (https://robinhoodchain.blockscout.com/address/0x89e5db8b5aa49aa85ac63f691524311aeb649eba)

 | Deployed migration AMM factory | 0x8bceaa40b9acdfaedf85adf4ff01f5ad6517937f (https://robinhoodchain.blockscout.com/address/0x8bceaa40b9acdfaedf85adf4ff01f5ad6517937f)

Chain ID: 4663 | Catalog status: active | Discovery source: not recorded / not confirmed

Creation block: 79866674 | Recorded token decimals: 18 | Quote decimals: 18

Saved verification records: curve=verified, token=verified

### Deployment evidence

deploy - 0x15a711051c8ac2867b0525a5a7e8385c587edbc1b64254916c5990a43cd4454e ↗ (https://robinhoodchain.blockscout.com/tx/0x15a711051c8ac2867b0525a5a7e8385c587edbc1b64254916c5990a43cd4454e)

approve funding - 0x32d4e5f48a53a1a11a907f11ee981ffca07bdff749ef27b05c7e1bc7f8ec57c6 ↗ (https://robinhoodchain.blockscout.com/tx/0x32d4e5f48a53a1a11a907f11ee981ffca07bdff749ef27b05c7e1bc7f8ec57c6)

fund - 0x78339b70b799b92ff9db78ff68e4b2f4976be12d5a5cfc74306c50f152cbc531 ↗ (https://robinhoodchain.blockscout.com/tx/0x78339b70b799b92ff9db78ff68e4b2f4976be12d5a5cfc74306c50f152cbc531)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=robinhood&input=0x0bd7d308f8e1639fab988df18a8011f41eacad73&output=0xbe602d85593638894bd492cac1591afe7d92919d&pair=0xd10c480743c01522dfaa2f63ada22598cf9ecf29)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## Sonic | System curve wCOOK/wS

 | Contract role | Address

 | Curve / direct trade contract | 0xb82e1234a2f3f01888761bd7a53d0fe02a92514f (https://sonicscan.org/address/0xb82e1234a2f3f01888761bd7a53d0fe02a92514f)

 | Discovery factory | No separate discovery factory recorded (legacy direct deployment)

 | wCOOK token contract | 0x14f68f3753d179a8da17d85e2f54445a416e925e (https://sonicscan.org/address/0x14f68f3753d179a8da17d85e2f54445a416e925e)

 | Quote token contract | 0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38 (https://sonicscan.org/address/0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38)

 | Deployed migration AMM router | 0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa (https://sonicscan.org/address/0x1bc619b7f70d2537daeeb30d4098cc9b7e32e9aa)

 | Deployed migration AMM factory | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://sonicscan.org/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

Chain ID: 146 | Catalog status: active | Discovery source: not recorded / not confirmed

Creation block: 80336360 | Recorded token decimals: 18 | Quote decimals: 18

Saved verification records: curve=verified, token=verified

### Deployment evidence

deploy - 0x11baa0f325513c3f201f09251052e26d922efad6b6085ea0778855541d840ce0 ↗ (https://sonicscan.org/tx/0x11baa0f325513c3f201f09251052e26d922efad6b6085ea0778855541d840ce0)

approve funding - 0xc684d9d90a9e43c28ad97a98b3e22bfa693febde0829064a4ac5666bd5eaba90 ↗ (https://sonicscan.org/tx/0xc684d9d90a9e43c28ad97a98b3e22bfa693febde0829064a4ac5666bd5eaba90)

fund - 0xbb0e542e478c713be7d9b9810b5882b0242c6ba9547012ce0f99169c60e48deb ↗ (https://sonicscan.org/tx/0xbb0e542e478c713be7d9b9810b5882b0242c6ba9547012ce0f99169c60e48deb)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=sonic&input=0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38&output=0x14f68f3753d179a8da17d85e2f54445a416e925e&pair=0xb82e1234a2f3f01888761bd7a53d0fe02a92514f)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## Unichain | System curve wCOOK/WETH

 | Contract role | Address

 | Curve / direct trade contract | 0x90c66cf688d52604cc08a89484d3efd637995f2a (https://uniscan.xyz/address/0x90c66cf688d52604cc08a89484d3efd637995f2a)

 | Discovery factory | 0x9fbfea94dcb78a0f20a09755dcd673ad5f5a2999 (https://uniscan.xyz/address/0x9fbfea94dcb78a0f20a09755dcd673ad5f5a2999)

 | wCOOK token contract | 0x87c9c5dd1e8c6e64343ee7136a028a2a22b4a845 (https://uniscan.xyz/address/0x87c9c5dd1e8c6e64343ee7136a028a2a22b4a845)

 | Quote token contract | 0x4200000000000000000000000000000000000006 (https://uniscan.xyz/address/0x4200000000000000000000000000000000000006)

 | Deployed migration AMM router | 0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430 (https://uniscan.xyz/address/0x3d4e8c0e5ccc479f2ac5e499d3c5805a52273430)

 | Deployed migration AMM factory | 0x0ab828aa68499b56e9a47df9c4f1f5da703ff751 (https://uniscan.xyz/address/0x0ab828aa68499b56e9a47df9c4f1f5da703ff751)

Chain ID: 130 | Catalog status: active | Discovery source: deployment record

Creation block: 60661058 | Recorded token decimals: 18 | Quote decimals: 18

Saved verification records: token=verified, factory=verified, curve=verified

### Deployment evidence

deploy discovery factory - 0x7268a91f55a437ebfc35b97764bde32c4383fdc31588e736f11b92b63caa7630 ↗ (https://uniscan.xyz/tx/0x7268a91f55a437ebfc35b97764bde32c4383fdc31588e736f11b92b63caa7630)

create curve - 0xef8dc4fc8c9cc7bd72946b07f8477e17649c66c781db5048f5d02223947eb705 ↗ (https://uniscan.xyz/tx/0xef8dc4fc8c9cc7bd72946b07f8477e17649c66c781db5048f5d02223947eb705)

approve funding - 0x20c76e9e54a39da3b87ea3a72bd34a35d1572330ef41112be430a65653dd83ac ↗ (https://uniscan.xyz/tx/0x20c76e9e54a39da3b87ea3a72bd34a35d1572330ef41112be430a65653dd83ac)

fund - 0x0a5306e2e1f196891db4d4713d0e7650857f9d266eebc785cef96112ec7e41a4 ↗ (https://uniscan.xyz/tx/0x0a5306e2e1f196891db4d4713d0e7650857f9d266eebc785cef96112ec7e41a4)

Trade this pair on CookSwap ↗ (https://swap.cookscan.net/?chain=unichain&input=0x4200000000000000000000000000000000000006&output=0x87c9c5dd1e8c6e64343ee7136a028a2a22b4a845&pair=0x90c66cf688d52604cc08a89484d3efd637995f2a)

Published virtual-liquidity values are price-model parameters. Index real reserves / collateral separately. The catalog may contain more than one active curve for the same token pair, as on BNB Chain; each curve address is a separate market.

## Official wCOOK token contracts

Current official origin and bridged representations. The Cookchain origin is the wrapped COOK ERC-20; other listed tokens are bridged representations. The bridge vault address is not substituted for the Cookchain token.

 | Chain | Chain ID | wCOOK token contract

 | Cookchain | 20261001 | 0xf800bf07394e8290807b4ce579f4e9f99c3da869 (https://cookscan.net/explorer/address/0xf800bf07394e8290807b4ce579f4e9f99c3da869)

 | Arbitrum One | 42161 | 0xf62df06e93340c8f632b0691f444a159d0cddcaa (https://arbiscan.io/address/0xf62df06e93340c8f632b0691f444a159d0cddcaa)

 | Arc | 5042 | 0xf1df4d18da9d31cbed16a7b1ef6846f77cf69ce0 (https://explorer.arc.io/address/0xf1df4d18da9d31cbed16a7b1ef6846f77cf69ce0)

 | Avalanche C-Chain | 43114 | 0x130890d3fa866392edd99976e8f86bad9da6aff8 (https://snowtrace.io/address/0x130890d3fa866392edd99976e8f86bad9da6aff8)

 | Base | 8453 | 0xfad5552b3bc8c62d66745e69485f33b81673fd6c (https://basescan.org/address/0xfad5552b3bc8c62d66745e69485f33b81673fd6c)

 | Blast | 81457 | 0xfad5552b3bc8c62d66745e69485f33b81673fd6c (https://blastscan.io/address/0xfad5552b3bc8c62d66745e69485f33b81673fd6c)

 | BNB Smart Chain | 56 | 0x85dec769279e1303a6c4479beb3a578397024f44 (https://bscscan.com/address/0x85dec769279e1303a6c4479beb3a578397024f44)

 | Fantom Opera | 250 | 0xa2b11f59be5b81970b21a76b657b60708c0dc905 (https://explorer.fantom.network/address/0xa2b11f59be5b81970b21a76b657b60708c0dc905)

 | HyperEVM | 999 | 0x327f195c268aa3910c6b4c15360b92b924724d0a (https://hyperevmscan.io/address/0x327f195c268aa3910c6b4c15360b92b924724d0a)

 | Linea | 59144 | 0x3cd633981b01a8341f59a015b3d5f00ee25af53d (https://lineascan.build/address/0x3cd633981b01a8341f59a015b3d5f00ee25af53d)

 | Monad | 143 | 0x56df9df1c148e5a146640965a0fd372c40faf2ad (https://monadscan.com/address/0x56df9df1c148e5a146640965a0fd372c40faf2ad)

 | Optimism | 10 | 0xf1df4d18da9d31cbed16a7b1ef6846f77cf69ce0 (https://optimistic.etherscan.io/address/0xf1df4d18da9d31cbed16a7b1ef6846f77cf69ce0)

 | Polygon PoS | 137 | 0xf62df06e93340c8f632b0691f444a159d0cddcaa (https://polygonscan.com/address/0xf62df06e93340c8f632b0691f444a159d0cddcaa)

 | Robinhood | 4663 | 0xbe602d85593638894bd492cac1591afe7d92919d (https://robinhoodchain.blockscout.com/address/0xbe602d85593638894bd492cac1591afe7d92919d)

 | Sonic | 146 | 0x14f68f3753d179a8da17d85e2f54445a416e925e (https://sonicscan.org/address/0x14f68f3753d179a8da17d85e2f54445a416e925e)

 | Unichain | 130 | 0x87c9c5dd1e8c6e64343ee7136a028a2a22b4a845 (https://uniscan.xyz/address/0x87c9c5dd1e8c6e64343ee7136a028a2a22b4a845)

Live official contract directory ↗ (https://cookscan.net/api/read/official-wcook-contracts)

## Indexer guidance: AMMs and bonding curves

### Normal AMM pools

For V2, discover pairs via the AMM factory and PairCreated logs. Track token0/token1, reserves, Swap/Sync/Mint/Burn events and LP supply. For V3, discover pools via PoolCreated and fee tiers. Track Initialize, Mint, Burn, Swap and Collect logs; maintain slot0, ticks and active liquidity. Position-manager NFTs describe V3 liquidity positions.

### Curve discovery and trading

Curve discovery exposes a separate factory / PairCreated surface. EasyLaunch also emits LaunchCreated. Curve trades must be interpreted against the deployed revision ABI. A V3-target EasyLaunch can expose V2-style discovery and Swap/Sync events before migration; this does not make it a normal V2 AMM.

System curve implementations expose Trade and, in relevant revisions, V2-style Swap/Sync events. Use the exact deployed ABI to avoid counting both Trade and Swap as separate trades. Legacy system getReserves() may include virtual pricing reserves. Read realReserve or actual token balances for real backing; respect reserveMode/isVirtualLiquidity where present. Current indexed V3 launch sources distinguish real getReserves() from getVirtualReserves().

### Migration

Capture Graduated / migration events and the resulting AMM pair or V3 pool. End the pre-migration curve market and start its AMM successor without duplicating volume. A pool exists only after its actual creation event/receipt; a launch fee selection alone is not evidence of a live V3 pool.

### Historical start blocks

Use deployment receipts and their block numbers as the indexing start. System creation blocks are included when recorded. Normal AMM and EasyLaunch start blocks are not consistently retained in the exported current configuration; resolve them from explorer contract creation / receipts before choosing a backfill start. Missing fields are not assigned block zero as an asserted deployment block.

## Listing submission notes and references

GeckoTerminal provides a dedicated EVM Chain/DEX listing route and factory/router update form. A standard fork submission uses its factory/router addresses; custom bonding curves can require a separate adapter and partner review. Submit AMM and curve families with the explicit reserve semantics in this package.

GeckoTerminal EVM Chain/DEX integration guide ↗ (https://support.coingecko.com/hc/en-us/articles/22611672824473-How-do-I-get-my-EVM-Chain-DEX-listed-on-GeckoTerminal)

GeckoTerminal request form ↗ (https://about.geckoterminal.com/dex-chain-listing)

GeckoTerminal custom integration guidance ↗ (https://support.coingecko.com/hc/en-us/articles/41889080628889-How-to-integrate-Non-EVM-Chain-DEX-on-GeckoTerminal)

DEX Screener documents automatic token listing once a pool exists and has at least one transaction on a supported DEX. This does not independently add support for a new DEX or custom curve protocol. DEXTools likewise distinguishes discovery on supported DEXs from a new integration. The package does not certify admission by either service.

DEX Screener token listing ↗ (https://docs.dexscreener.com/token-listing)

DEXTools token discovery guidance ↗ (https://info.dextools.io/faq/how-can-i-list-my-token-on-dextools/)

DEXTools integration SDK / HTTP adapter ↗ (https://github.com/dextools-io/integration-sdk/blob/main/http-adapter/README.md)

### Additional submission fields

Provide the operator contact, official logo assets, complete deployed ABIs / verified source links, factory creation blocks and receipts, supported fee tiers, example funded markets and swap transactions, ownership/proxy controls, finality policy and RPC log-range limits. No contact address, audit certificate or indexer SLA is invented in this document.

## API quick reference | DEX statistics

Public read-only JSON endpoint. No API key or wallet session is required by this route. It covers indexed CookDEX markets across chains, not only transactions executed through the CookSwap website. The endpoint has a 60-second application cache and HTTP Cache-Control: public, max-age=60, stale-while-revalidate=300.

GET https://cookdex.net/api/public/dex-statistics ↗ (https://cookdex.net/api/public/dex-statistics)

curl -fsS "https://cookdex.net/api/public/dex-statistics"

curl -fsS "https://cookdex.net/api/public/dex-statistics" | jq .totals

 | Response field | Meaning

 | updatedAt | ISO timestamp of the response snapshot

 | scope | Indexed DEX market scope

 | totals | pools, volume24h (USD), swaps24h, liquidityUsd, curveRealUsd, volumeCoverage, swapCoverage

 | chains[] | Per-chain aggregate values; chain is the network key

 | pools[] | address, chain, protocol, token, volume24h, swaps24h, liquidityUsd and curveRealUsd

 | daily[] / history[] | Recent daily series and per-chain date summaries; inspect pricedSwaps when present

 | databaseStatus / source | Data origin and MySQL/fallback availability

 | historyCoverage | Human-readable historical coverage limitation

 | indexer | Pool cursors/historyComplete and factory discoveryComplete; errors may be reported

### Coverage rules

Missing values may be null. Aggregate numeric values alone do not prove complete coverage. Check volumeCoverage and swapCoverage against pools, databaseStatus, historyCoverage and indexer progress. Zero volume is not proof of complete historical indexing. Virtual reserves are excluded from normal pool liquidity; real curve collateral is reported separately.

### Example snapshot - not a promised live value

Sampled 2026-10-08T07:53:39.058Z

{
  "totals": {
    "pools": 21,
    "volume24h": 2653263.25707415,
    "swaps24h": 9967,
    "liquidityUsd": 2314494.2650499265,
    "curveRealUsd": 15.990607169113094,
    "volumeCoverage": 21,
    "swapCoverage": 21
  },
  "databaseStatus": "unavailable"
}

## API quick reference | Pools and trade history

GET https://cookdex.net/api/pools/catalog ↗ (https://cookdex.net/api/pools/catalog)

Response: {success: true, items: [...]}. Fields include chain, protocolVersion, pairAddress, tokenA/tokenB, dexName and isBondingCurve. Curves also expose launchProgress where available. Filter on chain and pairAddress; this endpoint is not a full history feed.

curl -fsS "https://cookdex.net/api/pools/catalog"

### Per-token recent trades

GET /api/public/token/{chain}/{contract}/trades?pair={pool}

The pair parameter selects a specific market for that token. Successful payloads include success, pairAddress and trade fields from the selected market provider. Token or pool lookup may return HTTP 404. Curve markets are served through the current launch/curve market path where available.

### Stored trade history

GET /api/public/token/{chain}/{contract}/trades/history

Optional query: pair, before, beforeId, limit

before and beforeId pass through to stored-history pagination. Treat returned pagination values as opaque; do not invent a cursor from a transaction hash. Payload details can differ for AMM history and curve markets; check the selected response before continuing pagination.

Example: Cookchain wCOOK/USDC curve trade history ↗ (https://cookdex.net/api/public/token/cookchain/0xf800bf07394e8290807b4ce579f4e9f99c3da869/trades/history?pair=0xec3adb83b157629fa0f3c166d34171293ede505a&limit=50)

### EasyLaunch discovery

GET /api/public/meme-easy-launch?chain={chain}&page=1

Response includes success, items and pagination fields when available. Follow page/pages instead of requesting all chains repeatedly. Launch state and migration data remain per-launch; a completed launch belongs to its AMM successor market.

### Client operation

Poll statistics no more frequently than its 60-second cache interval. Cache the pool catalog; fetch history only for the selected market. Check HTTP status and Content-Type before JSON parsing. Back off on HTTP 429 or temporary 5xx responses; do not interpret a failed request as zero trading activity. Public data is not a transaction-signing interface and does not provide database write access.

## Source snapshot and revision notes

Configuration and catalogs were collected on 08 October 2026. Current AMM addresses come from the CookDEX chains() configuration; current EasyLaunch factory slots come from data/meme_easy_launch/config.json. System market membership comes from the public pool catalog and deployed system-curve setup records. The official token list is taken from the canonical bridge-route directory.

Public JSON sources: CookDEX pool catalog, EasyLaunch discovery and DEX statistics; CookSwap network metadata; Cookscan official wCOOK directory. RPC factory checks succeeded on eight networks in this run. Other networks returned unavailable/blocked requests; their listed addresses remain configuration-sourced, not freshly RPC-certified.

Saved verification status is included where relevant but may lag explorer state. Deployed bytecode, all token permissions, each factory fee-tier enablement and every liquidity pool were not independently audited. This revision replaces the former current-address directory; old router/factory history is not included.

### USDC / native reward revision

USDC is retained as the stable asset. Cookchain native rewards are reported as 0.001 COOK per block, supported by the sampled explorer block record and the available reward configuration. Other network reward schedules are not claimed by CookDEX. The API section reflects the currently installed public read routes.

CookDEX pool catalog ↗ (https://cookdex.net/api/pools/catalog)

CookDEX statistics ↗ (https://cookdex.net/api/public/dex-statistics)

CookSwap networks ↗ (https://swap.cookscan.net/api/networks)

Official wCOOK directory ↗ (https://cookscan.net/api/read/official-wcook-contracts)

## Bridge | Cross-chain transfers

CookSwap connects supported chains through approved token routes. wCOOK is the wrapped COOK origin token on Cookchain; its official representations on other chains reference the same canonical asset. A transfer must use the correct source token, destination representation and activated route.

### How a transfer works

 | Step | What happens

 | Select | Choose the source chain, destination chain and an available token in the Bridge interface.

 | Quote | Review the amount, destination token, recipient, quoted bridge fee and source-chain gas.

 | Approve | For ERC-20 tokens, confirm the required spending allowance if it is missing.

 | Send | Confirm the source-chain transaction in your wallet. Keep its transaction hash.

 | Deliver | The destination processes the bridge message after the required source confirmation and relay. Track delivery rather than treating a source receipt as a completed destination transfer.

### Token identity and backing

The canonical token identity distinguishes assets with the same symbol. The route registry associates an origin token with its chain-specific representations and routers. An origin collateral route locks backing in its vault; a representation route mints or burns according to its deployed router implementation. Transfer direction and collateral handling must follow that implementation. Token symbols alone never prove that two contracts are the same bridged asset.

The intended wCOOK model uses one official representation per chain. Existing approved contracts and routes should be reused. A missing token representation or direct connection requires deployment, enrollment, verification and activation before it becomes an available public route. Do not assume every possible chain-to-chain combination is active.

### Native assets and wrapping

Bridge routes identify token contracts. Native-to-wrapped conversion and a cross-chain transfer are separate operations. For example, HYPE / WHYPE conversion does not itself activate a WHYPE bridge route. Use the available token and exact destination contract shown by the Bridge interface.

### Infrastructure and activation

The deployed bridge infrastructure includes a mailbox, merkle-tree hook and interchain security module (ISM), alongside token routers and route helpers. Router enrollment identifies the authorized remote router. Source verification, security-module / signer configuration and relayer readiness must agree before an administrator enables a public route. Deployment or a successful enrollment transaction alone is not evidence that public transfers are activated.

### Fees and gas funding

The transfer quote is the source of the applicable bridge fee. Wallet network gas is separate. Source and destination native assets may differ. Administrative bridge gas funds support configured delivery operations and can be inspected or refilled in the Bridge gas-funds panel. A funded treasury does not guarantee a fixed delivery time or zero fees.

### Recovery and status

If a transfer or deployment is interrupted, retain the transaction hash and inspect its receipt before retrying. Confirmed steps must not be blindly repeated. Use saved workflows and the existing-hash recovery controls in the relevant administration panel. A failed RPC lookup, pending source transaction and failed destination delivery are distinct states.

Open Bridge ↗ (https://swap.cookscan.net/bridge.html)

Public bridge route registry ↗ (https://swap.cookscan.net/api/bridge-assets/bridge-route-registry.json)

Public bridge status ↗ (https://swap.cookscan.net/api/bridge-assets/bridge-status.json)

Official wCOOK contract directory ↗ (https://cookscan.net/api/read/official-wcook-contracts)

### Registry snapshot · 08 October 2026

Configured infrastructure is listed below as registry data. It is not a guarantee that every token route between these chains is enabled. Check available routes and the current quote in Bridge before transferring.

 | Chain | Chain ID

 | Base | 8453

 | Cookchain | 20261001

 | BNB Chain | 56

 | Arc | 5042

 | Robinhood Chain | 4663

 | Sonic | 146

 | Blast | 81457

 | Fantom Opera | 250

 | Arbitrum | 42161

 | Avalanche | 43114

 | Polygon | 137

 | Monad | 143

 | Linea | 59144

 | HyperEVM | 999

 | Unichain | 130

 | Optimism | 10
