import { Router } from 'express'
import { getProducerWorkspace } from '../controllers/producer.controller.ts'

export const producerRouter = Router()

producerRouter.get('/workspace', getProducerWorkspace)
