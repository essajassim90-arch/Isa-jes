# NAMA Protocol — Architecture

## System Architecture Overview

**Version:** 1.0  
**Blockchain:** VeChainThor (Testnet / Mainnet)  
**Frontend:** React 18 + TypeScript + Vite  
**Backend:** Node.js + TypeScript  
**Contracts:** Solidity + Hardhat (VeChainThor-compatible)

---

## High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          NAMA PROTOCOL                                  │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  ┌─────────────┐  │
│  │  dashboard/  │  │ marketplace/ │  │ product-   │  │ ai-esg-     │  │
│  │  (React)     │  │  (React)     │  │ passport/  │  │ dashboard/  │  │
│  │              │  │              │  │  (React)   │  │  (React)    │  │
│  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  └──────┬──────┘  │
│         │                 │                 │                 │         │
│         └─────────────────┴─────────────────┴────────────────┘         │
│                                    │                                     │
│                           ┌────────▼────────┐                           │
│                           │    api/         │                           │
│                           │  (Node.js API   │                           │
│                           │   Gateway)      │                           │
│                           └────────┬────────┘                           │
│                                    │                                     │
│              ┌─────────────────────┼─────────────────────┐              │
│              │                     │                     │              │
│    ┌─────────▼──────┐   ┌──────────▼──────┐   ┌─────────▼──────┐       │
│    │ smart-         │   │  iot-           │   │  circular-     │       │
│    │ contracts/     │   │  simulation/    │   │  economy/      │       │
│    │ (Solidity)     │   │  (Node.js)      │   │  (React)       │       │
│    └─────────┬──────┘   └──────────┬──────┘   └────────────────┘       │
│              │                     │                                     │
│              └──────────┬──────────┘                                    │
│                         │                                                │
│               ┌──────────▼──────────┐                                   │
│               │   VeChainThor       │                                   │
│               │   Blockchain        │                                   │
│               │   (Testnet/Mainnet) │                                   │
│               └─────────────────────┘                                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Module Descriptions

### `smart-contracts/`
**Technology:** Solidity + Hardhat + VeChain SDK  
**Purpose:** Core on-chain logic

| Contract | Responsibility |
|----------|---------------|
| `DPP.sol` | Mint, update, and query Digital Product Passports |
| `Marketplace.sol` | Create listings, submit offers, execute smart procurement orders |
| `CircularEconomy.sol` | Register surplus/waste, route to secondary buyers, issue diversion records |
| `ESGCertification.sol` | Issue and verify on-chain ESG sustainability certificates |

**Directory structure:**
```
smart-contracts/
├── contracts/
│   ├── DPP.sol
│   ├── Marketplace.sol
│   ├── CircularEconomy.sol
│   ├── ESGCertification.sol
│   └── interfaces/
│       ├── IDPP.sol
│       ├── IMarketplace.sol
│       └── IESGCertification.sol
├── scripts/
│   ├── deploy-testnet.ts
│   └── deploy-mainnet.ts
├── test/
│   ├── DPP.test.ts
│   ├── Marketplace.test.ts
│   └── CircularEconomy.test.ts
└── hardhat.config.ts
```

---

### `api/`
**Technology:** Node.js + Express + TypeScript  
**Purpose:** REST API gateway between frontends and the blockchain / IoT layer

**Key routes:**

| Route | Description |
|-------|-------------|
| `GET /dpp/:batchId` | Fetch a Digital Product Passport by batch ID |
| `POST /dpp/mint` | Mint a new DPP on-chain |
| `POST /dpp/:batchId/event` | Record a transit or quality event |
| `GET /marketplace/listings` | List active procurement listings |
| `POST /marketplace/order` | Submit a purchase order |
| `GET /esg/report/:orgId` | Generate ESG compliance report |
| `POST /iot/reading` | Ingest IoT sensor reading |
| `GET /circular/waste` | Query registered surplus/waste items |

**Directory structure:**
```
api/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   │   ├── vechain.service.ts    ← VeChainThor SDK wrapper
│   │   ├── dpp.service.ts
│   │   └── esg.service.ts
│   ├── middleware/
│   └── index.ts
└── package.json
```

---

### `dashboard/`
**Technology:** React 18 + TypeScript + Vite + VeChain Kit  
**Purpose:** Main enterprise dApp — wallet connection, DPP overview, ESG summary

**Key pages:**

| Page | Description |
|------|-------------|
| `/` | Landing page + wallet connect |
| `/passport` | DPP search and lifecycle viewer |
| `/marketplace` | Browse and transact on procurement listings |
| `/esg` | ESG score and compliance dashboard |
| `/circular` | Circular economy waste overview |
| `/profile` | Connected wallet and transaction history |

