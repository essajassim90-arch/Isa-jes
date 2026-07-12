import type { IoTReading } from '@nama/shared'

export type IoTState = 'optimal' | 'warning' | 'critical'

/** Cold-chain humidity thresholds (% RH). */
const OPTIMAL_MAX = 60
const WARNING_MAX = 75

/** Base relative humidity inside a refrigerated container (%). */
const BASE_HUMIDITY = 50

function deterministicDelta(step: number, amplitude: number): number {
  return amplitude * Math.cos((step * Math.PI) / 8)
}

export function classifyHumidityState(percent: number): IoTState {
  if (percent > WARNING_MAX) return 'critical'
  if (percent > OPTIMAL_MAX) return 'warning'
  return 'optimal'
}

export interface HumidityReading {
  reading: Omit<IoTReading, 'readingId' | 'txHash'>
  state: IoTState
}

/**
 * Generate a simulated humidity reading for a cold-chain batch.
 * @param sensorId  Logical sensor identifier.
 * @param batchId   Shipment batch identifier.
 * @param step      Monotonically increasing step counter.
 * @param timestamp ISO-8601 timestamp for the reading.
 * @param excursion Optional forced excursion amplitude (% RH above base).
 */
export function simulateHumidity(
  sensorId: string,
  batchId: string,
  step: number,
  timestamp: string,
  excursion = 0,
): HumidityReading {
  const percent = Number((BASE_HUMIDITY + deterministicDelta(step, 8) + excursion).toFixed(2))
  return {
    reading: {
      sensorId,
      batchId,
      type: 'humidity',
      value: percent,
      unit: '%RH',
      timestamp,
    },
    state: classifyHumidityState(percent),
  }
}
