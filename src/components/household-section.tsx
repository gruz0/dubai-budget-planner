import { Plus, X } from 'lucide-react'
import type { HouseholdData } from '../lib/budget-calculator'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface HouseholdSectionProps {
  data: HouseholdData
  onChange: (data: Partial<HouseholdData>) => void
}

export function HouseholdSection({ data, onChange }: HouseholdSectionProps) {
  function addChild() {
    const newAges = [...data.childrenAges, 5]
    onChange({
      children: data.children + 1,
      childrenAges: newAges,
    })
  }

  function removeChild(index: number) {
    const newAges = data.childrenAges.filter((_, i) => i !== index)
    onChange({
      children: Math.max(0, data.children - 1),
      childrenAges: newAges,
    })
  }

  function updateChildAge(index: number, age: number) {
    const newAges = [...data.childrenAges]
    newAges[index] = age
    onChange({ childrenAges: newAges })
  }

  function getSchoolCategory(age: number) {
    if (age <= 4) return 'Nursery'
    if (age <= 11) return 'Primary'
    if (age <= 17) return 'Secondary'
    return 'Adult'
  }

  function getSchoolCostRange(age: number) {
    if (age <= 4) return '1,500-3,000 AED/month'
    if (age <= 11) return '2,000-4,500 AED/month'
    if (age <= 17) return '3,000-6,000 AED/month'
    return 'N/A'
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="adults">Number of Adults</Label>
          <Input
            id="adults"
            type="number"
            min="1"
            value={data.adults || ''}
            onChange={(e) => onChange({ adults: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="children">Number of Children</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="children"
              type="number"
              min="0"
              value={data.children || ''}
              onChange={(e) => {
                const count = Number(e.target.value)
                const currentAges = data.childrenAges.slice(0, count)
                while (currentAges.length < count) {
                  currentAges.push(5)
                }
                onChange({ children: count, childrenAges: currentAges })
              }}
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={addChild}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {data.children > 0 && (
        <div className="space-y-4">
          <Label>Children Ages & School Costs</Label>
          <div className="space-y-3">
            {data.childrenAges.map((age, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: children are identified only by their position
              <div key={index} className="flex items-center space-x-3 rounded-lg border p-3">
                <div className="grid flex-1 grid-cols-1 items-center gap-3 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-sm">Age</Label>
                    <Input
                      type="number"
                      min="0"
                      max="18"
                      value={age || ''}
                      onChange={(e) => updateChildAge(index, Number(e.target.value))}
                      className="w-20"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm">School Level</Label>
                    <Badge variant="secondary">{getSchoolCategory(age)}</Badge>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm">Est. School Cost</Label>
                    <p className="text-muted-foreground text-sm">{getSchoolCostRange(age)}</p>
                  </div>
                </div>

                <Button type="button" variant="outline" size="sm" onClick={() => removeChild(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="nursery"
              checked={data.nursery}
              onCheckedChange={(checked) => onChange({ nursery: !!checked })}
            />
            <Label htmlFor="nursery" className="text-sm">
              Include nursery/daycare costs for young children
            </Label>
          </div>
        </div>
      )}

      <div className="bg-muted/50 rounded-lg border p-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">School Cost Information</p>
          <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
            <li>Costs vary significantly by school curriculum and location</li>
            <li>Popular curricula: British, American, IB, Indian, Filipino</li>
            <li>Many schools require registration fees and security deposits</li>
            <li>School bus costs are typically separate (300-800 AED/month)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
