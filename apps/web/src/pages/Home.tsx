import {
  WalletButton,
  useWallet,
  useIsSmartAccountDeployed,
  useUpgradeSmartAccount,
  useAccountBalance,
} from '@vechain/vechain-kit'

// Phase 1 MVP Demo: Testnet only.
// Mainnet address retained here for future phases but is NOT shown in the demo UI.
// const MAINNET_SMART_ACCOUNT = '0x1604a6EF0B1Cc40bFcC5d2205DEDb264bf8862FE'
const TESTNET_SMART_ACCOUNT = '0xf51085090F8294b6158082dbDBB42A4484a55ba6'

function SmartAccountCard({ address }: { address: string }) {
  const { data: isDeployed, isLoading } = useIsSmartAccountDeployed(address)

  return (
    <div className="sa-card">
      <div className="sa-network">Testnet</div>
      <div className="sa-label">Smart Account Address</div>
      <a
        className="sa-address"
        href={`https://explore-testnet.vechain.org/accounts/${address}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {address.slice(0, 8)}…{address.slice(-6)}
      </a>
      <div className={`sa-status ${isLoading ? 'loading' : isDeployed ? 'deployed' : 'pending'}`}>
        {isLoading ? '⏳ Checking…' : isDeployed ? '✅ Deployed' : '🔴 Not deployed'}
      </div>
    </div>
  )
}

function ConnectedDashboard() {
  const { account, connection, smartAccount } = useWallet()
  const accountAddress = account?.address ?? ''
  const { data: balance } = useAccountBalance(accountAddress)
  const { data: isDeployed } = useIsSmartAccountDeployed(TESTNET_SMART_ACCOUNT)

  const { sendTransaction: deploySA, isTransactionPending: isUpgrading } = useUpgradeSmartAccount({
    smartAccountAddress: smartAccount?.address ?? accountAddress,
    targetVersion: 1,
  })

  const handleDeploy = async () => {
    try {
      await deploySA()
    } catch (err) {
      console.error('Deploy failed:', err)
    }
  }

  return (
    <div className="dashboard">
      <div className="wallet-info">
        <div className="wallet-row">
          <span className="wallet-label">Connected via</span>
          <span className="wallet-source">{connection.source?.displayName ?? 'Unknown'}</span>
        </div>
        <div className="wallet-row">
          <span className="wallet-label">Address</span>
          <span className="wallet-address">
            {accountAddress
              ? `${accountAddress.slice(0, 8)}…${accountAddress.slice(-6)}`
              : '—'}
          </span>
        </div>
        <div className="wallet-row">
          <span className="wallet-label">VET Balance</span>
          <span className="wallet-balance">
            {balance ? `${Number(balance.balance).toFixed(4)} VET` : '—'}
          </span>
        </div>
        <div className="wallet-row">
          <span className="wallet-label">VTHO Balance</span>
          <span className="wallet-balance">
            {balance ? `${Number(balance.energy).toFixed(4)} VTHO` : '—'}
          </span>
        </div>
        {smartAccount?.address && (
          <div className="wallet-row">
            <span className="wallet-label">Smart Account</span>
            <span className={`sa-status ${smartAccount.isDeployed ? 'deployed' : 'pending'}`}>
              {`${smartAccount.address.slice(0, 8)}…${smartAccount.address.slice(-6)}`}{' '}
              {smartAccount.isDeployed ? '✅' : '🔴'}
            </span>
          </div>
        )}
      </div>

      <div className="sa-section">
        <h2>Smart Account (Testnet)</h2>
        <SmartAccountCard address={TESTNET_SMART_ACCOUNT} />
        {!isDeployed && smartAccount?.address && (
          <button
            className="deploy-btn"
            onClick={handleDeploy}
            disabled={isUpgrading}
          >
            {isUpgrading ? 'Deploying…' : 'Deploy Smart Account'}
          </button>
        )}
        {isDeployed && (
          <p className="deploy-success">✅ Smart account is live on Testnet!</p>
        )}
      </div>
    </div>
  )
}

export function Home() {
  const { account } = useWallet()

  return account ? (
    <>
      <ConnectedDashboard />
    </>
  ) : (
    <div className="hero">
      <h1>NAMA Protocol</h1>
      <p>
        Decentralized ecosystem for global food security &amp; sustainable supply chains —
        powered by VeChainThor blockchain, IoT simulation, and Digital Product Passports.
      </p>
      <div className="hero-cards">
        <SmartAccountCard address={TESTNET_SMART_ACCOUNT} />
      </div>
      <div className="connect-cta">
        <WalletButton />
      </div>
    </div>
  )
}
