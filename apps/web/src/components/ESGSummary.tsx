import type { ESGReport } from '@nama/shared'

interface ESGSummaryProps {
  report: ESGReport
}

const METRIC_ICONS: Record<string, string> = {
  carbon: '💨',
  energy: '⚡',
  water: '💧',
  waste: '♻️',
  compliance: '✅',
}

export function ESGSummary({ report }: ESGSummaryProps) {
  return (
    <div className="wallet-info">
      <div className="wallet-row">
        <span className="wallet-label">Organisation</span>
        <span className="wallet-source">{report.orgId}</span>
      </div>
      <div className="wallet-row">
        <span className="wallet-label">Carbon Footprint</span>
        <span className="wallet-balance">{report.carbonFootprintKg} kg CO₂e</span>
      </div>
      <div className="wallet-row">
        <span className="wallet-label">Circular Routes</span>
        <span className="wallet-balance">{report.circularRoutes}</span>
      </div>
      <div className="wallet-row">
        <span className="wallet-label">Compliance Score</span>
        <span className={`sa-status ${report.complianceScore >= 80 ? 'deployed' : 'pending'}`}>
          {report.complianceScore} / 100
        </span>
      </div>
      {report.periodStart && (
        <div className="wallet-row">
          <span className="wallet-label">Period</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {new Date(report.periodStart).toLocaleDateString()} –{' '}
            {report.periodEnd ? new Date(report.periodEnd).toLocaleDateString() : '—'}
          </span>
        </div>
      )}
      {report.metrics && report.metrics.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Metric Breakdown
          </div>
          {report.metrics.map((m, i) => (
            <div key={i} className="wallet-row">
              <span className="wallet-label">
                {METRIC_ICONS[m.metricType] ?? '📊'} {m.metricType}
              </span>
              <span>
                {m.value} {m.unit}{' '}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({m.source})</span>
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="wallet-row" style={{ marginTop: '8px' }}>
        <span className="wallet-label">Generated</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {new Date(report.generatedAt).toLocaleString()}
        </span>
      </div>
    </div>
  )
}
