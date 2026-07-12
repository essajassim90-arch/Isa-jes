import { useCircular } from '../hooks/useCircular.ts'
import type { CircularDiversionRoute, ESGCircularBadge, HeritageVaultEntry } from '@nama/shared'

const TIER_COLOUR: Record<string, string> = {
  gold: '#f59e0b',
  silver: '#9ca3af',
  bronze: '#92400e',
}

const STATUS_COLOUR: Record<string, string> = {
  completed: 'deployed',
  active: 'pending',
  cancelled: 'error',
}

function MetricTile({ label, value, unit }: { label: string; value: number | string; unit?: string }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value accent">
        {value}{unit ? <span style={{ fontSize: '0.75rem', marginLeft: '4px', fontWeight: 400 }}>{unit}</span> : null}
      </div>
    </div>
  )
}

function RouteRow({ route }: { route: CircularDiversionRoute }) {
  return (
    <div className="list-row">
      <div>
        <strong style={{ textTransform: 'capitalize' }}>{route.diversionType.replace(/-/g, ' ')}</strong>
        <div className="muted-text">
          {route.batchId} · {route.certificationName ?? '—'}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        <span className={`sa-status ${STATUS_COLOUR[route.status] ?? 'pending'}`} style={{ textTransform: 'capitalize' }}>
          {route.status}
        </span>
        <span className="muted-text">{route.kgDiverted} kg</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {route.sdg2Impact && <span className="badge-roadmap">SDG 2</span>}
          {route.sdg12Impact && <span className="badge-roadmap">SDG 12</span>}
        </div>
      </div>
    </div>
  )
}

function BadgeCard({ badge }: { badge: ESGCircularBadge }) {
  return (
    <div className="sa-card" style={{ maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <div className="sa-network">ESG Circular Badge</div>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>
            {badge.batchId}
          </div>
        </div>
        <div style={{
          padding: '6px 14px',
          borderRadius: '20px',
          fontWeight: 700,
          fontSize: '0.9rem',
          background: TIER_COLOUR[badge.tier] + '22',
          color: TIER_COLOUR[badge.tier],
          border: `1px solid ${TIER_COLOUR[badge.tier]}44`,
          textTransform: 'capitalize',
        }}>
          ♻️ {badge.tier}
        </div>
      </div>
      <div className="wallet-info">
        <div className="wallet-row">
          <span className="wallet-label">Score</span>
          <span className="wallet-balance">{badge.score}/100</span>
        </div>
        <div className="wallet-row">
          <span className="wallet-label">Certification basis</span>
          <span>{badge.certificationBasis.join(', ')}</span>
        </div>
        <div className="wallet-row">
          <span className="wallet-label">SDG alignment</span>
          <span>{badge.sdgAlignment.map((g) => `SDG ${g}`).join(', ')}</span>
        </div>
        <div className="wallet-row">
          <span className="wallet-label">Issued</span>
          <span className="muted-text">{new Date(badge.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        {badge.validUntil && (
          <div className="wallet-row">
            <span className="wallet-label">Valid until</span>
            <span className="muted-text">{new Date(badge.validUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        )}
      </div>
      <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        ⛓️ Certification-based · no new contracts · PassportCertificationAttached
      </div>
    </div>
  )
}

function HeritageCard({ entry }: { entry: HeritageVaultEntry }) {
  return (
    <div className="list-row">
      <div>
        <strong>{entry.productName}</strong>
        <div className="muted-text">
          {entry.origin} · <span style={{ textTransform: 'capitalize' }}>{entry.category.replace(/-/g, ' ')}</span>
        </div>
        <div className="muted-text" style={{ marginTop: '2px', fontSize: '0.78rem' }}>
          {entry.certificationSnapshot.join(' · ')}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        <span className="badge-roadmap" style={{ textTransform: 'capitalize' }}>{entry.status}</span>
        <span className="wallet-balance">{entry.heritageScore}/100</span>
      </div>
    </div>
  )
}

export function Circular() {
  const { panel, loading, error } = useCircular()

  if (loading) {
    return <div className="page-empty">Loading circular procurement data…</div>
  }

  if (error) {
    return <div className="page-error">⚠️ {error}</div>
  }

  if (!panel) {
    return <div className="page-empty">No circular data available.</div>
  }

  const { metrics, recentRoutes, badges, heritageVault } = panel

  return (
    <div className="stack-lg">
      <section className="panel hero-panel">
        <div>
          <div className="badge-roadmap">Phase 2M · Hyper-Local Circular Procurement</div>
          <h1 className="page-title">♻️ Circular Economy Engine</h1>
          <p className="page-subtitle">
            Certification-based circular diversion routes, ESG badges, SDG telemetry,
            and heritage vault simulation — all powered by existing DPP.sol infrastructure.
          </p>
        </div>
        <div className="metric-grid">
          <MetricTile label="Routes completed" value={metrics.routesCompleted} />
          <MetricTile label="kg diverted" value={metrics.kgDiverted} unit="kg" />
          <MetricTile label="SDG 2 impact events" value={metrics.sdg2ImpactEvents} />
          <MetricTile label="SDG 12 impact events" value={metrics.sdg12ImpactEvents} />
        </div>
      </section>

      <section className="two-column-grid">
        <div className="panel">
          <div className="section-title-row">
            <h2>Diversion routes</h2>
            <span className="badge-roadmap">recordPassportEvent</span>
          </div>
          <div className="stack-sm">
            {recentRoutes.length === 0 && (
              <div className="muted-text">No circular routes recorded.</div>
            )}
            {recentRoutes.map((route) => (
              <RouteRow key={route.routeId} route={route} />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title-row">
            <h2>ESG Circular Badges</h2>
            <span className="badge-roadmap">PassportCertificationAttached</span>
          </div>
          <div className="stack-sm">
            {badges.length === 0 && (
              <div className="muted-text">No badges issued yet.</div>
            )}
            {badges.map((badge) => (
              <BadgeCard key={badge.badgeId} badge={badge} />
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title-row">
          <h2>Heritage Vault</h2>
          <span className="badge-roadmap">Simulated · certification-based · no new on-chain storage</span>
        </div>
        <div className="stack-sm">
          {heritageVault.length === 0 && (
            <div className="muted-text">No heritage vault entries.</div>
          )}
          {heritageVault.map((entry) => (
            <HeritageCard key={entry.vaultId} entry={entry} />
          ))}
        </div>
      </section>
    </div>
  )
}

