import { HelpCircle } from 'lucide-react'
import type { CustomSpendingItem, ExtrasData } from '../lib/budget-calculator'
import { CustomSpendingTable } from './custom-spending-table'
import { FitnessOptionsHelper } from './fitness-options-helper'
import { MobilePlansHelper } from './mobile-plans-helper'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface ExtrasSectionProps {
  data: ExtrasData
  onChange: (data: Partial<ExtrasData>) => void
}

export function ExtrasSection({ data, onChange }: ExtrasSectionProps) {
  return (
    <div className="space-y-6 divide-y">
      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="mobile-phone">Mobile Phone (AED/month)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <HelpCircle className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <MobilePlansHelper />
              </PopoverContent>
            </Popover>
          </div>
          <Input
            id="mobile-phone"
            type="number"
            placeholder="150"
            value={data.mobilePhone || ''}
            onChange={(e) => onChange({ mobilePhone: Number(e.target.value) })}
          />
          <p className="text-muted-foreground text-xs">Typical: 100-300 AED</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="gym">Gym Membership (AED/month)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <HelpCircle className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <FitnessOptionsHelper />
              </PopoverContent>
            </Popover>
          </div>
          <Input
            id="gym"
            type="number"
            placeholder="300"
            value={data.gym || ''}
            onChange={(e) => onChange({ gym: Number(e.target.value) })}
          />
          <p className="text-muted-foreground text-xs">Range: 200-800 AED</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="streaming">Entertainment/Streaming (AED/month)</Label>
          <Input
            id="streaming"
            type="number"
            placeholder="100"
            value={data.streaming || ''}
            onChange={(e) => onChange({ streaming: Number(e.target.value) })}
          />
          <p className="text-muted-foreground text-xs">Netflix, OSN, etc.</p>
        </div>
      </div>

      {/* Custom Spending Table */}
      <CustomSpendingTable
        items={data.customSpending}
        onChange={(items: CustomSpendingItem[]) => onChange({ customSpending: items })}
      />
    </div>
  )
}
