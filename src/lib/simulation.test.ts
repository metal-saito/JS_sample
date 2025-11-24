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

  it('シミュレーション期間全体の年次データを生成する', () => {
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

  it('年表に退職年が含まれることを確認する', () => {
    const baseYear = 2030
    const { timeline } = simulateLifePlan(baseInput, baseYear)
    const retirementRow = timeline.find((entry) => entry.age === baseInput.retirementAge)

    expect(retirementRow).not.toBeUndefined()
    expect(retirementRow?.year).toBe(baseYear + (baseInput.retirementAge - baseInput.currentAge))
  })

  it('退職後の支出が高すぎる場合に不足を検出する', () => {
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

  it('就業期間中は毎年の積立増加率を反映する', () => {
    const { timeline } = simulateLifePlan(baseInput, 2025)

    const firstYearContribution = timeline[0].contribution
    const secondYearContribution = timeline[1].contribution

    expect(secondYearContribution).toBeGreaterThan(firstYearContribution)
  })

  it('退職年齢が不正な場合はエラーを投げる', () => {
    const invalidInput: LifePlanInput = {
      ...baseInput,
      retirementAge: 30,
    }

    expect(() => simulateLifePlan(invalidInput, 2025)).toThrow('退職年齢は現在の年齢以上である必要があります。')
  })
})
