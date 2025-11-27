import type { LifePlanNumericField } from '../../constants/lifePlanConfig'
import type { LifePlanInput } from '../../lib/simulation'
import { NumericFieldInput } from '../common/NumericFieldInput'

interface NumericFieldGroupProps {
  readonly title: string
  readonly description?: string
  readonly fields: ReadonlyArray<LifePlanNumericField>
  readonly values: LifePlanInput
  readonly onValueChange: (key: LifePlanNumericField['key'], value: number) => void
  readonly describedById?: string
}

export const NumericFieldGroup = ({
  title,
  description,
  fields,
  values,
  onValueChange,
  describedById,
}: NumericFieldGroupProps) => {
  if (fields.length === 0) {
    return null
  }

  return (
    <fieldset className="form-section">
      <legend className="form-section__legend">{title}</legend>
      {description ? <p className="form-section__description">{description}</p> : null}
      <div className="form-grid form-section__grid">
        {fields.map((field) => (
          <NumericFieldInput
            key={field.key}
            field={field}
            value={values[field.key]}
            onValueChange={onValueChange}
            describedById={describedById}
          />
        ))}
      </div>
    </fieldset>
  )
}
