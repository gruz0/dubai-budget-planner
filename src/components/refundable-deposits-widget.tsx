import { ChevronDown, ChevronUp, Shield } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import type { BudgetData, BudgetResults, PreferencesData } from '../lib/budget-calculator'
import { formatNumber } from '../lib/format'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'

interface RefundableDepositsWidgetProps {
  results: BudgetResults
  budgetData: BudgetData
  preferences: PreferencesData
  expandable?: boolean
  defaultExpanded?: boolean
}

interface RefundableDeposit {
  name: string
  amount: number
  description: string
  enabled: boolean
}

export function RefundableDepositsWidget({
  results,
  budgetData,
  preferences,
  expandable = true,
  defaultExpanded = false,
}: RefundableDepositsWidgetProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const toggleExpanded = () => {
    if (expandable) {
      setExpanded(!expanded)
    }
  }

  // Format currency
  const formatCurrency = useCallback(
    (amount: number): string => {
      const currency = preferences.displayCurrency === 'USD' ? '$' : 'AED '
      const displayAmount = preferences.displayCurrency === 'USD' ? amount / preferences.exchangeRate : amount
      return `${currency}${formatNumber(displayAmount)}`
    },
    [preferences.displayCurrency, preferences.exchangeRate],
  )

  // Generate refundable deposits data
  const generateRefundableDeposits = useCallback((): RefundableDeposit[] => {
    const deposits: RefundableDeposit[] = []

    // Apartment Security Deposit
    if (results.upfront.securityDeposit > 0) {
      deposits.push({
        name: 'Apartment Security Deposit',
        amount: results.upfront.securityDeposit,
        description: 'Refundable upon lease termination with proper condition',
        enabled: true,
      })
    }

    // DEWA Security Deposit
    if (results.upfront.dewaDeposit > 0) {
      deposits.push({
        name: 'DEWA Security Deposit',
        amount: results.upfront.dewaDeposit,
        description: 'Refundable when closing DEWA account',
        enabled: budgetData.utilities.dewa.enabled,
      })
    }

    // District Cooling Security Deposit
    if (results.upfront.coolingDeposit > 0) {
      deposits.push({
        name: 'District Cooling Deposit',
        amount: results.upfront.coolingDeposit,
        description: 'Refundable when disconnecting cooling service',
        enabled: budgetData.utilities.districtCooling.enabled,
      })
    }

    // Gas Security Deposit
    if (results.upfront.gasDeposit > 0) {
      deposits.push({
        name: 'Gas Security Deposit',
        amount: results.upfront.gasDeposit,
        description: 'Refundable when disconnecting gas service',
        enabled: budgetData.utilities.gas.enabled,
      })
    }

    return deposits.filter((deposit) => deposit.enabled)
  }, [
    results.upfront.securityDeposit,
    results.upfront.dewaDeposit,
    budgetData.utilities.dewa.enabled,
    results.upfront.coolingDeposit,
    budgetData.utilities.districtCooling.enabled,
    results.upfront.gasDeposit,
    budgetData.utilities.gas.enabled,
  ])

  const refundableDeposits = useMemo(() => generateRefundableDeposits(), [generateRefundableDeposits])

  return (
    <Card className="gap-4 py-4 pb-2 lg:px-2">
      <CardHeader className={expandable ? 'cursor-pointer px-4' : 'px-4'} onClick={toggleExpanded}>
        <CardTitle className="flex items-center justify-between text-base lg:text-lg">
          <span className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Refundable Deposits
          </span>
          {expandable &&
            (expanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ))}
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4 px-4 pb-2">
          {refundableDeposits.length > 0 ? (
            <div className="space-y-3">
              {refundableDeposits.map((deposit, index) => (
                <div key={deposit.name} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="text-sm font-medium">{deposit.name}</span>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{deposit.description}</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">{formatCurrency(deposit.amount)}</span>
                  </div>
                  {index < refundableDeposits.length - 1 && <Separator />}
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Total Refundable:</span>
                <span className="text-sm font-bold text-green-600 md:text-base">
                  {formatCurrency(refundableDeposits.reduce((sum, d) => sum + d.amount, 0))}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No refundable deposits configured for your selected utilities.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  )
}
