import { useLifePlanSimulationContext } from './context/LifePlanSimulationContext'
import { TimelineTable } from './TimelineTable'

export const SimulationTimelineSection = () => {
  const { timeline, conditions, summary } = useLifePlanSimulationContext()

  return (
    <TimelineTable
      entries={timeline}
      retirementAge={conditions.retirementAge}
      shortfallYear={summary?.shortfallYear ?? null}
    />
  )
}
