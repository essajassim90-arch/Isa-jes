export type CircularListingType = 'commercial' | 'circular'

export type CircularRouteStatus = 'active' | 'completed' | 'cancelled'

export type CircularDiversionType = 'animal-feed' | 'compost' | 'bioenergy' | 'reuse' | 'recycle'

export interface CircularDiversionRoute {
  routeId: string
  dppId: string
  batchId: string
  diversionType: CircularDiversionType
  kgDiverted: number
  status: CircularRouteStatus
  certificationId?: string
  certificationName?: string
  startedAt: string
  completedAt?: string
  /** SDG 2 — Zero Hunger: route contributes to food systems */
  sdg2Impact: boolean
  /** SDG 12 — Responsible Consumption and Production */
  sdg12Impact: boolean
  actorOrgId?: string
}

export interface CircularProcurementMetrics {
  routesCompleted: number
  kgDiverted: number
  sdg2ImpactEvents: number
  sdg12ImpactEvents: number
  generatedAt: string
}

export type ESGCircularBadgeTier = 'bronze' | 'silver' | 'gold'

export interface ESGCircularBadge {
  badgeId: string
  dppId: string
  batchId: string
  /** Certification names used as the on-chain-free basis for badge issuance */
  certificationBasis: string[]
  score: number
  tier: ESGCircularBadgeTier
  issuedAt: string
  validUntil?: string
  sdgAlignment: number[]
}

export type HeritageVaultCategory =
  | 'heritage-variety'
  | 'traditional-method'
  | 'protected-origin'

export interface HeritageVaultEntry {
  vaultId: string
  dppId: string
  batchId: string
  productName: string
  origin: string
  certificationSnapshot: string[]
  heritageScore: number
  category: HeritageVaultCategory
  registeredAt: string
  /** Simulation only — no new on-chain storage */
  status: 'simulated' | 'pending-on-chain'
}

export interface CircularPanel {
  metrics: CircularProcurementMetrics
  recentRoutes: CircularDiversionRoute[]
  badges: ESGCircularBadge[]
  heritageVault: HeritageVaultEntry[]
}
