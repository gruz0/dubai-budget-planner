import { describe, expect, it } from 'vitest'
import { parseSavedBudget } from './budget-storage'
import { initialBudgetData } from './initial-budget-data'

describe('parseSavedBudget', () => {
  it('restores a saved budget', () => {
    const budgetData = { ...initialBudgetData, income: { ...initialBudgetData.income, monthlyAmount: 42000 } }
    const raw = JSON.stringify({ budgetData, openSections: ['rent', 'broker'], hasUnlockedSections: true })

    expect(parseSavedBudget(raw)).toEqual({ budgetData, openSections: ['rent', 'broker'], hasUnlockedSections: true })
  })

  it('ignores missing, corrupt, or unrelated values', () => {
    expect(parseSavedBudget(null)).toBeNull()
    expect(parseSavedBudget('{not json')).toBeNull()
    expect(parseSavedBudget('[]')).toBeNull()
    expect(parseSavedBudget('{"budgetData":"nope"}')).toBeNull()
  })

  it('fills in sections and fields missing from an older save', () => {
    const raw = JSON.stringify({ budgetData: { income: { monthlyAmount: 9000 }, rent: 'broken' } })
    const restored = parseSavedBudget(raw)

    expect(restored?.budgetData.income).toEqual({ ...initialBudgetData.income, monthlyAmount: 9000 })
    expect(restored?.budgetData.rent).toEqual(initialBudgetData.rent)
    expect(restored?.budgetData.utilities).toEqual(initialBudgetData.utilities)
    expect(restored?.openSections).toEqual(['income'])
    expect(restored?.hasUnlockedSections).toBe(false)
  })
})
