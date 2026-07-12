# Legacy: Isa-Jes Smart Account Demo

This directory archives the original Isa-Jes VeChain dApp, which was a standalone
smart account deployment demo built before NAMA Protocol was established.

**Archived from:** repository root (`src/`, `index.html`, `vite.config.ts`, `tsconfig.*.json`)  
**Archived:** 2026-07-10  
**Reason:** Repository refocused on NAMA Protocol (`apps/web/` is the active application)

## What This Contains

- `App.tsx` — Smart account deployment dashboard (Mainnet & Testnet)
- `main.tsx` — Entry point with VeChain Kit + Reown AppKit providers
- `AppKitProvider.tsx` — Wagmi/AppKit EVM provider wrapper
- `appkit-config.ts` — Reown AppKit configuration (ETH, Arbitrum, Polygon)
- `index.html` — HTML entry point
- `vite.config.ts` / `tsconfig*.json` — Build configuration

## Why Preserved

The smart account deployment patterns and VeChain Kit + Reown AppKit integration
in this demo may be referenced when implementing smart account features in the
NAMA Protocol application.

## Active Application

The active NAMA Protocol application is in `../../apps/web/`.
