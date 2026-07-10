# NAMA Component Architecture

**Version:** 1.0  
**Project:** NAMA — Global Trust Infrastructure for Sustainable Food Systems  
**Stack:** React 18 + TypeScript + Vite

---

## Component Design Principles

1. **Composable over Monolithic** — Build small, focused components that compose into complex views
2. **Data-driven props** — Components receive typed data objects, not raw primitives
3. **Presentation/Container separation** — UI components have no direct API or blockchain calls
4. **Accessibility first** — Every interactive component must be keyboard-navigable and screen-reader compatible
5. **Design token alignment** — All styling uses CSS custom properties from the Design System

---

## Component Hierarchy

```
src/
├── components/
│   ├── ui/                    ← Primitive UI components (design system layer)
│   │   ├── Button/
│   │   ├── Badge/
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Table/
│   │   ├── Modal/
│   │   ├── Toast/
│   │   ├── Tooltip/
│   │   ├── Skeleton/
│   │   └── EmptyState/
│   │
│   ├── layout/                ← Layout and structural components
│   │   ├── AppShell/
│   │   ├── Sidebar/
│   │   ├── TopBar/
│   │   ├── PageHeader/
│   │   ├── ContentGrid/
│   │   └── BottomNav/
│   │
│   ├── blockchain/            ← VeChain-specific components
│   │   ├── WalletButton/
│   │   ├── VerificationStamp/
│   │   ├── TransactionStatus/
│   │   ├── BlockchainBadge/
│   │   └── VTHOIndicator/
│   │
│   ├── passport/              ← DPP-specific components
│   │   ├── PassportCard/
│   │   ├── PassportTimeline/
│   │   ├── PassportHeader/
│   │   ├── CertificationBadge/
│   │   ├── PassportQRCode/
│   │   └── OriginMap/
│   │
│   ├── esg/                   ← ESG-specific components
│   │   ├── ESGScoreCard/
│   │   ├── CarbonMetric/
│   │   ├── ComplianceChecklist/
│   │   ├── ESGTrendChart/
│   │   ├── WasteMetric/
│   │   └── RiskMap/
│   │
│   ├── iot/                   ← IoT monitoring components
│   │   ├── SensorReadingCard/
│   │   ├── LiveIndicator/
│   │   ├── TemperatureGauge/
│   │   ├── IoTTimeline/
│   │   └── AlertBadge/
│   │
│   ├── marketplace/           ← Procurement components
│   │   ├── ListingCard/
│   │   ├── ListingDetail/
│   │   ├── OfferForm/
│   │   ├── OrderStatus/
│   │   ├── SupplierTrustBadge/
│   │   └── ProcurementStepper/
│   │
│   └── circular/              ← Circular economy components
│       ├── WasteRegistryCard/
│       ├── DiversionRouteMap/
│       ├── CircularMetric/
│       ├── ESGCertificate/
│       └── WasteCategory/
│
├── hooks/                     ← Custom React hooks
├── providers/                 ← Context providers
└── pages/                     ← Route-level page components
```

---

## UI Primitive Components

### `Button`

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'chain'
  size: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}
```

**Variants:**
- `primary` — Green, solid background. Main CTAs.
- `secondary` — White with green border. Secondary actions.
- `destructive` — Red. Destructive or irreversible actions.
- `ghost` — No background. Tertiary actions in toolbars.
- `chain` — VeChain purple. Blockchain write operations ONLY.

**Loading state:** Replace children with spinner + "Processing..." text. Disable pointer events.

---

### `Badge`

```typescript
interface BadgeProps {
  variant: 'active' | 'pending' | 'failed' | 'verified' | 'draft' | 'info'
  size?: 'sm' | 'md'
  icon?: React.ReactNode
  label: string
}
```

**Verified badge:** Must include a shield-check icon and use VeChain purple colors. Only rendered when `isOnChainVerified === true`.

---

### `Card`

```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'dpp' | 'metric' | 'iot'
  accent?: 'none' | 'green' | 'chain'
  padding?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}
