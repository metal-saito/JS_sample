import { useLifePlanSimulationContext } from './context/LifePlanSimulationContext'
import { InsightsPanel } from './InsightsPanel'

export const SimulationInsightsSection = () => {
  const { insights } = useLifePlanSimulationContext()

  return <InsightsPanel insights={insights} />
}
