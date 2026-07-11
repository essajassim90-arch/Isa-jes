# NAMA Implementation Guide

**Version:** 1.0  
**Project:** NAMA — Global Trust Infrastructure for Sustainable Food Systems

This guide provides the complete recommendations for frontend, API, and smart contract implementation, aligned with the approved Architecture and Design System.

---

## Frontend Implementation Recommendations

### Technology Decisions

| Concern | Decision | Rationale |
|---------|---------|-----------|
| **Framework** | React 18 + TypeScript | Type safety, ecosystem maturity, VeChain Kit support |
| **Build Tool** | Vite 5 | Fast dev server, optimized production builds, ESM-first |
| **Styling** | CSS Modules + CSS Custom Properties | Zero runtime, design token integration, no class conflicts |
| **State: Global** | Zustand | Lightweight, TypeScript-native, no boilerplate |
| **State: Server** | TanStack Query v5 | Caching, background refetch, optimistic updates |
| **Routing** | React Router v6 | Industry standard, nested routes, code splitting |
| **Forms** | React Hook Form + Zod | Performant, schema validation, TypeScript inference |
| **Charts** | Recharts | Composable, accessible, no canvas dependency |
| **Icons** | Lucide React | Tree-shakeable, consistent, MIT license |
| **Testing** | Vitest + React Testing Library | Fast, collocated tests, behavior-driven |
| **Linting** | oxlint | Fast, enforces code quality |
| **Wallet** | VeChain Kit + Reown AppKit | VeWorld/Sync2 + cross-chain EVM support |

---

### Monorepo Structure

```
/
├── apps/
│   ├── web/                    ← Main enterprise dashboard
│   ├── passport/               ← Public DPP viewer (lightweight)
│   ├── esg/                    ← ESG intelligence deep-dive
│   └── marketplace/            ← B2B procurement interface
│
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   ├── models/         ← TypeScript interfaces & types
│   │   │   ├── api/            ← API client & query hooks
│   │   │   ├── utils/          ← Date, formatting, validation helpers
│   │   │   ├── constants/      ← Shared enums, contract addresses, configs
│   │   │   └── design-tokens/  ← CSS variables export
│   │   └── package.json
│   │
│   └── ui/
│       ├── src/
│       │   ├── components/     ← All shared UI components
│       │   └── index.ts
│       └── package.json
│
├── smart-contracts/            ← Solidity + Hardhat
├── api/                        ← Node.js API gateway
├── iot-simulation/             ← IoT sensor simulator
├── docs/                       ← All design & architecture docs
├── .github/
│   └── workflows/              ← CI/CD pipelines
├── package.json                ← Workspace root
└── turbo.json                  ← Turborepo pipeline config
```

### Build Pipeline Recommendation

Use **Turborepo** for monorepo task orchestration:

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "outputs": ["coverage/**"]
    },
    "type-check": {}
  }
}
```

---

### Frontend Architecture Patterns

#### API Client Layer

All API calls are abstracted behind a typed client in `packages/shared/src/api/`:

```
api/
├── client.ts          ← Axios/fetch instance with auth interceptors
├── dpp.api.ts         ← DPP CRUD operations
├── marketplace.api.ts ← Listing and order operations
├── esg.api.ts         ← ESG metrics and report generation
├── iot.api.ts         ← Sensor data and device queries
└── circular.api.ts    ← Waste registry and routing
```

**Pattern:** Each API module exports typed async functions. TanStack Query wraps these in hooks within `packages/shared/src/hooks/`.

#### Error Boundary Strategy

```
AppShell
  └─ GlobalErrorBoundary (catches unhandled errors, shows friendly page)
       └─ Route components
            └─ ModuleErrorBoundary (per-module, shows inline error states)
                 └─ Component tree
