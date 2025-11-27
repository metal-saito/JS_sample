import { useMemo } from 'react'
import { formatCurrency, type LifePlanSummary, type LifePlanYearResult } from '../lib/simulation'

export type LifePlanInsightTone = 'positive' | 'warning' | 'neutral'
export type LifePlanInsightTrend = 'up' | 'down'

export interface LifePlanInsight {
  readonly id: string
  readonly title: string
  readonly highlight: string
  readonly description: string
  readonly tone: LifePlanInsightTone
  readonly trend?: LifePlanInsightTrend
}

export interface LifePlanInsightsOptions {
  readonly summary: LifePlanSummary | null
  readonly timeline: ReadonlyArray<LifePlanYearResult>
  readonly retirementAge: number
}

const percentageFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'percent',
  maximumFractionDigits: 0,
})

const clampPercentage = (value: number): number => {
  if (Number.isNaN(value)) {
    return 0
  }

  if (value < 0) {
    return 0
  }

  return value > 1 ? 1 : value
}

const resolveCoverageTone = (ratio: number): LifePlanInsightTone => {
  if (ratio >= 0.95) {
    return 'positive'
  }

  if (ratio >= 0.65) {
    return 'neutral'
  }

  return 'warning'
}

const resolveWealthTone = (multiple: number): { tone: LifePlanInsightTone; trend?: LifePlanInsightTrend } => {
  if (multiple >= 1.2) {
    return { tone: 'positive', trend: 'up' }
  }

  if (multiple >= 0.85) {
    return { tone: 'neutral' }
  }

  return { tone: 'warning', trend: 'down' }
}

export const buildLifePlanInsights = ({
  summary,
  timeline,
  retirementAge,
}: LifePlanInsightsOptions): LifePlanInsight[] => {
  if (!summary || timeline.length === 0) {
    return []
  }

  const insights: LifePlanInsight[] = []

  const peakBalanceEntry = timeline.reduce<LifePlanYearResult>((peak, entry) => {
    return entry.endBalance > peak.endBalance ? entry : peak
  })

  insights.push({
    id: 'peak-balance',
    title: '最大残高',
    highlight: formatCurrency(peakBalanceEntry.endBalance),
    description: `${peakBalanceEntry.year} 年（${peakBalanceEntry.age} 歳）の時点で最も多く資産を保有しています。`,
    tone: 'positive',
    trend: 'up',
  })

  const retirementEntries = timeline.filter((entry) => entry.age >= retirementAge)
  if (retirementEntries.length > 0) {
    const coverageRatio = summary.yearsFundedAfterRetirement / retirementEntries.length
    const tone = resolveCoverageTone(coverageRatio)
    const highlight = percentageFormatter.format(clampPercentage(coverageRatio))

    insights.push({
      id: 'retirement-coverage',
      title: '退職後の資金カバレッジ',
      highlight,
      description: `退職後 ${retirementEntries.length} 年のうち ${summary.yearsFundedAfterRetirement} 年で生活費を満額引き出せています。`,
      tone,
      trend: coverageRatio >= 0.95 ? 'up' : coverageRatio < 0.65 ? 'down' : undefined,
    })
  }

  if (summary.totalContributions > 0) {
    const wealthMultiple = summary.finalBalance / summary.totalContributions
    const { tone, trend } = resolveWealthTone(wealthMultiple)

    insights.push({
      id: 'wealth-multiple',
      title: '資産成長倍率',
      highlight: `${wealthMultiple.toFixed(2)}x`,
      description: `累計積立額 ${formatCurrency(summary.totalContributions)} に対し、最終残高は ${formatCurrency(summary.finalBalance)} です。`,
      tone,
      trend,
    })
  }

  if (summary.shortfallYear) {
    insights.push({
      id: 'shortfall-warning',
      title: '不足発生日',
      highlight: `${summary.shortfallYear} 年`,
      description: 'この年以降は生活費を満額引き出せません。積立額や支出条件を見直しましょう。',
      tone: 'warning',
      trend: 'down',
    })
  } else {
    insights.push({
      id: 'shortfall-none',
      title: '不足なし',
      highlight: '最後まで生活費を確保',
      description: '全期間を通じて生活費を満額引き出せています。',
      tone: 'positive',
      trend: 'up',
    })
  }

  return insights
}

export const useLifePlanInsights = (options: LifePlanInsightsOptions): ReadonlyArray<LifePlanInsight> => {
  const { summary, timeline, retirementAge } = options

  return useMemo(() => buildLifePlanInsights({ summary, timeline, retirementAge }), [summary, timeline, retirementAge])
}