**Wallet integration:**
- VeChain Kit (`@vechain/vechain-kit`) for VeWorld, Sync2, WalletConnect
- Reown AppKit + Wagmi for EVM-compatible wallets (cross-chain future support)

---

### `marketplace/`
**Technology:** React 18 + TypeScript + Vite  
**Purpose:** Dedicated B2B procurement interface — producer and buyer dashboards

**Key components:**
- `ProducerDashboard` — manage product listings, view orders
- `BuyerDashboard` — browse listings, submit offers, track orders
- `SmartContractCheckout` — IoT-condition-verified payment flow
- `WasteMarket` — secondary market listings for surplus goods

---

### `product-passport/`
**Technology:** React 18 + TypeScript + Vite  
**Purpose:** Standalone DPP viewer — QR code scanning, provenance timeline

**Key components:**
- `DPPScanner` — QR code scan to fetch DPP on-chain data
- `DPPTimeline` — visual lifecycle timeline from farm to consumer
- `CertificationBadges` — verified certification display

---

### `iot-simulation/`
**Technology:** Node.js + TypeScript + MQTT  
**Purpose:** Simulates real-time IoT sensor streams publishing to VeChainThor

**Simulators:**
- `TemperatureSensor` — cold-chain temperature readings
- `HumiditySensor` — humidity levels during storage/transit
- `LocationTracker` — GPS waypoint recording
- `RFIDScanner` — batch entry/exit events at distribution points

**Scenarios:**
- `cold-chain.scenario.ts` — end-to-end refrigerated transport simulation
- `transit.scenario.ts` — multi-stop cross-border transport
- `warehouse.scenario.ts` — storage period monitoring

---

### `ai-esg-dashboard/`
**Technology:** React 18 + TypeScript + Vite + Chart.js  
**Purpose:** AI-assisted ESG analytics, waste prediction, carbon tracking

**Key components:**
- `WasteAnalytics` — historical and predicted waste volumes
- `DemandForecast` — AI demand prediction charts
- `CarbonTracker` — real-time and cumulative carbon footprint
- `RiskMap` — geographic supply chain risk visualization
- `ESGIntelligence` — composite ESG score with breakdown

---

### `circular-economy/`
**Technology:** React 18 + TypeScript + Vite  
**Purpose:** Waste-to-wealth management — register surplus, match secondary buyers

**Key flows:**
1. Distributor registers non-consumable batch
2. AI categorizes waste type
3. Smart contract matches with secondary buyer registry
4. Transaction executed; on-chain ESG certificate issued

---

## Data Flow: Digital Product Passport Lifecycle

```
Producer                IoT Devices           VeChainThor              Consumer
   │                        │                      │                       │
   │  Harvest & pack        │                      │                       │
   │─────────────────────▶  │                      │                       │
   │                        │  Sensor readings      │                       │
   │                        │─────────────────────▶│                       │
   │  Mint DPP              │                      │                       │
   │──────────────────────────────────────────────▶│                       │
   │                        │                      │  DPP stored on-chain  │
   │                        │                      │──────────────────┐    │
   │   Transit events       │                      │◀─────────────────┘    │
   │◀───────────────────────│──────────────────────│                       │
   │                        │  Update DPP          │                       │
   │                        │─────────────────────▶│                       │
   │                        │                      │                       │
   │                        │                      │  QR scan              │
   │                        │                      │◀──────────────────────│
   │                        │                      │  Return DPP data      │
   │                        │                      │──────────────────────▶│
```

---

## Security Architecture

### Smart Contract Security
- Solidity security best practices (checks-effects-interactions, reentrancy guards)
- Access control via OpenZeppelin's `Ownable` and `AccessControl` patterns
- Event emission for all state changes (full auditability)
- No private key storage on-chain

### API Security
- JWT-based authentication for enterprise API clients
- Rate limiting on all public endpoints
- Input validation middleware on all routes
- CORS policy restricted to known frontend origins

### Data Privacy
- **No personal data stored on-chain** — only batch IDs, hashes, and aggregate metrics
- Sensor data is aggregated and anonymized before on-chain submission
- API logs are purged on a rolling 90-day schedule

### CI/CD Security
- Dependency vulnerability scanning in GitHub Actions
- oxlint for code quality enforcement
- Environment secrets via GitHub Secrets (never in source code)
- Separate Testnet and Mainnet deployment pipelines with approval gates

---

## VeChainThor Integration

### VeChain SDK Usage
```typescript
import { ThorClient } from '@vechain/sdk-network'
import { clauseBuilder, networkInfo } from '@vechain/sdk-core'

// Connect to Testnet
const thor = ThorClient.at(networkInfo.testnet.url)

// Build a transaction clause (DPP minting)
const clause = clauseBuilder.functionInteraction(
  DPP_CONTRACT_ADDRESS,
  DPP_ABI,
  'mintDPP',
  [batchId, originHash, certHash]
)
```

