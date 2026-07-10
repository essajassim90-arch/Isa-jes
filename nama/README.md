# NAMA Protocol

## Decentralized Ecosystem for Global Food Security & Sustainable Supply Chains

[![VeChainThor](https://img.shields.io/badge/Blockchain-VeChainThor-blue)](https://vechain.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev)
[![Status: Demo](https://img.shields.io/badge/Status-VeChain%20Ecosystem%20Demo-orange)](#)

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
nama/
├── smart-contracts/          ← VeChainThor Solidity contracts (Hardhat)
├── api/                      ← Node.js + TypeScript REST API gateway
├── dashboard/                ← React + Vite main enterprise dashboard
├── marketplace/              ← B2B procurement frontend
├── iot-simulation/           ← Sensor data simulator (Node.js)
├── ai-esg-dashboard/         ← AI-assisted ESG analytics (React + Vite)
├── product-passport/         ← DPP viewer and minting UI
├── circular-economy/         ← Waste-to-wealth management UI
├── docs/                     ← Architecture diagrams, guides, API specs
└── .github/workflows/        ← CI/CD pipelines
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | VeChainThor (Testnet → Mainnet) |
| Smart Contracts | Solidity + Hardhat + VeChain SDK |
| Frontend | React 18 + TypeScript + Vite |
| Wallet Integration | VeChain Kit + Reown AppKit |
| Backend API | Node.js + TypeScript + Express |
| IoT Simulation | Node.js + MQTT |
| AI / Analytics | TypeScript ML utilities + Chart.js |
| State Management | Zustand + TanStack Query |
| Linting | oxlint |
| Testing | Vitest + React Testing Library |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- A VeChain-compatible wallet (VeWorld recommended)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/<your-org>/nama-protocol.git
cd nama-protocol

# Install workspace dependencies
npm install --legacy-peer-deps

# Start the main dashboard (development)
cd dashboard
npm install --legacy-peer-deps
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in required values:

```bash
cp .env.example .env.local
```

See [`.env.example`](../.env.example) for all required variables.

---

## Roadmap Summary

| Phase | Timeline | Primary Objective |
|-------|----------|-------------------|
| Phase 1 | Months 1–3 | Proof of Concept — DPP contracts, IoT simulation, UI prototype |
| Phase 2 | Months 4–6 | MVP & Closed Pilot — live B2B transactions, waste tracking |
| Phase 3 | Months 7–9 | AI Analytics & Ecosystem Expansion — ESG intelligence, ERP APIs |
| Phase 4 | Months 10–12+ | Mainnet & Global Scaling — cross-border trade interoperability |

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
