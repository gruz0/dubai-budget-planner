import { Info } from 'lucide-react'
import type { RelocationServicesData, SponsorshipConfig } from '../lib/budget-calculator'
import { formatNumber } from '../lib/format'
import { SplitButton } from './split-button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface RelocationServicesSectionProps {
  data: RelocationServicesData
  onChange: (data: Partial<RelocationServicesData>) => void
  sponsorship?: SponsorshipConfig
  onSponsorshipChange?: (updates: Partial<SponsorshipConfig>) => void
}

export function RelocationServicesSection({
  data,
  onChange,
  sponsorship,
  onSponsorshipChange,
}: RelocationServicesSectionProps) {
  function updateSubsection<K extends keyof RelocationServicesData>(
    section: K,
    updates: Partial<RelocationServicesData[K]>,
  ) {
    onChange({
      [section]: { ...data[section], ...updates },
    })
  }

  // Calculate total relocation costs
  const planeTickets = data.planeTickets.enabled
    ? data.planeTickets.adults * data.planeTickets.adultCost +
      data.planeTickets.children * data.planeTickets.childrenCost
    : 0

  const hotelStay = data.temporaryStay.enabled ? data.temporaryStay.nights * data.temporaryStay.costPerNight : 0

  const airportTaxi = data.airportTransfer.enabled ? data.airportTransfer.trips * data.airportTransfer.costPerTrip : 0

  const visaMedicals = data.visaMedicals.enabled
    ? data.visaMedicals.adults * data.visaMedicals.adultCost +
      data.visaMedicals.children * data.visaMedicals.childrenCost
    : 0

  const petTransport = data.pets.enabled ? data.pets.count * data.pets.costPerPet : 0

  const totalRelocationCosts = Math.round(planeTickets + hotelStay + airportTaxi + visaMedicals + petTransport)

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        One-time relocation expenses for moving to Dubai. Useful for individuals, companies planning employee
        relocations, and relocation agencies.
      </p>

      {/* Plane Tickets */}
      <Card className="gap-4 pt-4 pb-2">
        <CardHeader className="px-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="plane-tickets-enabled"
              checked={data.planeTickets.enabled}
              onCheckedChange={(checked) => updateSubsection('planeTickets', { enabled: !!checked })}
            />
            <CardTitle className="text-sm md:text-base lg:text-lg">
              <label htmlFor="plane-tickets-enabled" className="cursor-pointer">
                Plane Tickets
              </label>
            </CardTitle>
          </div>
        </CardHeader>
        {data.planeTickets.enabled && (
          <CardContent className="space-y-4 px-4">
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <Info className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <p className="mb-1 font-medium">Flight Tickets</p>
                  <p className="text-muted-foreground">
                    Flight tickets for employees, family members, or dependents. Prices vary by origin, season, and
                    booking time.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adults-count">Adults</Label>
                <Input
                  id="adults-count"
                  type="number"
                  min="0"
                  value={data.planeTickets.adults || ''}
                  onChange={(e) =>
                    updateSubsection('planeTickets', {
                      adults: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  placeholder="2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adult-cost">Cost per Adult (AED)</Label>
                <Input
                  id="adult-cost"
                  type="number"
                  min="0"
                  step="100"
                  value={data.planeTickets.adultCost || ''}
                  onChange={(e) =>
                    updateSubsection('planeTickets', {
                      adultCost: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="2500"
                />
                <p className="text-muted-foreground text-xs">Typical range: AED 1,500–3,000 per adult</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="children-count">Children</Label>
                <Input
                  id="children-count"
                  type="number"
                  min="0"
                  value={data.planeTickets.children || ''}
                  onChange={(e) =>
                    updateSubsection('planeTickets', {
                      children: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="children-cost">Cost per Child (AED)</Label>
                <Input
                  id="children-cost"
                  type="number"
                  min="0"
                  step="100"
                  value={data.planeTickets.childrenCost || ''}
                  onChange={(e) =>
                    updateSubsection('planeTickets', {
                      childrenCost: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="2000"
                />
                <p className="text-muted-foreground text-xs">Usually 10-20% less than adult tickets</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Temporary Stay */}
      <Card className="gap-4 pt-4 pb-2">
        <CardHeader className="px-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="temporary-stay-enabled"
              checked={data.temporaryStay.enabled}
              onCheckedChange={(checked) => updateSubsection('temporaryStay', { enabled: !!checked })}
            />
            <CardTitle className="text-sm md:text-base lg:text-lg">
              <label htmlFor="temporary-stay-enabled" className="cursor-pointer">
                Temporary Stay (Hotels / Apartments)
              </label>
            </CardTitle>
          </div>
        </CardHeader>
        {data.temporaryStay.enabled && (
          <CardContent className="space-y-4 px-4">
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <Info className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <p className="mb-1 font-medium">Accommodation for First Days/Weeks</p>
                  <p className="text-muted-foreground">
                    Hotel, serviced apartment, or Airbnb accommodation while searching for permanent housing in Dubai.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nights">Number of Nights</Label>
                <Input
                  id="nights"
                  type="number"
                  min="0"
                  value={data.temporaryStay.nights || ''}
                  onChange={(e) =>
                    updateSubsection('temporaryStay', {
                      nights: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  placeholder="7"
                />
                <p className="text-muted-foreground text-xs">Usually 3-14 nights while house hunting</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost-per-night">Cost per Night (AED)</Label>
                <Input
                  id="cost-per-night"
                  type="number"
                  min="0"
                  step="50"
                  value={data.temporaryStay.costPerNight || ''}
                  onChange={(e) =>
                    updateSubsection('temporaryStay', {
                      costPerNight: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="400"
                />
                <p className="text-muted-foreground text-xs">Typical range: AED 200–600/night</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Airport Transfer */}
      <Card className="gap-4 pt-4 pb-2">
        <CardHeader className="px-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="airport-transfer-enabled"
              checked={data.airportTransfer.enabled}
              onCheckedChange={(checked) => updateSubsection('airportTransfer', { enabled: !!checked })}
            />
            <CardTitle className="text-sm md:text-base lg:text-lg">
              <label htmlFor="airport-transfer-enabled" className="cursor-pointer">
                Airport Transfer / Taxi
              </label>
            </CardTitle>
          </div>
        </CardHeader>
        {data.airportTransfer.enabled && (
          <CardContent className="space-y-4 px-4">
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <Info className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <p className="mb-1 font-medium">Transportation from Airport</p>
                  <p className="text-muted-foreground">
                    Taxi, Careem/Uber, or private driver transfers from Dubai International Airport to your
                    accommodation.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="trips">Number of Trips</Label>
                <Input
                  id="trips"
                  type="number"
                  min="0"
                  value={data.airportTransfer.trips || ''}
                  onChange={(e) =>
                    updateSubsection('airportTransfer', {
                      trips: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  placeholder="2"
                />
                <p className="text-muted-foreground text-xs">Usually 2 trips (arrival + departure)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost-per-trip">Cost per Trip (AED)</Label>
                <Input
                  id="cost-per-trip"
                  type="number"
                  min="0"
                  step="10"
                  value={data.airportTransfer.costPerTrip || ''}
                  onChange={(e) =>
                    updateSubsection('airportTransfer', {
                      costPerTrip: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="100"
                />
                <p className="text-muted-foreground text-xs">Typical range: AED 50–150 per trip</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Visa & Medicals */}
      <Card className="gap-4 pt-4 pb-2">
        <CardHeader className="px-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="visa-medicals-enabled"
              checked={data.visaMedicals.enabled}
              onCheckedChange={(checked) => updateSubsection('visaMedicals', { enabled: !!checked })}
            />
            <CardTitle className="text-sm md:text-base lg:text-lg">
              <label htmlFor="visa-medicals-enabled" className="cursor-pointer">
                Visa & Medicals
              </label>
            </CardTitle>
          </div>
        </CardHeader>
        {data.visaMedicals.enabled && (
          <CardContent className="space-y-4 px-4">
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <Info className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <p className="mb-1 font-medium">Immigration & Documentation</p>
                  <p className="text-muted-foreground">
                    Entry permit, residence visa stamping, Emirates ID, and mandatory medical tests required for UAE
                    residency.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="visa-adults">Adults</Label>
                <Input
                  id="visa-adults"
                  type="number"
                  min="0"
                  value={data.visaMedicals.adults || ''}
                  onChange={(e) =>
                    updateSubsection('visaMedicals', {
                      adults: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  placeholder="2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visa-adult-cost">Cost per Adult (AED)</Label>
                <Input
                  id="visa-adult-cost"
                  type="number"
                  min="0"
                  step="100"
                  value={data.visaMedicals.adultCost || ''}
                  onChange={(e) =>
                    updateSubsection('visaMedicals', {
                      adultCost: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="4500"
                />
                <p className="text-muted-foreground text-xs">Typical range: AED 3,000–6,000 per adult</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="visa-children">Children</Label>
                <Input
                  id="visa-children"
                  type="number"
                  min="0"
                  value={data.visaMedicals.children || ''}
                  onChange={(e) =>
                    updateSubsection('visaMedicals', {
                      children: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visa-children-cost">Cost per Child (AED)</Label>
                <Input
                  id="visa-children-cost"
                  type="number"
                  min="0"
                  step="100"
                  value={data.visaMedicals.childrenCost || ''}
                  onChange={(e) =>
                    updateSubsection('visaMedicals', {
                      childrenCost: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="3000"
                />
                <p className="text-muted-foreground text-xs">Usually lower than adult fees</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Pets */}
      <Card className="gap-4 pt-4 pb-2">
        <CardHeader className="px-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pets-enabled"
              checked={data.pets.enabled}
              onCheckedChange={(checked) => updateSubsection('pets', { enabled: !!checked })}
            />
            <CardTitle className="text-sm md:text-base lg:text-lg">
              <label htmlFor="pets-enabled" className="cursor-pointer">
                Pets (Optional)
              </label>
            </CardTitle>
          </div>
        </CardHeader>
        {data.pets.enabled && (
          <CardContent className="space-y-4 px-4">
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <Info className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <p className="mb-1 font-medium">Pet Relocation Services</p>
                  <p className="text-muted-foreground">
                    Costs for transporting pets including air cargo, veterinary certificates, import permits, and
                    quarantine if required.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pets-count">Number of Pets</Label>
                <Input
                  id="pets-count"
                  type="number"
                  min="0"
                  value={data.pets.count || ''}
                  onChange={(e) =>
                    updateSubsection('pets', {
                      count: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pets-cost">Cost per Pet (AED)</Label>
                <Input
                  id="pets-cost"
                  type="number"
                  min="0"
                  step="500"
                  value={data.pets.costPerPet || ''}
                  onChange={(e) =>
                    updateSubsection('pets', {
                      costPerPet: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="10000"
                />
                <p className="text-muted-foreground text-xs">Typical range: AED 5,000–15,000 per pet</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {onSponsorshipChange && totalRelocationCosts > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900">
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <div>
              <p className="text-sm font-medium">Split total relocation costs?</p>
              <p className="mt-1 text-xs">Total: AED {formatNumber(totalRelocationCosts)}</p>
            </div>
            <SplitButton
              amount={totalRelocationCosts}
              currentRule={sponsorship?.relocation}
              onChange={(rule) => {
                onSponsorshipChange({
                  enabled: !!rule || sponsorship?.enabled || false,
                  relocation: rule,
                })
              }}
              label="Relocation Costs"
            />
          </div>
        </div>
      )}
    </div>
  )
}
