import { randomUUID } from 'node:crypto'
import type { IoTReading, IoTSensorType } from '@nama/shared'

export type IoTState = 'optimal' | 'warning' | 'critical'

export interface IoTReadingWithState {
  reading: IoTReading
  state: IoTState
}

// In-memory store keyed by batchId — replaced with time-series DB in later phases
const readingsByBatch = new Map<string, IoTReading[]>()

const VALID_SENSOR_TYPES: IoTSensorType[] = ['temperature', 'humidity', 'location', 'rfid']

interface IngestPayload {
  sensorId: string
  batchId: string
  type: IoTSensorType
  value: number | string
  unit: string
  timestamp?: string
  latitude?: number
  longitude?: number
}

function isIngestPayload(value: unknown): value is IngestPayload {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Record<string, unknown>
  return (
    typeof p['sensorId'] === 'string' &&
    typeof p['batchId'] === 'string' &&
    VALID_SENSOR_TYPES.includes(p['type'] as IoTSensorType) &&
    (typeof p['value'] === 'number' || typeof p['value'] === 'string') &&
    typeof p['unit'] === 'string'
  )
}

function classifyState(type: IoTSensorType, value: number | string): IoTState {
  if (typeof value !== 'number') return 'optimal'
  switch (type) {
    case 'temperature':
      if (value > 35) return 'critical'
      if (value > 25) return 'warning'
      return 'optimal'
    case 'humidity':
      if (value > 80) return 'critical'
      if (value > 60) return 'warning'
      return 'optimal'
    default:
      return 'optimal'
  }
}

// Seed demo IoT readings for demo-batch-001 on startup
readingsByBatch.set('demo-batch-001', [
  {
    readingId: 'demo-r-001',
    sensorId: 'sensor-temp-001',
    batchId: 'demo-batch-001',
    type: 'temperature',
    value: 22.5,
    unit: '°C',
    timestamp: '2025-03-05T10:30:00.000Z',
  },
  {
    readingId: 'demo-r-002',
    sensorId: 'sensor-hum-001',
    batchId: 'demo-batch-001',
    type: 'humidity',
    value: 58,
    unit: '%',
    timestamp: '2025-03-05T10:30:00.000Z',
  },
  {
    readingId: 'demo-r-003',
    sensorId: 'sensor-temp-001',
    batchId: 'demo-batch-001',
    type: 'temperature',
    value: 28.5,
    unit: '°C',
    timestamp: '2025-03-12T14:00:00.000Z',
  },
  {
    readingId: 'demo-r-004',
    sensorId: 'sensor-hum-001',
    batchId: 'demo-batch-001',
    type: 'humidity',
    value: 85,
    unit: '%',
    timestamp: '2025-03-12T14:00:00.000Z',
  },
  {
    readingId: 'demo-r-005',
    sensorId: 'sensor-temp-001',
    batchId: 'demo-batch-001',
    type: 'temperature',
    value: 21.0,
    unit: '°C',
    timestamp: '2025-03-20T09:00:00.000Z',
  },
  {
    readingId: 'demo-r-006',
    sensorId: 'sensor-hum-001',
    batchId: 'demo-batch-001',
    type: 'humidity',
    value: 62,
    unit: '%',
    timestamp: '2025-03-20T09:00:00.000Z',
  },
])

class IoTService {
  ingest(payload: unknown): IoTReadingWithState {
    if (!isIngestPayload(payload)) {
      throw new Error(
        'Invalid reading payload: sensorId, batchId, type, value, and unit are required',
      )
    }
    const reading: IoTReading = {
      readingId: randomUUID(),
      sensorId: payload.sensorId,
      batchId: payload.batchId,
      type: payload.type,
      value: payload.value,
      unit: payload.unit,
      timestamp: payload.timestamp ?? new Date().toISOString(),
      latitude: payload.latitude,
      longitude: payload.longitude,
    }
    const existing = readingsByBatch.get(reading.batchId) ?? []
    existing.push(reading)
    readingsByBatch.set(reading.batchId, existing)
    return { reading, state: classifyState(reading.type, reading.value) }
  }

  getLatestByBatchId(batchId: string): IoTReading[] {
    return readingsByBatch.get(batchId) ?? []
  }
}

export const iotService = new IoTService()
