import { ChangeEvent, useCallback } from 'react'
import type { NumericFieldDefinition } from '../../constants/lifePlanConfig'
import type { LifePlanInput } from '../../lib/simulation'
import { Panel } from '../common/Panel'

interface SimulationFormProps {
  readonly fields: ReadonlyArray<NumericFieldDefinition>
  readonly values: LifePlanInput
  readonly onChange: (key: keyof LifePlanInput, value: number) => void
  readonly helperText?: string
  readonly errorMessage?: string | null
}

export const SimulationForm = ({
  fields,
  values,
  onChange,
  helperText,
  errorMessage,
}: SimulationFormProps) => {
  const createChangeHandler = useCallback(
    (key: keyof LifePlanInput) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.currentTarget.value
        const parsedValue = rawValue === '' ? 0 : Number(rawValue)

        onChange(key, Number.isNaN(parsedValue) ? values[key] : parsedValue)
      },
    [onChange, values],
  )

  return (
    <Panel title="シミュレーション条件">
      <div className="form-grid">
        {fields.map(({ key, label, step, min }) => (
          <label key={key as string} className="form-field">
            <span className="form-field__label">{label}</span>
            <input
              type="number"
              inputMode="decimal"
              step={step}
              min={min}
              value={values[key]}
              onChange={createChangeHandler(key)}
            />
          </label>
        ))}
      </div>

      {helperText ? <p className="form-helper">{helperText}</p> : null}
      {errorMessage ? <p className="error">{errorMessage}</p> : null}
    </Panel>
  )
}
