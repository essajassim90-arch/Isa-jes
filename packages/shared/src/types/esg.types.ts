export interface ESGReport {
  orgId: string
  carbonFootprintKg: number
  circularRoutes: number
  complianceScore: number
  generatedAt: string
  blockRange?: { from: number; to: number }
}

export interface ESGCertificate {
  certId: string
  orgId: string
  issuedAt: string
  score: number
  txHash: string
}