```

#### Code Splitting Strategy

```
Route-level:  All page components are React.lazy() wrapped
Module-level: Charts, PDF generation, QR scanner loaded on demand
Shared:       Design system and UI components bundled in shared package
Vendor:       VeChain SDK and wallet libraries in separate chunk
```

---

### Security Recommendations (Frontend)

1. **No private keys or seeds in browser storage** — VeChain Kit manages all signing
2. **Content Security Policy** — Restrict script/style sources in deployed HTML
3. **VTHO balance validation** before any write transaction is submitted
4. **Confirmation modals** for all blockchain write operations (irreversible actions)
5. **Transaction hash verification** — Always link to VeChain Explorer for user verification
6. **Input sanitization** — Zod schema validation on all form inputs before API submission
7. **Environment variables** — Never expose API secrets in `VITE_` prefixed variables (these are public); keep server secrets in API layer only

---

## API Architecture Recommendations

### Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Runtime** | Node.js 20 LTS | Stable, well-supported, TypeScript-native |
| **Framework** | Fastify | Performance-focused, schema-validated routes, OpenAPI plugin |
| **Language** | TypeScript (strict mode) | Full type safety end-to-end |
| **Validation** | Zod | Runtime + compile-time schema validation |
| **VeChain** | `@vechain/sdk-network` + `@vechain/sdk-core` | Official SDK, event decoding, contract calls |
| **Auth** | JWT (RS256) | Asymmetric key, no shared secret between services |
| **Caching** | Redis | API response caching, IoT data buffering, session store |
| **Database** | PostgreSQL | Relational, ACID-compliant, off-chain data storage |
| **ORM** | Prisma | Type-safe queries, migration management |
| **Queue** | BullMQ (Redis-backed) | IoT ingestion, ESG report generation, async jobs |
| **Documentation** | OpenAPI 3.1 + Scalar | Auto-generated from route schemas |
| **Testing** | Vitest + Supertest | Fast unit + integration tests |

---

### API Module Structure

```
api/src/
├── routes/
│   ├── dpp.routes.ts
│   ├── marketplace.routes.ts
│   ├── esg.routes.ts
│   ├── iot.routes.ts
│   ├── circular.routes.ts
│   └── auth.routes.ts
│
├── controllers/
│   ├── dpp.controller.ts
│   ├── marketplace.controller.ts
│   ├── esg.controller.ts
│   ├── iot.controller.ts
│   └── circular.controller.ts
│
├── services/
│   ├── vechain/
│   │   ├── vechain.client.ts      ← ThorClient singleton
│   │   ├── contract.service.ts    ← Contract call abstraction
│   │   ├── event.service.ts       ← On-chain event listener
│   │   └── tx.service.ts          ← Transaction building + submission
│   ├── dpp.service.ts
│   ├── marketplace.service.ts
│   ├── esg.service.ts
│   ├── iot.service.ts
│   └── circular.service.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── rate-limit.middleware.ts
│   ├── validate.middleware.ts
│   └── logger.middleware.ts
│
├── queue/
│   ├── iot-ingest.queue.ts
│   ├── esg-report.queue.ts
│   └── dpp-sync.queue.ts
│
├── db/
│   ├── schema.prisma
│   └── migrations/
│
└── index.ts
```

---

### REST API Endpoint Specification

#### Digital Product Passport

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET` | `/v1/dpp/:batchId` | Fetch a DPP by batch ID | Public |
| `GET` | `/v1/dpp/search` | Search DPPs by filters | Public |
| `POST` | `/v1/dpp/mint` | Mint a new DPP on-chain | Required |
| `POST` | `/v1/dpp/:batchId/event` | Record a transit/quality event | Required |
| `GET` | `/v1/dpp/:batchId/verify` | Verify DPP on-chain immutability | Public |
| `GET` | `/v1/dpp/:batchId/qr` | Generate QR code URL for a DPP | Public |

