import {
  Calendar,
  Car,
  ClipboardList,
  DollarSign,
  Home,
  Info,
  type LucideIcon,
  Package,
  Plane,
  RotateCcw,
  Smartphone,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Zap,
} from 'lucide-react'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { trackEvent } from '../analytics'
import {
  BUDGET_TEMPLATES,
  type BudgetData,
  type BudgetTemplate,
  calculateBudget,
  type SponsorshipConfig,
} from '../lib/budget-calculator'
import { clearSavedBudget, loadSavedBudget, saveBudget } from '../lib/budget-storage'
import { formatNumber } from '../lib/format'
import { initialBudgetData } from '../lib/initial-budget-data'
import { useToast } from '../lib/use-toast'
import { AdPlacementSection } from './ad-placement-section'
import { AppliancesSection } from './appliances-section'
import { AssumptionsSection } from './assumptions-section'
import { BrokerSection } from './broker-section'
import { CtaSection } from './cta-section'
import { DownloadPdfButton } from './download-pdf-button'
import { ExtrasSection } from './extras-section'
import { FoodSection } from './food-section'
import { HouseholdSection } from './household-section'
import { ImportantTasksWidget } from './important-tasks-widget'
import { IncomeSection } from './income-section'
import { MonthlyBudgetWidget } from './monthly-budget-widget'
import { MovingServicesSection } from './moving-services-section'
import { PreferencesDialog } from './preferences-dialog'
import { QuickStartTemplatesDialog } from './quick-start-templates-dialog'
import { RefundableDepositsWidget } from './refundable-deposits-widget'
import { RelocationServicesSection } from './relocation-services-section'
import { RentSection } from './rent-section'
import { ReportBugButton } from './report-bug-button'
import { TransportSection } from './transport-section'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { UpfrontPaymentsWidget } from './upfront-payments-widget'
import { UtilitiesSection } from './utilities-section'
import { YearlyCalendar } from './yearly-calendar'

interface SectionHeaderProps {
  icon: LucideIcon
  title: string
  hint?: string
  iconColor?: string
}

function SectionHeader({ icon: Icon, title, hint, iconColor = 'text-muted-foreground' }: SectionHeaderProps) {
  return (
    <div className="flex w-full cursor-pointer items-center justify-between">
      <span className="flex items-center text-base font-semibold lg:text-lg">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <span className="ml-2">{title}</span>
      </span>
      {hint && <span className="text-muted-foreground mr-2 hidden text-xs lg:mr-4 lg:block lg:text-sm">{hint}</span>}
    </div>
  )
}

// Default appliances with 2026 Dubai pricing and ranges
function templateIdFromUrl() {
  return new URLSearchParams(window.location.search).get('template')
}

