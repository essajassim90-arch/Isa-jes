import type { Request, Response } from 'express'

export async function getListings(_req: Request, res: Response): Promise<void> {
  // TODO (Phase 1): query Marketplace.sol listings via vechain.service
  res.json({ listings: [], total: 0 })
}

export async function submitOrder(req: Request, res: Response): Promise<void> {
  // TODO (Phase 1): call Marketplace.sol createOrder via vechain.service
  res.status(201).json({ message: 'Order submitted', data: req.body })
}
