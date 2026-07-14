import { randomUUID } from 'node:crypto'
import type { ESGReport, ESGMetricSnapshot } from '@nama/shared'
import { iotService } from './iot.service.ts'

/**
 * ESG Service — Phase 1B.
 * Derives ESG summaries from IoT sensor readings.
 * Integration with on-chain DPP data and real analytics will be added in Phase 2.
 */
class ESGService {
  getReport(orgId: string): ESGReport {
    const iotReadings = iotService.getLatestByBatchId(orgId)
    const now = new Date()

    // Derive carbon footprint from temperature readings above 20 °C baseline
    const tempReadings = iotReadings.filter(
      (r) => r.type === 'temperature' && typeof r.value === 'number',
    )
    const avgTemp =
      tempReadings.length > 0
        ? tempReadings.reduce((sum, r) => sum + (r.value as number), 0) / tempReadings.length
        : null
    const carbonFootprintKg =
      avgTemp !== null && avgTemp > 20
        ? Number(((avgTemp - 20) * 0.5).toFixed(2))
        : 0

    // Compliance score: start at 100, deduct 10 per critical IoT reading
    const criticalCount = iotReadings.filter((r) => {
      if (typeof r.value !== 'number') return false
      if (r.type === 'temperature') return r.value > 35
      if (r.type === 'humidity') return r.value > 80
      return false
    }).length
    const complianceScore = Math.max(0, 100 - criticalCount * 10)

    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const metrics: ESGMetricSnapshot[] = [
      {
        metricType: 'carbon',
        value: carbonFootprintKg,
        unit: 'kg CO2e',
        timestamp: now.toISOString(),
        source: 'simulated',
      },
      {
        metricType: 'compliance',
        value: complianceScore,
        unit: 'score',
        timestamp: now.toISOString(),
        source: 'simulated',
      },
    ]

    return {
      reportId: randomUUID(),
      orgId,
      periodStart,
      periodEnd: now.toISOString(),
      complianceScore,
      carbonFootprintKg,
      circularRoutes: 0,
      generatedAt: now.toISOString(),
      metrics,
    }
  }
}

export const esgService = new ESGService()
