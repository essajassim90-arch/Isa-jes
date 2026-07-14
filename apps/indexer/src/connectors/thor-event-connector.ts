import { ThorClient } from '@vechain/sdk-network';
import type { EventCriteria, EventLogs } from '@vechain/sdk-network';
import type { Hex } from 'viem';
import type { EventConnector, RawEventLog } from './types.js';
import type { SupportedContract } from '../versioning/schema.js';
import type { CheckpointStore } from '../checkpoints/checkpoint-store.js';

// ── Configuration ────────────────────────────────────────────────────────────

export interface ThorEventConnectorOptions {
  /** VeChainThor node URL, e.g. https://testnet.vechain.org */
  thorUrl: string;
  /** VeChain chain ID as integer. Testnet = 39 (0x27). */
  chainId: number;
  /**
   * Deployed DPP contract address (0x-prefixed, 40 hex chars).
   * Pass an empty string when the contract has not yet been deployed.
   * The connector will skip querying this contract until a valid address is provided.
   */
  dppAddress: string;
  /**
   * Deployed Marketplace contract address (0x-prefixed, 40 hex chars).
   * Pass an empty string when the contract has not yet been deployed.
   */
  marketplaceAddress: string;
  /**
   * Optional checkpoint store already hydrated by the caller.
   * When provided, the connector initialises its fromBlock cursor from the
   * lowest checkpoint across 'dpp' and 'marketplace' stream keys so that
   * no events are missed on process restart.
   */
  checkpointStore?: CheckpointStore;
  /** Maximum number of blocks to scan per pull(). Default: 1000. */
  batchSize?: number;
  /**
   * Maximum number of events to return per contract per pull().
   * Maps to VeChain REST API pagination limit. Default: 256.
   */
  pageLimit?: number;
}

// ── Internal helpers ─────────────────────────────────────────────────────────

const DEPLOYED_ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

function isDeployedAddress(addr: string): addr is `0x${string}` {
  return DEPLOYED_ADDRESS_RE.test(addr);
}

function toHex(s: string): Hex {
  return (s.startsWith('0x') ? s : `0x${s}`) as Hex;
}

/** Tagged intermediate type holding the raw VeChain log alongside its contract identity. */
interface TaggedLog {
  log: EventLogs;
  contract: SupportedContract;
  address: `0x${string}`;
}

/**
 * Sort tagged logs into a deterministic canonical order:
 * block number ASC → transaction ID ASC → clause index ASC.
 *
 * This stable ordering ensures that block-scoped logIndex values are identical
 * across separate process runs given the same on-chain state, which is a
 * prerequisite for correct idempotency keying in the pipeline.
 */
function sortTaggedLogs(tagged: TaggedLog[]): TaggedLog[] {
  return [...tagged].sort((a, b) => {
    const blockDiff = a.log.meta.blockNumber - b.log.meta.blockNumber;
    if (blockDiff !== 0) return blockDiff;

    const txCmp = a.log.meta.txID.localeCompare(b.log.meta.txID);
    if (txCmp !== 0) return txCmp;

    return a.log.meta.clauseIndex - b.log.meta.clauseIndex;
  });
}

/**
 * Convert sorted tagged VeChain logs to RawEventLog[].
 *
 * A sequential, block-scoped logIndex is assigned to every event, starting
 * at 0 for the first event in each block.  Because the input is already
 * sorted deterministically, replaying the same block range always produces
 * the same `id = "${blockHash}:${logIndex}"`, which is what the pipeline
 * IdempotencyGuard and the SQLite `INSERT OR IGNORE` rely on.
 */
function convertToRawLogs(sorted: TaggedLog[], chainId: number): RawEventLog[] {
  const blockLogIndex = new Map<string, number>();

  return sorted.map(({ log, contract, address }) => {
    const blockId = log.meta.blockID;
    const idx = blockLogIndex.get(blockId) ?? 0;
    blockLogIndex.set(blockId, idx + 1);

    return {
      chainId,
      contract,
      address,
      blockNumber: BigInt(log.meta.blockNumber),
      blockHash: toHex(log.meta.blockID),
      transactionHash: toHex(log.meta.txID),
      logIndex: idx,
      data: toHex(log.data),
      topics: log.topics.map(toHex),
    };
  });
}

// ── Connector ────────────────────────────────────────────────────────────────

/**
 * ThorEventConnector — Phase 2G
 *
 * Polls VeChainThor for raw event logs emitted by the DPP and Marketplace
 * contracts and converts them to the RawEventLog shape expected by the
 * existing IndexerPipeline.
 *
 * Architecture
 * ────────────
 * - Uses ThorClient.logs.filterRawEventLogs() from @vechain/sdk-network v2.
 * - Maintains an in-process fromBlock cursor that advances after each pull().
 * - Initialises fromBlock from the checkpoint store on first pull() so that
 *   the indexer resumes from exactly where it stopped on restart.
 * - Returns an empty slice when no contract addresses are configured, allowing
 *   the pipeline to run safely before contracts are deployed.
 * - Merges and sorts DPP + Marketplace logs before assigning logIndex values
 *   to ensure deterministic event IDs across replay.
 *
 * Idempotency & replay compatibility
 * ───────────────────────────────────
 * The pipeline assigns event.id = "${blockHash}:${logIndex}".  Because logs
 * are sorted by (blockNumber, txID, clauseIndex) before logIndex is assigned,
 * replaying the same block range always yields the same IDs.  The SQLite
 * projection store's INSERT OR IGNORE and the in-memory IdempotencyGuard
 * both guard against duplicate processing.
 */
