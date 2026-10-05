import { useCallback, useMemo } from 'react'
import type { BudgetData, BudgetResults } from '../lib/budget-calculator'
import { formatNumber } from '../lib/format'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

interface YearlyCalendarProps {
  budgetData: BudgetData
  results: BudgetResults
  rentStartDate: string
}

interface MonthlyExpense {
  month: string
  monthIndex: number
  rentCheque: number
  dewa: number
  districtCooling: number
  internet: number
  gas: number
  transport: number
  food: number
  schooling: number
  extras: number
  oneTimeExpenses: number
  total: number
  isBigPaymentMonth: boolean
}

export function YearlyCalendar({ budgetData, results, rentStartDate }: YearlyCalendarProps) {
  // Format currency
  const formatCurrency = useCallback(
    (amount: number): string => {
      const currency = budgetData.preferences.displayCurrency === 'USD' ? '$' : 'AED '
      const displayAmount =
        budgetData.preferences.displayCurrency === 'USD' ? amount / budgetData.preferences.exchangeRate : amount
      return `${currency}${formatNumber(displayAmount)}`
    },
    [budgetData.preferences.displayCurrency, budgetData.preferences.exchangeRate],
  )

  // Generate 12 months starting from rent start date
  const generateYearlyExpenses = useCallback((): MonthlyExpense[] => {
    if (!rentStartDate) return []

    const startDate = new Date(rentStartDate)
    const months: MonthlyExpense[] = []

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (let i = 0; i < 12; i++) {
      const currentDate = new Date(startDate)
      currentDate.setMonth(startDate.getMonth() + i)

      const monthIndex = currentDate.getMonth()
      const monthName = monthNames[monthIndex]
      const year = currentDate.getFullYear()

      // Calculate rent cheque for this month
      const chequeAmount = budgetData.rent.annualRent / budgetData.rent.numberOfCheques
      const isRentChequeMonth = i % (12 / budgetData.rent.numberOfCheques) === 0

      // One-time expenses in first month
      const oneTimeExpenses =
        i === 0
          ? results.upfront.brokerFee +
            results.upfront.securityDeposit +
            results.upfront.dewaDeposit +
            results.upfront.coolingDeposit +
            results.upfront.gasDeposit +
            results.upfront.ejari +
            results.upfront.appliances +
            results.upfront.movingServices +
            results.upfront.relocationServices
          : 0

      const monthlyExpense: MonthlyExpense = {
        month: `${monthName} ${year}`,
        monthIndex: i,
        rentCheque: isRentChequeMonth ? chequeAmount : 0,
        dewa: budgetData.utilities.dewa.enabled ? budgetData.utilities.dewa.monthlyUsage : 0,
        districtCooling: budgetData.utilities.districtCooling.enabled
          ? budgetData.utilities.districtCooling.monthlyAmount
          : 0,
        internet: budgetData.utilities.internet.enabled ? budgetData.utilities.internet.monthlyAmount : 0,
        gas: budgetData.utilities.gas.enabled ? budgetData.utilities.gas.monthlyAmount : 0,
        transport: results.monthly.transport,
        food: results.monthly.food,
        schooling: results.monthly.schooling,
        extras: results.monthly.extras,
        oneTimeExpenses,
        total: 0,
        isBigPaymentMonth: false,
      }

      // Calculate total
      monthlyExpense.total =
        monthlyExpense.rentCheque +
        monthlyExpense.dewa +
        monthlyExpense.districtCooling +
        monthlyExpense.internet +
        monthlyExpense.gas +
        monthlyExpense.transport +
        monthlyExpense.food +
        monthlyExpense.schooling +
        monthlyExpense.extras +
        monthlyExpense.oneTimeExpenses

      months.push(monthlyExpense)
    }

    // Mark big payment months (those significantly above average)
    const averageMonthly = months.reduce((sum, m) => sum + m.total, 0) / 12
    const threshold = averageMonthly * 1.5

    months.forEach((month) => {
      month.isBigPaymentMonth = month.total > threshold
    })

    return months
  }, [
    rentStartDate,
    budgetData.rent.annualRent,
    budgetData.rent.numberOfCheques,
    results.upfront.brokerFee,
    results.upfront.securityDeposit,
    results.upfront.dewaDeposit,
    results.upfront.coolingDeposit,
    results.upfront.gasDeposit,
    results.upfront.ejari,
    results.upfront.appliances,
    results.upfront.movingServices,
    results.upfront.relocationServices,
    budgetData.utilities.dewa.enabled,
    budgetData.utilities.dewa.monthlyUsage,
    budgetData.utilities.districtCooling.enabled,
    budgetData.utilities.districtCooling.monthlyAmount,
    budgetData.utilities.internet.enabled,
    budgetData.utilities.internet.monthlyAmount,
    budgetData.utilities.gas.enabled,
    budgetData.utilities.gas.monthlyAmount,
    results.monthly.transport,
    results.monthly.food,
    results.monthly.schooling,
    results.monthly.extras,
  ])

  const yearlyExpenses = useMemo(() => generateYearlyExpenses(), [generateYearlyExpenses])

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-40">Expense Category</TableHead>
            {yearlyExpenses.map((month) => (
              <TableHead key={month.monthIndex} className="min-w-24 text-right">
                <span className="text-sm font-medium">{month.month}</span>
              </TableHead>
            ))}
            <TableHead className="bg-background/50 sticky right-0 min-w-32 text-right">
              <span className="text-sm font-bold">Year Total</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Rent Cheques Row */}
          <TableRow>
            <TableCell>Rent Cheques</TableCell>
            {yearlyExpenses.map((month) => (
              <TableCell key={month.monthIndex} className="text-right text-nowrap">
                {month.rentCheque > 0 ? (
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {formatCurrency(month.rentCheque)}
                  </span>
                ) : (
                  '—'
                )}
              </TableCell>
            ))}
            <TableCell className="bg-background sticky right-0 text-right font-semibold text-nowrap">
              {formatCurrency(yearlyExpenses.reduce((sum, m) => sum + m.rentCheque, 0))}
            </TableCell>
          </TableRow>

          {/* DEWA Row */}
          {budgetData.utilities.dewa.enabled && (
            <TableRow>
              <TableCell>DEWA</TableCell>
              {yearlyExpenses.map((month) => (
                <TableCell key={month.monthIndex} className="text-right text-nowrap">
                  {month.dewa > 0 ? formatCurrency(month.dewa) : '—'}
                </TableCell>
              ))}
              <TableCell className="bg-background sticky right-0 text-right font-semibold text-nowrap">
                {formatCurrency(yearlyExpenses.reduce((sum, m) => sum + m.dewa, 0))}
              </TableCell>
            </TableRow>
          )}

          {/* District Cooling Row */}
          {budgetData.utilities.districtCooling.enabled && (
            <TableRow>
              <TableCell>District Cooling</TableCell>
              {yearlyExpenses.map((month) => (
                <TableCell key={month.monthIndex} className="text-right text-nowrap">
                  {month.districtCooling > 0 ? formatCurrency(month.districtCooling) : '—'}
                </TableCell>
              ))}
              <TableCell className="bg-background sticky right-0 text-right font-semibold text-nowrap">
                {formatCurrency(yearlyExpenses.reduce((sum, m) => sum + m.districtCooling, 0))}
              </TableCell>
            </TableRow>
          )}

          {/* Internet Row */}
          {budgetData.utilities.internet.enabled && (
            <TableRow>
              <TableCell>Internet</TableCell>
              {yearlyExpenses.map((month) => (
                <TableCell key={month.monthIndex} className="text-right text-nowrap">
                  {month.internet > 0 ? formatCurrency(month.internet) : '—'}
                </TableCell>
              ))}
              <TableCell className="bg-background sticky right-0 text-right font-semibold text-nowrap">
                {formatCurrency(yearlyExpenses.reduce((sum, m) => sum + m.internet, 0))}
              </TableCell>
            </TableRow>
          )}

          {/* Gas Row */}
          {budgetData.utilities.gas.enabled && (
            <TableRow>
              <TableCell>Gas</TableCell>
              {yearlyExpenses.map((month) => (
                <TableCell key={month.monthIndex} className="text-right text-nowrap">
                  {month.gas > 0 ? formatCurrency(month.gas) : '—'}
                </TableCell>
              ))}
              <TableCell className="bg-background sticky right-0 text-right font-semibold text-nowrap">
                {formatCurrency(yearlyExpenses.reduce((sum, m) => sum + m.gas, 0))}
              </TableCell>
            </TableRow>
          )}

          {/* Transport Row */}
          {results.monthly.transport > 0 && (
            <TableRow>
              <TableCell>Transport</TableCell>
              {yearlyExpenses.map((month) => (
                <TableCell key={month.monthIndex} className="text-right text-nowrap">
                  {month.transport > 0 ? formatCurrency(month.transport) : '—'}
                </TableCell>
              ))}
              <TableCell className="bg-background sticky right-0 text-right font-semibold text-nowrap">
                {formatCurrency(yearlyExpenses.reduce((sum, m) => sum + m.transport, 0))}
              </TableCell>
            </TableRow>
          )}

          {/* Food Row */}
          {results.monthly.food > 0 && (
            <TableRow>
              <TableCell>Food & Groceries</TableCell>
              {yearlyExpenses.map((month) => (
                <TableCell key={month.monthIndex} className="text-right text-nowrap">
                  {formatCurrency(month.food)}
                </TableCell>
              ))}
              <TableCell className="bg-background sticky right-0 text-right font-semibold text-nowrap">
                {formatCurrency(yearlyExpenses.reduce((sum, m) => sum + m.food, 0))}
              </TableCell>
            </TableRow>
          )}

          {/* Education Row */}
          {results.monthly.schooling > 0 && (
            <TableRow>
              <TableCell>Education</TableCell>
              {yearlyExpenses.map((month) => (
                <TableCell key={month.monthIndex} className="text-right text-nowrap">
                  {month.schooling > 0 ? formatCurrency(month.schooling) : '—'}
                </TableCell>
              ))}
              <TableCell className="bg-background sticky right-0 text-right font-semibold text-nowrap">
                {formatCurrency(yearlyExpenses.reduce((sum, m) => sum + m.schooling, 0))}
              </TableCell>
            </TableRow>
          )}

          {/* Extras Row */}
          {results.monthly.extras > 0 && (
            <TableRow>
              <TableCell>Entertainment & Misc</TableCell>
              {yearlyExpenses.map((month) => (
                <TableCell key={month.monthIndex} className="text-right text-nowrap">
                  {month.extras > 0 ? formatCurrency(month.extras) : '—'}
                </TableCell>
              ))}
              <TableCell className="bg-background sticky right-0 text-right font-semibold text-nowrap">
                {formatCurrency(yearlyExpenses.reduce((sum, m) => sum + m.extras, 0))}
              </TableCell>
            </TableRow>
          )}

          {/* One-time Expenses Row */}
          <TableRow>
            <TableCell>One-time Expenses</TableCell>
            {yearlyExpenses.map((month) => (
              <TableCell key={month.monthIndex} className="text-right text-nowrap">
                {month.oneTimeExpenses > 0 ? (
                  <span className="font-medium text-orange-600">{formatCurrency(month.oneTimeExpenses)}</span>
                ) : (
                  '—'
                )}
              </TableCell>
            ))}
            <TableCell className="bg-background sticky right-0 text-right font-semibold text-nowrap">
              {formatCurrency(yearlyExpenses.reduce((sum, m) => sum + m.oneTimeExpenses, 0))}
            </TableCell>
          </TableRow>

          {/* Total Row */}
          <TableRow className="border-t-2 bg-gray-50 dark:bg-gray-900/50">
            <TableCell className="font-medium">Monthly Total</TableCell>
            {yearlyExpenses.map((month) => (
              <TableCell key={month.monthIndex} className="text-right text-nowrap">
                <span className={`font-bold ${month.isBigPaymentMonth ? 'text-red-600 dark:text-red-400' : undefined}`}>
                  {formatCurrency(month.total)}
                </span>
              </TableCell>
            ))}
            <TableCell className="sticky right-0 bg-gray-50 text-right font-bold text-nowrap dark:bg-gray-900/50">
              {formatCurrency(yearlyExpenses.reduce((sum, m) => sum + m.total, 0))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
