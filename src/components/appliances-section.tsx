import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { ApplianceItem, AppliancesData } from '../lib/budget-calculator'
import { formatNumber } from '../lib/format'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface AppliancesSectionProps {
  data: AppliancesData
  onChange: (data: Partial<AppliancesData>) => void
}

const CATEGORY_LABELS = {
  kitchen: 'Kitchen',
  laundry: 'Laundry',
  bedroom: 'Bedroom',
  living: 'Living Room',
  other: 'Other',
}

export function AppliancesSection({ data, onChange }: AppliancesSectionProps) {
  const [expandedCategories, setExpandedCategories] = useState({
    kitchen: true, // Kitchen expanded by default
    laundry: false,
    bedroom: false,
    living: false,
    other: false,
  })

  const toggleCategory = (category: keyof typeof expandedCategories) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  function updateAppliance(applianceId: string, updates: Partial<ApplianceItem>) {
    const updatedItems = data.items.map((item) => (item.id === applianceId ? { ...item, ...updates } : item))

    const totalAmount = updatedItems.filter((item) => item.enabled).reduce((sum, item) => sum + item.price, 0)

    onChange({
      items: updatedItems,
      totalAmount,
    })
  }

  function resetToDefault(applianceId: string) {
    const appliance = data.items.find((item) => item.id === applianceId)
    if (appliance) {
      updateAppliance(applianceId, { price: appliance.defaultPrice })
    }
  }

  // Group appliances by category
  const groupedAppliances = data.items.reduce(
    (groups, appliance) => {
      const category = appliance.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(appliance)
      return groups
    },
    {} as Record<string, ApplianceItem[]>,
  )

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg border p-4">
        <p className="text-sm">
          <strong>💡 Tip:</strong>{' '}
          <span className="text-muted-foreground">
            These are 2026 mid-tier appliance prices in Dubai. Each item shows the current price range to help you
            budget accurately. Consider buying from outlets like IKEA, Home Centre, or second-hand markets for better
            deals.
          </span>
        </p>
      </div>

      {Object.entries(groupedAppliances).map(([category, appliances]) => (
        <Card key={category} className="gap-2 pt-4 pb-2">
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleCategory(category as keyof typeof expandedCategories)}
          >
            <CardTitle className="flex items-center justify-between text-base lg:text-lg">
              <span className="flex items-center gap-2">
                {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
              </span>
              {expandedCategories[category as keyof typeof expandedCategories] ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </CardTitle>
          </CardHeader>
          {expandedCategories[category as keyof typeof expandedCategories] && (
            <CardContent className="px-4 pb-2">
              <div className="grid gap-4">
                {appliances.map((appliance) => (
                  <div key={appliance.id} className="rounded-lg border p-4">
                    {/* Desktop layout: horizontal */}
                    <div className="hidden items-center justify-between md:flex">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`appliance-${appliance.id}`}
                          checked={appliance.enabled}
                          onCheckedChange={(checked) =>
                            updateAppliance(appliance.id, {
                              enabled: !!checked,
                            })
                          }
                        />
                        <div>
                          <Label htmlFor={`appliance-${appliance.id}`} className="cursor-pointer">
                            <div className="grid grid-cols-1 space-y-2">
                              <div className="text-sm font-medium md:text-base">{appliance.name}</div>
                              <div className="text-muted-foreground space-y-1 text-xs">
                                <p>
                                  Range: AED {formatNumber(appliance.priceRange.min)} -{' '}
                                  {formatNumber(appliance.priceRange.max)}
                                </p>
                                <p>{appliance.priceRange.notes}</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`price-${appliance.id}`} className="text-sm">
                            AED
                          </Label>
                          <Input
                            id={`price-${appliance.id}`}
                            type="number"
                            value={appliance.price || ''}
                            onChange={(e) =>
                              updateAppliance(appliance.id, {
                                price: Number(e.target.value),
                              })
                            }
                            className="w-24 text-right text-sm md:text-base"
                            disabled={!appliance.enabled}
                          />
                        </div>
                        {appliance.price !== appliance.defaultPrice && (
                          <button
                            type="button"
                            onClick={() => resetToDefault(appliance.id)}
                            className="text-muted-foreground hover:text-foreground text-xs underline"
                            disabled={!appliance.enabled}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Mobile layout: vertical */}
                    <div className="space-y-3 md:hidden">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`appliance-mobile-${appliance.id}`}
                          checked={appliance.enabled}
                          onCheckedChange={(checked) =>
                            updateAppliance(appliance.id, {
                              enabled: !!checked,
                            })
                          }
                        />
                        <div className="flex-1">
                          <Label htmlFor={`appliance-mobile-${appliance.id}`} className="cursor-pointer">
                            <div className="space-y-2">
                              <div className="text-sm font-medium md:text-base">{appliance.name}</div>
                              <div className="text-muted-foreground space-y-1 text-xs">
                                <p>
                                  Range: AED {formatNumber(appliance.priceRange.min)} -{' '}
                                  {formatNumber(appliance.priceRange.max)}
                                </p>
                                <p>{appliance.priceRange.notes}</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>

                      {/* Price section below on mobile */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`price-mobile-${appliance.id}`} className="text-sm font-medium">
                            Price: AED
                          </Label>
                          <Input
                            id={`price-mobile-${appliance.id}`}
                            type="number"
                            value={appliance.price || ''}
                            onChange={(e) =>
                              updateAppliance(appliance.id, {
                                price: Number(e.target.value),
                              })
                            }
                            className="w-24 text-right text-sm md:text-base"
                            disabled={!appliance.enabled}
                          />
                        </div>
                        {appliance.price !== appliance.defaultPrice && (
                          <button
                            type="button"
                            onClick={() => resetToDefault(appliance.id)}
                            className="text-muted-foreground hover:text-foreground text-xs underline"
                            disabled={!appliance.enabled}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
