import type { IncomeData } from '../lib/budget-calculator'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface IncomeSectionProps {
  data: IncomeData
  onChange: (data: Partial<IncomeData>) => void
}

export function IncomeSection({ data, onChange }: IncomeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="monthly-income">Monthly Total Salary</Label>
          <Input
            id="monthly-income"
            type="number"
            placeholder="15,000"
            value={data.monthlyAmount || ''}
            onChange={(e) => onChange({ monthlyAmount: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={data.currency} onValueChange={(value) => onChange({ currency: value as 'AED' | 'USD' })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AED">AED (Dirhams)</SelectItem>
              <SelectItem value="USD">USD (Dollars)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {data.currency === 'USD' && (
        <Card className="border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
          <div className="space-y-2">
            <Label htmlFor="exchange-rate">USD to AED Exchange Rate</Label>
            <Input
              id="exchange-rate"
              type="number"
              step="0.01"
              placeholder="3.67"
              value={data.exchangeRate || ''}
              onChange={(e) => onChange({ exchangeRate: Number(e.target.value) })}
            />
            <p className="text-muted-foreground text-sm">
              Current rate is approximately 3.67. This affects all calculations as they are done in AED.
            </p>
          </div>
        </Card>
      )}

      <div className="text-muted-foreground text-sm">
        <p>
          💡 <strong>Tip:</strong> Use your total gross monthly salary including allowances. Most calculations in Dubai
          are done in AED.
        </p>
      </div>
    </div>
  )
}
