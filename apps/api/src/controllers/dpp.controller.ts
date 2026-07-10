import type { Request, Response } from 'express'
import { dppService } from '../services/dpp.service.ts'

export async function getDPP(req: Request, res: Response): Promise<void> {
  const batchId = req.params['batchId'] as string
  const dpp = dppService.getByBatchId(batchId)
  if (!dpp) {
    res.status(404).json({ error: 'DPP not found' })
    return
  }
  res.json(dpp)
}

export async function mintDPP(req: Request, res: Response): Promise<void> {
  // TODO (Phase 2): call DPP.sol mintDPP via vechain.service once contract is deployed
  try {
    const result = dppService.mint(req.body)
    res.status(201).json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to mint DPP'
    res.status(400).json({ error: message })
  }
}

export async function addDPPEvent(req: Request, res: Response): Promise<void> {
  const batchId = req.params['batchId'] as string
  // TODO (Phase 2): call DPP.sol addEvent via vechain.service once contract is deployed
  try {
    const result = dppService.addEvent(batchId, req.body)
    res.status(201).json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to add DPP event'
    res.status(400).json({ error: message })
  }
}
