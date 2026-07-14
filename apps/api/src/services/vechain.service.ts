import { ThorClient } from '@vechain/sdk-network'
import { VECHAIN_TESTNET, TESTNET_CONTRACT_ADDRESSES } from '@nama/shared'

/**
 * VeChainThor Testnet service.
 * Provides a ThorClient for network interaction and contract readiness checks.
 * Contract call methods will be wired in later phases once addresses are deployed.
 */
class VeChainService {
  readonly thorClient: ThorClient
  readonly contractAddresses = TESTNET_CONTRACT_ADDRESSES

  constructor() {
    this.thorClient = ThorClient.at(VECHAIN_TESTNET.rpcUrl)
  }

  /**
   * Returns true when the named contract has a non-empty address on Testnet.
   * Use this guard before making any on-chain calls.
   */
  isContractDeployed(name: keyof typeof TESTNET_CONTRACT_ADDRESSES): boolean {
    return this.contractAddresses[name] !== ''
  }
}

export const veChainService = new VeChainService()
