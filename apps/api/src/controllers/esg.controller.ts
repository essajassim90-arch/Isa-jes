import type { Request, Response } from 'express'
import { esgService } from '../services/esg.service.ts'

export async function getESGReport(req: Request, res: Response): Promise<void> {
  const orgId = req.params['orgId'] as string
  const report = esgService.getReport(orgId)
  res.json(report)
}
