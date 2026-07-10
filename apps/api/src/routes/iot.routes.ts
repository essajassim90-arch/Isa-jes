import { Router } from 'express'
import { ingestReading } from '../controllers/iot.controller.ts'
import { authenticate } from '../middleware/auth.ts'

export const iotRouter = Router()

/** POST /iot/reading — ingest an IoT sensor reading (requires auth) */
iotRouter.post('/reading', authenticate, ingestReading)
