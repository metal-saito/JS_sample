import type { LifePlanSummary } from '../../lib/simulation'
import { formatCurrency } from '../../lib/simulation'
import { Panel } from '../common/Panel'

interface SummaryPanelProps {
  readonly summary: LifePlanSummary
}

export const SummaryPanel = ({ summary }: SummaryPanelProps) => {
  const items = [
    {
      label: '累計積立額',
      value: formatCurrency(summary.totalContributions),
    },
    {
      label: '累計引き出し額',
      value: formatCurrency(summary.totalWithdrawals),
    },
    {
      label: '最終残高',
      value: formatCurrency(summary.finalBalance),
    },
    {
      label: '退職後に生活費を賄えた年数',
      value: `${summary.yearsFundedAfterRetirement} 年`,
    },
    {
      label: '不足が発生した年',
      value: summary.shortfallYear ? `${summary.shortfallYear} 年` : '不足なし',
      fullWidth: true,
    },
  ] as const

  return (
    <Panel title="サマリー">
      <div className="summary-grid">
        {items.map(({ label, value, fullWidth }) => (
          <div
            key={label}
            className={['summary-card', fullWidth ? 'summary-card--wide' : ''].filter(Boolean).join(' ')}
          >
            <span className="summary-card__label">{label}</span>
            <strong className="summary-card__value">{value}</strong>
          </div>
        ))}
      </div>
    </Panel>
  )
}
