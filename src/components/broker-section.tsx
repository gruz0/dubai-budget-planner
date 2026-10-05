import type { BrokerData, SponsorshipConfig } from '../lib/budget-calculator'
import { formatNumber } from '../lib/format'
import { clamp } from '../lib/utils'
import { SplitButton } from './split-button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'

interface BrokerSectionProps {
  data: BrokerData
  annualRent: number
  onChange: (data: Partial<BrokerData>) => void
  sponsorship?: SponsorshipConfig
  onSponsorshipChange?: (updates: Partial<SponsorshipConfig>) => void
}

export function BrokerSection({ data, annualRent, onChange, sponsorship, onSponsorshipChange }: BrokerSectionProps) {
  const calculatedFee = Math.round(data.type === 'percentage' ? annualRent * (data.percentage / 100) : data.fixedAmount)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RadioGroup value={data.type} onValueChange={(value) => onChange({ type: value as 'percentage' | 'fixed' })}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="broker-percentage" />
              <Label htmlFor="broker-percentage" className="font-medium">
                Percentage of annual rent
              </Label>
            </div>

            {data.type === 'percentage' && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="broker-percentage">Broker Commission (%)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="broker-percentage"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={data.percentage || ''}
                    onChange={(e) => onChange({ percentage: clamp(Number(e.target.value), 0, 100) })}
                    className="w-24"
                  />
                  <span className="text-muted-foreground text-sm">%</span>
                  <span className="text-sm font-medium">= AED {formatNumber(calculatedFee)}</span>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="broker-fixed" />
              <Label htmlFor="broker-fixed" className="font-medium">
                Fixed amount
              </Label>
            </div>

            {data.type === 'fixed' && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="broker-fixed">Broker Commission (AED)</Label>
                <Input
                  id="broker-fixed"
                  type="number"
                  placeholder="4,000"
                  value={data.fixedAmount || ''}
                  onChange={(e) => onChange({ fixedAmount: Number(e.target.value) })}
                />
              </div>
            )}
          </div>
        </RadioGroup>

        <div className="bg-muted/50 rounded-lg border p-4">
          <div className="space-y-2">
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Typical range: 2-5% of annual rent</li>
              <li>Some areas have fixed rates</li>
              <li>Payable upon lease signing</li>
              <li>Some properties are commission-free</li>
            </ul>
          </div>
        </div>
      </div>

      {onSponsorshipChange && calculatedFee > 0 && (
        <div className="flex flex-col items-center justify-between gap-2 rounded-lg border bg-blue-50 p-3 md:flex-row dark:border-blue-800 dark:bg-blue-900">
          <span className="text-sm font-medium">Split broker commission payment?</span>
          <SplitButton
            amount={calculatedFee}
            currentRule={sponsorship?.broker}
            onChange={(rule) => {
              onSponsorshipChange({
                enabled: !!rule || sponsorship?.enabled || false,
                broker: rule,
              })
            }}
            label="Broker Commission"
          />
        </div>
      )}
    </div>
  )
}
