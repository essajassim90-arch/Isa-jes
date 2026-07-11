import type { Request, Response } from 'express'
import { circularService } from '../services/circular.service.ts'

export async function getCircularMetrics(_req: Request, res: Response): Promise<void> {
  const metrics = circularService.getMetrics()
  res.json(metrics)
}

export async function getCircularRoutes(_req: Request, res: Response): Promise<void> {
  const routes = circularService.getRoutes()
  res.json({ routes, total: routes.length })
}

export async function getCircularBadge(req: Request, res: Response): Promise<void> {
  const dppId = req.params['dppId'] as string
  const badge = circularService.getBadge(dppId)
  if (!badge) {
    res.status(404).json({ error: `No circular badge found for DPP "${dppId}"` })
    return
  }
  res.json(badge)
}

export async function getAllCircularBadges(_req: Request, res: Response): Promise<void> {
  const badges = circularService.getAllBadges()
  res.json({ badges, total: badges.length })
}

export async function getHeritageVault(_req: Request, res: Response): Promise<void> {
  const entries = circularService.getHeritageVault()
  res.json({ entries, total: entries.length })
}

export async function getCircularPanel(_req: Request, res: Response): Promise<void> {
  const panel = circularService.getCircularPanel()
  res.json(panel)
}
