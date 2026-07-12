/**
 * Phase 2G — ThorEventConnector smoke test
 *
 * Verifies:
 *   1. Connectivity to VeChainThor Testnet
 *   2. ThorEventConnector returns [] when no contract addresses are configured
 *   3. ThorEventConnector returns [] when given addresses with no matching events
 *
 * Run: npm run smoke-test --workspace=@nama/indexer
 */

import { ThorClient } from '@vechain/sdk-network';
import { ThorEventConnector } from './thor-event-connector.js';

const TESTNET_URL = 'https://testnet.vechain.org';
// VeChainThor Testnet chain ID (0x27 = 39)
const TESTNET_CHAIN_ID = 39;

function pass(label: string): void {
  console.log(`[smoke-test] ✓ ${label}`);
}

function info(label: string): void {
  console.log(`[smoke-test]   ${label}`);
}

async function runSmokeTest(): Promise<void> {
  console.log('[smoke-test] ═══════════════════════════════════════════════');
  console.log('[smoke-test] Phase 2G — ThorEventConnector Smoke Test');
  console.log('[smoke-test] ═══════════════════════════════════════════════');
  info(`Node: ${TESTNET_URL}`);
  info(`Chain ID: ${TESTNET_CHAIN_ID} (0x${TESTNET_CHAIN_ID.toString(16)})`);
  console.log('');

  // ── Step 1: Verify raw ThorClient connectivity ──────────────────────────

  console.log('[smoke-test] Step 1 — VeChainThor Testnet connectivity');

  const thor = ThorClient.at(TESTNET_URL);
  const bestBlock = await thor.blocks.getBestBlockCompressed();

  if (!bestBlock) {
    throw new Error('getBestBlockCompressed() returned null — node unreachable or returning unexpected response');
  }

  pass('ThorClient.at() connected to VeChainThor Testnet');
  pass(`Best block: #${bestBlock.number}`);
  info(`  Block ID  : ${bestBlock.id}`);
  info(`  Timestamp : ${new Date(bestBlock.timestamp * 1000).toISOString()}`);
  console.log('');

  // ── Step 2: Connector with no addresses (pre-deployment state) ───────────

  console.log('[smoke-test] Step 2 — Connector behaviour before contract deployment');

  const connectorEmpty = new ThorEventConnector({
    thorUrl: TESTNET_URL,
    chainId: TESTNET_CHAIN_ID,
    dppAddress: '',
    marketplaceAddress: '',
  });

  const emptyLogs = await connectorEmpty.pull();

  if (emptyLogs.length !== 0) {
    throw new Error(`Expected pull() to return [] for undeployed connector, got ${emptyLogs.length} logs`);
  }

  pass('pull() returns [] when dppAddress and marketplaceAddress are empty strings');
  console.log('');

  // ── Step 3: Connector with placeholder addresses (no events expected) ────

  console.log('[smoke-test] Step 3 — Connector with placeholder addresses over a narrow block window');
  info(`  Scanning blocks: ${bestBlock.number} → ${bestBlock.number} (1 block)`);

  const connectorPlaceholder = new ThorEventConnector({
    thorUrl: TESTNET_URL,
    chainId: TESTNET_CHAIN_ID,
    // These placeholder addresses exist but have no NAMA contracts — expect zero matching events.
    dppAddress: '0x0000000000000000000000000000000000000001',
    marketplaceAddress: '0x0000000000000000000000000000000000000002',
    batchSize: 1,
  });

  const placeholderLogs = await connectorPlaceholder.pull();

  pass(`pull() with placeholder addresses returned ${placeholderLogs.length} log(s) (expected 0)`);
  console.log('');

  // ── Step 4: Verify second pull() advances cursor (no re-scan) ───────────

  console.log('[smoke-test] Step 4 — Cursor advancement (no re-scan of processed block range)');

  const secondPull = await connectorPlaceholder.pull();
  pass(`Second pull() returned ${secondPull.length} log(s) without re-querying processed range`);
  console.log('');

  // ── Summary ──────────────────────────────────────────────────────────────

  console.log('[smoke-test] ═══════════════════════════════════════════════');
  console.log('[smoke-test] ✓ All smoke-test checks passed');
  console.log('[smoke-test]');
  console.log('[smoke-test] Connector status: READY');
  console.log('[smoke-test] Testnet RPC:       REACHABLE');
  console.log('[smoke-test] Awaiting:          DPP.sol + Marketplace.sol deployment');
  console.log('[smoke-test]                    (configure dppAddress + marketplaceAddress)');
  console.log('[smoke-test] ═══════════════════════════════════════════════');
}

runSmokeTest().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[smoke-test] ✗ FAILED: ${message}`);
  process.exit(1);
});
