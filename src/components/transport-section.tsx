import { getPublicTransportCost, type TransportData } from '../lib/budget-calculator'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface TransportSectionProps {
  data: TransportData
  onChange: (data: Partial<TransportData>) => void
}

export function TransportSection({ data, onChange }: TransportSectionProps) {
  function updateTransportType(type: string) {
    const newData: Partial<TransportData> = {
      type: type as TransportData['type'],
    }

    // Update public transport cost when zones change
    if (type === 'public' || type === 'both') {
      newData.publicTransport = {
        ...data.publicTransport,
        monthlyAmount: getPublicTransportCost(data.publicTransport.zones),
      }
    }

    onChange(newData)
  }

  const carCategories = [
    {
      value: 'economy',
      label: 'Economy (Nissan Sunny, etc.)',
      cost: '1,400-1,800',
    },
    {
      value: 'sedan',
      label: 'Sedan (Corolla, Altima, etc.)',
      cost: '1,800-2,800',
    },
    { value: 'suv', label: 'SUV (Prado, Pajero, etc.)', cost: '2,500-4,000' },
    {
      value: 'luxury',
      label: 'Luxury (BMW, Mercedes, etc.)',
      cost: '4,000-6,000+',
    },
  ]

  const fuelCost = (data.carRental.fuelKmPerMonth / 15) * 2.6 // Assuming 15km/L, 2.6 AED/L
  const salikCost = data.carRental.salikCrossings * 6

  return (
    <div className="space-y-6">
      <RadioGroup value={data.type} onValueChange={updateTransportType}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="transport-none" />
            <Label htmlFor="transport-none">No transport needed</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="car" id="transport-car" />
            <Label htmlFor="transport-car">Car rental only</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="transport-public" />
            <Label htmlFor="transport-public">Public transport only</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="transport-both" />
            <Label htmlFor="transport-both">Both car and public transport</Label>
          </div>
        </div>
      </RadioGroup>

      {(data.type === 'car' || data.type === 'both') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🚗 Car Rental</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="car-category">Car Category</Label>
              <Select
                value={data.carRental.category}
                onValueChange={(value) => {
                  const category = carCategories.find((c) => c.value === value)
                  const baseCost =
                    category?.value === 'economy'
                      ? 1400
                      : category?.value === 'sedan'
                        ? 1800
                        : category?.value === 'suv'
                          ? 2500
                          : 5000
                  onChange({
                    carRental: {
                      ...data.carRental,
                      category: value,
                      monthlyAmount: baseCost,
                    },
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {carCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label} ({category.cost} AED/month)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="car-monthly">Monthly Rental (AED)</Label>
                <Input
                  id="car-monthly"
                  type="number"
                  value={data.carRental.monthlyAmount || ''}
                  onChange={(e) =>
                    onChange({
                      carRental: {
                        ...data.carRental,
                        monthlyAmount: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salik-crossings">Salik Crossings/Month</Label>
                <Input
                  id="salik-crossings"
                  type="number"
                  placeholder="20"
                  value={data.carRental.salikCrossings || ''}
                  onChange={(e) =>
                    onChange({
                      carRental: {
                        ...data.carRental,
                        salikCrossings: Number(e.target.value),
                      },
                    })
                  }
                />
                <p className="text-muted-foreground text-xs">6 AED per crossing</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel-km">Driving KM/Month</Label>
                <Input
                  id="fuel-km"
                  type="number"
                  placeholder="1500"
                  value={data.carRental.fuelKmPerMonth || ''}
                  onChange={(e) =>
                    onChange({
                      carRental: {
                        ...data.carRental,
                        fuelKmPerMonth: Number(e.target.value),
                      },
                    })
                  }
                />
                <p className="text-muted-foreground text-xs">~2.6 AED/L fuel</p>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                <strong>Estimated additional costs:</strong> Fuel: {fuelCost.toFixed(0)} AED/month, Salik: {salikCost}{' '}
                AED/month
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {(data.type === 'public' || data.type === 'both') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🚇 Public Transport</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="transport-zones">NOL Card Zones</Label>
                <Select
                  value={data.publicTransport.zones.toString()}
                  onValueChange={(value) => {
                    const zones = Number(value)
                    onChange({
                      publicTransport: {
                        zones,
                        monthlyAmount: getPublicTransportCost(zones),
                      },
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Zone - 140 AED/month</SelectItem>
                    <SelectItem value="2">2 Zones - 230 AED/month</SelectItem>
                    <SelectItem value="3">3 Zones - 350 AED/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transport-monthly">Monthly Cost (AED)</Label>
                <Input
                  id="transport-monthly"
                  type="number"
                  value={data.publicTransport.monthlyAmount || ''}
                  onChange={(e) =>
                    onChange({
                      publicTransport: {
                        ...data.publicTransport,
                        monthlyAmount: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-800">
                <strong>Dubai Public Transport:</strong> Metro, buses, trams, and marine transport. Silver NOL card
                recommended for residents.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {data.type === 'both' && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            <strong>⚠️ Note:</strong> You&apos;ve selected both car and public transport. This is common in Dubai but
            consider if you need both to avoid overspending.
          </p>
        </div>
      )}
    </div>
  )
}
