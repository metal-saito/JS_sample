import { LifePlanInput } from '../lib/simulation'

export interface NumericFieldDefinition {
  readonly key: keyof LifePlanInput
  readonly label: string
  readonly step: number
  readonly min: number
}

export const lifePlanDefaultInput: LifePlanInput = {
  currentAge: 32,
  retirementAge: 65,
  lifeExpectancyAge: 90,
  currentSavings: 5_000_000,
  monthlyContribution: 60_000,
  annualReturnRate: 0.04,
  annualRetirementSpending: 3_600_000,
  annualContributionGrowthRate: 0.03,
  annualInflationRate: 0.02,
}

export const lifePlanNumericFields = [
  { key: 'currentAge', label: '現在の年齢', step: 1, min: 18 },
  { key: 'retirementAge', label: '退職予定の年齢', step: 1, min: 18 },
  { key: 'lifeExpectancyAge', label: 'シミュレーションする最終年齢', step: 1, min: 40 },
  { key: 'currentSavings', label: '現在の貯蓄額 (円)', step: 100_000, min: 0 },
  { key: 'monthlyContribution', label: '毎月の積立額 (円)', step: 1_000, min: 0 },
  { key: 'annualReturnRate', label: '年間利回り (例: 0.04)', step: 0.005, min: 0 },
  { key: 'annualContributionGrowthRate', label: '積立増加率 (例: 0.03)', step: 0.005, min: 0 },
  { key: 'annualRetirementSpending', label: '退職後の年間支出 (円)', step: 100_000, min: 0 },
  { key: 'annualInflationRate', label: 'インフレ率 (例: 0.02)', step: 0.005, min: 0 },
] as const satisfies ReadonlyArray<NumericFieldDefinition>

export const LIFE_PLAN_FORM_HELPER_TEXT =
  '※ 利回りやインフレ率は割合を小数で入力します（例: 4% → 0.04）。'
