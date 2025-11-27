import { useMemo } from 'react'
import { PageContainer } from '../layout/PageContainer'
import { PageFooter } from '../layout/PageFooter'
import { PageHeader } from '../layout/PageHeader'
import { LifePlanSimulationProvider } from './context/LifePlanSimulationContext'
import { SimulationConditionsSection } from './SimulationConditionsSection'
import { SimulationInsightsSection } from './SimulationInsightsSection'
import { SimulationSummarySection } from './SimulationSummarySection'
import { SimulationTimelineSection } from './SimulationTimelineSection'

export const LifePlanSimulator = () => {
  const baseYear = useMemo(() => new Date().getFullYear(), [])

  return (
    <LifePlanSimulationProvider baseYear={baseYear}>
      <PageContainer>
        <PageHeader
          title="ライフプラン・シミュレーター"
          description="年齢や積立額などの条件を調整し、退職後までの資産推移と生活費の賄える年数を把握しましょう。"
        />
        <SimulationConditionsSection />
        <SimulationSummarySection />
        <SimulationInsightsSection />
        <SimulationTimelineSection />
        <PageFooter>
          シナリオを変更して、退職時の貯蓄規模や退職後の支出パターンを比較検討できます。前提条件を調整しながらリスクと必要資金のバランスを検討してください。
        </PageFooter>
      </PageContainer>
    </LifePlanSimulationProvider>
  )
}
