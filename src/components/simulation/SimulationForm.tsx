import { useId, useMemo } from 'react'
import type {
  LifePlanFieldGroup,
  LifePlanNumericField,
  LifePlanNumericFieldKey,
} from '../../constants/lifePlanConfig'
import type { LifePlanInput } from '../../lib/simulation'
import { Button } from '../common/Button'
import { FormMessage } from '../common/FormMessage'
import { Panel } from '../common/Panel'
import { NumericFieldGroup } from './NumericFieldGroup'

interface SimulationFormProps {
  readonly fieldDefinitions: ReadonlyArray<LifePlanNumericField>
  readonly fieldGroups?: ReadonlyArray<LifePlanFieldGroup>
  readonly values: LifePlanInput
  readonly onChange: (key: LifePlanNumericFieldKey, value: number) => void
  readonly helperText?: string
  readonly errorMessage?: string | null
  readonly onReset?: () => void
}

type ResolvedFieldGroup = {
  readonly id: string
  readonly title: string
  readonly description?: string
  readonly fields: ReadonlyArray<LifePlanNumericField>
}

export const SimulationForm = ({
  fieldDefinitions,
  fieldGroups,
  values,
  onChange,
  helperText,
  errorMessage,
  onReset,
}: SimulationFormProps) => {
  const helperMessageId = useId()
  const errorMessageId = useId()

  const fieldLookup = useMemo(() => {
    return fieldDefinitions.reduce((lookup, field) => {
      lookup.set(field.key, field)
      return lookup
    }, new Map<LifePlanNumericFieldKey, LifePlanNumericField>())
  }, [fieldDefinitions])

  const groupsWithFields = useMemo<ReadonlyArray<ResolvedFieldGroup>>(() => {
    const groupsToUse: ReadonlyArray<LifePlanFieldGroup> =
      fieldGroups && fieldGroups.length > 0
        ? fieldGroups
        : [
            {
              id: 'default',
              title: 'シミュレーション条件',
              fieldKeys: fieldDefinitions.map((field) => field.key),
            },
          ]

    return groupsToUse.map<ResolvedFieldGroup>((group) => {
      const resolvedFields = group.fieldKeys.map((key) => {
        const definition = fieldLookup.get(key)
        if (!definition) {
          throw new Error(`Life plan numeric field definition is missing for key "${key}".`)
        }
        return definition
      })

      return {
        id: group.id,
        title: group.title,
        description: group.description,
        fields: resolvedFields,
      }
    })
  }, [fieldDefinitions, fieldGroups, fieldLookup])

  const describedById = useMemo(() => {
    const ids = [helperText ? helperMessageId : null, errorMessage ? errorMessageId : null].filter(
      (id): id is string => Boolean(id),
    )
    return ids.length > 0 ? ids.join(' ') : undefined
  }, [errorMessage, errorMessageId, helperMessageId, helperText])

  const panelFooter = useMemo(() => {
    if (!helperText && !errorMessage) {
      return null
    }

    return (
      <>
        <FormMessage id={helperMessageId} variant="info">
          {helperText ?? null}
        </FormMessage>
        <FormMessage id={errorMessageId} variant="error">
          {errorMessage ?? null}
        </FormMessage>
      </>
    )
  }, [errorMessage, errorMessageId, helperMessageId, helperText])

  const panelActions = useMemo(() => {
    if (!onReset) {
      return null
    }

    return (
      <Button variant="secondary" size="small" onClick={onReset}>
        初期値にリセット
      </Button>
    )
  }, [onReset])

  return (
    <Panel
      title="シミュレーション条件"
      description="ライフイベントや運用条件を調整し、シミュレーションの前提となる数値を設定します。"
      actions={panelActions}
      footer={panelFooter}
    >
      <div className="form-section-list">
        {groupsWithFields.map((group) => (
          <NumericFieldGroup
            key={group.id}
            title={group.title}
            description={group.description}
            fields={group.fields}
            values={values}
            onValueChange={onChange}
            describedById={describedById}
          />
        ))}
      </div>
    </Panel>
  )
}
