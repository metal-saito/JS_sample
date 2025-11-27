import { useLifePlanSimulationContext } from './context/LifePlanSimulationContext'
import { SummaryPanel } from './SummaryPanel'

export const SimulationSummarySection = () => {
  const { summary } = useLifePlanSimulationContext()

  if (!summary) {
    return null
  }

  return <SummaryPanel summary={summary} />
}
