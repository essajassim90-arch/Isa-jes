import { Router } from 'express'
import { getDPP, getDPPTimeline, mintDPP, addDPPEvent } from '../controllers/dpp.controller.ts'
import { authenticate } from '../middleware/auth.ts'

export const dppRouter = Router()

/** GET /dpp/:batchId — fetch a Digital Product Passport by batch ID */
dppRouter.get('/:batchId', getDPP)

/** GET /dpp/:batchId/timeline — fetch timeline events for a DPP */
dppRouter.get('/:batchId/timeline', getDPPTimeline)

/** POST /dpp/mint — mint a new DPP on-chain (requires auth) */
dppRouter.post('/mint', authenticate, mintDPP)

/** POST /dpp/:batchId/event — record a transit or quality event (requires auth) */
dppRouter.post('/:batchId/event', authenticate, addDPPEvent)
