import { describe, expect, it } from 'vitest'
import { buildLifePlanInsights } from './useLifePlanInsights'
import type { LifePlanSummary, LifePlanYearResult } from '../lib/simulation'

const sampleTimeline: LifePlanYearResult[] = [
  { age: 64, year: 2030, contribution: 720000, investmentGrowth: 280000, withdrawal: 0, endBalance: 8200000 },
  { age: 65, year: 2031, contribution: 0, investmentGrowth: 320000, withdrawal: 3600000, endBalance: 4920000 },
  { age: 66, year: 2032, contribution: 0, investmentGrowth: 295000, withdrawal: 3700000, endBalance: 1515000 },
  { age: 67, year: 2033, contribution: 0, investmentGrowth: 182000, withdrawal: 3800000, endBalance: 0 },
  { age: 68, year: 2034, contribution: 0, investmentGrowth: 0, withdrawal: 2500000, endBalance: 0 },
  { age: 69, year: 2035, contribution: 0, investmentGrowth: 0, withdrawal: 2500000, endBalance: 0 },
]

const baseSummary: LifePlanSummary = {
  totalContributions: 12_000_000,
  totalWithdrawals: 15_000_000,
  finalBalance: 0,
  shortfallYear: null,
  yearsFundedAfterRetirement: 5,
}

describe('buildLifePlanInsights', () => {
  it('returns an empty list when summary is unavailable', () => {
    const insights = buildLifePlanInsights({ summary: null, timeline: sampleTimeline, retirementAge: 65 })
    expect(insights).toHaveLength(0)
  })

  it('summarises fully funded retirement as a positive insight', () => {
    const insights = buildLifePlanInsights({ summary: baseSummary, timeline: sampleTimeline, retirementAge: 65 })
    const ids = insights.map((insight) => insight.id)

    expect(ids).toContain('peak-balance')
    expect(ids).toContain('retirement-coverage')
    expect(ids).toContain('wealth-multiple')
    expect(ids).toContain('shortfall-none')

    const coverage = insights.find((insight) => insight.id === 'retirement-coverage')
    expect(coverage?.tone).toBe('positive')
    expect(coverage?.highlight).toBe('100%')

    const shortfall = insights.find((insight) => insight.id === 'shortfall-none')
    expect(shortfall?.tone).toBe('positive')
  })

  it('flags an early shortfall with a warning insight', () => {
    const summaryWithShortfall: LifePlanSummary = {
      ...baseSummary,
      shortfallYear: 2033,
      yearsFundedAfterRetirement: 2,
      finalBalance: 0,
    }

    const insights = buildLifePlanInsights({ summary: summaryWithShortfall, timeline: sampleTimeline, retirementAge: 65 })

    const coverage = insights.find((insight) => insight.id === 'retirement-coverage')
    expect(coverage?.tone).toBe('warning')
    expect(coverage?.highlight).toBe('40%')

    const shortfall = insights.find((insight) => insight.id === 'shortfall-warning')
    expect(shortfall?.tone).toBe('warning')
    expect(shortfall?.highlight).toBe('2033 年')
  })
})
