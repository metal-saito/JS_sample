import { useCallback, useMemo } from 'react'
import './App.css'
import {
  LIFE_PLAN_FORM_HELPER_TEXT,
  lifePlanDefaultInput,
  lifePlanNumericFields,
} from './constants/lifePlanConfig'
import { PageContainer } from './components/layout/PageContainer'
import { PageFooter } from './components/layout/PageFooter'
import { PageHeader } from './components/layout/PageHeader'
import { SimulationForm } from './components/simulation/SimulationForm'
import { SummaryPanel } from './components/simulation/SummaryPanel'
import { TimelineTable } from './components/simulation/TimelineTable'
import { useLifePlanSimulation } from './hooks/useLifePlanSimulation'
import type { LifePlanInput } from './lib/simulation'

function App() {
  const baseYear = useMemo(() => new Date().getFullYear(), [])
  const { conditions, updateCondition, timeline, summary, errorMessage } = useLifePlanSimulation({
    initialInput: lifePlanDefaultInput,
    baseYear,
  })

  const handleFieldChange = useCallback(
    (key: keyof LifePlanInput, value: number) => {
      updateCondition(key, value)
    },
    [updateCondition],
  )

  return (
    <PageContainer>
      <PageHeader
        title="ライフプラン・シミュレーター"
        description="年齢や積立額などの条件を調整し、退職後までの資産推移と生活費の賄える年数を把握しましょう。"
      />
      <SimulationForm
        fields={lifePlanNumericFields}
        values={conditions}
        onChange={handleFieldChange}
        helperText={LIFE_PLAN_FORM_HELPER_TEXT}
        errorMessage={errorMessage}
      />
      {summary ? <SummaryPanel summary={summary} /> : null}
      <TimelineTable
        entries={timeline}
        retirementAge={conditions.retirementAge}
        shortfallYear={summary?.shortfallYear ?? null}
      />
      <PageFooter>
        シナリオを変更して、退職時の貯蓄規模や退職後の支出パターンを比較検討できます。前提条件を調整しながらリスクと必要資金のバランスを検討してください。
      </PageFooter>
    </PageContainer>
  )
}

export default App
