import express from 'express'
import cors from 'cors'
import { dppRouter } from './routes/dpp.routes.ts'
import { marketplaceRouter } from './routes/marketplace.routes.ts'
import { esgRouter } from './routes/esg.routes.ts'
import { iotRouter } from './routes/iot.routes.ts'
import { enterpriseRouter } from './routes/enterprise.routes.ts'
import { producerRouter } from './routes/producer.routes.ts'
import { circularRouter } from './routes/circular.routes.ts'
import { rateLimiter } from './middleware/rateLimit.ts'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())
app.use(rateLimiter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'nama-api', version: '0.1.0' })
})

app.use('/dpp', dppRouter)
app.use('/marketplace', marketplaceRouter)
app.use('/esg', esgRouter)
app.use('/iot', iotRouter)
app.use('/enterprise', enterpriseRouter)
app.use('/producer', producerRouter)
app.use('/circular', circularRouter)

app.listen(PORT, () => {
  console.log(`NAMA API running on http://localhost:${PORT}`)
})

export default app
