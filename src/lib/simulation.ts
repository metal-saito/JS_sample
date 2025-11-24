export interface LifePlanInput {
  /** 現在の年齢（整数） */
  currentAge: number
  /** 退職を予定している年齢（現在年齢以上） */
  retirementAge: number
  /** シミュレーションを行う最終年齢（退職年齢以上） */
  lifeExpectancyAge: number
  /** 現在の貯蓄額（円） */
  currentSavings: number
  /** 毎月の積立額（円） */
  monthlyContribution: number
  /** 年間の資産運用利回り（例: 0.04 = 4%） */
  annualReturnRate: number
  /** 退職後の年間支出（円） */
  annualRetirementSpending: number
  /** 毎年の積立増加率（例: 0.02 = 2%） */
  annualContributionGrowthRate: number
  /** 物価上昇率（例: 0.02 = 2%） */
  annualInflationRate: number
}

export interface LifePlanYearResult {
  age: number
  year: number
  contribution: number
  investmentGrowth: number
  withdrawal: number
  endBalance: number
}

export interface LifePlanSummary {
  totalContributions: number
  totalWithdrawals: number
  finalBalance: number
  shortfallYear: number | null
  yearsFundedAfterRetirement: number
}

export interface LifePlanSimulationResult {
  timeline: LifePlanYearResult[]
  summary: LifePlanSummary
}

/**
 * シミュレーション結果の小数点以下を整形するためのヘルパー。
 * UI 側でのフォーマット簡略化のため小数第 2 位で四捨五入します。
 */
const round2 = (value: number): number => Math.round(value * 100) / 100

/**
 * ライフプランの年次推移を計算します。
 * @param input ユーザーが入力したシミュレーション条件
 * @param baseYear 計算開始年（既定値は実行時の西暦）
 */
export const simulateLifePlan = (
  input: LifePlanInput,
  baseYear: number = new Date().getFullYear(),
): LifePlanSimulationResult => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancyAge,
    currentSavings,
    monthlyContribution,
    annualReturnRate,
    annualRetirementSpending,
    annualContributionGrowthRate,
    annualInflationRate,
  } = input

  // 入力に対する最低限の整合性チェック
  if (retirementAge < currentAge) {
    throw new Error('退職年齢は現在の年齢以上である必要があります。')
  }
  if (lifeExpectancyAge <= currentAge) {
    throw new Error('シミュレーションの最終年齢は現在の年齢より大きく設定してください。')
  }

  const results: LifePlanYearResult[] = []

  let balance = currentSavings
  let totalContributions = 0
  let totalWithdrawals = 0
  let shortfallYear: number | null = null

  const totalYears = lifeExpectancyAge - currentAge
  const retirementYear = baseYear + Math.max(0, retirementAge - currentAge)

  for (let offset = 0; offset <= totalYears; offset += 1) {
    const age = currentAge + offset
    const year = baseYear + offset

    // 積立額は年ごとに指数的に増加させる（昇給や積立増を想定）
    const isWorking = age < retirementAge
    const contribution = isWorking
      ? monthlyContribution * 12 * Math.pow(1 + annualContributionGrowthRate, offset)
      : 0

    const balanceAfterContribution = balance + contribution

    // 投資リターンは積立を反映した後の残高に対して計算
    const investmentGrowth = balanceAfterContribution * annualReturnRate

    let plannedWithdrawal = 0
    let actualWithdrawal = 0

    if (!isWorking) {
      const retirementYearOffset = age - retirementAge
      // 退職後の生活費はインフレ率で増加すると仮定
      plannedWithdrawal = annualRetirementSpending * Math.pow(1 + annualInflationRate, retirementYearOffset)
      // 満額引き出せない場合は残高の範囲で引き出す
      actualWithdrawal = Math.min(balanceAfterContribution + investmentGrowth, plannedWithdrawal)
      totalWithdrawals += actualWithdrawal

      if (shortfallYear === null && actualWithdrawal < plannedWithdrawal) {
        shortfallYear = year
      }
    }

    const endBalance = Math.max(0, balanceAfterContribution + investmentGrowth - actualWithdrawal)

    totalContributions += contribution

    results.push({
      age,
      year,
      contribution: round2(contribution),
      investmentGrowth: round2(investmentGrowth),
      withdrawal: round2(actualWithdrawal),
      endBalance: round2(endBalance),
    })

    balance = endBalance
  }

  // 退職年以降の何年分の支出を賄えたかを算出
  const timelineAfterRetirement = results.filter((entry) => entry.age >= retirementAge)
  const yearsFunded = timelineAfterRetirement.reduce<number>((acc, entry) => {
    return acc + (entry.withdrawal > 0 ? 1 : 0)
  }, 0)

  return {
    timeline: results,
    summary: {
      totalContributions: round2(totalContributions),
      totalWithdrawals: round2(totalWithdrawals),
      finalBalance: round2(balance),
      shortfallYear,
      yearsFundedAfterRetirement: yearsFunded,
    },
  }
}

/**
 * 金額を円表記にフォーマットするユーティリティ。
 * ビジネスロジックと UI の重複を避けるために共通化しておきます。
 */
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(value)
