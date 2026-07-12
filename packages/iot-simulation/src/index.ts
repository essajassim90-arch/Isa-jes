import type { IoTScenarioConfig } from '@nama/shared'
import { runColdChainScenario } from './scenarios/cold-chain.scenario.ts'

export { runColdChainScenario } from './scenarios/cold-chain.scenario.ts'
export type { StepResult, SimulatedReading } from './scenarios/cold-chain.scenario.ts'
export { simulateTemperature, classifyTemperatureState } from './simulators/temperature.simulator.ts'
export { simulateHumidity, classifyHumidityState } from './simulators/humidity.simulator.ts'
export { simulateLocation, COLD_CHAIN_WAYPOINTS } from './simulators/location.simulator.ts'

/**
 * CLI entry-point.
 * Usage: node dist/index.js [batchId] [apiEndpoint] [apiToken]
 *
 * All arguments are optional.
 * - batchId       defaults to "demo-batch-001"
 * - apiEndpoint   defaults to "http://localhost:3001" (dry-run when empty)
 * - apiToken      defaults to "" (skips posting to API)
 *
 * The scenario runs for 10 steps with a 500 ms interval (5 s total in real
 * time) and prints each reading to stdout.
 */
async function main(): Promise<void> {
  const [, , rawBatchId, rawEndpoint, rawToken] = process.argv

  const config: IoTScenarioConfig = {
    name: 'cold-chain-demo',
    batchId: rawBatchId ?? 'demo-batch-001',
    durationMs: 5_000,
    intervalMs: 500,
    apiEndpoint: rawEndpoint ?? '',
  }

  const apiToken = rawToken ?? ''

  console.log(`[iot-sim] Starting cold-chain scenario "${config.name}"`)
  console.log(`[iot-sim] batchId=${config.batchId} steps=${config.durationMs / config.intervalMs}`)
  if (apiToken && config.apiEndpoint) {
    console.log(`[iot-sim] Posting to ${config.apiEndpoint}`)
  } else {
    console.log('[iot-sim] Dry-run mode — no API posting')
  }

  const results = await runColdChainScenario(config, apiToken, true)

  console.log(`\n[iot-sim] Scenario complete — ${results.length} steps`)

  const warningSteps = results.filter(
    (r) => r.states.temperature === 'warning' || r.states.humidity === 'warning',
  ).length
  const criticalSteps = results.filter(
    (r) => r.states.temperature === 'critical' || r.states.humidity === 'critical',
  ).length
  console.log(
    `[iot-sim] States — optimal: ${results.length - warningSteps - criticalSteps}, warning: ${warningSteps}, critical: ${criticalSteps}`,
  )

  console.log('\n[iot-sim] Example reading payload:')
  const example = results[0]?.readings[0]
  if (example) console.log(JSON.stringify(example, null, 2))
}

main().catch((err: unknown) => {
  console.error('[iot-sim] Fatal:', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
