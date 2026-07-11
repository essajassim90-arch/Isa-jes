import type {
  AIIScoreBreakdown,
  AIISnapshot,
  AuditSnapshot,
  EnterpriseDashboard,
  ExportJob,
  TelemetryCategorySummary,
  TelemetryEvent,
  TelemetrySummary
} from '@nama/shared'
import { dppService } from './dpp.service.ts'
import { esgService } from './esg.service.ts'
import { marketplaceService } from './marketplace.service.ts'
import { projectionQueryService } from './projection-query.service.ts'

interface ExportPayload {
  mimeType: string
  fileName: string
  content: string
}

function getSource(): 'projection' | 'demo' {
  return projectionQueryService.hasPassportProjectionData() ? 'projection' : 'demo'
}

function normalizeTelemetryEvent(value: unknown, batchId: string, eventId: string, actor?: string): TelemetryEvent | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const event = value as Record<string, unknown>
  const category = event['category']
  const numericValue = event['value']
  const unit = event['unit']
  const capturedAt = event['capturedAt']
  const status = event['status']
  const sdgGoals = event['sdgGoals']
  const tags = event['tags']

  if (
    (category !== 'water' && category !== 'energy' && category !== 'biodiversity' && category !== 'waste' && category !== 'compliance') ||
    typeof numericValue !== 'number' ||
    typeof unit !== 'string'
  ) {
    return null
  }

  return {
    id: `${eventId}-${category}-${numericValue}`,
    batchId,
    category,
    value: numericValue,
    unit,
    status: status === 'flagged' || status === 'captured' ? status : 'verified',
    sdgGoals: Array.isArray(sdgGoals) ? sdgGoals.filter((goal): goal is number => typeof goal === 'number') : [],
    source: 'projection',
    capturedAt: typeof capturedAt === 'string' ? capturedAt : new Date().toISOString(),
    actor,
    evidence: typeof event['evidence'] === 'string' ? event['evidence'] : undefined,
    tags: Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === 'string') : []
  }
}

function toGrade(score: number): AIISnapshot['grade'] {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  return 'D'
}

class EnterpriseService {
  getTelemetrySummary(batchId?: string): TelemetrySummary {
    const telemetry = dppService
      .listAll()
      .filter((dpp) => !batchId || dpp.batchId === batchId)
      .flatMap((dpp) =>
        dpp.events.flatMap((event, index) => {
          const payload = event.metadata?.['telemetry']
          if (!Array.isArray(payload)) {
            return []
          }

          return payload
            .map((entry) =>
              normalizeTelemetryEvent(entry, dpp.batchId, `${dpp.dppId ?? dpp.batchId}-${index}`, event.actor)
            )
            .filter((entry): entry is TelemetryEvent => entry !== null)
            .map((entry) => ({
              ...entry,
              passportId: dpp.dppId,
              capturedAt: event.timestamp,
              source: getSource() === 'projection' ? 'projection' : 'manual'
            }))
        })
      )
      .sort((left, right) => right.capturedAt.localeCompare(left.capturedAt))

    const categories = telemetry.reduce<Record<string, TelemetryCategorySummary>>((acc, entry) => {
      const key = entry.category
      const existing = acc[key]
      if (!existing) {
        acc[key] = {
          category: entry.category,
          totalValue: entry.value,
          unit: entry.unit,
          verifiedCount: entry.status === 'verified' ? 1 : 0,
          sdgGoals: [...entry.sdgGoals]
        }
        return acc
      }

      existing.totalValue = Number((existing.totalValue + entry.value).toFixed(2))
      existing.verifiedCount += entry.status === 'verified' ? 1 : 0
      existing.sdgGoals = [...new Set([...existing.sdgGoals, ...entry.sdgGoals])]
      return acc
    }, {})

    return {
      batchId,
      totals: {
        captured: telemetry.length,
        verified: telemetry.filter((entry) => entry.status === 'verified').length,
        flagged: telemetry.filter((entry) => entry.status === 'flagged').length
      },
      categories: Object.values(categories),
      recentEvents: telemetry.slice(0, 6)
    }
  }

  getAIISnapshot(batchId: string): AIISnapshot {
    const dpp = dppService.getByBatchId(batchId)
    if (!dpp) {
      throw new Error(`DPP "${batchId}" not found`)
    }

    const matchingListing = marketplaceService.getListings().find((listing) => listing.dppId === dpp.dppId)
    const certificationScore = Math.min(100, dpp.certifications.length * 35)
    const marketplaceScore = Math.min(100, matchingListing ? 55 + Math.min(30, matchingListing.quantity / 10) : 35)
    const telemetryScore = Math.min(100, this.getTelemetrySummary(batchId).totals.verified * 20)

    const breakdown: AIIScoreBreakdown[] = [
      {
        id: 'certifications',
        label: 'Certification readiness',
        weight: 0.45,
        score: certificationScore,
        rationale: 'Derived from attached certification evidence and expiry coverage.'
      },
      {
        id: 'marketplace',
        label: 'Marketplace traction',
        weight: 0.35,
        score: marketplaceScore,
        rationale: 'Measures active procurement visibility from the marketplace projection.'
      },
      {
        id: 'telemetry',
        label: 'Telemetry verifiability',
        weight: 0.2,
        score: telemetryScore,
        rationale: 'Rewards verified SDG telemetry events captured off-chain for audit use.'
      }
    ]

    const score = Math.round(
      breakdown.reduce((total, item) => total + item.score * item.weight, 0)
    )

    return {
      batchId,
      score,
      grade: toGrade(score),
      calculatedAt: new Date().toISOString(),
      certificationScore,
      marketplaceScore,
      breakdown,
      evidence: [
        ...dpp.certifications.map((certification) => `${certification.name} issued by ${certification.issuer}`),
        matchingListing ? `Listing ${matchingListing.listingId} open at ${matchingListing.unitPriceVET} VET` : 'No active marketplace listing',
        `${this.getTelemetrySummary(batchId).totals.verified} verified telemetry events available`
      ]
    }
  }