export function BudgetPlannerForm({ themeToggle }: { themeToggle: ReactNode }) {
  const { toast } = useToast()
  // A ?template= link starts from that template, not from the visitor's saved budget
  const [saved] = useState(() => (templateIdFromUrl() ? null : loadSavedBudget()))
  const [budgetData, setBudgetData] = useState<BudgetData>(saved?.budgetData ?? initialBudgetData)
  const [openSections, setOpenSections] = useState<string[]>(saved?.openSections ?? ['income'])
  const [hasUnlockedSections, setHasUnlockedSections] = useState(saved?.hasUnlockedSections ?? false)
  const [showQuickStart, setShowQuickStart] = useState(!saved)

  // Keep the budget across reloads; nothing is stored until the visitor leaves the starting screen
  useEffect(() => {
    if (showQuickStart) return
    saveBudget({ budgetData, openSections, hasUnlockedSections })
  }, [budgetData, openSections, hasUnlockedSections, showQuickStart])

  function handleReset() {
    clearSavedBudget()
    setBudgetData(initialBudgetData)
    setOpenSections(['income'])
    setHasUnlockedSections(false)
    setShowQuickStart(true)
  }

  const results = useMemo(() => calculateBudget(budgetData), [budgetData])

  function updateBudgetData<K extends keyof BudgetData>(section: K, data: Partial<BudgetData[K]>) {
    setBudgetData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }))
  }

  function updateSponsorship(updates: Partial<SponsorshipConfig>) {
    setBudgetData((prev) => ({
      ...prev,
      sponsorship: {
        enabled: prev.sponsorship?.enabled || false,
        ...prev.sponsorship,
        ...updates,
      },
    }))
  }

  function applyTemplate(template: BudgetTemplate) {
    // Merge template data with current data, auto-enabling relevant sections
    setBudgetData((prev) => {
      const newData: BudgetData = {
        ...prev,
        ...template.data,
        preferences: {
          ...prev.preferences,
          visibleSections: {
            ...prev.preferences.visibleSections,
            household:
              prev.preferences.visibleSections.household ||
              (template.data.household?.children ?? 0) > 0 ||
              (template.data.household?.adults ?? 0) > 1,
            food: prev.preferences.visibleSections.food || (template.data.food?.monthlyAmount ?? 0) > 0,
            extras:
              prev.preferences.visibleSections.extras ||
              !!(template.data.extras?.mobilePhone || template.data.extras?.gym || template.data.extras?.streaming),
            moving: prev.preferences.visibleSections.moving || !!template.data.movingServices,
          },
        },
      }

      // Calculate appliances total based on enabled items from the template
      if (newData.appliances?.items) {
        const totalAmount = newData.appliances.items
          .filter((item) => item.enabled)
          .reduce((sum, item) => sum + item.price, 0)

        newData.appliances.totalAmount = totalAmount
      }

      return newData
    })

    // Auto-open relevant sections to show the applied changes
    const sectionsToOpen = ['income', 'rent', 'household', 'appliances', 'utilities', 'transport']
    if ((template.data.food?.monthlyAmount ?? 0) > 0) {
      sectionsToOpen.push('food')
    }
    if (template.data.extras?.mobilePhone || template.data.extras?.gym || template.data.extras?.streaming) {
      sectionsToOpen.push('extras')
    }
    setOpenSections(sectionsToOpen)

    setShowQuickStart(false)
  }

  // Auto-apply template from ?template=<id> query parameter
  const templateApplied = useRef(false)
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once on mount; applyTemplate is recreated every render
  useEffect(() => {
    if (templateApplied.current) return
    const templateId = templateIdFromUrl()
    if (!templateId) return
    const template = BUDGET_TEMPLATES.find((t) => t.id === templateId)
    if (!template) return
    templateApplied.current = true
    applyTemplate(template)
  }, [])

  function handleUnlockSections() {
    if (hasUnlockedSections) return

    trackEvent('budget_calculated')
    toast({
      title: 'Monthly budget calculated',
      description: 'You can now see your monthly budget.',
    })
    setHasUnlockedSections(true)
  }

  return (
    <div className="w-full space-y-6">
      {!showQuickStart && (
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
          {hasUnlockedSections && (
            <>
              <DownloadPdfButton budgetData={budgetData} />
              <ReportBugButton />
            </>
          )}
          <QuickStartTemplatesDialog onTemplateSelect={applyTemplate} />
          <PreferencesDialog
            data={budgetData.preferences}
            onChange={(data) => updateBudgetData('preferences', data)}
            themeToggle={themeToggle}
          />
          <Button variant="outline" className="flex cursor-pointer items-center gap-2" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            <span className="hidden md:block">Start Over</span>
          </Button>
        </div>
      )}

      {/* Quick Start Onboarding */}
      {showQuickStart && (
        <Card className="mx-auto max-w-6xl gap-4 py-6">
          <CardHeader className="px-4 lg:px-6">
            <CardTitle className="text-base lg:text-lg">Pick a Starting Point</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-4 lg:px-6">
            {/* Template cards */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {BUDGET_TEMPLATES.map((template) => {
                const iconColor: Record<string, string> = {
                  'solo-unfurnished': 'text-blue-600 dark:text-blue-400',
                  'couple-unfurnished': 'text-rose-600 dark:text-rose-400',
                  'family-2children': 'text-emerald-600 dark:text-emerald-400',
                  'family-young-children': 'text-amber-600 dark:text-amber-400',
                }
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="hover:border-primary/50 hover:bg-accent flex cursor-pointer items-center gap-4 rounded-lg border p-4 text-left transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <template.icon className={`h-8 w-8 ${iconColor[template.id] ?? 'text-primary'}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{template.name}</p>
                      <p className="text-muted-foreground text-sm">{template.description}</p>
                    </div>
                    <span className="bg-primary text-primary-foreground flex-shrink-0 rounded-md px-3 py-1.5 text-sm font-medium">
                      Select
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Start from scratch */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowQuickStart(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-sm underline underline-offset-4 transition-colors"
              >
                Or start from scratch
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {!showQuickStart && (
        <>
          {/* Section 1: Budget Calculator (Default Open) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Form Section */}
            <div className="space-y-4 lg:col-span-2 lg:space-y-6">
              <Accordion
                type="multiple"
                value={openSections}
                onValueChange={setOpenSections}
                className="space-y-3 lg:space-y-4"
              >
                <AccordionItem value="income" className="rounded-lg border">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6">
                    <SectionHeader
                      icon={DollarSign}
                      title="Income & Currency"
                      hint={`${budgetData.income.currency} ${formatNumber(budgetData.income.monthlyAmount)}/month`}
                      iconColor="text-emerald-600 dark:text-emerald-400"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                    <IncomeSection data={budgetData.income} onChange={(data) => updateBudgetData('income', data)} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="rent" className="rounded-lg border">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6">
                    <SectionHeader
                      icon={Home}
                      title="Rent & Cheques"
                      hint={`AED ${formatNumber(budgetData.rent.annualRent)}/year`}
                      iconColor="text-blue-600 dark:text-blue-400"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                    <RentSection
                      data={budgetData.rent}
                      onChange={(data) => updateBudgetData('rent', data)}
                      sponsorship={budgetData.sponsorship}
                      onSponsorshipChange={updateSponsorship}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="broker" className="rounded-lg border">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6">
                    <SectionHeader
                      icon={ClipboardList}
                      title="Broker Commission"
                      hint={`AED ${formatNumber(results.upfront.brokerFee)}`}
                      iconColor="text-purple-600 dark:text-purple-400"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                    <BrokerSection
                      data={budgetData.broker}
                      annualRent={budgetData.rent.annualRent}
                      onChange={(data) => updateBudgetData('broker', data)}
                      sponsorship={budgetData.sponsorship}
                      onSponsorshipChange={updateSponsorship}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Ad Placement Section */}
                {hasUnlockedSections && (
                  <div className="py-2">
                    <AdPlacementSection />
                  </div>
                )}

                <AccordionItem value="appliances" className="rounded-lg border">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6">
                    <SectionHeader
                      icon={Home}
                      title="Appliances & Furniture"
                      hint={`AED ${formatNumber(results.upfront.appliances)} one-time`}
                      iconColor="text-orange-600 dark:text-orange-400"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                    <AppliancesSection
                      data={budgetData.appliances}
                      onChange={(data) => updateBudgetData('appliances', data)}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="utilities" className="rounded-lg border">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6">
                    <SectionHeader
                      icon={Zap}
                      title="Utilities & Services"
                      hint={`AED ${formatNumber(results.monthly.utilities)}/month`}
                      iconColor="text-yellow-600 dark:text-yellow-400"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                    <UtilitiesSection
                      data={budgetData.utilities}
                      onChange={(data) => updateBudgetData('utilities', data)}
                      sponsorship={budgetData.sponsorship}
                      onSponsorshipChange={updateSponsorship}
                    />
                  </AccordionContent>
                </AccordionItem>

                {budgetData.preferences.visibleSections.household && (
                  <AccordionItem value="household" className="rounded-lg border">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6">
                      <SectionHeader
                        icon={Users}
                        title="Household & Schooling"
                        hint={`${budgetData.household.adults} adult${budgetData.household.adults !== 1 ? 's' : ''}, ${budgetData.household.children} child${budgetData.household.children !== 1 ? 'ren' : ''}`}
                        iconColor="text-pink-600 dark:text-pink-400"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                      <HouseholdSection
                        data={budgetData.household}
                        onChange={(data) => updateBudgetData('household', data)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="transport" className="rounded-lg border">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6">
                    <SectionHeader
                      icon={Car}
                      title="Transport"
                      hint={`AED ${formatNumber(results.monthly.transport)}/month`}
                      iconColor="text-indigo-600 dark:text-indigo-400"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                    <TransportSection
                      data={budgetData.transport}
                      onChange={(data) => updateBudgetData('transport', data)}
                    />
                  </AccordionContent>
                </AccordionItem>

                {budgetData.preferences.visibleSections.food && (
                  <AccordionItem value="food" className="rounded-lg border">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6">
                      <SectionHeader
                        icon={UtensilsCrossed}
                        title="Food & Groceries"
                        hint={`AED ${formatNumber(budgetData.food.monthlyAmount)}/month`}
                        iconColor="text-red-600 dark:text-red-400"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                      <FoodSection
                        data={budgetData.food}
                        household={budgetData.household}
                        onChange={(data) => updateBudgetData('food', data)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                )}

                {budgetData.preferences.visibleSections.extras && (
                  <AccordionItem value="extras" className="rounded-lg border">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6">
                      <SectionHeader
                        icon={Smartphone}
                        title="Extra Recurring Expenses"
                        hint={`AED ${formatNumber(results.monthly.extras)}/month`}
                        iconColor="text-cyan-600 dark:text-cyan-400"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                      <ExtrasSection data={budgetData.extras} onChange={(data) => updateBudgetData('extras', data)} />
                    </AccordionContent>
                  </AccordionItem>
                )}

                {budgetData.preferences.visibleSections.moving && (
                  <AccordionItem value="moving" className="rounded-lg border">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6">
                      <SectionHeader
                        icon={Package}
                        title="Moving Services"
                        hint={`AED ${formatNumber(budgetData.movingServices.amount)} one-time`}
                        iconColor="text-teal-600 dark:text-teal-400"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                      <MovingServicesSection
                        data={budgetData.movingServices}
                        onChange={(data) => updateBudgetData('movingServices', data)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="relocation" className="rounded-lg border">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6">
                    <SectionHeader
                      icon={Plane}
                      title="Relocation Services"
                      hint={`AED ${formatNumber(results.upfront.relocationServices)} one-time`}
                      iconColor="text-sky-600 dark:text-sky-400"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                    <RelocationServicesSection
                      data={budgetData.relocationServices}
                      onChange={(data) => updateBudgetData('relocationServices', data)}
                      sponsorship={budgetData.sponsorship}
                      onSponsorshipChange={updateSponsorship}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="assumptions" className="rounded-lg border">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline lg:px-6">
                    <SectionHeader
                      icon={Info}
                      title="Key Assumptions & Sources"
                      hint="Feb 2026"
                      iconColor="text-yellow-600 dark:text-yellow-400"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                    <AssumptionsSection />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4 lg:space-y-6">
                <UpfrontPaymentsWidget
                  splitSummaryId="split-summary-sidebar"
                  results={results}
                  preferences={budgetData.preferences}
                  sponsorship={budgetData.sponsorship}
                  expandable={true}
                  defaultExpanded={true}
                  showButton={!hasUnlockedSections}
                  onButtonClick={handleUnlockSections}
                  buttonText="Next: Show Budget Insights"
                  buttonIcon={<TrendingUp className="mr-2 h-4 w-4" />}
                  buttonDescription="Get a full breakdown of your budget."
                />

                {hasUnlockedSections && (
                  <MonthlyBudgetWidget
                    budgetData={budgetData}
                    results={results}
                    preferences={budgetData.preferences}
                    expandable={true}
                    defaultExpanded={true}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Yearly Calendar (Appears only after calculation) */}
          {hasUnlockedSections && (
            <Card id="yearly-calendar-section" className="gap-4 py-4 pb-2 lg:px-2">
              <CardHeader className="px-4">
                <CardTitle className="flex justify-between md:items-center">
                  <span className="flex items-center gap-2 text-base lg:text-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span className="hidden md:block">Yearly </span>
                    Calendar
                  </span>
                  <div>
                    <Input
                      id="rent-start-date-edit"
                      type="date"
                      value={budgetData.rent.rentStartDate}
                      onChange={(e) =>
                        updateBudgetData('rent', {
                          rentStartDate: e.target.value,
                        })
                      }
                      className="w-auto text-sm md:text-base"
                    />
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 px-4 pb-2">
                <YearlyCalendar
                  budgetData={budgetData}
                  results={results}
                  rentStartDate={budgetData.rent.rentStartDate}
                />
              </CardContent>
            </Card>
          )}

          {/* Section 3: Insights (Appears only after calculation) */}
          {hasUnlockedSections && (
            <div id="insights-section" className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ImportantTasksWidget
                results={results}
                budgetData={budgetData}
                preferences={budgetData.preferences}
                rentStartDate={budgetData.rent.rentStartDate}
                expandable={true}
                defaultExpanded={true}
              />
              <RefundableDepositsWidget
                results={results}
                budgetData={budgetData}
                preferences={budgetData.preferences}
                expandable={true}
                defaultExpanded={true}
              />
            </div>
          )}

          {hasUnlockedSections && <CtaSection />}
        </>
      )}
    </div>
  )
}
