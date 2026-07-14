/**
 * Indexer runtime configuration.
 *
 * All values are sourced from environment variables.  When a variable is not
 * set the default shown below is used.
 *
 * Address propagation strategy
 * ─────────────────────────────
 * The single source of truth for deployed contract addresses is
 * packages/shared/src/constants/vechain.ts (TESTNET_CONTRACT_ADDRESSES).
 * After deployment, update that file and propagate the addresses here via
 * the environment variables DPP_CONTRACT_ADDRESS and MARKETPLACE_CONTRACT_ADDRESS.
 * The API and frontend consume the addresses directly from @nama/shared at
 * compile/bundle time; the indexer runtime consumes them via env vars so that
 * the same binary can be reconfigured without rebuilding.
 *
 * Environment variables
 * ──────────────────────
 *   THOR_URL                  VeChainThor node URL   (default: https://testnet.vechain.org)
 *   CHAIN_ID                  VeChain chain ID int   (default: 39 — testnet 0x27)
 *   DPP_CONTRACT_ADDRESS      Deployed DPP address   (default: '' — not deployed)
 *   MARKETPLACE_CONTRACT_ADDRESS  Deployed Marketplace address  (default: '')
 *   POLL_INTERVAL_MS          Polling interval ms    (default: 5000)
 *   BATCH_SIZE                Max blocks per batch   (default: 1000)
 *   PAGE_LIMIT                Max events per page    (default: 256)
 *   CHECKPOINT_PATH           Checkpoint JSON path   (default: data/checkpoints.json)
 *   DB_PATH                   SQLite DB path         (default: data/projections.db)
 */

/** VeChainThor Testnet RPC URL — matches VECHAIN_TESTNET.rpcUrl in @nama/shared */
const DEFAULT_THOR_URL = 'https://testnet.vechain.org';

/** VeChainThor Testnet chain ID (0x27 = 39) */
const DEFAULT_CHAIN_ID = 39;

const DEFAULT_POLL_INTERVAL_MS = 5_000;
const DEFAULT_BATCH_SIZE = 1_000;
const DEFAULT_PAGE_LIMIT = 256;
const DEFAULT_CHECKPOINT_PATH = 'data/checkpoints.json';
const DEFAULT_DB_PATH = 'data/projections.db';

export interface IndexerConfig {
  /** VeChainThor node URL */
  thorUrl: string;
  /** VeChain chain ID as integer */
  chainId: number;
  /**
   * Deployed DPP contract address (0x-prefixed).
   * Empty string when not yet deployed — connector will skip querying this contract.
   * Set from packages/shared TESTNET_CONTRACT_ADDRESSES.DPP after deployment.
   */
  dppAddress: string;
  /**
   * Deployed Marketplace contract address (0x-prefixed).
   * Empty string when not yet deployed.
   * Set from packages/shared TESTNET_CONTRACT_ADDRESSES.Marketplace after deployment.
   */
  marketplaceAddress: string;
  /** Polling interval in milliseconds */
  pollIntervalMs: number;
  /** Maximum blocks to scan per poll batch */
  batchSize: number;
  /** Maximum events to retrieve per page per contract */
  pageLimit: number;
  /** Path to the checkpoint JSON persistence file */
  checkpointPath: string;
  /** Path to the SQLite projection database */
  dbPath: string;
}

function parseIntEnv(name: string, defaultValue: number): number {
  const raw = process.env[name];
  if (!raw) return defaultValue;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

/**
 * Load indexer configuration from environment variables.
 *
 * Throws when a required environment variable is present but malformed
 * (e.g. a non-numeric CHAIN_ID falls back to the default rather than
 * throwing, preserving safe startup behaviour).
 */
export function loadConfig(): IndexerConfig {
  return {
    thorUrl: process.env['THOR_URL'] ?? DEFAULT_THOR_URL,
    chainId: parseIntEnv('CHAIN_ID', DEFAULT_CHAIN_ID),
    dppAddress: process.env['DPP_CONTRACT_ADDRESS'] ?? '',
    marketplaceAddress: process.env['MARKETPLACE_CONTRACT_ADDRESS'] ?? '',
    pollIntervalMs: parseIntEnv('POLL_INTERVAL_MS', DEFAULT_POLL_INTERVAL_MS),
    batchSize: parseIntEnv('BATCH_SIZE', DEFAULT_BATCH_SIZE),
    pageLimit: parseIntEnv('PAGE_LIMIT', DEFAULT_PAGE_LIMIT),
    checkpointPath: process.env['CHECKPOINT_PATH'] ?? DEFAULT_CHECKPOINT_PATH,
    dbPath: process.env['DB_PATH'] ?? DEFAULT_DB_PATH,
  };
}