  getAuditSnapshots(): AuditSnapshot[] {
    const recentEvents = projectionQueryService.getRecentDomainEvents(12)
    const telemetry = this.getTelemetrySummary()

    return dppService.listAll().slice(0, 3).map((dpp, index) => {
      const flaggedTelemetry = telemetry.recentEvents.filter(
        (event) => event.batchId === dpp.batchId && event.status !== 'verified'
      )
      const passportEvents = recentEvents.filter(
        (event) => event.aggregateId === (dpp.dppId ?? dpp.batchId) || event.aggregateId === dpp.batchId
      )

      return {
        snapshotId: `audit-${index + 1}`,
        batchId: dpp.batchId,
        status: flaggedTelemetry.length > 0 ? 'attention' : 'verified',
        generatedAt: new Date().toISOString(),
        controls: [
          'Certification-derived AII evidence',
          'Projection-backed lifecycle history',
          'Event-based SDG telemetry review'
        ],
        findings: flaggedTelemetry.length > 0
          ? flaggedTelemetry.map((event) => `${event.category} telemetry still awaiting verification`)
          : ['No open telemetry exceptions'],
        eventCount: dpp.events.length + passportEvents.length,
        exportIds: [`passports-csv`, `audit-json`]
      }
    })
  }

  listExportJobs(): ExportJob[] {
    const generatedAt = new Date().toISOString()
    const telemetry = this.getTelemetrySummary()
    const source = getSource()
    const passports = dppService.listAll()
    const audits = this.getAuditSnapshots()

    const jobs: Omit<ExportJob, 'downloadPath'>[] = [
      { exportId: 'passports-csv', dataset: 'passports', format: 'csv', version: 'v1', status: 'ready', source, recordCount: passports.length, generatedAt },
      { exportId: 'passports-json', dataset: 'passports', format: 'json', version: 'v1', status: 'generated', source, recordCount: passports.length, generatedAt },
      { exportId: 'telemetry-csv', dataset: 'telemetry', format: 'csv', version: 'v1', status: 'ready', source, recordCount: telemetry.recentEvents.length, generatedAt },
      { exportId: 'telemetry-json', dataset: 'telemetry', format: 'json', version: 'v1', status: 'generated', source, recordCount: telemetry.recentEvents.length, generatedAt },
      { exportId: 'audit-csv', dataset: 'audit', format: 'csv', version: 'v1', status: 'ready', source, recordCount: audits.length, generatedAt },
      { exportId: 'audit-json', dataset: 'audit', format: 'json', version: 'v1', status: 'generated', source, recordCount: audits.length, generatedAt }
    ]

    return jobs.map((job) => ({
      ...job,
      downloadPath: `/enterprise/exports/${job.exportId}/download`
    }))
  }

  downloadExport(exportId: string): ExportPayload {
    const jobs = this.listExportJobs()
    const job = jobs.find((entry) => entry.exportId === exportId)
    if (!job) {
      throw new Error(`Export "${exportId}" not found`)
    }

    const passports = dppService.listAll().map((dpp) => ({
      batchId: dpp.batchId,
      product: dpp.productName ?? dpp.product,
      profile: dpp.profile ?? 'standard',
      status: dpp.status,
      workflowId: dpp.workflowId ?? 'producer-dpp-standard-v1',
      updatedAt: dpp.updatedAt ?? dpp.createdAt
    }))
    const telemetry = this.getTelemetrySummary().recentEvents.map((entry) => ({
      batchId: entry.batchId,
      category: entry.category,
      value: entry.value,
      unit: entry.unit,
      status: entry.status,
      sdgGoals: entry.sdgGoals.join('|'),
      capturedAt: entry.capturedAt
    }))
    const audits = this.getAuditSnapshots().map((entry) => ({
      batchId: entry.batchId,
      status: entry.status,
      eventCount: entry.eventCount,
      findings: entry.findings.join(' | '),
      generatedAt: entry.generatedAt
    }))

    const rows = job.dataset === 'passports' ? passports : job.dataset === 'telemetry' ? telemetry : audits
    if (job.format === 'json') {
      return {
        mimeType: 'application/json; charset=utf-8',
        fileName: `${job.exportId}.json`,
        content: JSON.stringify({ exportId: job.exportId, version: job.version, rows }, null, 2)
      }
    }

    const headers = Object.keys(rows[0] ?? {})
    const csvRows = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((header) => JSON.stringify(String(row[header as keyof typeof row] ?? '')))
          .join(',')
      )
    ]

    return {
      mimeType: 'text/csv; charset=utf-8',
      fileName: `${job.exportId}.csv`,
      content: csvRows.join('\n')
    }
  }

  getDashboard(): EnterpriseDashboard {
    const passports = dppService.listAll()
    const featuredBatchId = passports[0]?.batchId ?? 'demo-batch-001'
    const exportJobs = this.listExportJobs()
    const telemetry = this.getTelemetrySummary(featuredBatchId)

    return {
      generatedAt: new Date().toISOString(),
      source: getSource(),
      stats: {
        activePassports: passports.filter((passport) => passport.status === 'active').length,
        openListings: marketplaceService.getListings().length,
        telemetryVerified: telemetry.totals.verified,
        exportJobs: exportJobs.length
      },
      esg: esgService.getReport(featuredBatchId),
      telemetry,
      aii: this.getAIISnapshot(featuredBatchId),
      auditSnapshots: this.getAuditSnapshots(),
      exportJobs
    }
  }
}

export const enterpriseService = new EnterpriseService()
