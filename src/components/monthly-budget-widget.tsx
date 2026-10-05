import { Calendar, ChevronDown, ChevronUp, TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import type { BudgetData, BudgetResults, PreferencesData } from '../lib/budget-calculator'
import { formatNumber } from '../lib/format'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'

interface MonthlyBudgetWidgetProps {
  budgetData: BudgetData
  results: BudgetResults
  preferences: PreferencesData
  expandable?: boolean
  defaultExpanded?: boolean
}

export function MonthlyBudgetWidget({
  budgetData,
  results,
  preferences,
  expandable = true,
  defaultExpanded = false,
}: MonthlyBudgetWidgetProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const toggleExpanded = () => {
    if (expandable) {
      setExpanded(!expanded)
    }
  }

  // Helper function to format currency based on preferences
  const formatCurrency = (amountInAED: number): string => {
    const amount = preferences.displayCurrency === 'USD' ? amountInAED / preferences.exchangeRate : amountInAED
    const currency = preferences.displayCurrency
    return `${currency} ${formatNumber(amount)}`
  }

  // Helper function to check if value should be shown (filters empty values)
  const shouldShowValue = (value: number): boolean => {
    return !preferences.ignoreEmptyValues || value > 0
  }

  const monthlyIncomeAED = Math.round(
    budgetData.income.currency === 'USD'
      ? budgetData.income.monthlyAmount * budgetData.income.exchangeRate
      : budgetData.income.monthlyAmount,
  )

  const getSavingsColor = (rate: number) => {
    if (rate >= 30) return 'text-green-600'
    if (rate >= 20) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSavingsIcon = (rate: number) => {
    if (rate >= 20) return <TrendingUp className="h-4 w-4" />
    return <TrendingDown className="h-4 w-4" />
  }

  return (
    <Card className="gap-4 py-4 pb-2 lg:px-2">
      <CardHeader className={expandable ? 'cursor-pointer px-4' : 'px-4'} onClick={toggleExpanded}>
        <CardTitle className="flex items-center justify-between text-base lg:text-lg">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Monthly Budget
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
        <CardContent className="space-y-4 px-4 pb-2 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Monthly rent</span>
              <span className="font-medium">{formatCurrency(results.monthly.rent)}</span>
            </div>
            {shouldShowValue(results.monthly.utilities) && (
              <div className="flex justify-between">
                <span>Utilities & Services</span>
                <span className="font-medium">{formatCurrency(results.monthly.utilities)}</span>
              </div>
            )}
            {shouldShowValue(results.monthly.transport) && (
              <div className="flex justify-between">
                <span>Transportation</span>
                <span className="font-medium">{formatCurrency(results.monthly.transport)}</span>
              </div>
            )}
            {shouldShowValue(results.monthly.food) && (
              <div className="flex justify-between">
                <span>Food & groceries</span>
                <span className="font-medium">{formatCurrency(results.monthly.food)}</span>
              </div>
            )}
            {shouldShowValue(results.monthly.schooling) && (
              <div className="flex justify-between">
                <span>Education</span>
                <span className="font-medium">{formatCurrency(results.monthly.schooling)}</span>
              </div>
            )}
            {shouldShowValue(results.monthly.extras) && (
              <div className="flex justify-between">
                <span>Entertainment & misc</span>
                <span className="font-medium">{formatCurrency(results.monthly.extras)}</span>
              </div>
            )}
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between font-bold">
              <span>Monthly income:</span>
              <span className="text-green-600 dark:text-green-400">{formatCurrency(monthlyIncomeAED)}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Monthly expenses:</span>
              <span className="text-red-600 dark:text-red-400">{formatCurrency(results.monthly.total)}</span>
            </div>

            <div className="flex justify-between">
              <span>Monthly savings:</span>
              <span className={getSavingsColor(results.savings.savingsRate)}>
                {formatCurrency(results.savings.monthlyAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Savings rate:</span>
              <div className={`flex items-center gap-1 ${getSavingsColor(results.savings.savingsRate)}`}>
                {getSavingsIcon(results.savings.savingsRate)}
                <span>{results.savings.savingsRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
