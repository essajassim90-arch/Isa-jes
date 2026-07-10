import type { Request, Response } from 'express'
import { marketplaceService } from '../services/marketplace.service.ts'

export async function getListings(_req: Request, res: Response): Promise<void> {
  const listings = marketplaceService.getListings()
  res.json({ listings, total: listings.length })
}

export async function createListing(req: Request, res: Response): Promise<void> {
  try {
    const listing = marketplaceService.createListing(req.body)
    res.status(201).json(listing)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid listing payload'
    res.status(400).json({ error: message })
  }
}

export async function submitOrder(req: Request, res: Response): Promise<void> {
  // TODO (Phase 2): call Marketplace.sol createOrder via vechain.service once contract is deployed
  try {
    const offer = marketplaceService.createOrder(req.body)
    res.status(201).json(offer)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid order payload'
    res.status(400).json({ error: message })
  }
}
