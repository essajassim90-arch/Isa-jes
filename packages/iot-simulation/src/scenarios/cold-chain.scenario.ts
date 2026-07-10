import type { IoTScenarioConfig } from '@nama/shared'
import { simulateTemperature } from '../simulators/temperature.simulator.ts'
import { simulateHumidity } from '../simulators/humidity.simulator.ts'
import { simulateLocation } from '../simulators/location.simulator.ts'

export interface SimulatedReading {
  sensorId: string
  batchId: string
  type: 'temperature' | 'humidity' | 'location'
  value: number | string
  unit: string
  timestamp: string
  latitude?: number
  longitude?: number
}

export interface StepResult {
  step: number
  timestamp: string
  readings: SimulatedReading[]
  states: { temperature: string; humidity: string; location: string }
}

/**
 * Cold-chain excursion events injected at specific steps to exercise
 * warning/critical states deterministically.
 */
const EXCURSION_EVENTS: Record<number, { tempDelta: number; humidDelta: number }> = {
  3: { tempDelta: 6, humidDelta: 12 },  // warning: temp ~10°C, humidity ~62%
  7: { tempDelta: 14, humidDelta: 28 }, // critical: temp ~18°C, humidity ~78%
}

/**
 * Run a deterministic cold-chain simulation scenario.
 *
 * Each step emits one temperature, one humidity, and one location reading.
 * Readings can optionally be posted to the API IoT ingestion endpoint.
 *
 * @param config   IoTScenarioConfig from @nama/shared.
 * @param apiToken ****** for authenticated API posts.  Pass an empty
 *                 string to skip posting (dry-run / offline mode).
 * @param verbose  When true, logs each step to stdout.
 */
export async function runColdChainScenario(
  config: IoTScenarioConfig,
  apiToken: string,
  verbose = false,
): Promise<StepResult[]> {
  const totalSteps = Math.max(
    1,
    Math.floor(config.durationMs / Math.max(config.intervalMs, 1)),
  )
  const results: StepResult[] = []

  const tempSensorId = `temp-${config.batchId}`
  const humSensorId = `hum-${config.batchId}`
  const locSensorId = `loc-${config.batchId}`

  const startTime = Date.now()

  for (let step = 0; step < totalSteps; step++) {
    const timestamp = new Date(startTime + step * config.intervalMs).toISOString()
    const excursion = EXCURSION_EVENTS[step] ?? { tempDelta: 0, humidDelta: 0 }

    const tempResult = simulateTemperature(
      tempSensorId,
      config.batchId,
      step,
      timestamp,
      excursion.tempDelta,
    )
    const humResult = simulateHumidity(
      humSensorId,
      config.batchId,
      step,
      timestamp,
      excursion.humidDelta,
    )
    const locResult = simulateLocation(
      locSensorId,
      config.batchId,
      step,
      totalSteps,
      timestamp,
    )

    const readings: SimulatedReading[] = [
      tempResult.reading as SimulatedReading,
      humResult.reading as SimulatedReading,
      locResult.reading as SimulatedReading,
    ]

    const stepResult: StepResult = {
      step,
      timestamp,
      readings,
      states: {
        temperature: tempResult.state,
        humidity: humResult.state,
        location: locResult.state,
      },
    }
    results.push(stepResult)

    if (verbose) {
      console.log(
        `[step ${step}] ${timestamp} | temp=${tempResult.reading.value}°C(${tempResult.state})` +
          ` hum=${humResult.reading.value}%RH(${humResult.state})` +
          ` loc=${locResult.label}`,
      )
    }

    if (apiToken && config.apiEndpoint) {
      await postReadings(config.apiEndpoint, apiToken, readings)
    }
  }

  return results
}

async function postReadings(
  endpoint: string,
  token: string,
  readings: SimulatedReading[],
): Promise<void> {
  const iotUrl = endpoint.replace(/\/$/, '') + '/iot/reading'
  await Promise.all(
    readings.map(async (reading) => {
      try {
        const res = await fetch(iotUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify(reading),
        })
        if (!res.ok) {
          console.warn(`[iot-sim] POST failed: ${res.status} ${res.statusText}`)
        }
      } catch (err) {
        console.warn(`[iot-sim] POST error: ${err instanceof Error ? err.message : String(err)}`)
      }
    }),
  )
}
