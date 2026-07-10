import { Router } from 'express'
import { getListings, submitOrder } from '../controllers/marketplace.controller.ts'
import { authenticate } from '../middleware/auth.ts'

export const marketplaceRouter = Router()

/** GET /marketplace/listings — list active procurement listings */
marketplaceRouter.get('/listings', getListings)

/** POST /marketplace/order — submit a purchase order (requires auth) */
marketplaceRouter.post('/order', authenticate, submitOrder)
