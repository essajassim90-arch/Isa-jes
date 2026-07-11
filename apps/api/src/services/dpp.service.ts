import { randomUUID } from 'node:crypto'
import type { DPP, DPPCertification, DPPEvent, DPPEventType, DPPStatus, DPPProfile } from '@nama/shared'
import { projectionQueryService } from './projection-query.service.ts'
import { getWorkflowDefinition } from './workflow-catalog.ts'

// In-memory store — replaced with on-chain + DB persistence in later phases
const store = new Map<string, DPP>()

const VALID_EVENT_TYPES: DPPEventType[] = ['created', 'transit', 'storage', 'quality_check', 'delivered']
const VALID_STATUSES: DPPStatus[] = ['active', 'delivered', 'recalled', 'expired']

function isValidEventType(value: unknown): value is DPPEventType {
  return VALID_EVENT_TYPES.includes(value as DPPEventType)
}

function isValidStatus(value: unknown): value is DPPStatus {
  return VALID_STATUSES.includes(value as DPPStatus)
}

function toDppStatusFromActive(active: number | null): DPPStatus {
  return active === 1 ? 'active' : 'recalled'
}

function toDppEventType(value: string): DPPEventType {
  const normalized = value.toLowerCase()

  if (normalized.includes('certification')) {
    return 'quality_check'
  }

  if (normalized.includes('quality')) {
    return 'quality_check'
  }

  if (normalized.includes('transit')) {
    return 'transit'
  }

  if (normalized.includes('storage')) {
    return 'storage'
  }

  if (normalized.includes('deliver')) {
    return 'delivered'
  }

  return 'created'
}

function decodeCertType(certType: string | null): string {
  if (!certType) {
    return 'Passport Certification'
  }

  const normalized = certType.toLowerCase()
  if (normalized.includes('org')) return 'Organic'
  if (normalized.includes('fair')) return 'Fair Trade'
  if (normalized.includes('sdg')) return 'SDG Verified'
  if (normalized.includes('aii')) return 'AII Evidence'
  if (normalized.startsWith('0x')) return 'Passport Certification'
  return certType
}

function mapProjectionCertification(certification: {
  certType: string | null
  issuer: string | null
  certificationHash: string | null
  issuedAt: string | null
  expiresAt: string | null
  occurredAt: string
}): DPPCertification {
  return {
    name: decodeCertType(certification.certType),
    issuer: certification.issuer ?? 'Verified Issuer',
    issuedAt: certification.issuedAt ?? certification.occurredAt,
    expiresAt: certification.expiresAt ?? undefined,
    onChainHash: certification.certificationHash ?? undefined
  }
}

interface MintPayload {
  batchId: string
  product: string
  origin: string
  productName?: string
  originCountry?: string
  profile?: DPPProfile
  workflowId?: string
  metadata?: Record<string, unknown>
  status?: string
}

function isMintPayload(value: unknown): value is MintPayload {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Record<string, unknown>
  return typeof p['batchId'] === 'string' && typeof p['product'] === 'string' && typeof p['origin'] === 'string'
}

interface EventPayload {
  eventType: DPPEventType
  timestamp?: string
  actorOrgId?: string
  actor?: string
  locationCode?: string
  location?: string
  metadata?: Record<string, unknown>
}

function isEventPayload(value: unknown): value is EventPayload {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Record<string, unknown>
  return isValidEventType(p['eventType'])
}