export class ThorEventConnector implements EventConnector {
  readonly #thor: ThorClient;
  readonly #dppAddress: `0x${string}` | null;
  readonly #marketplaceAddress: `0x${string}` | null;
  readonly #chainId: number;
  readonly #batchSize: number;
  readonly #pageLimit: number;
  readonly #checkpointStore: CheckpointStore | undefined;

  #fromBlock: number = 0;
  #initialized: boolean = false;

  constructor(options: ThorEventConnectorOptions) {
    this.#thor = ThorClient.at(options.thorUrl);
    this.#dppAddress = isDeployedAddress(options.dppAddress) ? options.dppAddress : null;
    this.#marketplaceAddress = isDeployedAddress(options.marketplaceAddress) ? options.marketplaceAddress : null;
    this.#chainId = options.chainId;
    this.#batchSize = options.batchSize ?? 1000;
    this.#pageLimit = options.pageLimit ?? 256;
    this.#checkpointStore = options.checkpointStore;
  }

  /**
   * Initialise fromBlock from the checkpoint store.
   *
   * Takes the minimum committed blockNumber across both contracts so that if
   * one contract's checkpoint lags behind the other, no events are missed.
   */
  #initFromCheckpoint(): void {
    if (!this.#checkpointStore) {
      this.#fromBlock = 0;
      return;
    }

    const contracts: SupportedContract[] = ['dpp', 'marketplace'];
    let minBlock: number | null = null;

    for (const contract of contracts) {
      const checkpoint = this.#checkpointStore.get(contract);
      if (!checkpoint) continue;
      const bn = Number(checkpoint.blockNumber);
      if (!Number.isFinite(bn)) continue;
      minBlock = minBlock === null ? bn : Math.min(minBlock, bn);
    }

    // Resume from the block after the last committed checkpoint; 0 if cold start.
    this.#fromBlock = minBlock !== null ? minBlock + 1 : 0;
  }

  /**
   * Fetch all pages of raw event logs for a given range and criteria set.
   *
   * Paginates using `offset` until fewer than `pageLimit` results are returned,
   * ensuring no logs are lost when event volume in a block range exceeds
   * the per-page limit.
   */
  async #fetchAllPages(
    range: { unit: 'block'; from: number; to: number },
    criteria: EventCriteria[],
  ): Promise<EventLogs[]> {
    const all: EventLogs[] = [];
    let offset = 0;

    while (true) {
      const page = await this.#thor.logs.filterRawEventLogs({
        range,
        criteriaSet: criteria,
        options: { offset, limit: this.#pageLimit },
        order: 'asc',
      });

      all.push(...page);

      // Fewer results than the limit means we have fetched the final page.
      if (page.length < this.#pageLimit) {
        break;
      }

      offset += this.#pageLimit;
    }

    return all;
  }

  /**
   * Fetch raw event logs from VeChainThor for the next block range.
   *
   * Returns an empty array when:
   * - No contract addresses are configured (pre-deployment state).
   * - The connector is already up-to-date with the chain head.
   * - The Thor node returns no events for the queried range.
   *
   * Pagination: fetches all pages per contract so that no events are lost
   * when event volume in a block range exceeds pageLimit.
   */
  async pull(): Promise<RawEventLog[]> {
    if (!this.#initialized) {
      this.#initFromCheckpoint();
      this.#initialized = true;
    }

    // Skip until at least one contract address is configured.
    if (!this.#dppAddress && !this.#marketplaceAddress) {
      return [];
    }

    const bestBlock = await this.#thor.blocks.getBestBlockCompressed();
    if (!bestBlock) {
      return [];
    }

    const toBlock = Math.min(this.#fromBlock + this.#batchSize - 1, bestBlock.number);

    // Already synced to the chain head — nothing to do.
    if (this.#fromBlock > toBlock) {
      return [];
    }

    const range = { unit: 'block' as const, from: this.#fromBlock, to: toBlock };
    const tagged: TaggedLog[] = [];

    if (this.#dppAddress) {
      const criteria: EventCriteria[] = [{ address: this.#dppAddress }];
      const logs = await this.#fetchAllPages(range, criteria);
      for (const log of logs) {
        tagged.push({ log, contract: 'dpp', address: this.#dppAddress });
      }
    }

    if (this.#marketplaceAddress) {
      const criteria: EventCriteria[] = [{ address: this.#marketplaceAddress }];
      const logs = await this.#fetchAllPages(range, criteria);
      for (const log of logs) {
        tagged.push({ log, contract: 'marketplace', address: this.#marketplaceAddress });
      }
    }

    // Advance the cursor regardless of whether events were found to avoid
    // re-scanning the same block range on the next poll.
    this.#fromBlock = toBlock + 1;

    const sorted = sortTaggedLogs(tagged);
    return convertToRawLogs(sorted, this.#chainId);
  }
}
