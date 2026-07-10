import { Router } from 'express'
import { getESGReport } from '../controllers/esg.controller.ts'
import { authenticate } from '../middleware/auth.ts'

export const esgRouter = Router()

/** GET /esg/report/:orgId — generate ESG compliance report (requires auth) */
esgRouter.get('/report/:orgId', authenticate, getESGReport)
