import { useMemo } from 'react'
import type { LifePlanSummary } from '../../lib/simulation'
import { formatCurrency } from '../../lib/simulation'
import { Panel } from '../common/Panel'
import { SummaryMetricsGrid, type SummaryMetricDefinition } from './SummaryMetricsGrid'

interface SummaryPanelProps {
  readonly summary: LifePlanSummary
}

export const SummaryPanel = ({ summary }: SummaryPanelProps) => {
  const metrics = useMemo<ReadonlyArray<SummaryMetricDefinition>>(
    () => [
      {
        id: 'total-contributions',
        label: '累計積立額',
        value: formatCurrency(summary.totalContributions),
        caption: '就業期間中に積み上げた総額',
      },
      {
        id: 'total-withdrawals',
        label: '累計引き出し額',
        value: formatCurrency(summary.totalWithdrawals),
        caption: '退職後に取り崩した資金の合計',
      },
      {
        id: 'final-balance',
        label: '最終残高',
        value: formatCurrency(summary.finalBalance),
        caption: 'シミュレーション最終年の資産残高',
        emphasize: summary.finalBalance > summary.totalContributions * 0.5,
      },
      {
        id: 'funded-years',
        label: '退職後に生活費を賄えた年数',
        value: `${summary.yearsFundedAfterRetirement} 年`,
        caption: '引き出し需要を満たせた年数',
      },
      {
        id: 'shortfall-year',
        label: '不足が発生した年',
        value: summary.shortfallYear ? `${summary.shortfallYear} 年` : '不足なし',
        caption: summary.shortfallYear
          ? '最初に生活費を満額まかなえなかった年'
          : '退職後も不足は発生しませんでした',
        fullWidth: true,
        emphasize: summary.shortfallYear === null,
      },
    ],
    [summary],
  )

  const shortfallMessage = summary.shortfallYear
    ? `生活費の不足は ${summary.shortfallYear} 年に初めて発生しています。`
    : '退職後の期間を通じて生活費の不足は発生しませんでした。'

  return (
    <Panel
      title="サマリー"
      description="資産推移の主要指標をまとめて確認できます。累計額や不足発生年をチェックしてリスクを評価しましょう。"
      footer={<p className="panel__footnote">{shortfallMessage}</p>}
    >
      <SummaryMetricsGrid metrics={metrics} />
    </Panel>
  )
}
