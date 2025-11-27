import type { LifePlanInsight } from '../../hooks/useLifePlanInsights'
import { EmptyState } from '../common/EmptyState'
import { Panel } from '../common/Panel'
import { InsightCard } from '../common/InsightCard'

interface InsightsPanelProps {
  readonly insights: ReadonlyArray<LifePlanInsight>
}

export const InsightsPanel = ({ insights }: InsightsPanelProps) => {
  const hasInsights = insights.length > 0

  return (
    <Panel
      title="シミュレーションのインサイト"
      description="シミュレーション結果から導かれる重要なポイントや注意事項を把握できます。"
    >
      {hasInsights ? (
        <div className="insight-grid">
          {insights.map((insight) => (
            <InsightCard key={insight.id} {...insight} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="インサイトはまだありません"
          description="条件を調整すると、注目すべき指標や改善のヒントが表示されます。"
          icon={<span>💡</span>}
        />
      )}
    </Panel>
  )
}
