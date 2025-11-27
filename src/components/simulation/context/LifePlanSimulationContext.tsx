import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { lifePlanDefaultInput } from '../../../constants/lifePlanConfig'
import type { LifePlanInput } from '../../../lib/simulation'
import { useLifePlanInsights } from '../../../hooks/useLifePlanInsights'
import { useLifePlanSimulation } from '../../../hooks/useLifePlanSimulation'

export interface LifePlanSimulationContextValue extends ReturnType<typeof useLifePlanSimulation> {
  readonly baseYear: number
  readonly insights: ReturnType<typeof useLifePlanInsights>
}

interface LifePlanSimulationProviderProps {
  readonly children: ReactNode
  readonly initialInput?: LifePlanInput
  readonly baseYear?: number
}

const LifePlanSimulationContext = createContext<LifePlanSimulationContextValue | null>(null)

export const LifePlanSimulationProvider = ({
  children,
  initialInput = lifePlanDefaultInput,
  baseYear,
}: LifePlanSimulationProviderProps) => {
  const resolvedBaseYear = baseYear ?? new Date().getFullYear()
  const simulationState = useLifePlanSimulation({ initialInput, baseYear: resolvedBaseYear })
  const insights = useLifePlanInsights({
    summary: simulationState.summary,
    timeline: simulationState.timeline,
    retirementAge: simulationState.conditions.retirementAge,
  })

  const { conditions, timeline, summary, errorMessage, updateCondition, resetConditions } = simulationState

  const contextValue = useMemo<LifePlanSimulationContextValue>(
    () => ({
      conditions,
      timeline,
      summary,
      errorMessage,
      updateCondition,
      resetConditions,
      baseYear: resolvedBaseYear,
      insights,
    }),
    [conditions, timeline, summary, errorMessage, updateCondition, resetConditions, resolvedBaseYear, insights],
  )

  return <LifePlanSimulationContext.Provider value={contextValue}>{children}</LifePlanSimulationContext.Provider>
}

export const useLifePlanSimulationContext = (): LifePlanSimulationContextValue => {
  const context = useContext(LifePlanSimulationContext)
  if (!context) {
    throw new Error('useLifePlanSimulationContext must be used within a LifePlanSimulationProvider.')
  }
  return context
}
