import type { ESGReport } from './esg.types.ts'

export type InterfaceMode = 'enterprise' | 'producer'
export type DPPProfile = 'standard' | 'aqua'
export type WalletMode = 'wallet-light' | 'wallet-free-assisted'

export interface InterfaceViewPreset {
  mode: InterfaceMode
  label: string
  summary: string
  primaryCapabilities: string[]
}

export interface MetadataFieldOption {
  label: string
  value: string
}

export interface MetadataFieldDefinition {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'toggle'
  required?: boolean
  description?: string
  placeholder?: string
  options?: MetadataFieldOption[]
}

export interface WorkflowStepDefinition {
  id: string
  title: string
  description: string
  fields: MetadataFieldDefinition[]
}

export interface TelemetryTask {
  id: string
  title: string
  metric: string
  unit: string
  status: 'pending' | 'verified' | 'completed'
  source: 'manual' | 'nfc' | 'sensor'
  guidance: string
}

export interface NFCSimulationStatus {
  tagId: string
  status: 'ready' | 'paired' | 'verified'
  lastScannedAt?: string
  payloadHash?: string
}

export interface ProducerWorkflowDefinition {
  workflowId: string
  name: string
  profile: DPPProfile
  summary: string
  walletMode: WalletMode
  steps: WorkflowStepDefinition[]
  telemetryTasks: TelemetryTask[]
  nfcSimulation: NFCSimulationStatus
  recommendedMetadataTags: string[]
}

export interface TelemetryEvent {
  id: string
  batchId: string
  passportId?: string
  category: 'water' | 'energy' | 'biodiversity' | 'waste' | 'compliance'
  value: number
  unit: string
  status: 'captured' | 'verified' | 'flagged'
  sdgGoals: number[]
  source: 'manual' | 'sensor' | 'projection'
  capturedAt: string
  actor?: string
  evidence?: string
  tags: string[]
}

export interface TelemetryCategorySummary {
  category: TelemetryEvent['category']
  totalValue: number
  unit: string
  verifiedCount: number
  sdgGoals: number[]
}

export interface TelemetrySummary {
  batchId?: string
  totals: {
    captured: number
    verified: number
    flagged: number
  }
  categories: TelemetryCategorySummary[]
  recentEvents: TelemetryEvent[]
}

export interface AIIScoreBreakdown {
  id: string
  label: string
  weight: number
  score: number
  rationale: string
}

export interface AIISnapshot {
  batchId: string
  score: number
  grade: 'A' | 'B' | 'C' | 'D'
  calculatedAt: string
  certificationScore: number
  marketplaceScore: number
  breakdown: AIIScoreBreakdown[]
  evidence: string[]
}

export interface AuditSnapshot {
  snapshotId: string
  batchId: string
  status: 'verified' | 'attention'
  generatedAt: string
  controls: string[]
  findings: string[]
  eventCount: number
  exportIds: string[]
}

export interface ExportJob {
  exportId: string
  dataset: 'passports' | 'telemetry' | 'audit'
  format: 'csv' | 'json'
  version: 'v1'
  status: 'ready' | 'generated'
  source: 'projection' | 'demo'
  recordCount: number
  generatedAt: string
  downloadPath: string
}

export interface EnterpriseDashboard {
  generatedAt: string
  source: 'projection' | 'demo'
  stats: {
    activePassports: number
    openListings: number
    telemetryVerified: number
    exportJobs: number
  }
  esg: ESGReport
  telemetry: TelemetrySummary
  aii: AIISnapshot
  procurementInsights: Array<{
    listingId: string
    batchId: string
    aiiScore: number
    qualityIndicator: 'premium' | 'qualified' | 'watchlist'
    procurementSignal: 'strong' | 'moderate' | 'review'
  }>
  auditSnapshots: AuditSnapshot[]
  exportJobs: ExportJob[]
}
