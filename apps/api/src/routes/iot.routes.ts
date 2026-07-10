import { Router } from 'express'
import { ingestReading, getLatestReadings } from '../controllers/iot.controller.ts'
import { authenticate } from '../middleware/auth.ts'

export const iotRouter = Router()

/** POST /iot/reading — ingest an IoT sensor reading (requires auth) */
iotRouter.post('/reading', authenticate, ingestReading)

/** GET /iot/readings/:batchId — get latest readings for a batch (requires auth) */
iotRouter.get('/readings/:batchId', authenticate, getLatestReadings)
