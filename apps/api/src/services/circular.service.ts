import { randomUUID } from 'node:crypto'
import type {
  CircularDiversionRoute,
  CircularProcurementMetrics,
  ESGCircularBadge,
  ESGCircularBadgeTier,
  HeritageVaultEntry,
  CircularPanel,
} from '@nama/shared'
import { dppService } from './dpp.service.ts'

// ---------------------------------------------------------------------------
// Seeded simulation data — no new contracts, certification-based only
// ---------------------------------------------------------------------------

const seededRoutes: CircularDiversionRoute[] = [
  {
    routeId: 'circ-route-001',
    dppId: 'demo-dpp-001',
    batchId: 'demo-batch-001',
    diversionType: 'compost',
    kgDiverted: 42.0,
    status: 'completed',
    certificationName: 'Organic',
    startedAt: '2025-03-18T07:00:00.000Z',
    completedAt: '2025-03-20T09:00:00.000Z',
    sdg2Impact: true,
    sdg12Impact: true,
    actorOrgId: 'FARM-KE-001',
  },
  {
    routeId: 'circ-route-002',
    dppId: 'demo-dpp-001',
    batchId: 'demo-batch-001',
    diversionType: 'animal-feed',
    kgDiverted: 18.5,
    status: 'completed',
    certificationName: 'Fair Trade',
    startedAt: '2025-03-15T06:30:00.000Z',
    completedAt: '2025-03-17T08:00:00.000Z',
    sdg2Impact: true,
    sdg12Impact: false,
    actorOrgId: 'FARM-KE-001',
  },
  {
    routeId: 'circ-route-003',
    dppId: 'demo-dpp-aqua-001',
    batchId: 'aqua-batch-001',
    diversionType: 'bioenergy',
    kgDiverted: 11.2,
    status: 'active',
    certificationName: 'ASC Ready',
    startedAt: '2025-03-27T05:00:00.000Z',
    sdg2Impact: false,
    sdg12Impact: true,
    actorOrgId: 'AQUA-PRODUCER-009',
  },
]

function deriveBadgeTier(score: number): ESGCircularBadgeTier {
  if (score >= 80) return 'gold'
  if (score >= 55) return 'silver'
  return 'bronze'
}

function deriveBadgeScore(certificationCount: number, routeCount: number): number {
  return Math.min(100, certificationCount * 30 + routeCount * 15)
}

class CircularService {
  getRoutes(): CircularDiversionRoute[] {
    // Merge seeded routes with any cert-derived dynamic routes from live DPPs
    const live = dppService.listAll().flatMap((dpp) => {
      const existing = seededRoutes.filter((r) => r.dppId === dpp.dppId || r.batchId === dpp.batchId)
      if (existing.length > 0) return []
      return dpp.certifications.map<CircularDiversionRoute>((cert, idx) => ({
        routeId: `dyn-route-${dpp.batchId}-${idx}`,
        dppId: dpp.dppId ?? dpp.batchId,
        batchId: dpp.batchId,
        diversionType: 'compost',
        kgDiverted: 0,
        status: 'active',
        certificationName: cert.name,
        startedAt: cert.issuedAt,
        sdg2Impact: true,
        sdg12Impact: true,
        actorOrgId: dpp.origin,
      }))
    })

    return [...seededRoutes, ...live]
  }

  getMetrics(): CircularProcurementMetrics {
    const routes = this.getRoutes()
    const completed = routes.filter((r) => r.status === 'completed')
    return {
      routesCompleted: completed.length,
      kgDiverted: routes.reduce((sum, r) => sum + r.kgDiverted, 0),
      sdg2ImpactEvents: routes.filter((r) => r.sdg2Impact).length,
      sdg12ImpactEvents: routes.filter((r) => r.sdg12Impact).length,
      generatedAt: new Date().toISOString(),
    }
  }

  getBadge(dppId: string): ESGCircularBadge | null {
    const dpp = dppService.listAll().find((d) => d.dppId === dppId || d.batchId === dppId)
    if (!dpp) return null

    const routes = this.getRoutes().filter((r) => r.dppId === dppId || r.batchId === dppId)
    const score = deriveBadgeScore(dpp.certifications.length, routes.filter((r) => r.status === 'completed').length)

    const sdgAlignment = [...new Set(routes.flatMap((r) => {
      const goals: number[] = []
      if (r.sdg2Impact) goals.push(2)
      if (r.sdg12Impact) goals.push(12)
      return goals
    }))]

    return {
      badgeId: randomUUID(),
      dppId: dpp.dppId ?? dppId,
      batchId: dpp.batchId,
      certificationBasis: dpp.certifications.map((c) => c.name),
      score,
      tier: deriveBadgeTier(score),
      issuedAt: new Date().toISOString(),
      validUntil: dpp.certifications[0]?.expiresAt,
      sdgAlignment,
    }
  }

  getAllBadges(): ESGCircularBadge[] {
    return dppService.listAll()
      .map((dpp) => this.getBadge(dpp.dppId ?? dpp.batchId))
      .filter((b): b is ESGCircularBadge => b !== null)
  }

  getHeritageVault(): HeritageVaultEntry[] {
    return dppService.listAll().map<HeritageVaultEntry>((dpp, idx) => {
      const certNames = dpp.certifications.map((c) => c.name)
      const heritageScore = Math.min(100, certNames.length * 40 + (dpp.originCountry ? 20 : 0))

      const categories = ['heritage-variety', 'traditional-method', 'protected-origin'] as const
      const category = categories[idx % 3]

      return {
        vaultId: `heritage-${dpp.batchId}`,
        dppId: dpp.dppId ?? dpp.batchId,
        batchId: dpp.batchId,
        productName: dpp.productName ?? dpp.product,
        origin: dpp.originCountry ?? dpp.origin,
        certificationSnapshot: certNames,
        heritageScore,
        category,
        registeredAt: dpp.createdAt,
        status: 'simulated',
      }
    })
  }

  getCircularPanel(): CircularPanel {
    return {
      metrics: this.getMetrics(),
      recentRoutes: this.getRoutes().slice(0, 5),
      badges: this.getAllBadges(),
      heritageVault: this.getHeritageVault(),
    }
  }
}

export const circularService = new CircularService()