```

---

### `EmptyState`

```typescript
interface EmptyStateProps {
  illustration: 'passports' | 'marketplace' | 'esg' | 'iot' | 'circular' | 'search' | 'error'
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }
}
```

---

### `Skeleton`

Skeleton components mirror the shape of their loaded counterparts.

```
SkeletonCard      → Same dimensions as CardComponent, animated shimmer
SkeletonTable     → Row-count prop, animated shimmer rows
SkeletonMetric    → Circle + two lines for metric cards
SkeletonText      → Single line, width configurable
SkeletonPassport  → Full passport card silhouette
```

---

## Layout Components

### `AppShell`

The root layout wrapper for all authenticated pages. Composes TopBar + Sidebar + main content area.

```typescript
interface AppShellProps {
  children: React.ReactNode
}
```

**Behavior:**
- Sidebar collapses to icon-only below `1024px`
- Sidebar hides completely below `640px` (bottom nav replaces it)
- TopBar is always fixed at the top

---

### `PageHeader`

Standardized page title section with breadcrumbs and action area.

```typescript
interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: React.ReactNode
}
```

---

### `ContentGrid`

Responsive grid wrapper for dashboard metric cards.

```typescript
interface ContentGridProps {
  columns?: 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}
```

---

## Blockchain Components

### `WalletButton`

Wraps VeChain Kit's wallet connection UI with NAMA brand styling. Shows connected address (truncated) when connected.

```typescript
// Thin wrapper around @vechain/vechain-kit WalletButton
// Applies NAMA button styles
// Shows VTHO balance on hover (tooltip)
```

---

### `VerificationStamp`

The most important trust signal in NAMA. Displayed only when data is confirmed on VeChainThor.

```typescript
interface VerificationStampProps {
  txHash: string
  verifiedAt: Date
  network: 'testnet' | 'mainnet'
  size?: 'sm' | 'md' | 'lg'
}
```

**Visual spec:**
- Shield-check icon (VeChain purple)
- "Verified on VeChainThor" label
- Truncated transaction hash, copyable
- Links to VeChain Explorer on click
- Background: `--color-vechain-50`
- Border: `1px solid --color-vechain-200`

---

### `TransactionStatus`

Persistent status indicator for pending blockchain operations.

```typescript
type TxStatus = 'idle' | 'pending' | 'confirmed' | 'failed' | 'reverted'

interface TransactionStatusProps {
  status: TxStatus
  txHash?: string
  message?: string
  onRetry?: () => void
}
```

---

## Passport Components

### `PassportCard`

Summary card for a Digital Product Passport, used in list views.

```typescript
interface PassportCardProps {
  passport: DPPSummary
  onClick?: () => void
  showVerification?: boolean
}

interface DPPSummary {
  batchId: string
  productName: string
  category: ProductCategory
  originCountry: string
  harvestDate: Date
  certifications: string[]
  isVerified: boolean
  txHash?: string
  status: 'active' | 'in-transit' | 'delivered' | 'recalled'
}
```

---

### `PassportTimeline`

Vertical timeline visualization of the DPP lifecycle.

```typescript
interface PassportTimelineProps {
  events: DPPEvent[]
  showIoTReadings?: boolean
}

interface DPPEvent {
  id: string
  type: 'mint' | 'transit' | 'quality-check' | 'customs' | 'delivery' | 'recall'
  timestamp: Date
  location?: string
  actorAddress?: string
  txHash: string
  metadata?: Record<string, unknown>
  iotReading?: IoTReading
}
```

**Visual spec:**
- Vertical line connecting events
- Icon per event type (from icon system)
- Event type color coding (transit=blue, quality=green, recall=red)
- On-chain events show mini VerificationStamp

---

### `CertificationBadge`

Individual certification display (organic, fair-trade, Halal, etc.)

```typescript
interface CertificationBadgeProps {
  certification: {
    name: string
    issuer: string
    validUntil?: Date
    isExpired: boolean
    onChainVerified: boolean
  }
}
```

---

## ESG Components

### `ESGScoreCard`

Large metric display for a composite ESG score.

```typescript
interface ESGScoreCardProps {
  score: number          // 0–100
  maxScore: number       // 100
  trend: 'up' | 'down' | 'stable'
  trendPercent: number
  period: string
  breakdown?: {
    environmental: number
    social: number
    governance: number
  }
}
```

**Visual spec:**
- Large circular progress arc
- Score number centered, `--text-5xl --font-extrabold`
- Trend arrow + percentage below
- Optional breakdown: 3 mini bars (E / S / G)

---

### `CarbonMetric`

Carbon footprint display card with trend.

```typescript
interface CarbonMetricProps {
  value: number
  unit: 'tCO2e' | 'kgCO2e'
  period: string
  trend: number         // positive = increase, negative = reduction
  scope: 1 | 2 | 3 | 'total'
  sparklineData?: number[]
}
```

---

### `ComplianceChecklist`

CSRD / GRI compliance indicator list.

```typescript
interface ComplianceChecklistProps {
  framework: 'CSRD' | 'GRI' | 'ESPR' | 'custom'
  items: ComplianceItem[]
}

