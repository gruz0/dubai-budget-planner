import { Info, Shield } from 'lucide-react'
import type { SponsorshipConfig, UtilitiesData } from '../lib/budget-calculator'
import { SplitButton } from './split-button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface UtilitiesSectionProps {
  data: UtilitiesData
  onChange: (data: Partial<UtilitiesData>) => void
  sponsorship?: SponsorshipConfig
  onSponsorshipChange?: (updates: Partial<SponsorshipConfig>) => void
}

// Internet provider pricing constants
const INTERNET_PROVIDERS = {
  du: { min: 270, max: 350, label: 'du (270-350 AED/month)' },
  etisalat: { min: 280, max: 380, label: 'Etisalat (280-380 AED/month)' },
  virgin: { min: 250, max: 320, label: 'Virgin Mobile (250-320 AED/month)' },
} as const

export function UtilitiesSection({ data, onChange, sponsorship, onSponsorshipChange }: UtilitiesSectionProps) {
  return (
    <div className="space-y-4">
      {/* DEWA */}
      <Card className="gap-4 pt-4 pb-2">
        <CardHeader className="px-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dewa-enabled"
              checked={data.dewa.enabled}
              onCheckedChange={(checked) =>
                onChange({
                  dewa: { ...data.dewa, enabled: !!checked },
                })
              }
            />
            <CardTitle className="text-sm md:text-base lg:text-lg">
              <label htmlFor="dewa-enabled" className="cursor-pointer">
                DEWA
              </label>
            </CardTitle>
          </div>
        </CardHeader>
        {data.dewa.enabled && (
          <CardContent className="space-y-4 px-4">
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <Info className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <p className="mb-1 font-medium">What is DEWA?</p>
                  <p className="text-muted-foreground">
                    DEWA is Dubai&apos;s sole provider of electricity and water. All residents must register for DEWA
                    connection to activate utilities in their new home.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dewa-deposit" className="flex items-center gap-2">
                  Security Deposit (AED)
                  <div className="group relative">
                    <Shield className="text-muted-foreground h-4 w-4" />
                    <div className="bg-popover text-popover-foreground absolute top-5 left-0 z-10 hidden w-48 rounded border p-2 text-xs shadow-lg group-hover:block">
                      Refundable upon moving out
                    </div>
                  </div>
                </Label>
                <Input
                  id="dewa-deposit"
                  type="number"
                  value={data.dewa.deposit || ''}
                  onChange={(e) =>
                    onChange({
                      dewa: { ...data.dewa, deposit: Number(e.target.value) },
                    })
                  }
                />
                <p className="text-muted-foreground text-xs">Flat: AED 2,000 | Villa: AED 4,000 (fully refundable)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dewa-monthly">Monthly Usage Estimate (AED)</Label>
                <Input
                  id="dewa-monthly"
                  type="number"
                  value={data.dewa.monthlyUsage || ''}
                  onChange={(e) =>
                    onChange({
                      dewa: {
                        ...data.dewa,
                        monthlyUsage: Number(e.target.value),
                      },
                    })
                  }
                />
                <p className="text-muted-foreground text-xs">Typical: 400-800 AED/month (varies by usage)</p>
              </div>
            </div>

            {onSponsorshipChange && data.dewa.deposit > 0 && (
              <div className="flex flex-col items-center justify-between gap-2 rounded-lg border bg-blue-50 p-3 md:flex-row dark:border-blue-800 dark:bg-blue-900">
                <span className="text-sm font-medium">Split DEWA deposit payment?</span>
                <SplitButton
                  amount={data.dewa.deposit}
                  currentRule={sponsorship?.dewaDeposit}
                  onChange={(rule) => {
                    onSponsorshipChange({
                      enabled: !!rule || sponsorship?.enabled || false,
                      dewaDeposit: rule,
                    })
                  }}
                  label="DEWA Deposit"
                />
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* District Cooling */}
      <Card className="gap-4 pt-4 pb-2">
        <CardHeader className="px-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cooling-enabled"
              checked={data.districtCooling.enabled}
              onCheckedChange={(checked) =>
                onChange({
                  districtCooling: {
                    ...data.districtCooling,
                    enabled: !!checked,
                  },
                })
              }
            />
            <CardTitle className="text-sm md:text-base lg:text-lg">
              <label htmlFor="cooling-enabled" className="cursor-pointer">
                District Cooling
              </label>
            </CardTitle>
          </div>
        </CardHeader>
        {data.districtCooling.enabled && (
          <CardContent className="space-y-4 px-4">
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <Info className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <p className="mb-1 font-medium">What is District Cooling?</p>
                  <p className="text-muted-foreground">
                    District cooling is a centralized AC system used in many modern Dubai developments. Major providers
                    include Empower. Only required if your building uses this system instead of individual AC units.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cooling-deposit" className="flex items-center gap-2">
                  Connection Charge (AED)
                  <div className="group relative">
                    <Info className="text-muted-foreground h-4 w-4" />
                    <div className="bg-popover text-popover-foreground absolute top-5 left-0 z-10 hidden w-48 rounded border p-2 text-xs shadow-lg group-hover:block">
                      One-time charge, generally non-refundable
                    </div>
                  </div>
                </Label>
                <Input
                  id="cooling-deposit"
                  type="number"
                  value={data.districtCooling.deposit || ''}
                  onChange={(e) =>
                    onChange({
                      districtCooling: {
                        ...data.districtCooling,
                        deposit: Number(e.target.value),
                      },
                    })
                  }
                />
                <p className="text-muted-foreground text-xs">Varies by building/provider (typically AED 1,000-3,000)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cooling-monthly">Monthly Amount (AED)</Label>
                <Input
                  id="cooling-monthly"
                  type="number"
                  value={data.districtCooling.monthlyAmount || ''}
                  onChange={(e) =>
                    onChange({
                      districtCooling: {
                        ...data.districtCooling,
                        monthlyAmount: Number(e.target.value),
                      },
                    })
                  }
                />
                <p className="text-muted-foreground text-xs">
                  Based on usage + demand charges (AED 750/RT annually + consumption)
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Internet */}
      <Card className="gap-4 pt-4 pb-2">
        <CardHeader className="px-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="internet-enabled"
              checked={data.internet.enabled}
              onCheckedChange={(checked) =>
                onChange({
                  internet: { ...data.internet, enabled: !!checked },
                })
              }
            />
            <CardTitle className="text-sm md:text-base lg:text-lg">
              <label htmlFor="internet-enabled" className="cursor-pointer">
                Home Internet
              </label>
            </CardTitle>
          </div>
        </CardHeader>
        {data.internet.enabled && (
          <CardContent className="space-y-4 px-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="internet-provider">Provider</Label>
                <Select
                  value={data.internet.provider}
                  onValueChange={(value) => {
                    const updates: Partial<UtilitiesData['internet']> = {
                      provider: value,
                    }

                    // Set to expensive range when a specific provider is chosen
                    if (value in INTERNET_PROVIDERS) {
                      const providerKey = value as keyof typeof INTERNET_PROVIDERS
                      updates.monthlyAmount = INTERNET_PROVIDERS[providerKey].max
                    }

                    onChange({
                      internet: { ...data.internet, ...updates },
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="du">{INTERNET_PROVIDERS.du.label}</SelectItem>
                    <SelectItem value="etisalat">{INTERNET_PROVIDERS.etisalat.label}</SelectItem>
                    <SelectItem value="virgin">{INTERNET_PROVIDERS.virgin.label}</SelectItem>
                    <SelectItem value="custom">Custom amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="internet-monthly">Monthly Amount (AED)</Label>
                <Input
                  id="internet-monthly"
                  type="number"
                  value={data.internet.monthlyAmount || ''}
                  onChange={(e) =>
                    onChange({
                      internet: {
                        ...data.internet,
                        monthlyAmount: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Gas */}
      <Card className="gap-4 pt-4 pb-2">
        <CardHeader className="px-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gas-enabled"
              checked={data.gas.enabled}
              onCheckedChange={(checked) =>
                onChange({
                  gas: { ...data.gas, enabled: !!checked },
                })
              }
            />
            <CardTitle className="text-sm md:text-base lg:text-lg">
              <label htmlFor="gas-enabled" className="cursor-pointer">
                Gas (Cooking)
              </label>
            </CardTitle>
          </div>
        </CardHeader>
        {data.gas.enabled && (
          <CardContent className="space-y-4 px-4">
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <Info className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <p className="mb-1 font-medium">Gas Connection Options</p>
                  <p className="text-muted-foreground">
                    Central gas supply (South Energy) or individual gas cylinders. Many apartments include gas in rent
                    or use electric cooking only.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gas-deposit" className="flex items-center gap-2">
                  Security Deposit (AED)
                  <div className="group relative">
                    <Shield className="text-muted-foreground h-4 w-4" />
                    <div className="bg-popover text-popover-foreground absolute top-5 left-0 z-10 hidden w-48 rounded border p-2 text-xs shadow-lg group-hover:block">
                      Refundable upon moving out
                    </div>
                  </div>
                </Label>
                <Input
                  id="gas-deposit"
                  type="number"
                  placeholder="750"
                  value={data.gas.deposit || ''}
                  onChange={(e) =>
                    onChange({
                      gas: { ...data.gas, deposit: Number(e.target.value) },
                    })
                  }
                />
                <p className="text-muted-foreground text-xs">
                  Central gas: AED 750 (refundable) + AED 350 connection fee
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gas-monthly">Monthly Amount (AED)</Label>
                <Input
                  id="gas-monthly"
                  type="number"
                  placeholder="50-150"
                  value={data.gas.monthlyAmount || ''}
                  onChange={(e) =>
                    onChange({
                      gas: {
                        ...data.gas,
                        monthlyAmount: Number(e.target.value),
                      },
                    })
                  }
                />
                <p className="text-muted-foreground text-xs">Usage charges + AED 20/month fixed service charge</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
