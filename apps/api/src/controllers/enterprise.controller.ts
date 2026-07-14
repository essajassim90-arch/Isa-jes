import type { Request, Response } from 'express'
import { enterpriseService } from '../services/enterprise.service.ts'

export async function getEnterpriseDashboard(_req: Request, res: Response): Promise<void> {
  res.json(enterpriseService.getDashboard())
}

export async function getTelemetrySummary(req: Request, res: Response): Promise<void> {
  const batchId = typeof req.query['batchId'] === 'string' ? req.query['batchId'] : undefined
  res.json(enterpriseService.getTelemetrySummary(batchId))
}

export async function getAIISnapshot(req: Request, res: Response): Promise<void> {
  const batchId = req.params['batchId'] as string

  try {
    res.json(enterpriseService.getAIISnapshot(batchId))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to calculate AII snapshot'
    res.status(404).json({ error: message })
  }
}

export async function getAuditSnapshots(_req: Request, res: Response): Promise<void> {
  const snapshots = enterpriseService.getAuditSnapshots()
  res.json({ snapshots, total: snapshots.length })
}

export async function listExportJobs(_req: Request, res: Response): Promise<void> {
  const exports = enterpriseService.listExportJobs()
  res.json({ exports, total: exports.length })
}

export async function downloadExport(req: Request, res: Response): Promise<void> {
  const exportId = req.params['exportId'] as string

  try {
    const payload = enterpriseService.downloadExport(exportId)
    res.setHeader('Content-Type', payload.mimeType)
    res.setHeader('Content-Disposition', `attachment; filename="${payload.fileName}"`)
    res.send(payload.content)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Export not found'
    res.status(404).json({ error: message })
  }
}
