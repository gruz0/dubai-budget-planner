import type { BudgetData } from './budget-calculator'
import { initialBudgetData } from './initial-budget-data'

// Bump the version when BudgetData changes shape in a way old saves cannot survive
const STORAGE_KEY = 'dubai-budget-planner:budget:v1'

export interface SavedBudget {
  budgetData: BudgetData
  openSections: string[]
  hasUnlockedSections: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Fills in sections and fields that a save from an older release may be missing
function withDefaults(saved: Record<string, unknown>): BudgetData {
  const merged: Record<string, unknown> = {}
  for (const [section, defaults] of Object.entries(initialBudgetData)) {
    const value = saved[section]
    merged[section] = isRecord(value) ? { ...defaults, ...value } : defaults
  }
  return merged as unknown as BudgetData
}

export function parseSavedBudget(raw: string | null): SavedBudget | null {
  if (!raw) return null

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || !isRecord(parsed.budgetData)) return null

    return {
      budgetData: withDefaults(parsed.budgetData),
      openSections: Array.isArray(parsed.openSections)
        ? parsed.openSections.filter((section): section is string => typeof section === 'string')
        : ['income'],
      hasUnlockedSections: parsed.hasUnlockedSections === true,
    }
  } catch {
    return null
  }
}

// Storage can throw in private windows or when site data is blocked; the planner works without it
export function loadSavedBudget(): SavedBudget | null {
  try {
    return parseSavedBudget(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export function saveBudget(saved: SavedBudget) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch {
    // Nothing to do: the budget simply will not survive a reload
  }
}

export function clearSavedBudget() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing was stored
  }
}
