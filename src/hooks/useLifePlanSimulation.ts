import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { lifePlanDefaultInput, lifePlanNumericFieldMap, type LifePlanNumericFieldKey } from '../constants/lifePlanConfig'
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
  readonly updateCondition: (key: LifePlanNumericFieldKey, value: number) => void
  readonly resetConditions: () => void
}

const clampToFieldBounds = (key: LifePlanNumericFieldKey, value: number): number => {
  const definition = lifePlanNumericFieldMap.get(key)
  if (!definition) {
    return value
  }

  const clampedMin = Math.max(value, definition.min)
  return typeof definition.max === 'number' ? Math.min(clampedMin, definition.max) : clampedMin
}

const cloneLifePlanInput = (input: LifePlanInput): LifePlanInput => ({ ...input })

const areLifePlanInputsEqual = (left: LifePlanInput, right: LifePlanInput): boolean => {
  return (Object.keys(left) as Array<keyof LifePlanInput>).every((key) => Object.is(left[key], right[key]))
}

export const useLifePlanSimulation = (
  options: UseLifePlanSimulationOptions = {},
): UseLifePlanSimulationState => {
  const { initialInput = lifePlanDefaultInput, baseYear = new Date().getFullYear() } = options
  const initialSnapshotRef = useRef<LifePlanInput>(cloneLifePlanInput(initialInput))
  const [conditions, setConditions] = useState<LifePlanInput>(() => cloneLifePlanInput(initialSnapshotRef.current))

  useEffect(() => {
    const nextInitial = cloneLifePlanInput(initialInput)
    initialSnapshotRef.current = nextInitial
    setConditions((previous) => (areLifePlanInputsEqual(previous, nextInitial) ? previous : cloneLifePlanInput(nextInitial)))
  }, [initialInput])

  const updateCondition = useCallback((key: LifePlanNumericFieldKey, value: number) => {
    setConditions((previous) => {
      const nextValue = clampToFieldBounds(key, value)
      if (Object.is(previous[key], nextValue)) {
        return previous
      }

      return {
        ...previous,
        [key]: nextValue,
      }
    })
  }, [])

  const resetConditions = useCallback(() => {
    setConditions((previous) => {
      const baseline = initialSnapshotRef.current
      return areLifePlanInputsEqual(previous, baseline) ? previous : cloneLifePlanInput(baseline)
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
    resetConditions,
  }
}