### VeChain Kit (Frontend)
```tsx
import { VeChainKitProvider, WalletButton, useWallet } from '@vechain/vechain-kit'

// Wrap application with provider
<VeChainKitProvider network={{ type: 'test' }}>
  <App />
</VeChainKitProvider>
```

---

## Deployment Architecture

```
GitHub Repository
        │
        │ git push main
        ▼
GitHub Actions CI/CD
        │
        ├── lint (oxlint)
        ├── test (Vitest)
        ├── build (Vite)
        ├── contract compile (Hardhat)
        │
        └── Deploy to:
              ├── GitHub Pages (frontend)
              └── VeChainThor Testnet (contracts)
```

**Environment separation:**

| Environment | Blockchain Network | Frontend URL |
|-------------|-------------------|--------------|
| Development | VeChainThor Testnet | `localhost:5173` |
| Staging | VeChainThor Testnet | GitHub Pages (branch preview) |
| Production | VeChainThor Mainnet | GitHub Pages (main) |

---

## Future Architecture Vision — Global Trade & Customs Interoperability *(Phase 5 / Aspirational)*

> ⚠️ **This section describes a future architectural direction only. None of the components below exist in the current codebase. No new smart contracts, deployments, or integrations are present. This is a strategic roadmap vision.**

### Overview

The long-term architectural ambition for NAMA extends the current DPP + Marketplace + IoT + ESG stack outward to encompass **cross-border trade infrastructure**. The existing contracts (`DPP.sol`, `Marketplace.sol`) and indexer pipeline provide a natural foundation — the future layer adds interoperability, customs signalling, and freight market abstractions on top of them.

### Future Component Map

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   NAMA — FUTURE TRADE LAYER (ASPIRATIONAL)                │
│                                                                            │
│  Existing Foundation                 Future Extension                     │
│  ────────────────                    ──────────────────                   │
│                                                                            │
│  DPP.sol ──────────────────────────▶ Cross-Border DPP Adapter            │
│  (provenance + certifications)        (jurisdiction-specific fields)      │
│                                                                            │
│  Marketplace.sol ──────────────────▶ Decentralized Freight Marketplace   │
│  (offer / accept / settle)            (open carrier bidding layer)        │
│                                                                            │
│  IoT Telemetry + SDG Events ───────▶ FTZ Green Lane Signal               │
│  (temperature, humidity, GPS)         (customs pre-clearance evidence)    │
│                                                                            │
│  ESG Intelligence Dashboard ───────▶ Sustainability-Linked Trade         │
│  (AII, SDG telemetry, audit)          Validation (trade term alignment)  │
│                                                                            │
│  Indexer (ThorEventConnector) ─────▶ Customs Interoperability Layer      │
│  (projection store, SQLite)           (WCO-aligned data export)          │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

### Future Sub-Components

#### FTZ Green Lane
Customs authorities would consume a NAMA-issued DPP verification signal — derived from existing `DPP.sol` passport data and IoT telemetry events — as the basis for expedited shipment processing. The signal generation layer would be an off-chain API service reading from the existing indexer projection store. No new on-chain contract is required for the prototype signal; the evidentiary data already exists in `PassportCertificationAttached` and `PassportEventRecorded` events.

#### Decentralized Freight Marketplace
Architecturally modelled on the existing `Marketplace.sol` bid/offer pattern, a future freight contract would extend the listing/offer flow to cover shipment tenders rather than product listings. Carrier qualification would be anchored to on-chain logistics event histories, reusing the `DPP.recordPassportEvent` mechanism for delivery confirmations.

#### Cross-Border Trade Layer
A future standards-alignment module would wrap the existing DPP data schema in a translation layer conforming to WCO data model fields and ISO 28005 (electronic port clearance) structures. This would be implemented as an API transformation service above the existing `GET /dpp/:batchId` route — no contract changes required.

#### Sustainability-Linked Trade Validation
ESG telemetry data (already present in `TelemetryEvent` projections) and circular economy diversion records (`PassportCertificationAttached` with `certType = "esg_circular"`) would feed into a trade terms eligibility engine, producing a verifiable sustainability trade score. This extends the existing AII architecture with a cross-border weighting pillar.

### SDG Alignment

| Future Component | SDG 9 | SDG 12 | SDG 17 |
|---|:---:|:---:|:---:|
| FTZ Green Lane | ✓ | | |
| Decentralized Freight Marketplace | ✓ | | ✓ |
| Cross-Border Trade Layer | | | ✓ |
| Sustainability-Linked Trade Validation | | ✓ | ✓ |

---

*NAMA Protocol — Architecture v1.0*

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
