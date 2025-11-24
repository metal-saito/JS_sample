import { ChangeEvent, useMemo, useState } from 'react'
import './App.css'
import {
  LifePlanInput,
  LifePlanSimulationResult,
  formatCurrency,
  simulateLifePlan,
} from './lib/simulation'

const defaultInput: LifePlanInput = {
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

const numericFields: Array<{ key: keyof LifePlanInput; label: string; step: number; min: number }> = [
  { key: 'currentAge', label: '現在の年齢', step: 1, min: 18 },
  { key: 'retirementAge', label: '退職予定の年齢', step: 1, min: 18 },
  { key: 'lifeExpectancyAge', label: 'シミュレーションする最終年齢', step: 1, min: 40 },
  { key: 'currentSavings', label: '現在の貯蓄額 (円)', step: 100000, min: 0 },
  { key: 'monthlyContribution', label: '毎月の積立額 (円)', step: 1000, min: 0 },
  { key: 'annualReturnRate', label: '年間利回り (例: 0.04)', step: 0.005, min: 0 },
  { key: 'annualContributionGrowthRate', label: '積立増加率 (例: 0.03)', step: 0.005, min: 0 },
  { key: 'annualRetirementSpending', label: '退職後の年間支出 (円)', step: 100000, min: 0 },
  { key: 'annualInflationRate', label: 'インフレ率 (例: 0.02)', step: 0.005, min: 0 },
]

function App() {
  const [conditions, setConditions] = useState<LifePlanInput>(defaultInput)
  const baseYear = useMemo(() => new Date().getFullYear(), [])

  // 入力値の変更を単一のハンドラで扱うためのヘルパー
  const handleChange = (key: keyof LifePlanInput) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.currentTarget.value
      const parsed = rawValue === '' ? 0 : Number(rawValue)

      setConditions((prev) => ({
        ...prev,
        [key]: Number.isNaN(parsed) ? prev[key] : parsed,
      }))
    }

  const { result, errorMessage } = useMemo<{
    result: LifePlanSimulationResult | null
    errorMessage: string | null
  }>(() => {
    try {
      return { result: simulateLifePlan(conditions, baseYear), errorMessage: null }
    } catch (error) {
      if (error instanceof Error) {
        return { result: null, errorMessage: error.message }
      }
      return { result: null, errorMessage: 'シミュレーションの計算中に不明なエラーが発生しました。' }
    }
  }, [conditions, baseYear])

  // シミュレーションに成功した場合のみ結果を利用する
  const timeline = result?.timeline ?? []
  const summary = result?.summary

  const retirementIndex = timeline.findIndex((entry) => entry.age === conditions.retirementAge)

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>ライフプラン・シミュレーター</h1>
          <p>
            年齢や積立額などの条件を調整し、退職後までの資産推移と生活費の賄える年数を把握しましょう。
          </p>
        </div>
      </header>

      <section className="panel">
        <h2 className="panel__title">シミュレーション条件</h2>
        <div className="form-grid">
          {numericFields.map(({ key, label, step, min }) => (
            <label key={key} className="form-field">
              <span className="form-field__label">{label}</span>
              <input
                type="number"
                inputMode="decimal"
                step={step}
                min={min}
                value={conditions[key]}
                onChange={handleChange(key)}
              />
            </label>
          ))}
        </div>
        <p className="form-helper">
          ※ 利回りやインフレ率は割合を小数で入力します（例: 4% → 0.04）。
        </p>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </section>

      {summary && (
        <section className="panel">
          <h2 className="panel__title">サマリー</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <span className="summary-card__label">累計積立額</span>
              <strong className="summary-card__value">{formatCurrency(summary.totalContributions)}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">累計引き出し額</span>
              <strong className="summary-card__value">{formatCurrency(summary.totalWithdrawals)}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">最終残高</span>
              <strong className="summary-card__value">{formatCurrency(summary.finalBalance)}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">退職後に生活費を賄えた年数</span>
              <strong className="summary-card__value">{summary.yearsFundedAfterRetirement} 年</strong>
            </div>
            <div className="summary-card summary-card--wide">
              <span className="summary-card__label">不足が発生した年</span>
              <strong className="summary-card__value">
                {summary.shortfallYear ? `${summary.shortfallYear} 年` : '不足なし'}
              </strong>
            </div>
          </div>
        </section>
      )}

      {timeline.length > 0 && (
        <section className="panel">
          <h2 className="panel__title">年次の資産推移</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>年齢</th>
                  <th>西暦</th>
                  <th>年間積立</th>
                  <th>運用益</th>
                  <th>年間引き出し</th>
                  <th>年末残高</th>
                </tr>
              </thead>
              <tbody>
                {timeline.map((entry, index) => {
                  const isRetirementRow = index === retirementIndex
                  const isShortfallRow = summary?.shortfallYear === entry.year

                  return (
                    <tr
                      key={entry.year}
                      className={[
                        isRetirementRow ? 'table__row--retirement' : '',
                        isShortfallRow ? 'table__row--shortfall' : '',
                      ]
                        .join(' ')
                        .trim()}
                    >
                      <td>{entry.age}</td>
                      <td>{entry.year}</td>
                      <td>{formatCurrency(entry.contribution)}</td>
                      <td>{formatCurrency(entry.investmentGrowth)}</td>
                      <td>{formatCurrency(entry.withdrawal)}</td>
                      <td>{formatCurrency(entry.endBalance)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <footer className="page__footer">
        <p>
          シナリオを変更して、退職時の貯蓄規模や退職後の支出パターンを比較検討できます。前提条件を調整しながらリスクと必要資金のバランスを検討してください。
        </p>
      </footer>
    </div>
  )
}

export default App
