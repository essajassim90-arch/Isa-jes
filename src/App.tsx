import { useState } from 'react'
import {
  WalletButton,
  useWallet,
  useIsSmartAccountDeployed,
  useUpgradeSmartAccount,
  useAccountBalance,
} from '@vechain/vechain-kit'
import './App.css'

const MAINNET_SMART_ACCOUNT = '0x1604a6EF0B1Cc40bFcC5d2205DEDb264bf8862FE'
const TESTNET_SMART_ACCOUNT = '0xf51085090F8294b6158082dbDBB42A4484a55ba6'

function SmartAccountCard({
  network,
  address,
}: {
  network: 'Mainnet' | 'Testnet'
  address: string
}) {
  const { data: isDeployed, isLoading } = useIsSmartAccountDeployed(address)
  const isTestnet = network === 'Testnet'

  return (
    <div className="sa-card">
      <div className="sa-network">{network}</div>
      <div className="sa-label">Smart Account Address</div>
      <a
        className="sa-address"
        href={`https://${isTestnet ? 'explore-testnet' : 'explore'}.vechain.org/accounts/${address}`}
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
  const [network, setNetwork] = useState<'Testnet' | 'Mainnet'>('Testnet')
  const activeAddress = network === 'Mainnet' ? MAINNET_SMART_ACCOUNT : TESTNET_SMART_ACCOUNT
  const { data: isDeployed } = useIsSmartAccountDeployed(activeAddress)

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
        <h2>Smart Account Deployment</h2>
        <div className="network-tabs">
          <button
            className={`tab ${network === 'Testnet' ? 'active' : ''}`}
            onClick={() => setNetwork('Testnet')}
          >
            Testnet
          </button>
          <button
            className={`tab ${network === 'Mainnet' ? 'active' : ''}`}
            onClick={() => setNetwork('Mainnet')}
          >
            Mainnet
          </button>
        </div>
        <SmartAccountCard network={network} address={activeAddress} />
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
          <p className="deploy-success">✅ Smart account is live on {network}!</p>
        )}
      </div>
    </div>
  )
}

function App() {
  const { account } = useWallet()

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="logo">⚡ Isa-Jes</span>
          <span className="tagline">VeChain dApp</span>
        </div>
        <WalletButton />
      </header>

      <main className="main">
        {account ? (
          <ConnectedDashboard />
        ) : (
          <div className="hero">
            <h1>Build on VeChain</h1>
            <p>
              Connect your wallet to deploy smart accounts on Mainnet and Testnet,
              manage VET &amp; VTHO, and explore the VeChain ecosystem.
            </p>
            <div className="hero-cards">
              <SmartAccountCard network="Mainnet" address={MAINNET_SMART_ACCOUNT} />
              <SmartAccountCard network="Testnet" address={TESTNET_SMART_ACCOUNT} />
            </div>
            <div className="connect-cta">
              <WalletButton />
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>Powered by </span>
        <a href="https://vechainkit.vechain.org/" target="_blank" rel="noopener noreferrer">
          VeChain Kit
        </a>
        <span> · </span>
        <a
          href={`https://explore-testnet.vechain.org/accounts/${TESTNET_SMART_ACCOUNT}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Testnet Explorer
        </a>
        <span> · </span>
        <a
          href={`https://explore.vechain.org/accounts/${MAINNET_SMART_ACCOUNT}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Mainnet Explorer
        </a>
      </footer>
    </div>
  )
}

export default App
