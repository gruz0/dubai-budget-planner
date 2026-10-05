import type { MovingServicesData } from '../lib/budget-calculator'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface MovingServicesSectionProps {
  data: MovingServicesData
  onChange: (data: Partial<MovingServicesData>) => void
}

export function MovingServicesSection({ data, onChange }: MovingServicesSectionProps) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Set your estimated moving services cost. This includes packers, movers, and any additional moving-related
        services you might need.
      </p>

      <div className="space-y-3">
        <Label htmlFor="moving-amount">Moving Services Cost</Label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="text-sm font-medium sm:min-w-[3rem]">AED</span>
          <Input
            id="moving-amount"
            type="number"
            min="0"
            step="100"
            value={data.amount || ''}
            onChange={(e) => {
              const amount = parseFloat(e.target.value) || 0
              onChange({ amount })
            }}
            className="flex-1"
            placeholder="1500"
          />
        </div>
        <div className="bg-muted/50 rounded-lg border p-3">
          <p className="text-muted-foreground text-xs">
            <strong>Typical range:</strong> AED 800 - 3,000 depending on apartment size and distance
          </p>
          <div className="text-muted-foreground mt-2 space-y-1 text-xs">
            <div>• Studio/1BR: 800-1,500 AED</div>
            <div>• 2-3BR: 1,500-2,500 AED</div>
            <div>• 4BR+: 2,500-4,000+ AED</div>
          </div>
        </div>
      </div>
    </div>
  )
}
