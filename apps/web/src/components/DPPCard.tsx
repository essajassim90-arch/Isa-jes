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
    <div className="sa-card" style={{ maxWidth: '100%', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div className="sa-network">DPP</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, margin: '4px 0' }}>
            {dpp.productName ?? dpp.product}
          </div>
        </div>
        <div className={`sa-status ${dpp.status === 'active' ? 'deployed' : 'pending'}`} style={{ textTransform: 'capitalize' }}>
          {dpp.status}
        </div>
      </div>

      <div className="wallet-info" style={{ marginBottom: '16px' }}>
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
        <div className="wallet-row">
          <span className="wallet-label">On-Chain</span>
          <span className={`sa-status ${isVerified ? 'deployed' : 'pending'}`} style={{ fontSize: '0.8rem' }}>
            {isVerified ? `✅ ${dpp.txHash!.slice(0, 10)}…` : '⏳ Testnet-ready'}
          </span>
        </div>
      </div>

      {metadataEntries.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>
            Metadata-driven capture
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

      {dpp.events.length > 0 && (
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>
            Lifecycle Events
          </div>
          {dpp.events.map((e, i) => (
            <EventRow key={i} event={e} />
          ))}
        </div>
      )}
    </div>
  )
}