interface ComplianceItem {
  id: string
  label: string
  status: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable'
  evidence?: string
  onChainVerified?: boolean
}
```

---

## IoT Components

### `SensorReadingCard`

Real-time sensor reading display.

```typescript
interface SensorReadingCardProps {
  sensor: {
    id: string
    type: 'temperature' | 'humidity' | 'location' | 'rfid'
    deviceName: string
    batchId: string
    isLive: boolean
    healthState: 'healthy' | 'warning' | 'critical' | 'offline'
  }
  reading: {
    value: number | string
    unit: string
    timestamp: Date
    isWithinThreshold: boolean
    threshold?: { min: number; max: number }
  }
}
```

---

### `LiveIndicator`

Pulsing dot to indicate live data stream.

```typescript
interface LiveIndicatorProps {
  isLive: boolean
  lastUpdated?: Date
}
```

**Animation:** CSS keyframe pulse, respects `prefers-reduced-motion`.

---

## Marketplace Components

### `ListingCard`

Product listing summary for marketplace grid/list views.

```typescript
interface ListingCardProps {
  listing: MarketplaceListing
  onViewDetails: () => void
  onMakeOffer?: () => void
}

interface MarketplaceListing {
  id: string
  productName: string
  category: ProductCategory
  quantity: number
  unit: string
  pricePerUnit: number
  currency: 'USD' | 'VET'
  originCountry: string
  availableFrom: Date
  dppVerified: boolean
  certifications: string[]
  producerTrustScore?: number
  coldChainRequired: boolean
}
```

---

### `SupplierTrustBadge`

Trust score for a marketplace supplier, built from their DPP history.

```typescript
interface SupplierTrustBadgeProps {
  score: number        // 0–100
  dppCount: number     // Total DPPs issued
  onChainSince: Date
  certifications: string[]
}
```

---

## Circular Economy Components

### `DiversionRouteMap`

SVG flow diagram showing waste routing.

```typescript
interface DiversionRouteMapProps {
  batches: WasteBatch[]
  routes: DiversionRoute[]
}

interface DiversionRoute {
  id: string
  sourceType: 'near-expiry' | 'organic-surplus' | 'byproduct' | 'residue'
  destinationType: 'animal-feed' | 'compost' | 'bioenergy' | 'industrial'
  quantity: number
  unit: string
  completedAt?: Date
  txHash?: string
}
```

---

### `ESGCertificate`

On-chain ESG diversion certificate display.

```typescript
interface ESGCertificateProps {
  certificate: {
    id: string
    orgName: string
    diversionType: string
    quantity: number
    unit: string
    carbonEquivalent: number
    issuedAt: Date
    txHash: string
    isVerified: boolean
  }
}
```

---

## TypeScript Model Definitions

### Core Domain Models

```typescript
/* ─── Product & DPP ─── */

export type ProductCategory =
  | 'produce'
  | 'grains'
  | 'dairy'
  | 'meat'
  | 'seafood'
  | 'beverages'
  | 'processed'
  | 'industrial'

export interface OriginData {
  country: string
  region?: string
  farm?: string
  coordinates?: { lat: number; lng: number }
  farmSize?: number
  farmSizeUnit?: 'ha' | 'acres'
}

export interface DPPRecord {
  batchId: string
  productName: string
  category: ProductCategory
  origin: OriginData
  harvestDate: Date
  expiryDate?: Date
  quantity: number
  unit: string
  certifications: Certification[]
  transitEvents: DPPEvent[]
  currentStatus: DPPStatus
  txHash: string
  mintedAt: Date
  lastUpdated: Date
}

