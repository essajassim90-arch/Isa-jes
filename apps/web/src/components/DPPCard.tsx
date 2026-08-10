import type { DPP, DPPEvent } from '@nama/shared'

interface DPPCardProps {
  dpp: DPP
}

const EVENT_ICONS: Record<string, string> = {
  created: '🌱',
  transit: '🚢',
  storage: '🏭',
  quality_check: '🔬',
  delivered: '📬',
}

function EventRow({ event }: { event: DPPEvent }) {
  const icon = EVENT_ICONS[event.eventType] ?? '📌'
  const date = new Date(event.timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return (
    <div style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '1.1rem', width: '24px', textAlign: 'center' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '0.88rem' }}>
          {event.eventType.replace('_', ' ')}
        </div>
        {event.location && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{event.location}</div>
        )}
        {event.actor && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>by {event.actor}</div>
        )}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{date}</div>
    </div>
  )
}

export function DPPCard({ dpp }: DPPCardProps) {
  const isVerified = Boolean(dpp.txHash)
  const metadataEntries = Object.entries(dpp.metadata ?? {}).slice(0, 4)
  const certificationCount = dpp.certifications.length
  const procurementSignal = certificationCount >= 2 ? 'strong' : certificationCount === 1 ? 'moderate' : 'review'
  const qualityIndicator = certificationCount >= 2 ? 'premium' : certificationCount === 1 ? 'qualified' : 'watchlist'

  return (
    <div className={`dpp-card${isVerified ? ' dpp-card-verified' : ''}`} style={{ width: '100%' }}>
      {/* Header row */}
      <div className="dpp-card-header">
        <div>
          <div className="dpp-card-label">Digital Product Passport</div>
          <div className="dpp-card-product">
            {dpp.productName ?? dpp.product}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <div className={`sa-status ${dpp.status === 'active' ? 'deployed' : 'pending'}`} style={{ textTransform: 'capitalize', fontSize: '0.78rem' }}>
            {dpp.status}
          </div>
          {isVerified ? (
            <div className="chain-badge dark" title={`VeChainThor Testnet · tx ${dpp.txHash}`}>
              🔗 On-Chain Verified
            </div>
          ) : (
            <div className="chain-badge dark" style={{ opacity: 0.6 }}>
              ⏳ Testnet-ready
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Core fields */}
        <div className="wallet-info" style={{ margin: 0 }}>
          <div className="wallet-row">
            <span className="wallet-label">Batch ID</span>
            <span className="sa-address">{dpp.batchId}</span>
          </div>
          <div className="wallet-row">
            <span className="wallet-label">Origin</span>
            <span>{dpp.originCountry ? `${dpp.origin}, ${dpp.originCountry}` : dpp.origin}</span>
          </div>
          {(dpp.profile || dpp.workflowId) && (
            <div className="wallet-row">
              <span className="wallet-label">Workflow</span>
              <span style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {dpp.profile && <span className="badge-roadmap">{dpp.profile}</span>}
                {dpp.workflowId && <span className="badge-roadmap">{dpp.workflowId}</span>}
              </span>
            </div>
          )}
          {dpp.certifications.length > 0 && (
            <div className="wallet-row">
              <span className="wallet-label">Certifications</span>
              <span style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {dpp.certifications.map((c) => (
                  <span key={c.name} className="badge-roadmap">{c.name}</span>
                ))}
              </span>
            </div>
          )}
          <div className="wallet-row">
            <span className="wallet-label">AII badge</span>
            <span className="badge-roadmap">{certificationCount > 0 ? `${certificationCount} verified` : 'Pending'}</span>
          </div>
          <div className="wallet-row">
            <span className="wallet-label">Procurement signal</span>
            <span className="badge-roadmap">{procurementSignal}</span>
          </div>
          <div className="wallet-row">
            <span className="wallet-label">Marketplace quality</span>
            <span className="badge-roadmap">{qualityIndicator}</span>
          </div>
        </div>

        {/* Metadata section */}
        {metadataEntries.length > 0 && (
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Metadata capture
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {metadataEntries.map(([key, value]) => (
                <div key={key} className="data-chip">
                  <span className="data-chip-label">{key}</span>
                  <span className="data-chip-value">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lifecycle events */}
        {dpp.events.length > 0 && (
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lifecycle Events
            </div>
            {dpp.events.map((e, i) => (
              <EventRow key={i} event={e} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
