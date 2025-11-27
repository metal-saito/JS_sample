import { ReactNode } from 'react'

interface SummaryCardProps {
  readonly label: string
  readonly value: ReactNode
  readonly fullWidth?: boolean
  readonly emphasize?: boolean
  readonly caption?: ReactNode
}

export const SummaryCard = ({
  label,
  value,
  fullWidth = false,
  emphasize = false,
  caption,
}: SummaryCardProps) => {
  const className = ['summary-card', fullWidth ? 'summary-card--wide' : '', emphasize ? 'summary-card--emphasis' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className}>
      <span className="summary-card__label">{label}</span>
      <strong className="summary-card__value">{value}</strong>
      {caption ? <span className="summary-card__caption">{caption}</span> : null}
    </div>
  )
}
