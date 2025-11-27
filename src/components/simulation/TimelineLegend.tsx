import { LegendItem } from '../common/LegendItem'

interface TimelineLegendProps {
  readonly retirementAge: number
  readonly shortfallYear: number | null
}

export const TimelineLegend = ({ retirementAge, shortfallYear }: TimelineLegendProps) => {
  return (
    <div className="timeline-legend" aria-label="年次表の凡例">
      <LegendItem
        className="timeline-legend__item"
        indicatorClassName="timeline-legend__indicator timeline-legend__indicator--retirement"
        label="退職年"
        description={`${retirementAge} 歳の年次を強調表示します。`}
      />
      <LegendItem
        className="timeline-legend__item"
        indicatorClassName="timeline-legend__indicator timeline-legend__indicator--shortfall"
        label="不足発生年"
        description={
          shortfallYear
            ? `${shortfallYear} 年に生活費を満額引き出せなくなります。`
            : '不足が発生しない場合は表示されません。'
        }
      />
    </div>
  )
}
