import type { Hex } from 'viem';
import type { SupportedContract } from '../versioning/schema.js';

export interface RawEventLog {
  chainId: number;
  contract: SupportedContract;
  address: `0x${string}`;
  blockNumber: bigint;
  blockHash: Hex;
  transactionHash: Hex;
  logIndex: number;
  data: Hex;
  topics: Hex[];
  removed?: boolean;
}

export interface EventConnector {
  pull(): Promise<RawEventLog[]>;
}
