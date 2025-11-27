import {
  LIFE_PLAN_FORM_HELPER_TEXT,
  lifePlanFieldGroups,
  lifePlanNumericFields,
} from '../../constants/lifePlanConfig'
import { useLifePlanSimulationContext } from './context/LifePlanSimulationContext'
import { SimulationForm } from './SimulationForm'

export const SimulationConditionsSection = () => {
  const { conditions, updateCondition, errorMessage, resetConditions } = useLifePlanSimulationContext()

  return (
    <SimulationForm
      fieldDefinitions={lifePlanNumericFields}
      fieldGroups={lifePlanFieldGroups}
      values={conditions}
      onChange={updateCondition}
      helperText={LIFE_PLAN_FORM_HELPER_TEXT}
      errorMessage={errorMessage}
      onReset={resetConditions}
    />
  )
}
