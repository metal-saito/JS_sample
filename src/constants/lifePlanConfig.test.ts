import { describe, expect, it } from 'vitest'
import {
  lifePlanFieldGroups,
  lifePlanNumericFieldLookup,
  lifePlanNumericFieldMap,
  lifePlanNumericFields,
} from './lifePlanConfig'

describe('lifePlanConfig', () => {
  it('covers all numeric field definitions within groups without omissions', () => {
    const definedKeys = lifePlanNumericFields.map((field) => field.key)
    const groupedKeys = lifePlanFieldGroups.flatMap((group) => group.fieldKeys)

    expect(groupedKeys).toHaveLength(definedKeys.length)
    expect([...groupedKeys].sort()).toEqual([...definedKeys].sort())
  })

  it('does not duplicate numeric fields across groups', () => {
    const groupedKeys = lifePlanFieldGroups.flatMap((group) => group.fieldKeys)
    const duplicateKeys = groupedKeys.filter((key, index) => groupedKeys.indexOf(key) !== index)

    expect(duplicateKeys).toHaveLength(0)
  })

  it('exposes lookup structures that return the original field definitions', () => {
    for (const field of lifePlanNumericFields) {
      expect(lifePlanNumericFieldLookup[field.key]).toBe(field)
      expect(lifePlanNumericFieldMap.get(field.key)).toBe(field)
    }
  })
})
