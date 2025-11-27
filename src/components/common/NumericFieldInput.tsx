import { ChangeEvent, useCallback, useId, useMemo } from 'react'
import type { LifePlanNumericField } from '../../constants/lifePlanConfig'
import type { LifePlanInput } from '../../lib/simulation'

interface NumericFieldInputProps<TField extends LifePlanNumericField> {
  readonly field: TField
  readonly value: LifePlanInput[TField['key']]
  readonly onValueChange: (key: TField['key'], value: number) => void
  readonly describedById?: string
  readonly className?: string
}

export const NumericFieldInput = <TField extends LifePlanNumericField>({
  field,
  value,
  onValueChange,
  describedById,
  className,
}: NumericFieldInputProps<TField>) => {
  const inputId = useId()
  const descriptionId = field.description ? `${inputId}-description` : undefined

  const ariaDescribedBy = useMemo(() => {
    const ids = [describedById, descriptionId].filter(Boolean)
    return ids.length > 0 ? ids.join(' ') : undefined
  }, [describedById, descriptionId])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.currentTarget.value
      if (rawValue.trim() === '') {
        onValueChange(field.key, 0)
        return
      }

      const parsedValue = Number(rawValue)
      if (!Number.isNaN(parsedValue)) {
        onValueChange(field.key, parsedValue)
      }
    },
    [field.key, onValueChange],
  )

  const displayValue = useMemo(() => {
    return Number.isFinite(value) ? value : 0
  }, [value])

  const fieldClassName = ['form-field', className].filter(Boolean).join(' ')

  return (
    <label className={fieldClassName} htmlFor={inputId}>
      <span className="form-field__label">
        {field.label}
        {field.unit ? <span className="form-field__unit">{field.unit}</span> : null}
      </span>
      <div className="form-field__control">
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          step={field.step}
          min={field.min}
          max={field.max}
          value={displayValue}
          onChange={handleChange}
          aria-describedby={ariaDescribedBy}
        />
      </div>
      {field.description ? (
        <small id={descriptionId} className="form-field__description">
          {field.description}
        </small>
      ) : null}
    </label>
  )
}
