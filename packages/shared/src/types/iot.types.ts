export type IoTSensorType = 'temperature' | 'humidity' | 'location' | 'rfid'

export interface IoTReading {
  sensorId: string
  batchId: string
  type: IoTSensorType
  value: number | string
  unit: string
  timestamp: string
  latitude?: number
  longitude?: number
}

export interface IoTScenarioConfig {
  name: string
  batchId: string
  durationMs: number
  intervalMs: number
  apiEndpoint: string
}
