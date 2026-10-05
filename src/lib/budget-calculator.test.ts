import { describe, expect, it } from 'vitest'
import {
  BUDGET_TEMPLATES,
  type BudgetData,
  calculateBudget,
  calculateFoodSuggestion,
  getPublicTransportCost,
} from './budget-calculator'
import { initialBudgetData } from './initial-budget-data'

function budget(overrides: Partial<BudgetData> = {}): BudgetData {
  return { ...initialBudgetData, ...overrides }
}

describe('calculateBudget', () => {
  it('adds up the default up-front costs', () => {
    const { upfront } = calculateBudget(budget())

    expect(upfront).toMatchObject({
      rentFirstCheque: 20000,
      brokerFee: 4000,
      securityDeposit: 4000,
      dewaDeposit: 2000,
      ejari: 120,
      coolingDeposit: 0,
      gasDeposit: 0,
      total: 30120,
    })
    expect(upfront.youPay).toBeUndefined()
    expect(upfront.sponsorPay).toBeUndefined()
  })

  it('derives the monthly budget and savings from the default income', () => {
    const { monthly, savings } = calculateBudget(budget())

    expect(monthly.rent).toBe(6667)
    expect(monthly.utilities).toBe(600)
    expect(monthly.total).toBe(7267)
    expect(savings.monthlyAmount).toBe(7733)
    expect(savings.savingsRate).toBeCloseTo(51.55, 2)
  })

  it('sizes the first rent payment by the number of cheques', () => {
    const rent = { ...initialBudgetData.rent, annualRent: 120000 }

    expect(calculateBudget(budget({ rent: { ...rent, numberOfCheques: 1 } })).upfront.rentFirstCheque).toBe(120000)
    expect(calculateBudget(budget({ rent: { ...rent, numberOfCheques: 12 } })).upfront.rentFirstCheque).toBe(10000)
  })

  it('supports fixed broker fees and fixed security deposits', () => {
    const { upfront } = calculateBudget(
      budget({
        broker: { type: 'fixed', percentage: 5, fixedAmount: 3500 },
        rent: { ...initialBudgetData.rent, securityDeposit: { type: 'fixed', value: 6000 } },
      }),
    )

    expect(upfront.brokerFee).toBe(3500)
    expect(upfront.securityDeposit).toBe(6000)
  })

  it('counts only enabled utilities', () => {
    const utilities = {
      ...initialBudgetData.utilities,
      districtCooling: { enabled: true, deposit: 2000, monthlyAmount: 400 },
      gas: { enabled: true, deposit: 750, monthlyAmount: 30 },
    }
    const { upfront, monthly } = calculateBudget(budget({ utilities }))

    expect(upfront.coolingDeposit).toBe(2000)
    expect(upfront.gasDeposit).toBe(750)
    expect(monthly.utilities).toBe(1030)
  })

  it('converts a USD income to AED before calculating savings', () => {
    const { savings } = calculateBudget(
      budget({ income: { monthlyAmount: 5000, currency: 'USD', exchangeRate: 3.67 } }),
    )

    expect(savings.monthlyAmount).toBe(Math.round(5000 * 3.67 - 7267))
  })

  it('splits costs with a sponsor without changing the totals', () => {
    const unsponsored = calculateBudget(budget())
    const { upfront, monthly } = calculateBudget(
      budget({
        sponsorship: {
          enabled: true,
          rentChequesFromSponsor: 2,
          broker: { type: 'percentage', value: 100 },
          securityDeposit: { type: 'fixed', value: 1000 },
        },
      }),
    )

    expect(upfront.total).toBe(unsponsored.upfront.total)
    expect(upfront.sponsorPay).toBe(20000 + 4000 + 1000)
    expect(upfront.youPay).toBe(upfront.total - 25000)
    expect(monthly.sponsorPay).toBe(3334)
    expect(monthly.youPay).toBe(monthly.total - 3334)
  })

  it('reports a zero savings rate when there is no income', () => {
    const { savings } = calculateBudget(budget({ income: { monthlyAmount: 0, currency: 'AED', exchangeRate: 3.67 } }))

    expect(savings.savingsRate).toBe(0)
  })
})

describe('budget templates', () => {
  it('have unique ids, because ?template=<id> links depend on them', () => {
    const ids = BUDGET_TEMPLATES.map((template) => template.id)

    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('form helpers', () => {
  it('suggests a food budget by household size', () => {
    expect(calculateFoodSuggestion(2, 1)).toBe(4800)
  })

  it('falls back to the one-zone pass for unknown zones', () => {
    expect(getPublicTransportCost(3)).toBe(350)
    expect(getPublicTransportCost(9)).toBe(140)
  })
})
