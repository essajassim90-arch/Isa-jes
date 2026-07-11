import { Router } from 'express'
import {
  getListings,
  getListingState,
  getOfferState,
  createListing,
  submitOrder
} from '../controllers/marketplace.controller.ts'
import { authenticate } from '../middleware/auth.ts'

export const marketplaceRouter = Router()

/** GET /marketplace/listings — list active procurement listings */
marketplaceRouter.get('/listings', getListings)

/** GET /marketplace/listings/:listingId — fetch listing state */
marketplaceRouter.get('/listings/:listingId', getListingState)

/** GET /marketplace/offers/:offerId — fetch offer state */
marketplaceRouter.get('/offers/:offerId', getOfferState)

/** POST /marketplace/listings — create a new procurement listing (requires auth) */
marketplaceRouter.post('/listings', authenticate, createListing)

/** POST /marketplace/order — submit a purchase order (requires auth) */
marketplaceRouter.post('/order', authenticate, submitOrder)