// Seed demo-batch-001 on startup for the NAMA demo flow
store.set('demo-batch-001', {
  dppId: 'demo-dpp-001',
  batchId: 'demo-batch-001',
  product: 'org.coffee.arabica',
  productName: 'Single-Origin Arabica Coffee Beans',
  origin: 'FARM-KE-001',
  originCountry: 'Kenya',
  status: 'active',
  profile: 'standard',
  workflowId: 'producer-dpp-standard-v1',
  certifications: [
    {
      name: 'Organic',
      issuer: 'Kenya Organic Farmers Association',
      issuedAt: '2025-01-15T00:00:00.000Z',
    },
    {
      name: 'Fair Trade',
      issuer: 'FLO-CERT GmbH',
      issuedAt: '2025-02-01T00:00:00.000Z',
      expiresAt: '2027-02-01T00:00:00.000Z',
    },
  ],
  events: [
    {
      eventType: 'created',
      timestamp: '2025-03-01T06:00:00.000Z',
      actor: 'FARM-KE-001',
      location: 'Nyeri County, Kenya',
      metadata: {
        telemetry: [
          { category: 'biodiversity', value: 1, unit: 'event', sdgGoals: [15], status: 'verified', tags: ['agroforestry'] }
        ]
      }
    },
    {
      eventType: 'transit',
      timestamp: '2025-03-05T10:30:00.000Z',
      actor: 'LOGISTICS-001',
      location: 'Mombasa Port, Kenya',
      metadata: {
        telemetry: [
          { category: 'energy', value: 12.4, unit: 'kWh', sdgGoals: [7, 13], status: 'verified', tags: ['dispatch', 'cold-chain'] }
        ]
      }
    },
    {
      eventType: 'storage',
      timestamp: '2025-03-12T14:00:00.000Z',
      actor: 'WAREHOUSE-AE-001',
      location: 'Dubai, UAE',
      metadata: {
        telemetry: [
          { category: 'waste', value: 2.1, unit: 'kg', sdgGoals: [12], status: 'captured', tags: ['storage-loss'] }
        ]
      }
    },
    {
      eventType: 'quality_check',
      timestamp: '2025-03-20T09:00:00.000Z',
      actor: 'QA-TEAM-001',
      location: 'Dubai, UAE',
      metadata: {
        telemetry: [
          { category: 'compliance', value: 1, unit: 'event', sdgGoals: [12], status: 'verified', tags: ['qa', 'audit'] }
        ]
      }
    },
  ],
  metadata: {
    producerCooperative: 'Nyeri Highlands Cooperative',
    lotSizeKg: 500,
    harvestDate: '2025-02-24',
    packagingType: 'jute',
    certificationsVerified: true
  },
  createdAt: '2025-03-01T06:00:00.000Z',
})

store.set('aqua-batch-001', {
  dppId: 'demo-dpp-aqua-001',
  batchId: 'aqua-batch-001',
  product: 'org.shrimp.vannamei',
  productName: 'Vannamei Shrimp Harvest Lot',
  origin: 'POND-ID-009',
  originCountry: 'Indonesia',
  status: 'active',
  profile: 'aqua',
  workflowId: 'producer-aqua-dpp-v1',
  certifications: [
    {
      name: 'ASC Ready',
      issuer: 'Regional Aqua Assurance Board',
      issuedAt: '2025-03-10T00:00:00.000Z'
    }
  ],
  events: [
    {
      eventType: 'created',
      timestamp: '2025-03-24T05:30:00.000Z',
      actor: 'AQUA-PRODUCER-009',
      location: 'Makassar, Indonesia',
      metadata: {
        telemetry: [
          { category: 'water', value: 7.6, unit: 'pH', sdgGoals: [6, 14], status: 'verified', tags: ['pond-baseline'] }
        ]
      }
    },
    {
      eventType: 'quality_check',
      timestamp: '2025-03-28T06:45:00.000Z',
      actor: 'BIOSECURITY-TEAM-03',
      location: 'Makassar, Indonesia',
      metadata: {
        telemetry: [
          { category: 'water', value: 6.8, unit: 'mg/L', sdgGoals: [6, 14], status: 'verified', tags: ['oxygen'] },
          { category: 'biodiversity', value: 1, unit: 'event', sdgGoals: [14], status: 'captured', tags: ['feed-audit'] }
        ]
      }
    }
  ],
  metadata: {
    species: 'Litopenaeus vannamei',
    pondId: 'POND-ID-009',
    harvestWindow: '2025-04-02',
    dissolvedOxygenMgL: 6.8,
    salinityPpt: 14,
    feedCertification: 'IFFO RS'
  },
  createdAt: '2025-03-24T05:30:00.000Z'
})

function attachWorkflow(dpp: DPP): DPP {
  const profile = dpp.profile ?? 'standard'
  return {
    ...dpp,
    profile,
    workflowId: dpp.workflowId ?? getWorkflowDefinition(undefined, profile).workflowId,
    workflow: getWorkflowDefinition(dpp.workflowId, profile)
  }
}

class DPPService {
  getCertificationsByBatchId(batchId: string): DPPCertification[] | undefined {
    if (projectionQueryService.hasPassportProjectionData()) {
      const passport = projectionQueryService.getPassportStateByBatchId(batchId)
      if (!passport) {
        return undefined
      }

      return projectionQueryService.getPassportCertifications(passport.passportId).map(mapProjectionCertification)
    }

    const dpp = store.get(batchId)
    return dpp?.certifications
  }

