import { Button } from './ui/button'
import { Label } from './ui/label'
import { Switch } from './ui/switch'

interface PreferencesData {
  displayCurrency: 'AED' | 'USD'
  exchangeRate: number
  ignoreEmptyValues: boolean
  visibleSections: {
    household: boolean
    food: boolean
    extras: boolean
    moving: boolean
  }
}

interface PreferencesSectionProps {
  data: PreferencesData
  onChange: (data: Partial<PreferencesData>) => void
}

export function PreferencesSection({ data, onChange }: PreferencesSectionProps) {
  const handleCurrencyChange = (currency: 'AED' | 'USD') => {
    onChange({ displayCurrency: currency })
  }

  const handleIgnoreEmptyChange = (checked: boolean) => {
    onChange({ ignoreEmptyValues: checked })
  }

  const handleSectionVisibilityChange = (section: keyof PreferencesData['visibleSections'], checked: boolean) => {
    onChange({
      visibleSections: {
        ...data.visibleSections,
        [section]: checked,
      },
    })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Currency Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium md:text-base">Display Currency</Label>
        <p className="text-muted-foreground text-sm">Choose how amounts are displayed.</p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={data.displayCurrency === 'AED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCurrencyChange('AED')}
            className="flex-1 sm:flex-none"
          >
            AED (Dirhams)
          </Button>
          <Button
            type="button"
            variant={data.displayCurrency === 'USD' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCurrencyChange('USD')}
            className="flex-1 sm:flex-none"
          >
            USD (Dollars)
          </Button>
        </div>
      </div>

      {/* Empty Values Option */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="ignore-empty" className="text-sm font-medium md:text-base">
              Clean Display
            </Label>
            <p className="text-muted-foreground text-sm">Hide items with zero or empty values.</p>
          </div>
          <Switch id="ignore-empty" checked={data.ignoreEmptyValues} onCheckedChange={handleIgnoreEmptyChange} />
        </div>
      </div>

      {/* Optional Sections */}
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-sm font-medium md:text-base">Optional Sections</Label>
          <p className="text-muted-foreground text-sm">Show or hide additional budget sections.</p>
        </div>

        {/* Household & Schooling */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="section-household" className="cursor-pointer text-sm font-medium">
              Household & Schooling
            </Label>
            <p className="text-muted-foreground text-xs">Family members, education costs</p>
          </div>
          <Switch
            id="section-household"
            checked={data.visibleSections.household}
            onCheckedChange={(checked) => handleSectionVisibilityChange('household', checked)}
          />
        </div>

        {/* Food & Groceries */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="section-food" className="cursor-pointer text-sm font-medium">
              Food & Groceries
            </Label>
            <p className="text-muted-foreground text-xs">Monthly food and grocery expenses</p>
          </div>
          <Switch
            id="section-food"
            checked={data.visibleSections.food}
            onCheckedChange={(checked) => handleSectionVisibilityChange('food', checked)}
          />
        </div>

        {/* Extra Recurring Expenses */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="section-extras" className="cursor-pointer text-sm font-medium">
              Extra Recurring Expenses
            </Label>
            <p className="text-muted-foreground text-xs">Mobile, gym, streaming, custom spending</p>
          </div>
          <Switch
            id="section-extras"
            checked={data.visibleSections.extras}
            onCheckedChange={(checked) => handleSectionVisibilityChange('extras', checked)}
          />
        </div>

        {/* Moving Services */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="section-moving" className="cursor-pointer text-sm font-medium">
              Moving Services
            </Label>
            <p className="text-muted-foreground text-xs">One-time moving and packing costs</p>
          </div>
          <Switch
            id="section-moving"
            checked={data.visibleSections.moving}
            onCheckedChange={(checked) => handleSectionVisibilityChange('moving', checked)}
          />
        </div>
      </div>
    </div>
  )
}
