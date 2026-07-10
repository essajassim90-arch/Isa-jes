import type { ESGReport } from '@nama/shared'

interface ESGSummaryProps {
  report: ESGReport
}

// TODO (Phase 1): Connect to GET /esg/report/:orgId.
export function ESGSummary({ report }: ESGSummaryProps) {
  return (
    <div className="wallet-info">
      <div className="wallet-row">
        <span className="wallet-label">Organisation</span>
        <span>{report.orgId}</span>
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
    </div>
  )
}
