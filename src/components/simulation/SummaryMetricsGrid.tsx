import { SummaryCard } from '../common/SummaryCard'

export interface SummaryMetricDefinition {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly fullWidth?: boolean
  readonly emphasize?: boolean
  readonly caption?: string
}

interface SummaryMetricsGridProps {
  readonly metrics: ReadonlyArray<SummaryMetricDefinition>
}

export const SummaryMetricsGrid = ({ metrics }: SummaryMetricsGridProps) => {
  if (metrics.length === 0) {
    return null
  }

  return (
    <div className="summary-grid">
      {metrics.map((metric) => (
        <SummaryCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          fullWidth={metric.fullWidth}
          emphasize={metric.emphasize}
          caption={metric.caption}
        />
      ))}
    </div>
  )
}
