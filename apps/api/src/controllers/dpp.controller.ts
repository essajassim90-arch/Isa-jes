import type { Request, Response } from 'express'
import { dppService } from '../services/dpp.service.ts'

export async function getDPP(req: Request, res: Response): Promise<void> {
  const { batchId } = req.params
  const dpp = await dppService.getByBatchId(batchId)
  if (!dpp) {
    res.status(404).json({ error: 'DPP not found' })
    return
  }
  res.json(dpp)
}

export async function mintDPP(req: Request, res: Response): Promise<void> {
  // TODO (Phase 1): call DPP.sol mintDPP via vechain.service
  const result = await dppService.mint(req.body)
  res.status(201).json(result)
}

export async function addDPPEvent(req: Request, res: Response): Promise<void> {
  const { batchId } = req.params
  // TODO (Phase 1): call DPP.sol addEvent via vechain.service
  const result = await dppService.addEvent(batchId, req.body)
  res.status(201).json(result)
}
