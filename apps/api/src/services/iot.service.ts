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
