import { useEnterpriseDashboard } from '../hooks/useEnterpriseDashboard.ts'
import { useCircular } from '../hooks/useCircular.ts'
import { apiUrl, isDemoMode } from '../lib/api.ts'
import { demoProcurementSavings, demoCircularRevenueShare } from '../lib/demoData.ts'

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
  const { panel: circularPanel } = useCircular()

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
            <h2>AII indicators</h2>
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
            <h2>Verified SDG area</h2>
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
          <h2>Procurement insights</h2>
          <span className="badge-roadmap">AII quality signals</span>
        </div>
        <div className="stack-sm">
          {dashboard.procurementInsights.map((insight) => (
            <div key={insight.listingId} className="list-row">
              <div>
                <strong>{insight.batchId}</strong>
                <div className="muted-text">
                  Listing {insight.listingId} · AII {insight.aiiScore}
                </div>
              </div>
              <span className="badge-roadmap">
                {insight.qualityIndicator} · {insight.procurementSignal}
              </span>
            </div>
          ))}
        </div>
      </section>

      {circularPanel && (
        <section className="panel">
          <div className="section-title-row">
            <h2>♻️ Circular Procurement</h2>
            <span className="badge-roadmap">Phase 2M · certification-based</span>
          </div>
          <div className="metric-grid" style={{ marginBottom: '16px' }}>
            <div className="metric-card">
              <div className="metric-label">Routes completed</div>
              <div className="metric-value accent">{circularPanel.metrics.routesCompleted}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">kg diverted</div>
              <div className="metric-value accent">{circularPanel.metrics.kgDiverted} kg</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">SDG 2 impact events</div>
              <div className="metric-value">{circularPanel.metrics.sdg2ImpactEvents}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">SDG 12 impact events</div>
              <div className="metric-value">{circularPanel.metrics.sdg12ImpactEvents}</div>
            </div>
          </div>
          <div className="stack-sm">
            {circularPanel.recentRoutes.slice(0, 3).map((route) => (
              <div key={route.routeId} className="list-row">
                <div>
                  <strong style={{ textTransform: 'capitalize' }}>{route.diversionType.replace(/-/g, ' ')}</strong>
                  <div className="muted-text">
                    {route.batchId} · {route.certificationName ?? '—'}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className={`sa-status ${route.status === 'completed' ? 'deployed' : 'pending'}`} style={{ textTransform: 'capitalize' }}>
                    {route.status}
                  </span>
                  <span className="muted-text">{route.kgDiverted} kg</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="panel">
        <div className="section-title-row">
          <h2>💰 Commercial Model</h2>
          <span className="badge-roadmap">Demo · read-only · no payment logic</span>
        </div>
        <div className="panel-note" style={{ marginBottom: '16px' }}>
          Illustrative commercial model — demo values only. No real revenue, no payment contracts,
          no financial settlement. See{' '}
          <a href="https://github.com/essajassim90-arch/Isa-jes/blob/main/docs/COMMERCIAL_MODEL.md" className="link-muted" target="_blank" rel="noopener noreferrer">
            docs/COMMERCIAL_MODEL.md
          </a>{' '}
          for full context.
        </div>

        <div className="section-title-row" style={{ marginBottom: '8px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Shared Savings Procurement</h3>
          <span className="badge-roadmap">{demoProcurementSavings.period}</span>
        </div>
        <div className="metric-grid" style={{ marginBottom: '16px' }}>
          <div className="metric-card">
            <div className="metric-label">Conventional cost</div>
            <div className="metric-value">${demoProcurementSavings.conventionalCostUsd.toLocaleString()}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">NAMA procurement cost</div>
            <div className="metric-value accent">${demoProcurementSavings.namaCostUsd.toLocaleString()}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Verified savings</div>
            <div className="metric-value accent">${demoProcurementSavings.verifiedSavingsUsd.toLocaleString()}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Buyer net saving</div>
            <div className="metric-value">${demoProcurementSavings.buyerNetSavingUsd.toLocaleString()}</div>
          </div>
        </div>
        <div className="stack-sm" style={{ marginBottom: '20px' }}>
          <div className="key-value">
            <span>NAMA savings-share rate (configurable)</span>
            <strong>{(demoProcurementSavings.namaSavingsShareRate * 100).toFixed(0)}%</strong>
          </div>
          <div className="key-value">
            <span>NAMA revenue from savings-share</span>
            <strong>${demoProcurementSavings.namaRevenueUsd.toLocaleString()}</strong>
          </div>
        </div>

        <div className="section-title-row" style={{ marginBottom: '8px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Circular Recovery Revenue Share</h3>
          <span className="badge-roadmap">Configurable split · not a legal rule</span>
        </div>
        <div className="metric-grid" style={{ marginBottom: '12px' }}>
          <div className="metric-card">
            <div className="metric-label">Total circular recovery revenue</div>
            <div className="metric-value">${demoCircularRevenueShare.totalCircularRevenueUsd.toLocaleString()}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Municipality / recovery partner (50%)</div>
            <div className="metric-value">${demoCircularRevenueShare.municipalityRevenueUsd.toLocaleString()}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">NAMA share (40%)</div>
            <div className="metric-value accent">${demoCircularRevenueShare.namaRevenueUsd.toLocaleString()}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Contributing institution (10%)</div>
            <div className="metric-value">${demoCircularRevenueShare.institutionRevenueUsd.toLocaleString()}</div>
          </div>
        </div>
        <div className="panel-note">
          Split is illustrative (40 / 50 / 10). Final percentages are negotiated per partnership.
          No on-chain payment logic · Phase 2 planning only.
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
