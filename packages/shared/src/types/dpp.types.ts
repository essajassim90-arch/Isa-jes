export interface DPPEvent {
  eventType: 'created' | 'transit' | 'storage' | 'delivered' | 'quality_check'
  timestamp: string
  location?: string
  actor?: string
  txHash?: string
  metadata?: Record<string, unknown>
}

export interface DPPCertification {
  name: string
  issuer: string
  issuedAt: string
  expiresAt?: string
  onChainHash?: string
}

export interface DPP {
  batchId: string
  product: string
  origin: string
  status: 'active' | 'delivered' | 'recalled' | 'expired'
  certifications: DPPCertification[]
  events: DPPEvent[]
  createdAt: string
  updatedAt?: string
  txHash?: string
}
