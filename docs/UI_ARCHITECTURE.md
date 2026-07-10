# NAMA UI & UX Architecture

**Version:** 1.0  
**Project:** NAMA — Global Trust Infrastructure for Sustainable Food Systems  
**Stack:** React 18 + TypeScript + Vite + VeChain Kit

---

## UI Architecture Overview

NAMA's UI follows an **enterprise SaaS monorepo architecture** with modular, independently deployable frontend applications unified by a shared design system and shared data models.

```
┌──────────────────────────────────────────────────────────────────┐
│                     NAMA FRONTEND ECOSYSTEM                       │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                   packages/shared                            │  │
│  │   Design Tokens · TypeScript Models · API Hooks · Utils     │  │
│  └────────────────────────────┬────────────────────────────────┘  │
│                               │                                    │
│  ┌──────────┐  ┌──────────┐  ┌┴─────────┐  ┌──────────────────┐  │
│  │  apps/   │  │  apps/   │  │  apps/   │  │     apps/        │  │
│  │  web     │  │ passport │  │   esg    │  │   marketplace    │  │
│  │ (main    │  │ (DPP     │  │ (ESG     │  │  (B2B procure-   │  │
│  │ dashboard│  │  viewer) │  │  intel.) │  │   ment)          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              VeChain Kit + Reown AppKit Layer                 │  │
│  │         Wallet Connection · Transaction Signing               │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Application Module Responsibilities

### `apps/web` — Main Enterprise Dashboard

The central hub for authenticated enterprise users. Aggregates all NAMA modules into a unified dashboard experience.

**Primary Users:** Enterprise procurement officers, sustainability managers, operations leads

**Core Pages:**

| Route | Page | Primary Purpose |
|-------|------|----------------|
| `/` | Dashboard Home | KPI summary, recent activity feed, system status |
| `/passport` | DPP Explorer | Search, browse, and verify product passports |
| `/passport/:id` | DPP Detail | Full lifecycle view for a single passport |
| `/marketplace` | Procurement | Browse listings, submit offers, track orders |
| `/esg` | ESG Dashboard | Sustainability metrics, compliance, carbon tracking |
| `/esg/report` | ESG Report | Audit-ready report generation and export |
| `/circular` | Circular Economy | Waste registry, routing status, diversion metrics |
| `/iot` | IoT Monitor | Live sensor data, device health, alert management |
| `/profile` | Account & Settings | Organization profile, wallet, API keys |

**Layout Architecture:**

```
┌─────────────────────────────────────────────────────────┐
│  TopBar: Logo | Global Search | Alerts (3) | Wallet  ▾  │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│  Sidebar     │  Main Content Area                       │
│  Navigation  │  ┌──────────────────────────────────┐   │
│              │  │  Page Header (title + actions)   │   │
│  • Dashboard │  ├──────────────────────────────────┤   │
│  • Passports │  │                                  │   │
│  • Market    │  │  Page Content                    │   │
│  • ESG       │  │  (grid / table / detail)         │   │
│  • Circular  │  │                                  │   │
│  • IoT       │  └──────────────────────────────────┘   │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

---

### `apps/passport` — DPP Viewer (Public-Facing)

A lightweight, publicly accessible application for QR-code-linked product passport viewing. No wallet connection required for read-only access.

**Primary Users:** End consumers, customs inspectors, retail buyers

**Core Pages:**

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Scanner | QR code scan or batch ID manual entry |
| `/p/:batchId` | Passport View | Full DPP lifecycle display |
| `/verify/:batchId` | Verification | On-chain immutability proof display |

**Design Principle:** Extremely simple, fast, and mobile-optimized. The DPP view must be scannable in under 5 seconds on a mobile screen.

---

### `apps/esg` — ESG Intelligence Dashboard

Dedicated deep-dive analytics application for sustainability officers and compliance auditors.

**Primary Users:** ESG compliance teams, sustainability auditors, regulators

**Core Pages:**

| Route | Page | Purpose |
|-------|------|---------|
| `/` | ESG Overview | Composite ESG score, trending |
| `/carbon` | Carbon Tracker | Scope 1/2/3 breakdown, trend charts |
| `/compliance` | Compliance | CSRD, GRI, regulatory checklist |
| `/waste` | Waste Analytics | Diversion volume, routes, certificates |
| `/risk` | Risk Map | Supply chain risk geographic display |
| `/reports` | Reports | Generate and download audit reports |

---

### `apps/marketplace` — Smart Procurement

B2B procurement interface for producers and institutional buyers.

**Primary Users:** Producers, buyers (hotels, hospitals, distributors)

