import { useEnterpriseDashboard } from '../hooks/useEnterpriseDashboard.ts'
import { apiUrl, isDemoMode } from '../lib/api.ts'

function StatCard({ label, value, tone = 'default' }: { label: string; value: string | number; tone?: 'default' | 'accent' }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className={`metric-value ${tone === 'accent' ? 'accent' : ''}`}>{value}</div>
    </div>
  )
}

export function EnterpriseDashboard() {
  const { dashboard, loading, error } = useEnterpriseDashboard()

  if (loading) {
    return <div className="page-empty">Loading enterprise dashboard…</div>
  }

  if (error) {
    return <div className="page-error">⚠️ {error}</div>
  }

  if (!dashboard) {
    return <div className="page-empty">No enterprise dashboard data available.</div>
  }

  return (
    <div className="stack-lg">
      <section className="panel hero-panel">
        <div>
          <div className="badge-roadmap">Pre-Testnet scope · 2K + 2L</div>
          <h1 className="page-title">Enterprise interface</h1>
          <p className="page-subtitle">
            Projection-backed ESG intelligence, procurement visibility, verified SDG telemetry,
            audit snapshots, ERP exports, and AII score visibility.
          </p>
        </div>
        <div className="metric-grid">
          <StatCard label="Active passports" value={dashboard.stats.activePassports} />
          <StatCard label="Open listings" value={dashboard.stats.openListings} />
          <StatCard label="Verified telemetry" value={dashboard.stats.telemetryVerified} />
          <StatCard label="Export jobs" value={dashboard.stats.exportJobs} tone="accent" />
        </div>
      </section>

      <section className="two-column-grid">
        <div className="panel">
          <div className="section-title-row">
            <h2>ESG intelligence</h2>
            <span className="badge-roadmap">Existing projection reuse</span>
          </div>
          <div className="stack-sm">
            <div className="key-value">
              <span>Compliance score</span>
              <strong>{dashboard.esg.complianceScore}/100</strong>
            </div>
            <div className="key-value">
              <span>Carbon footprint</span>
              <strong>{dashboard.esg.carbonFootprintKg} kg CO2e</strong>
            </div>
            {(dashboard.esg.metrics ?? []).map((metric) => (
              <div key={metric.metricType} className="data-chip">
                <span className="data-chip-label">{metric.metricType}</span>
                <span className="data-chip-value">
                  {metric.value} {metric.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title-row">
            <h2>AII v1</h2>
            <span className="badge-roadmap">Off-chain derived</span>
          </div>
          <div className="stack-sm">
            <div className="aii-score">{dashboard.aii.score}</div>
            <div className="key-value">
              <span>Grade</span>
              <strong>{dashboard.aii.grade}</strong>
            </div>
            {dashboard.aii.breakdown.map((item) => (
              <div key={item.id} className="list-row">
                <div>
                  <strong>{item.label}</strong>
                  <div className="muted-text">{item.rationale}</div>
                </div>
                <span>{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="two-column-grid">
        <div className="panel">
          <div className="section-title-row">
            <h2>Verified SDG telemetry</h2>
            <span className="badge-roadmap">Event-based extension</span>
          </div>
          <div className="stack-sm">
            {dashboard.telemetry.categories.map((category) => (
              <div key={category.category} className="list-row">
                <div>
                  <strong>{category.category}</strong>
                  <div className="muted-text">SDGs {category.sdgGoals.join(', ') || '—'}</div>
                </div>
                <span>
                  {category.totalValue} {category.unit}
                </span>
              </div>
            ))}
            <div className="panel-note">
              {dashboard.telemetry.totals.verified} of {dashboard.telemetry.totals.captured} telemetry
              events are verified for audit use.
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="section-title-row">
            <h2>Audit & compliance</h2>
            <span className="badge-roadmap">Read views</span>
          </div>
          <div className="stack-sm">
            {dashboard.auditSnapshots.map((snapshot) => (
              <div key={snapshot.snapshotId} className="audit-card">
                <div className="list-row">
                  <strong>{snapshot.batchId}</strong>
                  <span className={`status-pill ${snapshot.status === 'verified' ? 'good' : 'warn'}`}>
                    {snapshot.status}
                  </span>
                </div>
                <div className="muted-text">{snapshot.findings.join(' · ')}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title-row">
          <h2>ERP Export Gateway v1</h2>
          <span className="badge-roadmap">CSV / JSON first</span>
        </div>
        <div className="export-grid">
          {dashboard.exportJobs.map((job) => (
            <div key={job.exportId} className="export-card">
              <div className="list-row">
                <strong>{job.exportId}</strong>
                <span className="badge-roadmap">{job.format.toUpperCase()}</span>
              </div>
              <div className="muted-text">
                {job.dataset} · {job.recordCount} rows · {job.source}
              </div>
              {isDemoMode ? (
                <span className="link-muted">Static demo export</span>
              ) : (
                <a href={apiUrl(job.downloadPath)} className="link-muted">
                  Download export
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
