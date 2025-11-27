import { useCallback, useMemo, useState } from 'react'
import { lifePlanDefaultInput } from '../constants/lifePlanConfig'
import { LifePlanInput, LifePlanSimulationResult, simulateLifePlan } from '../lib/simulation'

interface UseLifePlanSimulationOptions {
  readonly initialInput?: LifePlanInput
  readonly baseYear?: number
}

interface UseLifePlanSimulationState {
  readonly conditions: LifePlanInput
  readonly timeline: LifePlanSimulationResult['timeline']
  readonly summary: LifePlanSimulationResult['summary'] | null
  readonly errorMessage: string | null
  readonly updateCondition: (key: keyof LifePlanInput, value: number) => void
}

export const useLifePlanSimulation = (
  options: UseLifePlanSimulationOptions = {},
): UseLifePlanSimulationState => {
  const { initialInput = lifePlanDefaultInput, baseYear = new Date().getFullYear() } = options
  const [conditions, setConditions] = useState<LifePlanInput>(initialInput)

  const updateCondition = useCallback((key: keyof LifePlanInput, value: number) => {
    setConditions((prev) => {
      if (Object.is(prev[key], value)) {
        return prev
      }

      return {
        ...prev,
        [key]: value,
      }
    })
  }, [])

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

      return {
        result: null,
        errorMessage: 'シミュレーションの計算中に不明なエラーが発生しました。',
      }
    }
  }, [conditions, baseYear])

  return {
    conditions,
    timeline: result?.timeline ?? [],
    summary: result?.summary ?? null,
    errorMessage,
    updateCondition,
  }
}
