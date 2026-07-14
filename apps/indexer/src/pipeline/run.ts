import type { EventConnector } from '../connectors/types.js';
import type { NormalizedEventEnvelope } from '../versioning/schema.js';
import type { IndexerPipeline } from './indexer-pipeline.js';

export async function runIndexerBatch(
  connector: EventConnector,
  pipeline: IndexerPipeline
): Promise<NormalizedEventEnvelope[]> {
  const logs = await connector.pull();
  const envelopes: NormalizedEventEnvelope[] = [];

  for (const log of logs) {
    const envelope = await pipeline.process(log);
    if (envelope) {
      envelopes.push(envelope);
    }
  }

  return envelopes;
}
