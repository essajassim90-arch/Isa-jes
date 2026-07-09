# Isa-Jes — VeChain dApp

A **VeChain Kit** powered dApp with social login, smart account integration, and deployment support for both Mainnet and Testnet.

## Smart Account Addresses

| Network  | Address                                      | Status       |
|----------|----------------------------------------------|--------------|
| Mainnet  | `0x1604a6EF0B1Cc40bFcC5d2205DEDb264bf8862FE` | Deploy via UI |
| Testnet  | `0xf51085090F8294b6158082dbDBB42A4484a55ba6` | Deploy via UI |

## Features

- **Social Login** — Google, email, passkey via Privy
- **Wallet Connect** — VeWorld, Sync2, WalletConnect
- **Smart Account Deployment** — Deploy and monitor your smart accounts on Mainnet & Testnet
- **Live Balance** — View VET & VTHO balances after connecting
- **Explorer Links** — Direct links to VeChain block explorer for each address

## Getting Started

```bash
npm install --legacy-peer-deps
npm run dev
```

## Environment Variables

Create a `.env.local` file (optional — defaults work for Testnet without social login):

```env
VITE_WC_PROJECT_ID=your_walletconnect_project_id
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_PRIVY_CLIENT_ID=your_privy_client_id
```

## Deploy

Pushes to `main` automatically deploy to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.

Add the env vars above as GitHub repository secrets (`Settings → Secrets → Actions`).

## Built With

- [VeChain Kit](https://vechainkit.vechain.org/) — wallet, social login, smart accounts
- [Vite](https://vite.dev/) + React + TypeScript
