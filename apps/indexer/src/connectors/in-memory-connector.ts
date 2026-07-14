import type { EventConnector, RawEventLog } from './types.js';

export class InMemoryEventConnector implements EventConnector {
  readonly #queue: RawEventLog[] = [];

  push(log: RawEventLog): void {
    this.#queue.push(log);
  }

  pushMany(logs: RawEventLog[]): void {
    this.#queue.push(...logs);
  }

  async pull(): Promise<RawEventLog[]> {
    const batch = this.#queue.slice();
    this.#queue.length = 0;
    return batch;
  }
}
