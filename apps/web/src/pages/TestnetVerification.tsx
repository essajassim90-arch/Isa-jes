import { useWallet, useGetChainId, useAppConfig } from '@vechain/vechain-kit'

// VeChain Testnet genesis ID (canonical identifier for the testnet chain)
const TESTNET_GENESIS_ID =
  '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'

export function TestnetVerification() {
  const { account, connection, smartAccount } = useWallet()
  const { data: chainId, isLoading: chainLoading } = useGetChainId()
  const config = useAppConfig()

  const isConnected = connection.isConnected
  const isTestnet = chainId === TESTNET_GENESIS_ID

  return (
    <div style={{ padding: 16, fontFamily: 'monospace', fontSize: 14 }}>
      <h3>🔍 فحص الاتصال بـ Testnet</h3>

      <table>
        <tbody>
          <Row
            label="الحالة:"
            value={isConnected ? '✅ متصل' : '❌ غير متصل'}
            ok={isConnected}
          />
          <Row
            label="Chain ID:"
            value={chainLoading ? '⏳ جاري التحميل...' : (chainId ?? '—')}
          />
          <Row
            label="الشبكة:"
            value={
              chainLoading ? '⏳ ...' : isTestnet ? '✅ Testnet' : '❌ شبكة غير متوقعة!'
            }
            ok={!chainLoading && isTestnet}
            warn={!chainLoading && !isTestnet}
          />
          <Row label="عنوان المحفظة:" value={account?.address ?? '—'} />
          <Row
            label="Smart Account:"
            value={
              smartAccount?.address
                ? `${smartAccount.address} ${smartAccount.isDeployed ? '(منشور ✅)' : '(غير منشور ⚠️)'}`
                : '—'
            }
          />
          <Row label="مصدر الاتصال:" value={connection.source?.type ?? '—'} />
          <Row label="Node URL:" value={config.nodeUrl} />
          <Row
            label="Explorer:"
            value={config.explorerUrl}
            link={config.explorerUrl}
          />
        </tbody>
      </table>
    </div>
  )
}

function Row({
  label,
  value,
  ok,
  warn,
  link,
}: {
  label: string
  value: string
  ok?: boolean
  warn?: boolean
  link?: string
}) {
  const color = ok === true ? 'green' : warn === true ? 'red' : undefined
  return (
    <tr>
      <td style={{ padding: '6px 12px', fontWeight: 'bold', color: '#888', whiteSpace: 'nowrap' }}>
        {label}
      </td>
      <td style={{ padding: '6px 12px', color }}>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer">
            {value}
          </a>
        ) : (
          value
        )}
      </td>
    </tr>
  )
}
