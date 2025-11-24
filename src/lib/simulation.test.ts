import { describe, expect, it } from 'vitest'
import { LifePlanInput, simulateLifePlan } from './simulation'

describe('simulateLifePlan', () => {
  const baseInput: LifePlanInput = {
    currentAge: 35,
    retirementAge: 65,
    lifeExpectancyAge: 90,
    currentSavings: 2_000_000,
    monthlyContribution: 50_000,
    annualReturnRate: 0.05,
    annualRetirementSpending: 3_000_000,
    annualContributionGrowthRate: 0.02,
    annualInflationRate: 0.015,
  }

  it('generates a timeline covering the entire simulation window', () => {
    const baseYear = 2025
    const { timeline, summary } = simulateLifePlan(baseInput, baseYear)

    expect(timeline[0]).toMatchObject({
      age: baseInput.currentAge,
      year: baseYear,
    })
    expect(timeline.at(-1)).toMatchObject({
      age: baseInput.lifeExpectancyAge,
      year: baseYear + (baseInput.lifeExpectancyAge - baseInput.currentAge),
    })

    // シミュレーションが正しく実行されていることを示すため、指標が算出されているか確認
    expect(summary.finalBalance).toBeGreaterThan(0)
    expect(summary.totalContributions).toBeGreaterThan(summary.totalWithdrawals * 0.2)
  })

  it('marks the retirement year within the timeline', () => {
    const baseYear = 2030
    const { timeline } = simulateLifePlan(baseInput, baseYear)
    const retirementRow = timeline.find((entry) => entry.age === baseInput.retirementAge)

    expect(retirementRow).not.toBeUndefined()
    expect(retirementRow?.year).toBe(baseYear + (baseInput.retirementAge - baseInput.currentAge))
  })

  it('detects a shortfall when retirement spending is too high', () => {
    const shortfallInput: LifePlanInput = {
      ...baseInput,
      annualRetirementSpending: 12_000_000,
    }

    const { summary } = simulateLifePlan(shortfallInput, 2025)

    expect(summary.shortfallYear).not.toBeNull()
    expect(summary.yearsFundedAfterRetirement).toBeLessThan(
      shortfallInput.lifeExpectancyAge - shortfallInput.retirementAge + 1,
    )
  })

  it('applies annual contribution growth while still working', () => {
    const { timeline } = simulateLifePlan(baseInput, 2025)

    const firstYearContribution = timeline[0].contribution
    const secondYearContribution = timeline[1].contribution

    expect(secondYearContribution).toBeGreaterThan(firstYearContribution)
  })

  it('throws an error when retirement age is invalid', () => {
    const invalidInput: LifePlanInput = {
      ...baseInput,
      retirementAge: 30,
    }

    expect(() => simulateLifePlan(invalidInput, 2025)).toThrow('退職年齢は現在の年齢以上である必要があります。')
  })
})
