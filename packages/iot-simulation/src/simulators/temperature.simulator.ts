import type { IoTReading } from '@nama/shared'

export type IoTState = 'optimal' | 'warning' | 'critical'

/** Cold-chain temperature thresholds (°C). */
const OPTIMAL_MAX = 8
const WARNING_MAX = 15

/** Base temperature for a well-maintained cold-chain segment (°C). */
const BASE_TEMP = 4

/**
 * Deterministic temperature jitter using a seeded step value.
 * No random — keeps simulations reproducible for testing.
 */
function deterministicDelta(step: number, amplitude: number): number {
  return amplitude * Math.sin((step * Math.PI) / 6)
}

export function classifyTemperatureState(celsius: number): IoTState {
  if (celsius > WARNING_MAX) return 'critical'
  if (celsius > OPTIMAL_MAX) return 'warning'
  return 'optimal'
}

export interface TemperatureReading {
  reading: Omit<IoTReading, 'readingId' | 'txHash'>
  state: IoTState
}

/**
 * Generate a simulated temperature reading for a cold-chain batch.
 * @param sensorId  Logical sensor identifier.
 * @param batchId   Shipment batch identifier.
 * @param step      Monotonically increasing step counter (drives the waveform).
 * @param timestamp ISO-8601 timestamp for the reading.
 * @param excursion Optional forced excursion amplitude (°C above base), used to
 *                  simulate a warning or critical event.
 */
export function simulateTemperature(
  sensorId: string,
  batchId: string,
  step: number,
  timestamp: string,
  excursion = 0,
): TemperatureReading {
  const celsius = Number((BASE_TEMP + deterministicDelta(step, 2) + excursion).toFixed(2))
  return {
    reading: {
      sensorId,
      batchId,
      type: 'temperature',
      value: celsius,
      unit: '°C',
      timestamp,
    },
    state: classifyTemperatureState(celsius),
  }
}
