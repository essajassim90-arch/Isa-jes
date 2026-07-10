import { Router } from 'express'
import { getListings, createListing, submitOrder } from '../controllers/marketplace.controller.ts'
import { authenticate } from '../middleware/auth.ts'

export const marketplaceRouter = Router()

/** GET /marketplace/listings — list active procurement listings */
marketplaceRouter.get('/listings', getListings)

/** POST /marketplace/listings — create a new procurement listing (requires auth) */
marketplaceRouter.post('/listings', authenticate, createListing)

/** POST /marketplace/order — submit a purchase order (requires auth) */
marketplaceRouter.post('/order', authenticate, submitOrder)
