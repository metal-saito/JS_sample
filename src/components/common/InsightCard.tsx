import type { LifePlanInsight } from '../../hooks/useLifePlanInsights'

const toneClassNames: Record<LifePlanInsight['tone'], string> = {
  positive: 'insight-card--positive',
  warning: 'insight-card--warning',
  neutral: 'insight-card--neutral',
}

const trendSymbolByDirection: Record<NonNullable<LifePlanInsight['trend']>, string> = {
  up: '▲',
  down: '▼',
}

const trendLabelByDirection: Record<NonNullable<LifePlanInsight['trend']>, string> = {
  up: '上昇傾向',
  down: '下降傾向',
}

export const InsightCard = ({ title, highlight, description, tone, trend }: LifePlanInsight) => {
  const className = ['insight-card', toneClassNames[tone]].join(' ')

  return (
    <article className={className} aria-live="polite">
      <header className="insight-card__header">
        <span className="insight-card__title">{title}</span>
        {trend ? (
          <span className={`insight-card__trend insight-card__trend--${trend}`} aria-label={trendLabelByDirection[trend]}>
            {trendSymbolByDirection[trend]}
          </span>
        ) : null}
      </header>
      <strong className="insight-card__highlight">{highlight}</strong>
      <p className="insight-card__description">{description}</p>
    </article>
  )
}
