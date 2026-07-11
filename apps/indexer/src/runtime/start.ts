/**
 * NAMA Indexer Runtime — long-running entry point.
 *
 * Lifecycle
 * ─────────
 * 1. Load configuration from environment variables (see runtime/config.ts).
 * 2. Hydrate the CheckpointStore from disk — enables safe restart from the
 *    last committed block position without re-processing old events.
 * 3. Initialise the SqliteProjectionStore (creates schema if absent).
 * 4. Build a ThorEventConnector with checkpoint-aware cursor initialisation.
 * 5. Enter the polling loop: pull → process → sleep.
 * 6. On SIGINT / SIGTERM, set the shutdown flag and allow the current batch
 *    to complete before exiting cleanly.
 *
 * Idempotency & replay safety
 * ────────────────────────────
 * - The CheckpointStore records the last processed block per contract stream.
 * - On restart the connector resumes from min(dpp checkpoint, marketplace
 *   checkpoint) + 1, so no events are skipped even if only one stream advanced.
 * - The SqliteProjectionStore uses INSERT OR IGNORE / ON CONFLICT guards so
 *   re-processing the same event is a no-op.
 *
 * Run:  npm run start --workspace=@nama/indexer
 */

import { CheckpointStore } from '../checkpoints/checkpoint-store.js';
import { ThorEventConnector } from '../connectors/thor-event-connector.js';
import { SqliteProjectionStore } from '../database/sqlite-projection-store.js';
import { IndexerPipeline } from '../pipeline/indexer-pipeline.js';
import { runIndexerBatch } from '../pipeline/run.js';
import { loadConfig } from './config.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function log(message: string): void {
  console.log(`[indexer] ${message}`);
}

function logError(message: string): void {
  console.error(`[indexer] ERROR: ${message}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const config = loadConfig();

  log('═══════════════════════════════════════════════');
  log('NAMA Indexer Runtime starting');
  log('═══════════════════════════════════════════════');
  log(`Thor URL:            ${config.thorUrl}`);
  log(`Chain ID:            ${config.chainId} (0x${config.chainId.toString(16)})`);
  log(`DPP address:         ${config.dppAddress || '(not deployed — skipping)'}`);
  log(`Marketplace address: ${config.marketplaceAddress || '(not deployed — skipping)'}`);
  log(`Poll interval:       ${config.pollIntervalMs} ms`);
  log(`Batch size:          ${config.batchSize} blocks`);
  log(`Page limit:          ${config.pageLimit} events/page`);
  log(`Checkpoint path:     ${config.checkpointPath}`);
  log(`DB path:             ${config.dbPath}`);
  log('');

  // ── Step 1: Hydrate checkpoint store ────────────────────────────────────
  const checkpointStore = new CheckpointStore(config.checkpointPath);
  await checkpointStore.hydrate();
  log('Checkpoint store hydrated');

  // ── Step 2: Initialise projection store ─────────────────────────────────
  const projectionStore = new SqliteProjectionStore(config.dbPath);
  await projectionStore.init();
  log('Projection store initialised');

  // ── Step 3: Build connector (cursor seeded from checkpoint) ─────────────
  const connector = new ThorEventConnector({
    thorUrl: config.thorUrl,
    chainId: config.chainId,
    dppAddress: config.dppAddress,
    marketplaceAddress: config.marketplaceAddress,
    checkpointStore,
    batchSize: config.batchSize,
    pageLimit: config.pageLimit,
  });

  // ── Step 4: Build pipeline ───────────────────────────────────────────────
  const pipeline = new IndexerPipeline({
    checkpointStore,
    projectionStore,
  });

  // ── Step 5: Graceful shutdown ────────────────────────────────────────────
  let running = true;
  let shuttingDown = false;

  function shutdown(signal: string): void {
    if (shuttingDown) return;
    shuttingDown = true;
    running = false;
    log(`${signal} received — finishing current batch then shutting down`);
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // ── Step 6: Polling loop ─────────────────────────────────────────────────
  log('Polling loop started. Send SIGINT (Ctrl+C) or SIGTERM to stop.');
  log('═══════════════════════════════════════════════');

  let totalProcessed = 0;

  while (running) {
    try {
      const envelopes = await runIndexerBatch(connector, pipeline);

      if (envelopes.length > 0) {
        totalProcessed += envelopes.length;
        log(`Processed ${envelopes.length} event(s) (total: ${totalProcessed})`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logError(`Batch failed: ${message}`);
      // Continue polling after a transient error; the checkpoint cursor was
      // not advanced for a failed batch, so the same range will be retried.
    }

    if (!running) break;

    await sleep(config.pollIntervalMs);
  }

  log('Shutdown complete');
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[indexer] Fatal error during startup: ${message}`);
  process.exit(1);
});