export type DPPStatus = 'minted' | 'in-transit' | 'at-distribution' | 'at-retail' | 'delivered' | 'recalled'

export interface Certification {
  id: string
  name: string
  issuer: string
  issuedAt: Date
  validUntil?: Date
  verificationUrl?: string
  onChainHash?: string
}

/* ─── IoT ─── */

export type SensorType = 'temperature' | 'humidity' | 'gps' | 'rfid' | 'shock'
export type HealthState = 'healthy' | 'warning' | 'critical' | 'offline'

export interface IoTDevice {
  id: string
  type: SensorType
  name: string
  batchId: string
  isActive: boolean
  healthState: HealthState
  lastSeen: Date
}

export interface IoTReading {
  deviceId: string
  batchId: string
  sensorType: SensorType
  value: number | string
  unit: string
  timestamp: Date
  latitude?: number
  longitude?: number
  isWithinThreshold: boolean
  txHash?: string
}

/* ─── ESG ─── */

export interface ESGMetrics {
  orgId: string
  period: { from: Date; to: Date }
  compositeScore: number
  environmental: number
  social: number
  governance: number
  carbonFootprint: {
    scope1: number
    scope2: number
    scope3: number
    unit: 'tCO2e'
  }
  wasteMetrics: {
    totalWaste: number
    diverted: number
    diversionRate: number
    unit: 'tonnes'
  }
  complianceStatus: Record<string, ComplianceStatus>
}

export type ComplianceStatus = 'compliant' | 'partial' | 'non-compliant'

/* ─── Marketplace ─── */

export type OrderStatus = 'created' | 'pending-iot' | 'in-transit' | 'delivered' | 'completed' | 'disputed' | 'cancelled'

export interface Order {
  id: string
  listingId: string
  buyerAddress: string
  sellerAddress: string
  quantity: number
  unit: string
  pricePerUnit: number
  totalValue: number
  currency: 'VET'
  status: OrderStatus
  dppBatchId?: string
  iotConditions?: IoTCondition[]
  txHash?: string
  createdAt: Date
  updatedAt: Date
}

export interface IoTCondition {
  type: 'temperature' | 'humidity' | 'delivery-confirmation'
  operator: 'lte' | 'gte' | 'eq' | 'between'
  value: number | [number, number]
  unit: string
  isSatisfied: boolean
}

/* ─── Circular Economy ─── */

export type WasteDestination = 'animal-feed' | 'compost' | 'bioenergy' | 'industrial-reuse' | 'landfill'

export interface WasteBatch {
  id: string
  orgId: string
  productName: string
  quantity: number
  unit: string
  reason: 'near-expiry' | 'quality-fail' | 'overstock' | 'byproduct'
  destination: WasteDestination
  diversionCertificateId?: string
  status: 'registered' | 'matched' | 'in-transit' | 'completed'
  carbonEquivalent?: number
  createdAt: Date
}
```

---

## Custom Hooks

### Wallet & Authentication

```typescript
useWallet()           // → { address, isConnected, balance, vthoBalance }
useRequireWallet()    // → redirect to connect if not authenticated
```

### DPP

```typescript
useDPP(batchId: string)           // → { dpp, isLoading, error, refetch }
useDPPSearch(filters: DPPFilters) // → { results, total, page, setPage }
useMintDPP()                      // → { mint, status, txHash, error }
useUpdateDPPEvent()               // → { update, status, error }
```

### Marketplace

```typescript
useListings(filters: ListingFilters) // → { listings, isLoading }
useListing(id: string)               // → { listing, isLoading, error }
useCreateOrder()                     // → { createOrder, status, orderId }
useOrder(id: string)                 // → { order, isLoading, refetch }
```

### ESG

```typescript
useESGMetrics(orgId: string, period?: DateRange) // → { metrics, isLoading }
useESGReport(orgId: string)                      // → { generate, pdf, isGenerating }
```

### IoT

```typescript
useIoTDevices(batchId?: string)           // → { devices, isLoading }
useIoTReadings(deviceId: string)          // → { readings, isLive }
useIoTAlerts()                            // → { alerts, unreadCount, markRead }
```

---

*NAMA Component Architecture v1.0*

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