  getByBatchId(batchId: string): DPP | undefined {
    if (projectionQueryService.hasPassportProjectionData()) {
      const passport = projectionQueryService.getPassportStateByBatchId(batchId)
      if (!passport) {
        return undefined
      }

      const timeline = projectionQueryService.getPassportTimeline(passport.passportId)
      const certifications = projectionQueryService
        .getPassportCertifications(passport.passportId)
        .map(mapProjectionCertification)
      const events: DPPEvent[] = timeline.map((event) => ({
        eventType: toDppEventType(event.eventType),
        timestamp: event.eventTimestamp ?? event.occurredAt,
        actor: event.actor ?? undefined,
        locationCode: event.locationCode ?? undefined,
        location: event.locationCode ?? undefined
      }))

      return attachWorkflow({
        dppId: passport.passportId,
        batchId: passport.batchId ?? batchId,
        product: passport.product ?? 'unknown',
        origin: passport.origin ?? 'unknown',
        status: toDppStatusFromActive(passport.active),
        certifications,
        events,
        createdAt: passport.createdAt ?? passport.updatedAt ?? new Date().toISOString(),
        updatedAt: passport.updatedAt ?? undefined
      })
    }

    const dpp = store.get(batchId)
    return dpp ? attachWorkflow(dpp) : undefined
  }

  getTimelineByBatchId(batchId: string): DPPEvent[] | undefined {
    if (projectionQueryService.hasPassportProjectionData()) {
      const passport = projectionQueryService.getPassportStateByBatchId(batchId)
      if (!passport) {
        return undefined
      }

      return projectionQueryService.getPassportTimeline(passport.passportId).map((event) => ({
        eventType: toDppEventType(event.eventType),
        timestamp: event.eventTimestamp ?? event.occurredAt,
        actor: event.actor ?? undefined,
        locationCode: event.locationCode ?? undefined,
        location: event.locationCode ?? undefined
      }))
    }

    return store.get(batchId)?.events
  }

  listAll(): DPP[] {
    if (projectionQueryService.hasPassportProjectionData()) {
      return projectionQueryService.getPassportStates().map((passport) => {
        const certifications = projectionQueryService
          .getPassportCertifications(passport.passportId)
          .map(mapProjectionCertification)

        return attachWorkflow({
          dppId: passport.passportId,
          batchId: passport.batchId ?? passport.passportId,
          product: passport.product ?? 'unknown',
          origin: passport.origin ?? 'unknown',
          status: toDppStatusFromActive(passport.active),
          certifications,
          events: [],
          createdAt: passport.createdAt ?? passport.updatedAt ?? new Date().toISOString(),
          updatedAt: passport.updatedAt ?? undefined
        })
      })
    }

    return [...store.values()].map((dpp) => attachWorkflow(dpp))
  }

  mint(payload: unknown): DPP {
    if (!isMintPayload(payload)) {
      throw new Error('Invalid DPP payload: batchId, product, and origin are required')
    }
    if (store.has(payload.batchId)) {
      throw new Error(`DPP with batchId "${payload.batchId}" already exists`)
    }
    const status: DPPStatus = isValidStatus(payload.status) ? payload.status : 'active'
    const dpp: DPP = {
      dppId: randomUUID(),
      batchId: payload.batchId,
      product: payload.product,
      productName: payload.productName,
      origin: payload.origin,
      originCountry: payload.originCountry,
      status,
      profile: payload.profile ?? 'standard',
      workflowId: payload.workflowId,
      certifications: [],
      events: [
        {
          eventType: 'created',
          timestamp: new Date().toISOString(),
        },
      ],
      metadata: payload.metadata,
      createdAt: new Date().toISOString(),
    }
    store.set(dpp.batchId, dpp)
    return attachWorkflow(dpp)
  }

  addEvent(batchId: string, payload: unknown): DPP {
    const dpp = store.get(batchId)
    if (!dpp) {
      throw new Error(`DPP with batchId "${batchId}" not found`)
    }
    if (!isEventPayload(payload)) {
      throw new Error('Invalid event payload: eventType is required and must be a valid DPPEventType')
    }
    const event: DPPEvent = {
      eventType: payload.eventType,
      timestamp: payload.timestamp ?? new Date().toISOString(),
      actorOrgId: payload.actorOrgId,
      actor: payload.actor,
      locationCode: payload.locationCode,
      location: payload.location,
      metadata: payload.metadata,
    }
    dpp.events.push(event)
    dpp.updatedAt = new Date().toISOString()
    return attachWorkflow(dpp)
  }
}

export const dppService = new DPPService()
