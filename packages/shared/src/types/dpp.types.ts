import type { DPPProfile, ProducerWorkflowDefinition } from './experience.types.ts'

export type DPPStatus = 'active' | 'delivered' | 'recalled' | 'expired'

export type DPPEventType =
  | 'created'
  | 'transit'
  | 'storage'
  | 'quality_check'
  | 'delivered'

export interface DPPEvent {
  eventType: DPPEventType
  timestamp: string
  actorOrgId?: string
  actor?: string
  locationCode?: string
  location?: string
  txHash?: string
  metadata?: Record<string, unknown>
}

export interface DPPCertification {
  certificationId?: string
  name: string
  issuerOrgId?: string
  issuer: string
  issuedAt: string
  expiresAt?: string
  onChainHash?: string
}

export interface DPP {
  dppId?: string
  batchId: string
  product: string
  productName?: string
  origin: string
  originCountry?: string
  status: DPPStatus
  certifications: DPPCertification[]
  events: DPPEvent[]
  profile?: DPPProfile
  workflowId?: string
  workflow?: ProducerWorkflowDefinition
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt?: string
  txHash?: string
}