**Core Pages:**

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Listings | Browse available product listings |
| `/listing/:id` | Listing Detail | Full product detail, DPP link, offer form |
| `/producer` | Producer Dashboard | Manage listings, view orders |
| `/buyer` | Buyer Dashboard | Track offers, active orders |
| `/order/:id` | Order Detail | Smart contract status, IoT conditions |
| `/waste` | Waste Market | Secondary market for circular economy |

---

## UX Architecture

### Navigation Model

NAMA uses a **persistent sidebar + top navigation bar** on desktop, collapsing to a **bottom navigation bar** on mobile.

**Sidebar Navigation Hierarchy:**
```
Primary Navigation (always visible):
  • Dashboard (Home)
  • Product Passports
  • Marketplace
  • ESG Intelligence
  • Circular Economy
  • IoT Monitoring

Secondary Navigation (bottom of sidebar):
  • Settings
  • Help & Documentation
  • Wallet Status
```

**Active State Rules:**
- The active page item has a left border accent (3px, `--color-green-500`) and a slightly darker background
- Parent items expand to show sub-routes
- Breadcrumbs appear in the page header for routes deeper than one level

---

### Page Layout Patterns

**Pattern 1: Dashboard Grid**  
Used for: Home, ESG Overview, IoT Monitor

```
[ Metric Card ] [ Metric Card ] [ Metric Card ] [ Metric Card ]
[──────────────────────────────────────────────────────────────]
[ Primary Chart (large)         ] [ Secondary Widget (small)   ]
[──────────────────────────────────────────────────────────────]
[ Recent Activity Table                                        ]
```

**Pattern 2: List + Detail (Split Pane)**  
Used for: Passport Explorer, Marketplace Listings

```
[ Filter Bar + Search ]
[──────────────────────]
[ Item List            | Item Detail Panel          ]
[ (scrollable)         | (sticky, updates on click) ]
```

**Pattern 3: Full-Width Data Table**  
Used for: Reports, IoT readings, Transaction History

```
[ Page Title           ] [ Action Buttons: Export | Filters ]
[──────────────────────────────────────────────────────────────]
[ Active Filters: tag × tag × tag                  Clear all ]
[──────────────────────────────────────────────────────────────]
[ Table Header (sortable columns)                             ]
[ Row 1                                                       ]
[ Row 2                                                       ]
[ ...                                                         ]
[ Pagination: ← Prev   1 2 3 ... Next → ]
```

**Pattern 4: Detail View**  
Used for: DPP Detail, Order Detail, Certification Detail

```
[ ← Back to list ]
[ Header: Product Name / ID       ] [ Status Badge ] [ Actions ▾ ]
[──────────────────────────────────────────────────────────────]
[ Tab: Overview | Timeline | IoT Data | Certifications | Docs ]
[──────────────────────────────────────────────────────────────]
[ Tab Content                                                  ]
[──────────────────────────────────────────────────────────────]
[ Sidebar (right, 300px): Blockchain Verification Panel        ]
```

---

### User Journey Maps

#### Journey 1: Producer Onboards a Product Batch

```
1. Login (VeWorld / VeChain Kit)
     ↓
2. Navigate to Marketplace → New Listing
     ↓
3. Fill Product Form
   (Name, Category, Quantity, Price, Certifications, Origin)
     ↓
4. System: DPP Auto-Mint trigger
   (Shows: "Creating Digital Product Passport on VeChainThor...")
     ↓
5. IoT sensors assigned to batch
     ↓
6. Listing published → awaits buyer offers
     ↓
7. [SUCCESS] Product now has on-chain DPP + active marketplace listing
```

#### Journey 2: Buyer Verifies and Purchases

```
1. Login (or anonymous browse)
     ↓
2. Search Marketplace with filters
   (Category, Certifications, Price Range, Origin)
     ↓
3. Click Listing → View full DPP
   (Blockchain verification stamp visible if DPP present)
     ↓
4. Submit Offer → Smart contract conditions displayed
   ("Delivery confirmed by IoT cold chain ≤ 4°C")
     ↓
5. Order created, IoT monitoring begins
     ↓
6. On delivery confirmation by IoT data:
   Smart contract releases payment automatically
     ↓
7. [SUCCESS] Order complete, ESG certificate issued
```

#### Journey 3: Compliance Auditor Generates ESG Report

```
1. Login with organization credentials
     ↓
2. Navigate to ESG Intelligence → Reports
     ↓
3. Select reporting period (date range)
     ↓
4. System aggregates: on-chain data + IoT telemetry + certifications
     ↓
5. Preview report (interactive, drill-down)
     ↓
6. Generate PDF → cryptographic hash embedded
     ↓
7. [SUCCESS] Audit-ready PDF with on-chain verification hash
```