#### Marketplace

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET` | `/v1/marketplace/listings` | List active procurement listings | Public |
| `GET` | `/v1/marketplace/listings/:id` | Get listing detail | Public |
| `POST` | `/v1/marketplace/listings` | Create a new listing | Required |
| `PUT` | `/v1/marketplace/listings/:id` | Update listing | Required (owner) |
| `DELETE` | `/v1/marketplace/listings/:id` | Remove listing | Required (owner) |
| `POST` | `/v1/marketplace/orders` | Submit a purchase order | Required |
| `GET` | `/v1/marketplace/orders/:id` | Get order status | Required |
| `POST` | `/v1/marketplace/orders/:id/confirm` | Manually confirm delivery | Required |
| `POST` | `/v1/marketplace/orders/:id/dispute` | Raise a dispute | Required |

#### ESG Intelligence

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET` | `/v1/esg/metrics/:orgId` | Get ESG metrics for organization | Required |
| `GET` | `/v1/esg/carbon/:orgId` | Get carbon footprint breakdown | Required |
| `GET` | `/v1/esg/compliance/:orgId` | Get compliance checklist status | Required |
| `POST` | `/v1/esg/reports` | Generate audit-ready ESG report | Required |
| `GET` | `/v1/esg/reports/:reportId` | Download a generated report | Required |

#### IoT Telemetry

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET` | `/v1/iot/devices` | List IoT devices for organization | Required |
| `GET` | `/v1/iot/devices/:deviceId` | Get device detail + health | Required |
| `POST` | `/v1/iot/readings` | Ingest sensor reading | Device key |
| `GET` | `/v1/iot/readings/:batchId` | Get all readings for a batch | Required |
| `GET` | `/v1/iot/alerts` | Get active IoT alerts | Required |
| `PUT` | `/v1/iot/alerts/:alertId/dismiss` | Dismiss an alert | Required |

#### Circular Economy

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/v1/circular/waste` | Register a waste/surplus batch | Required |
| `GET` | `/v1/circular/waste` | List waste registry for organization | Required |
| `GET` | `/v1/circular/waste/:id` | Get waste batch detail | Required |
| `GET` | `/v1/circular/certificates` | List ESG diversion certificates | Required |
| `GET` | `/v1/circular/certificates/:id` | Get certificate detail + on-chain proof | Required |

---

### Off-Chain Data Strategy

Not all data belongs on-chain. NAMA uses a hybrid approach:

| Data Type | Storage | Rationale |
|-----------|---------|-----------|
| DPP core identity, certifications | **On-chain** | Immutability required |
| Transit events, IoT conditions | **On-chain** | Auditability required |
| Raw IoT readings (high frequency) | **PostgreSQL + Redis** | Too expensive to store on-chain at volume |
| ESG computed metrics | **PostgreSQL** | Complex aggregation, changes over time |
| User profiles, API keys | **PostgreSQL** | PII should not be on-chain |
| Report PDFs | **IPFS or S3** | Large files, content-addressed by hash on-chain |
| Marketplace listings (mutable) | **PostgreSQL** | Prices and availability change frequently |

---

### Rate Limiting Strategy

| Tier | Limit | Applies To |
|------|-------|-----------|
| Public read | 60 req/min | `/dpp/:id`, `/marketplace/listings` |
| Authenticated | 300 req/min | All authenticated endpoints |
| Write operations | 20 req/min | POST/PUT endpoints |
| IoT ingestion | 1000 readings/min | `/iot/readings` (device key) |
| Report generation | 5 req/hour | `/esg/reports` |

---

## Smart Contract Architecture Recommendations

### Contract Design Philosophy

1. **Minimal on-chain data** — Store only what requires immutability (IDs, hashes, events)
2. **Off-chain computation** — Heavy analytics belong in the API layer
3. **Event-driven architecture** — Emit events for all state changes; index off-chain
4. **Access control** — Role-based using OpenZeppelin's `AccessControl`
5. **Upgradeability** — Use OpenZeppelin `TransparentUpgradeableProxy` for future-proofing

---

### Contract Registry

| Contract | Responsibility | Priority |
|----------|---------------|---------|
| `DPP.sol` | Mint and update Digital Product Passports | Tier 1 |
| `Marketplace.sol` | Smart procurement listings and orders | Tier 1 |
| `CircularEconomy.sol` | Waste registration and diversion records | Tier 1 |
| `ESGCertification.sol` | Issue and verify sustainability certificates | Tier 1 |
| `AccessRegistry.sol` | Organization registration and role management | Tier 2 |
| `ProxyAdmin.sol` | Upgrade governance for upgradeable contracts | Tier 2 |

