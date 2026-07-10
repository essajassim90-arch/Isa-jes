# NAMA Protocol

## Decentralized Ecosystem for Global Food Security & Sustainable Supply Chains

[![VeChainThor](https://img.shields.io/badge/Blockchain-VeChainThor-blue)](https://vechain.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev)
[![Status: Phase 1 MVP Demo](https://img.shields.io/badge/Status-Phase%201%20MVP%20Demo-orange)](#)

NAMA is an open-source, blockchain-powered ecosystem that transforms global food supply chains through transparency, sustainability, and automation. Built on the **VeChainThor blockchain**, NAMA integrates Artificial Intelligence (AI), Internet of Things (IoT), and Digital Product Passports (DPP) to create a verifiable, traceable, and circular food economy.

---

## Vision

To establish a transparent, sustainable, and decentralized infrastructure for food production, procurement, logistics, and waste management — accessible to every stakeholder worldwide, from smallholder farmers to multinational enterprises.

---

## Problem Statement

The global food supply chain faces four critical challenges:

| Challenge | Impact |
|-----------|--------|
| **Trust & Transparency Deficit** | Counterfeit products, opaque logistics, untraceable origins |
| **Procurement Inefficiencies** | Centralized monopolies, high barriers for SMEs, inflated costs |
| **ESG & Regulatory Pressure** | Rising compliance demands (e.g., EU CSRD), Scope-3 emission reporting |
| **Systemic Food Waste** | 1.3 billion tons wasted annually, no structured secondary market |

---

## Solution: The NAMA Technology Triad

```
┌─────────────────────────────────────────────────────┐
│                    NAMA ECOSYSTEM                     │
│                                                       │
│  ┌────────────┐   ┌────────────┐   ┌──────────────┐  │
│  │  IoT Layer │──▶│  AI Layer  │──▶│  Blockchain  │  │
│  │            │   │            │   │    Layer      │  │
│  │ • RFID/NFC │   │ • Analytics│   │ • VeChainThor │  │
│  │ • Sensors  │   │ • Forecast │   │ • Smart Ctrs  │  │
│  │ • Location │   │ • Waste-AI │   │ • DPP Minting │  │
│  └────────────┘   └────────────┘   └──────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Core Ecosystem Components

### 1. Digital Product Passport (DPP)
Each product batch receives a cryptographic on-chain identity containing origin data, certifications, transit history, and sustainability metrics — readable via QR code scan.

### 2. Smart Procurement Marketplace
A decentralized B2B marketplace connecting producers directly with institutional buyers (hotels, restaurants, hospitals, distributors) using smart-contract-powered settlement.

### 3. Circular Economy Engine
AI-driven waste triage routes non-consumable goods to verified secondary buyers (animal feed, compost, bioenergy), with on-chain certificates contributing to enterprise ESG scores.

### 4. ESG & Sustainability Intelligence Dashboard
Real-time carbon footprint tracking, predictive risk analytics, and audit-ready compliance reports aligned with global sustainability standards.

---

## Repository Structure

```
Isa-jes/
├── apps/
│   ├── web/                  ← React + Vite frontend (main demo dashboard)
│   └── api/                  ← Node.js + TypeScript REST API gateway
├── packages/
│   ├── contracts/            ← VeChainThor Solidity contracts (Hardhat)
│   ├── iot-simulation/       ← Sensor data simulator (Node.js + TypeScript)
│   └── shared/               ← Shared TypeScript types
├── docs/                     ← Architecture diagrams, guides, API specs
├── .github/workflows/        ← CI/CD pipelines (deploy to GitHub Pages)
├── .env.example              ← Environment variable template
└── README.md                 ← This file
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | VeChainThor (Testnet — Phase 1) |
| Smart Contracts | Solidity + Hardhat + VeChain SDK |
| Frontend | React 18 + TypeScript + Vite 7 |
| Wallet Integration | VeChain Kit + Reown AppKit |
| Backend API | Node.js + TypeScript + Express |
| IoT Simulation | Node.js + TypeScript |
| Linting | oxlint |
| Testing | Hardhat (contracts) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- A VeChain-compatible wallet (VeWorld recommended)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/essajassim90-arch/Isa-jes.git
cd Isa-jes

# Install all workspace dependencies
npm ci

# Start the frontend in development mode
npm run dev

# (Optional) Start the API in a separate terminal
cd apps/api
node --import tsx/esm src/index.ts
```

### Running validation

```bash
npm run lint                                     # Lint frontend
npm run type-check                               # Type-check frontend
VITE_WC_PROJECT_ID=dummy npm run build           # Production build
npm run compile --workspace=@nama/contracts      # Compile Solidity contracts
npm run test --workspace=@nama/contracts         # Run contract tests
npm run build --workspace=@nama/iot-simulation   # Build IoT simulator
```

---

## Demo Mode (GitHub Pages)

The live GitHub Pages demo at `https://essajassim90-arch.github.io/Isa-jes/` runs entirely in the browser with **no backend**. When no `VITE_API_URL` environment variable is set in a production build, the app automatically enters **demo mode**:

- All API hooks return local seeded data for batch `demo-batch-001`.
- No network requests are made to any backend.
- All IoT readings, DPP data, marketplace listings, and ESG metrics are pre-loaded from `apps/web/src/lib/demoData.ts`.

To run against the live API locally, start the API server and set `VITE_API_URL` in your `.env.local`:

```bash
VITE_API_URL=http://localhost:3001
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_WC_PROJECT_ID` | **Required for build** | WalletConnect Project ID. Get one at [cloud.walletconnect.com](https://cloud.walletconnect.com). |
| `VITE_API_URL` | Optional | Base URL of the NAMA API (e.g. `http://localhost:3001`). If omitted in a production build, the app enters demo mode with local seeded data. |
| `JWT_SECRET` | Required for API | Secret key for JWT authentication in `apps/api`. Must be set via environment in non-development environments. |

---

## Privacy & Data Handling

- **No personal data is required** to run or view this demo.
- IoT readings are **fully simulated** — no real sensor hardware is involved.
- Coordinates shown are **mock shipment waypoints**, not real device or user locations.
- **No phone data, photos, audio, email, private keys, or seed phrases** are collected, processed, or stored.
- The demo does not require wallet connection to browse DPP, marketplace, or ESG data.
- Wallet connection (optional, via VeChain Kit) is used solely to display your on-chain testnet balances.

---

## Roadmap Summary

| Phase | Primary Objective |
|-------|-------------------|
| **Phase 1 (current)** | MVP Demo — DPP contracts, IoT simulation, UI demo on VeChainThor Testnet |
| Phase 2 | MVP & Closed Pilot — live B2B transactions, waste tracking |
| Phase 3 | AI Analytics & Ecosystem Expansion — ESG intelligence, ERP APIs |
| Phase 4 | Mainnet & Global Scaling — cross-border trade interoperability |

Full roadmap: [ROADMAP.md](ROADMAP.md)

---

## Why VeChainThor?

- **Enterprise-grade performance** with high throughput and predictable gas fees
- **Dual-token model (VET/VTHO)** separates value storage from transaction costs
- **Proven sustainability ecosystem** — carbon-neutral blockchain operations
- **Strong enterprise adoption** history in supply chain and traceability
- **VeChain Kit** provides ready-made wallet and social login components

---

## Contributing

We welcome contributions from developers, researchers, sustainability professionals, and supply chain experts worldwide.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Security

For responsible disclosure of vulnerabilities, see [SECURITY.md](SECURITY.md).

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Whitepaper

For the full technical and commercial deep-dive, read the [NAMA Whitepaper](WHITEPAPER.md).

---

## Documentation

| Document | Description |
|----------|-------------|
| [WHITEPAPER.md](WHITEPAPER.md) | Full technical and commercial deep-dive |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture and module breakdown |
| [ROADMAP.md](ROADMAP.md) | Phased development roadmap |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Brand system, design tokens, CSS variables, component specs |
| [docs/UI_ARCHITECTURE.md](docs/UI_ARCHITECTURE.md) | UI/UX architecture, page structure, user journeys |
| [docs/COMPONENT_ARCHITECTURE.md](docs/COMPONENT_ARCHITECTURE.md) | React component hierarchy and TypeScript models |
| [docs/IMPLEMENTATION_GUIDE.md](docs/IMPLEMENTATION_GUIDE.md) | Frontend, API, and smart contract implementation guide |
| [docs/ECOSYSTEM_ASSESSMENT.md](docs/ECOSYSTEM_ASSESSMENT.md) | VeChain alignment, grant readiness, MVP strategy |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [SECURITY.md](SECURITY.md) | Security policy and responsible disclosure |

---

## About the Founder

NAMA was conceived and architected by **Isa Jassim Ali**, Founder & Lead Architect of the NAMA Protocol.

Isa Jassim Ali is the creator of NAMA's vision for global trust infrastructure for sustainable food systems — bringing together digital product passports, IoT traceability, ESG intelligence, circular economy tracking, and enterprise supply-chain transparency on VeChainThor.

| | |
|---|---|
| **Founder** | Isa Jassim Ali |
| **Role** | Founder & Lead Architect |
| **Project** | NAMA |
| **GitHub** | [essajassim90-arch](https://github.com/essajassim90-arch) |
| **VeWorld Wallet** | [TO BE PROVIDED LATER] |

---

## Contact

NAMA is an open-source VeChain ecosystem project. Open an [Issue](../../issues) or start a [Discussion](../../discussions) to connect with the team.

---

## Attribution

```
Founder:      Isa Jassim Ali
Role:         Founder & Lead Architect
Project:      NAMA
Description:  NAMA is a global trust infrastructure for sustainable food systems built
              around digital product passports, food traceability, ESG intelligence,
              circular economy tracking, and enterprise supply-chain transparency.
GitHub:       https://github.com/essajassim90-arch
VeWorld:      [TO BE PROVIDED LATER]
```



