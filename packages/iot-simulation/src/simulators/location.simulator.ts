import type { IoTReading } from '@nama/shared'

export type IoTState = 'optimal' | 'warning' | 'critical'

/**
 * Mock cold-chain waypoints — fictional shipment route.
 * Uses only demo/mock coordinates; no real GPS data is accessed.
 *
 * Route: Cold-storage warehouse → Port of loading → Transit hub → Destination port → Retail DC
 */
export const COLD_CHAIN_WAYPOINTS: ReadonlyArray<{
  label: string
  latitude: number
  longitude: number
}> = [
  { label: 'Cold-Storage Warehouse A', latitude: 51.5074, longitude: -0.1278 },
  { label: 'Port of Loading B', latitude: 51.449, longitude: 0.7 },
  { label: 'Transit Hub C', latitude: 52.3702, longitude: 4.8952 },
  { label: 'Destination Port D', latitude: 53.3498, longitude: -6.2603 },
  { label: 'Retail Distribution Centre E', latitude: 53.4808, longitude: -2.2426 },
] as const

export interface LocationReading {
  reading: Omit<IoTReading, 'readingId' | 'txHash'>
  state: IoTState
  label: string
}

/**
 * Generate a simulated location reading by interpolating between two waypoints.
 * Progress is derived from `step` so the route advances deterministically.
 *
 * @param sensorId   Logical sensor identifier.
 * @param batchId    Shipment batch identifier.
 * @param step       Monotonically increasing step counter.
 * @param totalSteps Total number of steps in the scenario.
 * @param timestamp  ISO-8601 timestamp for the reading.
 */
export function simulateLocation(
  sensorId: string,
  batchId: string,
  step: number,
  totalSteps: number,
  timestamp: string,
): LocationReading {
  const waypoints = COLD_CHAIN_WAYPOINTS
  const progress = Math.min(step / Math.max(totalSteps - 1, 1), 1)
  const segmentCount = waypoints.length - 1
  const segmentProgress = progress * segmentCount
  const segmentIndex = Math.min(Math.floor(segmentProgress), segmentCount - 1)
  const segmentFraction = segmentProgress - segmentIndex

  const from = waypoints[segmentIndex]
  const to = waypoints[segmentIndex + 1]

  const latitude = Number(
    (from.latitude + (to.latitude - from.latitude) * segmentFraction).toFixed(6),
  )
  const longitude = Number(
    (from.longitude + (to.longitude - from.longitude) * segmentFraction).toFixed(6),
  )

  const label = segmentFraction < 0.5 ? from.label : to.label

  return {
    reading: {
      sensorId,
      batchId,
      type: 'location',
      value: `${latitude},${longitude}`,
      unit: 'lat,lon',
      timestamp,
      latitude,
      longitude,
    },
    state: 'optimal',
    label,
  }
}
