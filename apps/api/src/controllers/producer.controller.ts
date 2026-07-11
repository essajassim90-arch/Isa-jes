import type { Request, Response } from 'express'
import { producerService } from '../services/producer.service.ts'

export async function getProducerWorkspace(_req: Request, res: Response): Promise<void> {
  res.json(producerService.getWorkspace())
}