---

### `DPP.sol` — Specification

```
State:
  mapping(bytes32 => DPPRecord) private _dpps
  mapping(bytes32 => TransitEvent[]) private _events

Structs:
  DPPRecord {
    bytes32 batchId
    address producer
    bytes32 originHash        ← hash of origin data (off-chain stored)
    bytes32 certificationHash ← hash of certification data
    uint256 mintedAt
    DPPStatus status
  }

  TransitEvent {
    EventType eventType
    address actor
    bytes32 dataHash          ← hash of full event data (off-chain stored)
    uint256 timestamp
  }

Functions:
  mintDPP(bytes32 batchId, bytes32 originHash, bytes32 certHash) → external
  recordEvent(bytes32 batchId, EventType type, bytes32 dataHash) → external
  updateStatus(bytes32 batchId, DPPStatus status) → external (role: OPERATOR)
  getDPP(bytes32 batchId) → view returns (DPPRecord)
  getEvents(bytes32 batchId) → view returns (TransitEvent[])
  verifyDPP(bytes32 batchId) → view returns (bool)

Events:
  DPPMinted(bytes32 indexed batchId, address indexed producer, uint256 timestamp)
  EventRecorded(bytes32 indexed batchId, EventType indexed eventType, uint256 timestamp)
  StatusUpdated(bytes32 indexed batchId, DPPStatus indexed status)

Access:
  MINTER_ROLE: Authorized producers / platform
  OPERATOR_ROLE: Platform API (status updates, event recording)
  DEFAULT_ADMIN_ROLE: Contract owner / governance
```

---

### `Marketplace.sol` — Specification

```
State:
  mapping(bytes32 => Listing) private _listings
  mapping(bytes32 => Order) private _orders
  Counter private _listingCounter
  Counter private _orderCounter

Structs:
  Listing {
    bytes32 id
    address seller
    bytes32 dppBatchId        ← optional, links to DPP
    uint256 quantity
    uint256 pricePerUnit      ← in VTHO (smallest unit)
    bytes32 conditionsHash    ← hash of IoT conditions
    uint256 expiresAt
    ListingStatus status
  }

  Order {
    bytes32 id
    bytes32 listingId
    address buyer
    address seller
    uint256 quantity
    uint256 totalValue
    OrderStatus status
    uint256 createdAt
    uint256 completedAt
  }

Functions:
  createListing(dppBatchId, quantity, pricePerUnit, conditionsHash, expiresAt) → bytes32
  cancelListing(listingId) → external (listing owner)
  submitOrder(listingId, quantity) → bytes32 (payable: VTHO escrow)
  confirmDelivery(orderId) → external (platform oracle or buyer)
  releasePayment(orderId) → external (after confirmation)
  raiseDispute(orderId, evidenceHash) → external
  resolveDispute(orderId, buyerFavored) → external (ARBITER_ROLE)

Events:
  ListingCreated(bytes32 indexed listingId, address indexed seller, uint256 pricePerUnit)
  OrderCreated(bytes32 indexed orderId, bytes32 indexed listingId, address buyer)
  PaymentReleased(bytes32 indexed orderId, uint256 amount)
  DisputeRaised(bytes32 indexed orderId, address indexed raisedBy)

Access:
  ORACLE_ROLE: Platform API for IoT-based delivery confirmation
  ARBITER_ROLE: Dispute resolution authority
```

---

### `CircularEconomy.sol` — Specification

