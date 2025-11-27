import type { ReactNode } from 'react'

interface LegendItemProps {
  readonly label: ReactNode
  readonly description: ReactNode
  readonly className?: string
  readonly indicatorClassName?: string
  readonly indicatorLabel?: string
}

export const LegendItem = ({
  label,
  description,
  className,
  indicatorClassName,
  indicatorLabel,
}: LegendItemProps) => {
  const rootClassName = ['legend-item', className].filter(Boolean).join(' ')
  const indicatorClasses = ['legend-item__indicator', indicatorClassName]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClassName}>
      <span className={indicatorClasses} aria-hidden={indicatorLabel ? undefined : true} aria-label={indicatorLabel} />
      <div className="legend-item__content">
        <span className="legend-item__label">{label}</span>
        <span className="legend-item__description">{description}</span>
      </div>
    </div>
  )
}
