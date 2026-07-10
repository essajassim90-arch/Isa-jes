export type ESGMetricType = 'carbon' | 'energy' | 'water' | 'waste' | 'compliance'

export interface ESGMetricSnapshot {
  metricType: ESGMetricType
  value: number
  unit: string
  timestamp: string
  source: 'simulated' | 'oracle' | 'manual'
}

export interface ESGReport {
  reportId: string
  orgId: string
  periodStart: string
  periodEnd: string
  complianceScore: number
  carbonFootprintKg: number
  circularRoutes: number
  generatedAt: string
  metrics: ESGMetricSnapshot[]
  blockRange?: { from: number; to: number }
}

export interface ESGCertificate {
  certId: string
  orgId: string
  issuedAt: string
  score: number
  txHash: string
}
