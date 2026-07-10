import { randomUUID } from 'node:crypto'
import type { DPP, DPPEvent, DPPEventType, DPPStatus } from '@nama/shared'

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

interface MintPayload {
  batchId: string
  product: string
  origin: string
  productName?: string
  originCountry?: string
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
    },
    {
      eventType: 'transit',
      timestamp: '2025-03-05T10:30:00.000Z',
      actor: 'LOGISTICS-001',
      location: 'Mombasa Port, Kenya',
    },
    {
      eventType: 'storage',
      timestamp: '2025-03-12T14:00:00.000Z',
      actor: 'WAREHOUSE-AE-001',
      location: 'Dubai, UAE',
    },
    {
      eventType: 'quality_check',
      timestamp: '2025-03-20T09:00:00.000Z',
      actor: 'QA-TEAM-001',
      location: 'Dubai, UAE',
    },
  ],
  createdAt: '2025-03-01T06:00:00.000Z',
})

class DPPService {
  getByBatchId(batchId: string): DPP | undefined {
    return store.get(batchId)
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
      certifications: [],
      events: [
        {
          eventType: 'created',
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    }
    store.set(dpp.batchId, dpp)
    return dpp
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
    return dpp
  }
}

export const dppService = new DPPService()
