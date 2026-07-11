import { Router } from 'express'
import {
  downloadExport,
  getAIISnapshot,
  getAuditSnapshots,
  getEnterpriseDashboard,
  getTelemetrySummary,
  listExportJobs
} from '../controllers/enterprise.controller.ts'

export const enterpriseRouter = Router()

enterpriseRouter.get('/dashboard', getEnterpriseDashboard)
enterpriseRouter.get('/telemetry', getTelemetrySummary)
enterpriseRouter.get('/aii/:batchId', getAIISnapshot)
enterpriseRouter.get('/audit', getAuditSnapshots)
enterpriseRouter.get('/exports', listExportJobs)
enterpriseRouter.get('/exports/:exportId/download', downloadExport)
