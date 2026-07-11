# Deployment Guide — packages/contracts

## Overview

Contracts are deployed via [Hardhat Ignition](https://hardhat.org/ignition) to the **VeChainThor Testnet**.  
Do **NOT** deploy to mainnet.

Two independent Ignition modules are provided:

| Module | File | Contract |
|--------|------|----------|
| `DPP` | `ignition/modules/DPP.ts` | `contracts/DPP.sol` |
| `Marketplace` | `ignition/modules/Marketplace.ts` | `contracts/Marketplace.sol` |

---

## Environment Variables

Copy `.env.example` in the repository root to `.env` and fill in the deployment values.

| Variable | Required | Description |
|----------|----------|-------------|
| `DEPLOYER_PRIVATE_KEY` | **Yes** | Hex private key of the deployer account (preferred) |
| `VECHAIN_TESTNET_PRIVATE_KEY` | Fallback | Alias for `DEPLOYER_PRIVATE_KEY` |
| `VECHAIN_TESTNET_RPC_URL` | No | Override the RPC endpoint (default: `https://testnet.vechain.org`) |

> ⚠️ Never commit a real private key. Use a dedicated testnet wallet with no mainnet funds.

---

## Deployment Commands

All commands must be run from `packages/contracts/`.

### Compile

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

### Type-check (includes Ignition modules)

```bash
npm run type-check
```

### Validate Ignition modules (compile + type-check)

```bash
npm run ignition:validate
```

### Deploy — DPP contract

```bash
npx hardhat ignition deploy ignition/modules/DPP.ts --network vechain_testnet
```

### Deploy — Marketplace contract

```bash
npx hardhat ignition deploy ignition/modules/Marketplace.ts --network vechain_testnet
```

### Dry-run (no broadcast, validation only)

```bash
npx hardhat ignition deploy ignition/modules/DPP.ts --network vechain_testnet --dry-run
npx hardhat ignition deploy ignition/modules/Marketplace.ts --network vechain_testnet --dry-run
```

---

## Post-Deployment

After a successful deployment, Ignition writes the deployed contract addresses to:

```
ignition/deployments/<deployment-id>/deployed_addresses.json
```

Copy those addresses into the repository root `.env` (or your CI secrets):

```
VITE_CONTRACT_DPP=<deployed DPP address>
VITE_CONTRACT_MARKETPLACE=<deployed Marketplace address>
```

The indexer (`apps/indexer`) also requires these addresses:

```
THOR_DPP_ADDRESS=<deployed DPP address>
THOR_MARKETPLACE_ADDRESS=<deployed Marketplace address>
```

---

## Network Configuration

The `vechain_testnet` network is defined in `hardhat.config.ts`:

```
RPC URL : VECHAIN_TESTNET_RPC_URL  (default: https://testnet.vechain.org)
Accounts: DEPLOYER_PRIVATE_KEY  (or VECHAIN_TESTNET_PRIVATE_KEY)
Chain ID: 39 (VeChainThor Testnet)
```

---

## Remaining Blockers for Testnet Deployment

- [ ] Obtain a funded testnet deployer wallet
- [ ] Set `DEPLOYER_PRIVATE_KEY` in CI secrets
- [ ] Run `npx hardhat ignition deploy` for both modules
- [ ] Record deployed addresses in `.env` / CI secrets
- [ ] Update `ThorEventConnector` with live contract addresses
