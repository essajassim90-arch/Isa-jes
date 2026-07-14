import type { Request, Response } from 'express'
import { iotService } from '../services/iot.service.ts'

export async function ingestReading(req: Request, res: Response): Promise<void> {
  try {
    const result = iotService.ingest(req.body)
    res.status(201).json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid reading payload'
    res.status(400).json({ error: message })
  }
}

export async function getLatestReadings(req: Request, res: Response): Promise<void> {
  const batchId = req.params['batchId'] as string
  const readings = iotService.getLatestByBatchId(batchId)
  res.json({ batchId, readings, count: readings.length })
}
