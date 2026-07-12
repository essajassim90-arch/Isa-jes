export type IoTSensorType = 'temperature' | 'humidity' | 'location' | 'rfid'

export interface IoTReading {
  readingId: string
  sensorId: string
  batchId: string
  type: IoTSensorType
  value: number | string
  unit: string
  timestamp: string
  latitude?: number
  longitude?: number
  txHash?: string
}

export interface IoTSensor {
  sensorId: string
  batchId: string
  type: IoTSensorType
  status: 'active' | 'inactive'
  installedAt: string
}

export interface IoTScenarioConfig {
  name: string
  batchId: string
  durationMs: number
  intervalMs: number
  apiEndpoint: string
}
