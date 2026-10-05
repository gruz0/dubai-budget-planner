import { Calculator, ChevronDown, ChevronUp, CreditCard, Info } from 'lucide-react'
import { useState } from 'react'
import type { BudgetResults, PreferencesData, SponsorshipConfig } from '../lib/budget-calculator'
import { formatNumber } from '../lib/format'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { Separator } from './ui/separator'

interface UpfrontPaymentsWidgetProps {
  splitSummaryId: string
  results: BudgetResults
  preferences: PreferencesData
  sponsorship?: SponsorshipConfig
  expandable?: boolean
  showButton?: boolean
  onButtonClick?: () => void | Promise<void>
  buttonText?: string
  buttonIcon?: React.ReactNode
  buttonDescription?: string
  isButtonLoading?: boolean
  defaultExpanded?: boolean
}

export function UpfrontPaymentsWidget({
  splitSummaryId,
  results,
  preferences,
  sponsorship,
  expandable = true,
  showButton = false,
  onButtonClick,
  buttonText = 'Next: Calculate Monthly Budget',
  buttonIcon = <Calculator className="mr-2 h-4 w-4" />,
  buttonDescription = 'Get a full breakdown of your monthly expenses.',
  isButtonLoading = false,
  defaultExpanded = true,
}: UpfrontPaymentsWidgetProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [showSplitSummary, setShowSplitSummary] = useState(false)

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

  // Calculate split amounts for each expense
  const calculateSplit = (
    amount: number,
    rule?: { type: 'percentage' | 'fixed'; value: number },
  ): { youPay: number; sponsorPay: number } => {
    if (!rule || amount === 0) {
      return { youPay: amount, sponsorPay: 0 }
    }

    let sponsorPay = 0
    if (rule.type === 'percentage') {
      sponsorPay = Math.round((amount * rule.value) / 100)
    } else {
      sponsorPay = Math.min(rule.value, amount)
    }

    return { youPay: amount - sponsorPay, sponsorPay }
  }

  // Calculate rent split based on cheques
  const rentSplit = sponsorship?.rentChequesFromSponsor
    ? {
        youPay: sponsorship.rentChequesFromSponsor > 0 ? 0 : results.upfront.rentFirstCheque,
        sponsorPay: sponsorship.rentChequesFromSponsor > 0 ? results.upfront.rentFirstCheque : 0,
      }
    : { youPay: results.upfront.rentFirstCheque, sponsorPay: 0 }

  const securitySplit = calculateSplit(results.upfront.securityDeposit, sponsorship?.securityDeposit)
  const brokerSplit = calculateSplit(results.upfront.brokerFee, sponsorship?.broker)
  const dewaSplit = calculateSplit(results.upfront.dewaDeposit, sponsorship?.dewaDeposit)
  const relocationSplit = calculateSplit(results.upfront.relocationServices, sponsorship?.relocation)

  const sponsorshipEnabled = sponsorship?.enabled || false

  // Helper to render a line item (either combined or split)
  const renderLineItem = (label: string, amount: number, youPay: number, sponsorPay: number, tooltip: string) => {
    if (!showSplitSummary || !sponsorshipEnabled || sponsorPay === 0) {
      // Show combined view
      return (
        <div key={label} className="group flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{label}</span>
            <div className="relative">
              <Info className="h-3 w-3 text-gray-400 opacity-70 transition-opacity group-hover:opacity-100" />
              <div className="absolute top-5 left-0 z-10 hidden w-48 rounded bg-gray-900 p-2 text-xs text-white shadow-lg group-hover:block">
                {tooltip}
              </div>
            </div>
          </div>
          <span className="font-medium">{formatCurrency(amount)}</span>
        </div>
      )
    }

    // Show split view
    const items = []
    if (youPay > 0) {
      items.push(
        <div key={`${label}-you`} className="group flex items-center justify-between">
          <span className="text-sm">{label} (You)</span>
          <span className="font-medium">{formatCurrency(youPay)}</span>
        </div>,
      )
    }
    if (sponsorPay > 0) {
      items.push(
        <div key={`${label}-sponsor`} className="group flex items-center justify-between">
          <span className="text-sm">{label} (Sponsor)</span>
          <span className="font-medium">{formatCurrency(sponsorPay)}</span>
        </div>,
      )
    }
    return items
  }

  return (
    <Card className="gap-4 py-4 pb-2 lg:px-2">
      <CardHeader className={expandable ? 'cursor-pointer px-4' : 'px-4'} onClick={toggleExpanded}>
        <CardTitle className="flex items-center justify-between text-base lg:text-lg">
          <span className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Up-front Payments
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
          {sponsorshipEnabled && (
            <div className="mb-3 flex items-center space-x-2 rounded-lg border border-blue-200 bg-blue-50 p-2 dark:border-blue-800 dark:bg-blue-900">
              <Checkbox
                id={splitSummaryId}
                checked={showSplitSummary}
                onCheckedChange={(checked) => setShowSplitSummary(checked as boolean)}
              />
              <Label htmlFor={splitSummaryId} className="cursor-pointer text-sm font-medium">
                Show split breakdown
              </Label>
            </div>
          )}
          <div className="space-y-2">
            {renderLineItem(
              'First rent payment',
              results.upfront.rentFirstCheque,
              rentSplit.youPay,
              rentSplit.sponsorPay,
              'Usually 1-4 rent cheques paid upfront',
            )}
            {shouldShowValue(results.upfront.securityDeposit) &&
              renderLineItem(
                'Security deposit',
                results.upfront.securityDeposit,
                securitySplit.youPay,
                securitySplit.sponsorPay,
                'Typically 5-10% of annual rent, fully refundable upon moving out',
              )}
            {shouldShowValue(results.upfront.brokerFee) &&
              renderLineItem(
                "Broker's fees",
                results.upfront.brokerFee,
                brokerSplit.youPay,
                brokerSplit.sponsorPay,
                "Agent's fee, typically 2-5% of annual rent",
              )}
            {shouldShowValue(results.upfront.dewaDeposit) &&
              renderLineItem(
                'DEWA connection',
                results.upfront.dewaDeposit,
                dewaSplit.youPay,
                dewaSplit.sponsorPay,
                'Dubai Electricity & Water Authority deposit (fully refundable) + activation fees (AED 100-300)',
              )}
            {shouldShowValue(results.upfront.coolingDeposit) && (
              <div className="group flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>District cooling</span>
                  <div className="relative">
                    <Info className="h-3 w-3 text-gray-400 opacity-70 transition-opacity group-hover:opacity-100" />
                    <div className="absolute top-5 left-0 z-10 hidden w-48 rounded bg-gray-900 p-2 text-xs text-white shadow-lg group-hover:block">
                      Central AC system connection charge (non-refundable)
                    </div>
                  </div>
                </div>
                <span className="font-medium">{formatCurrency(results.upfront.coolingDeposit)}</span>
              </div>
            )}
            {shouldShowValue(results.upfront.gasDeposit) && (
              <div className="group flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Gas connection</span>
                  <div className="relative">
                    <Info className="h-3 w-3 text-gray-400 opacity-70 transition-opacity group-hover:opacity-100" />
                    <div className="absolute top-5 left-0 z-10 hidden w-48 rounded bg-gray-900 p-2 text-xs text-white shadow-lg group-hover:block">
                      Gas deposit (refundable) + connection fee AED 350
                    </div>
                  </div>
                </div>
                <span className="font-medium">{formatCurrency(results.upfront.gasDeposit)}</span>
              </div>
            )}
            <div className="group flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Ejari registration</span>
                <div className="relative">
                  <Info className="h-3 w-3 text-gray-400 opacity-70 transition-opacity group-hover:opacity-100" />
                  <div className="absolute top-5 left-0 z-10 hidden w-48 rounded bg-gray-900 p-2 text-xs text-white shadow-lg group-hover:block">
                    Mandatory tenancy contract registration with Dubai authorities. Online: AED 120, Centres: ~AED
                    215+VAT
                  </div>
                </div>
              </div>
              <span className="font-medium">{formatCurrency(results.upfront.ejari)}</span>
            </div>
            {shouldShowValue(results.upfront.appliances) && (
              <div className="group flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Appliances & furniture</span>
                  <div className="relative">
                    <Info className="h-3 w-3 text-gray-400 opacity-70 transition-opacity group-hover:opacity-100" />
                    <div className="absolute top-5 left-0 z-10 hidden w-48 rounded bg-gray-900 p-2 text-xs text-white shadow-lg group-hover:block">
                      Essential appliances and furniture for your new home
                    </div>
                  </div>
                </div>
                <span className="font-medium">{formatCurrency(results.upfront.appliances)}</span>
              </div>
            )}
            {shouldShowValue(results.upfront.movingServices) && (
              <div className="flex justify-between">
                <span>Moving services</span>
                <span className="font-medium">{formatCurrency(results.upfront.movingServices)}</span>
              </div>
            )}
            {shouldShowValue(results.upfront.relocationServices) &&
              renderLineItem(
                'Relocation services',
                results.upfront.relocationServices,
                relocationSplit.youPay,
                relocationSplit.sponsorPay,
                'Plane tickets, temporary stay, airport transfers, visa & medicals, and pet relocation costs',
              )}
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-blue-600 dark:text-blue-400">{formatCurrency(results.upfront.total)}</span>
            </div>
          </div>
        </CardContent>
      )}

      {showButton && (
        <CardFooter className="flex flex-col gap-2 pt-2">
          <Button
            onClick={onButtonClick ? () => void onButtonClick() : undefined}
            disabled={isButtonLoading}
            size="lg"
            variant="default"
            className="cursor-pointer bg-purple-700 py-6 text-white hover:bg-purple-600 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500"
          >
            {isButtonLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                {buttonText}
                {buttonIcon}
              </>
            )}
          </Button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">{buttonDescription}</p>
        </CardFooter>
      )}
    </Card>
  )
}
