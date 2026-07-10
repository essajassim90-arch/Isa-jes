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
  locationCode?: string
  txHash?: string
  metadata?: Record<string, unknown>
}

export interface DPPCertification {
  certificationId: string
  name: string
  issuerOrgId: string
  issuedAt: string
  expiresAt?: string
  onChainHash?: string
}

export interface DPP {
  dppId: string
  batchId: string
  productName: string
  originCountry: string
  status: DPPStatus
  certifications: DPPCertification[]
  events: DPPEvent[]
  createdAt: string
  updatedAt?: string
  txHash?: string
}