```
State:
  mapping(bytes32 => WasteRecord) private _wasteRecords
  mapping(bytes32 => DiversionCertificate) private _certificates

Structs:
  WasteRecord {
    bytes32 id
    address registrant
    bytes32 productHash
    uint256 quantity
    WasteCategory category
    WasteDestination destination
    bytes32 certificateId
    RecordStatus status
    uint256 registeredAt
  }

  DiversionCertificate {
    bytes32 id
    address orgAddress
    bytes32 wasteRecordId
    uint256 quantity
    uint256 carbonEquivalent
    uint256 issuedAt
    bool isValid
  }

Functions:
  registerWaste(productHash, quantity, category, destination) → bytes32
  confirmDiversion(wasteRecordId) → bytes32 (issues certificate)
  getCertificate(certificateId) → DiversionCertificate
  verifyCertificate(certificateId) → bool

Events:
  WasteRegistered(bytes32 indexed wasteId, address registrant, WasteCategory category)
  DiversionCertificateIssued(bytes32 indexed certId, address indexed org, uint256 carbonEquivalent)

Access:
  REGISTRANT_ROLE: Authorized distributors and platforms
  CERTIFIER_ROLE: Platform API (confirms diversions, issues certs)
```

---

### VeChainThor-Specific Implementation Notes

1. **Gas estimation:** Always use `thor.gas.estimateGas()` before submission; include a 20% buffer
2. **Clause batching:** VeChainThor supports multi-clause transactions — batch related state updates to save gas
3. **Event decoding:** Use `@vechain/sdk-core`'s `decodeEventLog()` to parse emitted events
4. **Transaction ID:** VeChainThor uses `txid` not `txHash`; store as string, not bytes32
5. **Block reference:** Include `blockRef` from latest block in all transactions (prevents replay)
6. **VTHO delegation:** Consider fee delegation (`VIP-191`) for enterprise clients to cover user gas costs
7. **Testnet faucet:** Use `https://faucet.vecha.in/` during development; document in CONTRIBUTING.md

---

### Smart Contract Testing Strategy

| Test Type | Tool | Coverage Target |
|-----------|------|----------------|
| Unit tests | Hardhat + Chai | Each function, edge cases |
| Integration tests | Hardhat + Ethers.js | Cross-contract interactions |
| Gas profiling | Hardhat Gas Reporter | Track gas costs per function |
| Security analysis | Slither + manual review | Critical vulnerabilities |
| Coverage | Hardhat Coverage | ≥ 85% line coverage |

---

## CI/CD Recommendations

### GitHub Actions Pipeline

```yaml
# Trigger: push to main, pull_request to main

jobs:
  lint:
    - Run oxlint on all packages
    - Run TypeScript type-check

  test:
    - Run Vitest (unit + integration) for all packages
    - Run Hardhat tests for smart contracts

  build:
    - Build all frontend apps (Vite)
    - Compile Solidity contracts

  security:
    - Run npm audit for dependency vulnerabilities
    - Run Slither on smart contracts (PRs to main)

  deploy-testnet:
    - Condition: push to main branch only
    - Deploy contracts to VeChainThor Testnet
    - Deploy frontend apps to GitHub Pages (or Vercel)

  deploy-mainnet:
    - Condition: manual trigger + tag matching v*.*.* only
    - Requires 2 maintainer approvals
    - Deploy contracts to VeChainThor Mainnet
```

---

### Environment Configuration

| Variable | Description | Scope |
|----------|-------------|-------|
| `VITE_WC_PROJECT_ID` | WalletConnect / Reown project ID | Frontend |
| `VITE_VECHAIN_NETWORK` | `test` or `main` | Frontend |
| `VITE_CONTRACT_DPP` | Deployed DPP contract address | Frontend |
| `VITE_CONTRACT_MARKETPLACE` | Deployed Marketplace contract address | Frontend |
| `VITE_API_BASE_URL` | API gateway URL | Frontend |
| `DATABASE_URL` | PostgreSQL connection string | API (secret) |
| `REDIS_URL` | Redis connection string | API (secret) |
| `JWT_PRIVATE_KEY` | RS256 private key for JWT signing | API (secret) |
| `VECHAIN_DEPLOYER_PRIVATE_KEY` | VeChain wallet key for contract deployment | CI/CD (secret) |

---

*NAMA Implementation Guide v1.0*  
*VeChainThor Ecosystem | Enterprise Production Standard*

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
