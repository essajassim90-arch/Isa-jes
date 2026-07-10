import { useState, useEffect } from 'react'
import type { IoTReading, IoTSensorType } from '@nama/shared'
import { apiUrl } from '../lib/api.ts'

export type IoTState = 'optimal' | 'warning' | 'critical'

export interface IoTReadingWithState {
  reading: IoTReading
  state: IoTState
}

interface ReadingsResponse {
  batchId: string
  readings: IoTReading[]
  count: number
}

export function classifyIoTState(type: IoTSensorType, value: number | string): IoTState {
  if (typeof value !== 'number') return 'optimal'
  if (type === 'temperature') {
    if (value > 35) return 'critical'
    if (value > 25) return 'warning'
    return 'optimal'
  }
  if (type === 'humidity') {
    if (value > 80) return 'critical'
    if (value > 60) return 'warning'
    return 'optimal'
  }
  return 'optimal'
}

export function useIoT(batchId: string | null) {
  const [readings, setReadings] = useState<IoTReadingWithState[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!batchId) return
    setLoading(true)
    setError(null)
    setReadings([])

    fetch(apiUrl(`/iot/readings/${encodeURIComponent(batchId)}`))
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body: { error?: string }) => {
            throw new Error(body.error ?? `HTTP ${res.status}`)
          })
        }
        return res.json() as Promise<ReadingsResponse>
      })
      .then((data) => {
        const withState: IoTReadingWithState[] = data.readings.map((r) => ({
          reading: r,
          state: classifyIoTState(r.type, r.value),
        }))
        setReadings(withState)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load IoT readings')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [batchId])

  return { readings, loading, error }
}