---

### State Management Architecture

```
Global State (Zustand stores):
  authStore        → wallet address, authentication state, permissions
  dppStore         → cached DPP records, search results
  marketplaceStore → listings cache, active orders, offers
  iotStore         → live sensor readings, device registry
  esgStore         → metrics, reports, carbon data
  notificationStore → alerts, transaction status, IoT alerts

Server State (TanStack Query):
  DPP queries      → GET /dpp/:id, GET /dpp/search
  Listings queries → GET /marketplace/listings
  ESG queries      → GET /esg/report/:orgId
  IoT queries      → GET /iot/devices, GET /iot/readings

VeChain State (VeChain Kit hooks):
  useWallet()       → connected wallet info
  useTransaction()  → transaction submission + status
  useContract()     → contract interaction helpers
```

---

### Form Design Patterns

**Product Registration Form (DPP Mint)**

```
Section 1: Product Identity
  • Product Name (text)
  • Product Category (select: Produce, Grains, Dairy, etc.)
  • Batch ID (auto-generated + manual override)
  • Harvest / Production Date (date)

Section 2: Origin & Provenance
  • Farm / Origin Location (text + map pin)
  • GPS Coordinates (optional, auto-detect)
  • Country of Origin (select)
  • Organic / Fair Trade Certifications (multi-select tags)

Section 3: Supply Chain
  • Cold Chain Required (toggle)
  • Target Temperature Range (conditional: if cold chain)
  • Estimated Logistics Route (optional)

Section 4: Review & Mint
  • Summary display of all entered data
  • Estimated VTHO cost for on-chain transaction
  • "Mint DPP on VeChainThor" button (primary, VeChain purple)
```

**Validation Rules:**
- All required fields validated on blur, not on submit
- Inline error messages appear below each invalid field
- VTHO balance check before mint (show warning if insufficient)
- Confirmation modal before any blockchain write operation

---

### Error Handling UX

| Error Type | UX Response |
|------------|-------------|
| Network offline | Banner: "You are offline — data shown may be outdated" |
| Wallet disconnected | Inline prompt in affected sections: "Connect wallet to continue" |
| Insufficient VTHO | Inline warning on transaction forms with balance display |
| Transaction failed | Toast notification (error) + link to transaction on VeChain Explorer |
| API timeout | Skeleton screen persists + retry button appears after 10s |
| Unauthorized access | Redirect to login with return URL preserved |
| Invalid DPP ID | Empty state with error illustration + clear action to go back |

---

### Notification System

**Toast Notifications** (ephemeral, top-right):
- Success: green, 3 second auto-dismiss
- Warning: amber, 5 second auto-dismiss
- Error: red, 8 second auto-dismiss + manual dismiss
- Info: blue, 4 second auto-dismiss

**Transaction Status Notifications** (persistent until resolved):
- "Transaction pending..." → pulsing indicator
- "Transaction confirmed" → success with transaction hash link
- "Transaction failed" → error with reason + retry option

**In-App Alert Center** (sidebar bell icon):
- IoT alerts (temperature threshold breaches)
- Order status changes
- Certification expiry warnings
- New marketplace offers

---

### Performance UX Guidelines

| Metric | Target | Strategy |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | Code splitting, route-based lazy loading |
| Time to Interactive | < 3.5s | Critical CSS inlining, deferred non-critical JS |
| Data table render | < 200ms | Virtualized lists for > 50 rows |
| Search response | < 300ms | Debounced input, optimistic UI |
| Blockchain data fetch | < 2s | Cached with TanStack Query, stale-while-revalidate |
| IoT live data latency | < 5s | WebSocket or polling at 5s intervals |

---

## Responsive Design Specifications

### Mobile (< 640px)

- Bottom navigation bar: 5 primary icons
- All cards stack vertically, full-width
- Tables replaced with card list view (one record per card)
- Sidebar hidden; accessible via hamburger menu
- DPP QR scanner uses full-screen camera view
- Forms: single column, large touch targets (min 44px)

### Tablet (640px – 1024px)

- Icon-only collapsed sidebar (72px width)
- 2-column card grid
- Tables shown with horizontal scroll
- Split pane views stack vertically

### Desktop (> 1024px)

- Full sidebar (240px) with labels
- Multi-column dashboard grids (3–4 columns)
- Split pane views show list + detail side by side
- Data tables at full density

---

*NAMA UI/UX Architecture v1.0*  
*Enterprise SaaS | WCAG 2.2 AA | VeChainThor Ecosystem*
