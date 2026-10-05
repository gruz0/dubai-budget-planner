import { RefreshCw } from 'lucide-react'
import { calculateFoodSuggestion, type FoodData, type HouseholdData } from '../lib/budget-calculator'
import { formatNumber } from '../lib/format'
import { FoodBudgetHelper } from './food-budget-helper'
import { FoodSavingsHelper } from './food-savings-helper'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface FoodSectionProps {
  data: FoodData
  household: HouseholdData
  onChange: (data: Partial<FoodData>) => void
}

export function FoodSection({ data, household, onChange }: FoodSectionProps) {
  const suggestion = calculateFoodSuggestion(household.adults, household.children)

  function applySuggestion() {
    onChange({ monthlyAmount: suggestion })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="food-monthly">Monthly Food & Groceries (AED)</Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Input
                id="food-monthly"
                type="number"
                placeholder="2,000"
                value={data.monthlyAmount || ''}
                onChange={(e) => onChange({ monthlyAmount: Number(e.target.value) })}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={applySuggestion}
                className="flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Auto-suggest</span>
                <span className="sm:hidden">Suggest</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg border p-3 sm:p-4">
          <div className="text-sm">
            <div className="text-foreground font-medium">Suggested amount for your household:</div>
            <div className="mt-1 text-base font-bold">AED {formatNumber(suggestion)}/month</div>
            <div className="text-muted-foreground mt-2 text-xs">
              Based on {household.adults} adult
              {household.adults !== 1 ? 's' : ''}
              {household.children > 0 ? ` and ${household.children} child${household.children !== 1 ? 'ren' : ''}` : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FoodBudgetHelper />
        <FoodSavingsHelper />
      </div>
    </div>
  )
}
