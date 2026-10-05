import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock,
  FileText,
  Home,
  Key,
  Shield,
  Snowflake,
  Sparkles,
  Wifi,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import type { BudgetData, BudgetResults, PreferencesData } from '../lib/budget-calculator'
import { formatNumber } from '../lib/format'
import { formatDate } from '../lib/utils'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface ImportantTasksWidgetProps {
  results: BudgetResults
  budgetData: BudgetData
  preferences: PreferencesData
  rentStartDate: string
  expandable?: boolean
  defaultExpanded?: boolean
}

interface RefundableDeposit {
  name: string
  amount: number
  description: string
  enabled: boolean
}

interface ImportantTask {
  title: string
  description: string
  date: string
  type:
    | 'deposit_return'
    | 'clearance_certificate'
    | 'moving_out'
    | 'internet_disconnection'
    | 'lease_decision'
    | 'cleaning_repairs'
    | 'final_inspection'
    | 'key_return'
    | 'district_cooling_clearance'
  priority: 'high' | 'medium' | 'low'
  completed?: boolean
}

export function ImportantTasksWidget({
  results,
  budgetData,
  preferences,
  rentStartDate,
  expandable = true,
  defaultExpanded = false,
}: ImportantTasksWidgetProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [showAllTasks, setShowAllTasks] = useState(false)

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

  // Check if a date is in the past
  const isDateInPast = useCallback((dateString: string): boolean => {
    const today = new Date()
    const taskDate = new Date(dateString)
    today.setHours(0, 0, 0, 0)
    taskDate.setHours(0, 0, 0, 0)
    return taskDate < today
  }, [])

  // Generate important tasks and reminders
  const generateImportantTasks = useCallback(
    (deposits: RefundableDeposit[]): ImportantTask[] => {
      if (!rentStartDate) return []

      const tasks: ImportantTask[] = []
      const startDate = new Date(rentStartDate)

      // Calculate lease end date (assuming 1 year lease)
      const leaseEndDate = new Date(startDate)
      leaseEndDate.setFullYear(startDate.getFullYear() + 1)

      // Moving out date (lease end date) - 19 Oct 2026
      tasks.push({
        title: 'Moving Out Date',
        description: 'Contract expiry/handover day. Return keys, complete inspection, sign handover form.',
        date: leaseEndDate.toISOString().split('T')[0],
        type: 'moving_out',
        priority: 'high',
        completed: isDateInPast(leaseEndDate.toISOString().split('T')[0]),
      })

      // Lease renewal decision (3 months before lease ends) - 19 Jul 2026
      const leaseDecisionDate = new Date(leaseEndDate)
      leaseDecisionDate.setMonth(leaseEndDate.getMonth() - 3)
      tasks.push({
        title: 'Lease Renewal Decision',
        description: "Most contracts require 90 days notice if you don't plan to renew.",
        date: leaseDecisionDate.toISOString().split('T')[0],
        type: 'lease_decision',
        priority: 'high',
        completed: isDateInPast(leaseDecisionDate.toISOString().split('T')[0]),
      })

      // Pre-handover cleaning/repairs (2-3 days before move-out)
      const cleaningRepairsDate = new Date(leaseEndDate)
      cleaningRepairsDate.setDate(leaseEndDate.getDate() - 3)
      tasks.push({
        title: 'Pre-handover Cleaning & Repairs',
        description: 'Complete any necessary cleaning and minor repairs before final inspection.',
        date: cleaningRepairsDate.toISOString().split('T')[0],
        type: 'cleaning_repairs',
        priority: 'medium',
        completed: isDateInPast(cleaningRepairsDate.toISOString().split('T')[0]),
      })

      // Final inspection booking (1 week before expiry)
      const finalInspectionDate = new Date(leaseEndDate)
      finalInspectionDate.setDate(leaseEndDate.getDate() - 7)
      tasks.push({
        title: 'Final Inspection Booking',
        description: 'Book final inspection with landlord or agent to confirm property condition.',
        date: finalInspectionDate.toISOString().split('T')[0],
        type: 'final_inspection',
        priority: 'medium',
        completed: isDateInPast(finalInspectionDate.toISOString().split('T')[0]),
      })

      // Internet disconnection (5-7 days before move-out) - Around 12 Oct 2026
      const internetDisconnectionDate = new Date(leaseEndDate)
      internetDisconnectionDate.setDate(leaseEndDate.getDate() - 7)
      tasks.push({
        title: 'Internet Disconnection',
        description:
          'Schedule 5–7 days before move-out. Allows time to settle bill, return router/modem, avoid extra charges.',
        date: internetDisconnectionDate.toISOString().split('T')[0],
        type: 'internet_disconnection',
        priority: 'medium',
        completed: isDateInPast(internetDisconnectionDate.toISOString().split('T')[0]),
      })

      // DEWA clearance certificate (1 week before move-out) - Around 12 Oct 2026
      if (budgetData.utilities.dewa.enabled) {
        const dewaDate = new Date(leaseEndDate)
        dewaDate.setDate(leaseEndDate.getDate() - 7)
        tasks.push({
          title: 'DEWA Clearance Certificate',
          description:
            'Request 1 week before move-out. Disconnection generates final bill within ~24 working hours; clearance after settlement.',
          date: dewaDate.toISOString().split('T')[0],
          type: 'clearance_certificate',
          priority: 'medium',
          completed: isDateInPast(dewaDate.toISOString().split('T')[0]),
        })
      }

      // District cooling clearance (1-2 weeks before move-out) - Around 5-12 Oct 2026
      if (budgetData.utilities.districtCooling.enabled) {
        const coolingDate = new Date(leaseEndDate)
        coolingDate.setDate(leaseEndDate.getDate() - 14)
        tasks.push({
          title: 'District Cooling Clearance',
          description: 'Request 1–2 weeks before move-out. Some providers need extra notice, check building policy.',
          date: coolingDate.toISOString().split('T')[0],
          type: 'district_cooling_clearance',
          priority: 'medium',
          completed: isDateInPast(coolingDate.toISOString().split('T')[0]),
        })
      }

      if (budgetData.utilities.gas.enabled) {
        const gasDate = new Date(leaseEndDate)
        gasDate.setDate(leaseEndDate.getDate() - 14)
        tasks.push({
          title: 'Gas Service Clearance',
          description: 'Request gas service clearance certificate for deposit refund.',
          date: gasDate.toISOString().split('T')[0],
          type: 'clearance_certificate',
          priority: 'medium',
          completed: isDateInPast(gasDate.toISOString().split('T')[0]),
        })
      }

      // Deposit return request (on/after handover) - From 19 Oct 2026 onwards
      const totalDeposits = deposits.find((deposit) => deposit.name === 'Apartment Security Deposit')?.amount ?? 0

      if (totalDeposits > 0) {
        tasks.push({
          title: 'Request Deposit Returns',
          description: `Legally refundable after clearance + inspection. Many landlords take up to 30 days. Amount to be refunded: ${formatCurrency(totalDeposits)}.`,
          date: leaseEndDate.toISOString().split('T')[0],
          type: 'deposit_return',
          priority: 'high',
          completed: isDateInPast(leaseEndDate.toISOString().split('T')[0]),
        })
      }

      // Key return & access cards (on handover day)
      tasks.push({
        title: 'Key Return & Access Cards',
        description: 'Return all keys, access cards, and building passes on handover day.',
        date: leaseEndDate.toISOString().split('T')[0],
        type: 'key_return',
        priority: 'high',
        completed: isDateInPast(leaseEndDate.toISOString().split('T')[0]),
      })

      // Sort tasks by date
      return tasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    },
    [
      rentStartDate,
      formatCurrency,
      budgetData.utilities.dewa.enabled,
      budgetData.utilities.districtCooling.enabled,
      budgetData.utilities.gas.enabled,
      isDateInPast,
    ],
  )

  const refundableDeposits = useMemo(() => generateRefundableDeposits(), [generateRefundableDeposits])

  const importantTasks = useMemo(
    () => generateImportantTasks(refundableDeposits),
    [generateImportantTasks, refundableDeposits],
  )

  const displayedTasks = useMemo(() => {
    if (showAllTasks || importantTasks.length <= 3) {
      return importantTasks
    }
    return importantTasks.slice(0, 3)
  }, [importantTasks, showAllTasks])

  const hasMoreTasks = importantTasks.length > 3

  return (
    <Card className="gap-4 py-4 pb-2 lg:px-2">
      <CardHeader className={expandable ? 'cursor-pointer px-4' : 'px-4'} onClick={toggleExpanded}>
        <CardTitle className="flex items-center justify-between text-base lg:text-lg">
          <span className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            Important Tasks & Reminders
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
          {importantTasks.length > 0 ? (
            <div className="space-y-3">
              {displayedTasks.map((task) => {
                const getTaskIcon = () => {
                  if (task.completed) {
                    return <CheckCircle className="h-4 w-4 text-green-600" />
                  }

                  switch (task.type) {
                    case 'moving_out':
                      return <Home className="h-4 w-4 text-red-600" />
                    case 'internet_disconnection':
                      return <Wifi className="h-4 w-4 text-orange-600" />
                    case 'lease_decision':
                      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    case 'deposit_return':
                      return <Shield className="h-4 w-4 text-blue-600" />
                    case 'clearance_certificate':
                      return <FileText className="h-4 w-4 text-purple-600" />
                    case 'cleaning_repairs':
                      return <Sparkles className="h-4 w-4 text-cyan-600" />
                    case 'final_inspection':
                      return <ClipboardCheck className="h-4 w-4 text-indigo-600" />
                    case 'key_return':
                      return <Key className="h-4 w-4 text-amber-600" />
                    case 'district_cooling_clearance':
                      return <Snowflake className="h-4 w-4 text-sky-600" />
                    default:
                      return <Clock className="h-4 w-4 text-gray-600" />
                  }
                }

                const getTaskStyles = () => {
                  if (task.completed) {
                    return {
                      container: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20 opacity-75',
                      title: 'text-gray-800 dark:text-gray-200 line-through',
                      date: 'text-gray-700 dark:text-gray-400',
                      description: 'text-gray-700 dark:text-gray-300',
                    }
                  }

                  return {
                    container: 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/20',
                    title: 'text-gray-800 dark:text-gray-200',
                    date: 'text-gray-700 dark:text-gray-400',
                    description: 'text-gray-700 dark:text-gray-300',
                  }
                }

                const styles = getTaskStyles()

                return (
                  <div key={task.title} className={`rounded-lg border px-4 py-3 ${styles.container}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">{getTaskIcon()}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                          <h4 className={`text-sm font-bold md:text-base ${styles.title}`}>
                            {task.title}
                            {task.completed && (
                              <span className="ml-2 text-xs font-normal text-green-600 dark:text-green-400">
                                (Completed)
                              </span>
                            )}
                          </h4>
                          <span className={`text-sm font-medium ${styles.date}`}>{formatDate(task.date)}</span>
                        </div>
                        <p className={`text-sm ${styles.description}`}>{task.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}

              {hasMoreTasks && !showAllTasks && (
                <div className="pt-2 text-center">
                  <Button variant="default" onClick={() => setShowAllTasks(true)}>
                    Show More ({importantTasks.length - 3} remaining)
                  </Button>
                </div>
              )}

              {hasMoreTasks && showAllTasks && (
                <div className="pt-2 text-center">
                  <Button variant="outline" onClick={() => setShowAllTasks(false)}>
                    Show Less
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No important tasks available. Set a rent start date to see reminders.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  )
}
