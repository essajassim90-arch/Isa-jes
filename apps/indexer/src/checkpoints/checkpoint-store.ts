import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { NormalizedEventEnvelope } from '../versioning/schema.js';

interface Checkpoint {
  blockNumber: string;
  blockHash: string;
  transactionHash: string;
  logIndex: number;
  indexedAt: string;
}

export class CheckpointStore {
  readonly #state = new Map<string, Checkpoint>();

  constructor(private readonly persistencePath?: string) {}

  async hydrate(): Promise<void> {
    if (!this.persistencePath) {
      return;
    }

    try {
      const content = await readFile(this.persistencePath, 'utf8');
      const parsed = JSON.parse(content) as Record<string, Checkpoint>;

      for (const [key, checkpoint] of Object.entries(parsed)) {
        this.#state.set(key, checkpoint);
      }
    } catch {
      // Start from empty state when no persistence file is available.
    }
  }

  get(streamKey: string): Checkpoint | undefined {
    return this.#state.get(streamKey);
  }

  async set(streamKey: string, envelope: NormalizedEventEnvelope): Promise<void> {
    this.#state.set(streamKey, {
      blockNumber: envelope.cursor.blockNumber,
      blockHash: envelope.cursor.blockHash,
      transactionHash: envelope.cursor.transactionHash,
      logIndex: envelope.cursor.logIndex,
      indexedAt: envelope.metadata.indexedAt
    });

    await this.persist();
  }

  private async persist(): Promise<void> {
    if (!this.persistencePath) {
      return;
    }

    const payload = JSON.stringify(Object.fromEntries(this.#state), null, 2);
    await mkdir(dirname(this.persistencePath), { recursive: true });
    await writeFile(this.persistencePath, payload, 'utf8');
  }
}
