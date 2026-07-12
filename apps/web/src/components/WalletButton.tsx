import { WalletButton as VeChainWalletButton } from '@vechain/vechain-kit'

/** Thin re-export so the rest of the app imports from components/. */
export function WalletButton() {
  return <VeChainWalletButton />
}
