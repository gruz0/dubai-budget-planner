import { describe, expect, it } from 'vitest'
import { calculateBudget } from './budget-calculator'
import { initialBudgetData } from './initial-budget-data'
import { generatePrintHTML } from './print-report'
import { APP_HOST } from './site'

describe('generatePrintHTML', () => {
  const html = generatePrintHTML(initialBudgetData, calculateBudget(initialBudgetData))

  it('renders a standalone printable document', () => {
    expect(html.startsWith('<!DOCTYPE html>')).toBe(true)
    expect(html).toContain('<title>Dubai Move-in Budget Report</title>')
    expect(html).toContain('window.print()')
  })

  it('credits the app and stays free of external resources', () => {
    expect(html).toContain(APP_HOST)
    expect(html).not.toMatch(/<(script|link|img)[^>]+(src|href)=/)
  })

  it('shows optional lines only when they have a cost', () => {
    const withGas = {
      ...initialBudgetData,
      utilities: { ...initialBudgetData.utilities, gas: { enabled: true, deposit: 750, monthlyAmount: 30 } },
    }

    expect(html).not.toContain('Gas deposit:')
    expect(generatePrintHTML(withGas, calculateBudget(withGas))).toContain('Gas deposit:')
  })
})
