import { Router } from 'express'
import { getESGReport } from '../controllers/esg.controller.ts'

export const esgRouter = Router()

/** GET /esg/report/:orgId — generate ESG compliance report (public for demo reads) */
esgRouter.get('/report/:orgId', getESGReport)
