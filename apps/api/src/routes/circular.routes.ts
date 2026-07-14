import { Router } from 'express'
import {
  getCircularMetrics,
  getCircularRoutes,
  getCircularBadge,
  getAllCircularBadges,
  getHeritageVault,
  getCircularPanel,
} from '../controllers/circular.controller.ts'

export const circularRouter = Router()

/** GET /circular/metrics — circular procurement KPIs */
circularRouter.get('/metrics', getCircularMetrics)

/** GET /circular/routes — circular diversion route telemetry */
circularRouter.get('/routes', getCircularRoutes)

/** GET /circular/badges — all ESG circular badges */
circularRouter.get('/badges', getAllCircularBadges)

/** GET /circular/badge/:dppId — ESG circular badge for a specific DPP */
circularRouter.get('/badge/:dppId', getCircularBadge)

/** GET /circular/heritage-vault — heritage vault simulation entries */
circularRouter.get('/heritage-vault', getHeritageVault)

/** GET /circular/panel — full circular panel (metrics + routes + badges + vault) */
circularRouter.get('/panel', getCircularPanel)
