import { Split, X } from 'lucide-react'
import { useState } from 'react'
import type { SplitRule } from '../lib/budget-calculator'
import { formatNumber } from '../lib/format'
import { clamp } from '../lib/utils'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Slider } from './ui/slider'

interface SplitButtonProps {
  amount: number
  currentRule?: SplitRule
  onChange: (rule: SplitRule | undefined) => void
  label?: string
  currency?: string
}

export function SplitButton({ amount, currentRule, onChange, label = 'expense', currency = 'AED' }: SplitButtonProps) {
  const [open, setOpen] = useState(false)
  const [splitMode, setSplitMode] = useState<'you' | 'sponsor' | 'split'>(
    currentRule ? (currentRule.type === 'percentage' && currentRule.value === 100 ? 'sponsor' : 'split') : 'you',
  )
  const [splitType, setSplitType] = useState<'percentage' | 'fixed'>(currentRule?.type || 'percentage')
  const [splitValue, setSplitValue] = useState<number>(currentRule?.value || 50)

  function getSplitLabel() {
    if (!currentRule) return 'You pay 100%'

    if (currentRule.type === 'percentage') {
      if (currentRule.value === 100) return 'Sponsor pays'
      if (currentRule.value === 0) return 'You pay 100%'
      return `Split ${currentRule.value}/${100 - currentRule.value}`
    } else {
      const sponsorAmount = Math.min(currentRule.value, amount)
      return `Split ${currency} ${formatNumber(sponsorAmount)}`
    }
  }

  function handleApply() {
    if (splitMode === 'you') {
      onChange(undefined)
    } else if (splitMode === 'sponsor') {
      onChange({ type: 'percentage', value: 100 })
    } else {
      onChange({ type: splitType, value: splitValue })
    }
    setOpen(false)
  }

  function handleClear() {
    setSplitMode('you')
    setSplitValue(50)
    onChange(undefined)
    setOpen(false)
  }

  function getPreviewAmounts() {
    if (splitMode === 'you') {
      return { youPay: amount, sponsorPay: 0 }
    }
    if (splitMode === 'sponsor') {
      return { youPay: 0, sponsorPay: amount }
    }

    let sponsorPay = 0
    if (splitType === 'percentage') {
      sponsorPay = Math.round((amount * splitValue) / 100)
    } else {
      sponsorPay = Math.min(splitValue, amount)
    }

    return { youPay: amount - sponsorPay, sponsorPay }
  }

  const preview = getPreviewAmounts()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={currentRule ? 'secondary' : 'default'} size="sm" className="cursor-pointer text-xs">
          <Split className="mr-1 h-3 w-3" />
          {getSplitLabel()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Split {label}</h4>
            <p className="text-muted-foreground text-sm">
              Total: {currency} {formatNumber(amount)}
            </p>
          </div>

          <RadioGroup value={splitMode} onValueChange={(value) => setSplitMode(value as typeof splitMode)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="you" id="you" />
              <Label htmlFor="you" className="cursor-pointer">
                You pay all
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sponsor" id="sponsor" />
              <Label htmlFor="sponsor" className="cursor-pointer">
                Sponsor pays all
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="split" id="split" />
              <Label htmlFor="split" className="cursor-pointer">
                Split between us
              </Label>
            </div>
          </RadioGroup>

          {splitMode === 'split' && (
            <div className="space-y-3">
              <RadioGroup
                value={splitType}
                onValueChange={(value) => setSplitType(value as typeof splitType)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage" className="cursor-pointer">
                    Percentage
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed" className="cursor-pointer">
                    Fixed amount
                  </Label>
                </div>
              </RadioGroup>

              {splitType === 'percentage' ? (
                <div className="space-y-2">
                  <Label>Sponsor pays {splitValue}%</Label>
                  <Slider
                    value={[splitValue]}
                    onValueChange={(values) => setSplitValue(values[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Sponsor pays (in {currency})</Label>
                  <Input
                    type="number"
                    value={splitValue}
                    onChange={(e) => setSplitValue(clamp(Number(e.target.value), 0, amount))}
                    min={0}
                    max={amount}
                  />
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-3">
            <div className="mb-2 text-sm font-medium">Preview:</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">You pay:</span>
                <span className="font-medium">
                  {currency} {formatNumber(preview.youPay)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sponsor pays:</span>
                <span className="font-medium">
                  {currency} {formatNumber(preview.sponsorPay)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <Button variant="outline" size="sm" onClick={handleClear}>
              <X className="mr-1 h-3 w-3" />
              Clear
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
