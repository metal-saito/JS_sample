import { LifePlanInput } from '../lib/simulation'

export interface NumericFieldDefinition {
  readonly key: keyof LifePlanInput
  readonly label: string
  readonly step: number
  readonly min: number
  readonly max?: number
  readonly unit?: string
  readonly description?: string
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
  {
    key: 'currentAge',
    label: '現在の年齢',
    step: 1,
    min: 18,
    max: 80,
    unit: '歳',
    description: 'シミュレーションの開始時点となる年齢です。',
  },
  {
    key: 'retirementAge',
    label: '退職予定の年齢',
    step: 1,
    min: 18,
    max: 80,
    unit: '歳',
    description: '就業を終える想定年齢を入力してください。',
  },
  {
    key: 'lifeExpectancyAge',
    label: 'シミュレーションする最終年齢',
    step: 1,
    min: 40,
    max: 110,
    unit: '歳',
    description: '試算を行う最終年齢（想定寿命）です。',
  },
  {
    key: 'currentSavings',
    label: '現在の貯蓄額 (円)',
    step: 100_000,
    min: 0,
    max: 200_000_000,
    unit: '円',
    description: '現在保有している金融資産の総額を入力します。',
  },
  {
    key: 'monthlyContribution',
    label: '毎月の積立額 (円)',
    step: 1_000,
    min: 0,
    max: 1_000_000,
    unit: '円',
    description: '就業期間中に毎月積み立てる金額です。',
  },
  {
    key: 'annualReturnRate',
    label: '年間利回り (例: 0.04)',
    step: 0.005,
    min: 0,
    max: 0.25,
    unit: '割合',
    description: '資産運用の想定利回りを小数で入力します（例: 0.04 = 4%）。',
  },
  {
    key: 'annualContributionGrowthRate',
    label: '積立増加率 (例: 0.03)',
    step: 0.005,
    min: 0,
    max: 0.15,
    unit: '割合',
    description: '毎年の積立額がどれほど増加するかの割合です。',
  },
  {
    key: 'annualRetirementSpending',
    label: '退職後の年間支出 (円)',
    step: 100_000,
    min: 0,
    max: 20_000_000,
    unit: '円',
    description: '退職後に一年間で必要となる生活費です。',
  },
  {
    key: 'annualInflationRate',
    label: 'インフレ率 (例: 0.02)',
    step: 0.005,
    min: 0,
    max: 0.1,
    unit: '割合',
    description: '生活費が毎年どの程度上昇するかの想定値です。',
  },
] as const satisfies ReadonlyArray<NumericFieldDefinition>

export type LifePlanNumericField = (typeof lifePlanNumericFields)[number]
export type LifePlanNumericFieldKey = LifePlanNumericField['key']

export interface LifePlanFieldGroup {
  readonly id: string
  readonly title: string
  readonly description?: string
  readonly fieldKeys: ReadonlyArray<LifePlanNumericFieldKey>
}

export const lifePlanNumericFieldLookup: Readonly<Record<LifePlanNumericFieldKey, LifePlanNumericField>> =
  lifePlanNumericFields.reduce<Record<LifePlanNumericFieldKey, LifePlanNumericField>>((accumulator, field) => {
    accumulator[field.key] = field
    return accumulator
  }, {} as Record<LifePlanNumericFieldKey, LifePlanNumericField>)

export const lifePlanNumericFieldMap: ReadonlyMap<LifePlanNumericFieldKey, LifePlanNumericField> = new Map(
  lifePlanNumericFields.map((field) => [field.key, field] as const),
)

export const lifePlanFieldGroups = [
  {
    id: 'profile',
    title: 'ライフイベント',
    description: 'ライフイベントに関する前提条件を設定します。',
    fieldKeys: ['currentAge', 'retirementAge', 'lifeExpectancyAge'],
  },
  {
    id: 'accumulation',
    title: '積立・運用条件',
    description: '就業期間中の積立額や運用利回りを調整します。',
    fieldKeys: ['currentSavings', 'monthlyContribution', 'annualContributionGrowthRate', 'annualReturnRate'],
  },
  {
    id: 'retirement',
    title: '退職後の支出条件',
    description: '退職後の生活費とインフレ率を指定します。',
    fieldKeys: ['annualRetirementSpending', 'annualInflationRate'],
  },
] as const satisfies ReadonlyArray<LifePlanFieldGroup>

export const LIFE_PLAN_FORM_HELPER_TEXT =
  '※ 利回りやインフレ率は割合を小数で入力します（例: 4% → 0.04）。'
