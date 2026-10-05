import { Info, Shield } from 'lucide-react'
import type { RentData, SponsorshipConfig } from '../lib/budget-calculator'
import { formatNumber } from '../lib/format'
import { clamp } from '../lib/utils'
import { SplitButton } from './split-button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface RentSectionProps {
  data: RentData
  onChange: (data: Partial<RentData>) => void
  sponsorship?: SponsorshipConfig
  onSponsorshipChange?: (updates: Partial<SponsorshipConfig>) => void
}

export function RentSection({ data, onChange, sponsorship, onSponsorshipChange }: RentSectionProps) {
  const securityDepositAmount = Math.round(
    data.securityDeposit.type === 'percentage'
      ? data.annualRent * (data.securityDeposit.value / 100)
      : data.securityDeposit.value,
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="annual-rent">Annual Rent (AED)</Label>
          <Input
            id="annual-rent"
            type="number"
            placeholder="80,000"
            value={data.annualRent || ''}
            onChange={(e) => onChange({ annualRent: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rent-start-date">Rent Start Date</Label>
          <Input
            id="rent-start-date"
            type="date"
            placeholder="2026-01-01"
            value={data.rentStartDate || ''}
            onChange={(e) => onChange({ rentStartDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cheques">Number of Cheques</Label>
          <Select
            value={data.numberOfCheques.toString()}
            onValueChange={(value) => onChange({ numberOfCheques: Number(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 cheque (full year)</SelectItem>
              <SelectItem value="2">2 cheques (6 months each)</SelectItem>
              <SelectItem value="3">3 cheques (4 months each)</SelectItem>
              <SelectItem value="4">4 cheques (3 months each)</SelectItem>
              <SelectItem value="6">6 cheques (2 months each)</SelectItem>
              <SelectItem value="12">12 cheques (monthly)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {onSponsorshipChange && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900">
          <div className="space-y-3">
            <Label htmlFor="sponsor-cheques" className="text-sm font-medium">
              Sponsor Covers Cheques (Optional)
            </Label>
            <p className="text-xs">If your company pays some or all rent cheques, enter how many</p>
            <div className="flex items-center gap-3">
              <Input
                id="sponsor-cheques"
                type="number"
                min={0}
                max={data.numberOfCheques}
                value={sponsorship?.rentChequesFromSponsor || 0}
                onChange={(e) => {
                  const value = clamp(Math.floor(Number(e.target.value)), 0, data.numberOfCheques)
                  onSponsorshipChange({
                    enabled: value > 0 || sponsorship?.enabled || false,
                    rentChequesFromSponsor: value,
                  })
                }}
                className="w-24"
              />
              <span className="text-sm">out of {data.numberOfCheques} cheques</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-medium">
            Security Deposit
            <div className="group relative">
              <Shield className="text-muted-foreground h-4 w-4" />
              <div className="bg-popover text-popover-foreground absolute top-5 left-0 z-10 hidden w-48 rounded border p-2 text-xs shadow-lg group-hover:block">
                Refundable upon moving out (typically 5-10% of annual rent)
              </div>
            </div>
          </Label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <RadioGroup
              value={data.securityDeposit.type}
              onValueChange={(value: 'percentage' | 'fixed') =>
                onChange({
                  securityDeposit: {
                    ...data.securityDeposit,
                    type: value,
                  },
                })
              }
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="deposit-percentage" />
                  <Label htmlFor="deposit-percentage" className="font-medium">
                    Percentage of annual rent
                  </Label>
                </div>

                {data.securityDeposit.type === 'percentage' && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="deposit-percentage-input">Security Deposit (%)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="deposit-percentage-input"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={data.securityDeposit.value || ''}
                        onChange={(e) =>
                          onChange({
                            securityDeposit: {
                              ...data.securityDeposit,
                              value: clamp(Number(e.target.value), 0, 100),
                            },
                          })
                        }
                        className="w-24"
                      />
                      <span className="text-muted-foreground text-sm">%</span>
                      <span className="text-sm font-medium">
                        = AED {formatNumber(data.annualRent * (data.securityDeposit.value / 100) || 0)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="deposit-fixed" />
                  <Label htmlFor="deposit-fixed" className="font-medium">
                    Fixed amount
                  </Label>
                </div>

                {data.securityDeposit.type === 'fixed' && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="deposit-fixed-input">Security Deposit (AED)</Label>
                    <Input
                      id="deposit-fixed-input"
                      type="number"
                      placeholder="5,000"
                      value={data.securityDeposit.value || ''}
                      onChange={(e) =>
                        onChange({
                          securityDeposit: {
                            ...data.securityDeposit,
                            value: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </RadioGroup>

            <div className="bg-muted/50 rounded-lg border p-4">
              <div className="space-y-2">
                <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                  <li>Most landlords require cheques in advance</li>
                  <li>Typical range: 5-10% of annual rent</li>
                  <li>Fully refundable upon lease completion</li>
                  <li>Fewer cheques typically mean higher rent</li>
                  <li>Used to cover potential damages or unpaid rent</li>
                </ul>
              </div>
            </div>
          </div>

          {onSponsorshipChange && securityDepositAmount > 0 && (
            <div className="flex flex-col items-center justify-between gap-2 rounded-lg border bg-blue-50 p-3 md:flex-row dark:border-blue-800 dark:bg-blue-900">
              <span className="text-sm font-medium">Split security deposit payment?</span>
              <SplitButton
                amount={securityDepositAmount}
                currentRule={sponsorship?.securityDeposit}
                onChange={(rule) => {
                  onSponsorshipChange({
                    enabled: !!rule || sponsorship?.enabled || false,
                    securityDeposit: rule,
                  })
                }}
                label="Security Deposit"
              />
            </div>
          )}
        </div>

        {/*}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="area">Area/Community</Label>
            <Input
              id="area"
              placeholder="Dubai Marina, Downtown, etc."
              value={data.area}
              onChange={(e) => onChange({ area: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="building">Building Name (optional)</Label>
            <Input
              id="building"
              placeholder="Building or complex name"
              value={data.building}
              onChange={(e) => onChange({ building: e.target.value })}
            />
          </div>
        </div>
        */}

        {/*}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any special terms, amenities included, etc."
            className="min-h-[80px]"
          />
        </div>
        */}
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-medium">
            EJARI Registration
            <div className="group relative">
              <Info className="text-muted-foreground h-4 w-4" />
              <div className="bg-popover text-popover-foreground absolute top-5 left-0 z-10 hidden w-80 rounded border p-3 text-xs shadow-lg group-hover:block">
                <p className="mb-2 font-medium">EJARI Registration Required</p>
                <p className="mb-2">
                  Mandatory system for registering tenancy contracts in Dubai. All rental agreements must be registered
                  with Dubai Land Department.
                </p>
                <div className="mb-2 space-y-1">
                  <p className="font-medium">What&apos;s included:</p>
                  <ul className="list-inside list-disc space-y-1 text-xs">
                    <li>Official contract registration</li>
                    <li>Digital record creation</li>
                    <li>Legal documentation</li>
                    <li>DEWA connection eligibility</li>
                    <li>Access to government services</li>
                  </ul>
                </div>
                <p className="font-medium text-green-600">💡 Dubai REST app is fastest and cheapest option</p>
              </div>
            </div>
          </Label>
          <RadioGroup
            value={data.ejari.type}
            onValueChange={(value: 'online' | 'centres' | 'offline') =>
              onChange({
                ejari: {
                  type: value,
                },
              })
            }
          >
            <Label
              htmlFor="ejari-online"
              className="flex cursor-pointer items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3 transition-colors hover:bg-green-100"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="online" id="ejari-online" />
                <div>
                  <div className="text-sm font-medium text-green-800">Dubai REST App / Website (Online)</div>
                  <p className="text-xs text-green-600">Most convenient • Cheapest • Recommended</p>
                  <p className="mt-1 text-xs text-green-600">Instant processing • 7 minutes excluding wait time</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-800">AED 120</div>
                <div className="text-xs text-green-600">100+10+10</div>
              </div>
            </Label>

            <Label
              htmlFor="ejari-centres"
              className="bg-muted/20 hover:bg-muted/40 flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="centres" id="ejari-centres" />
                <div>
                  <div className="text-sm font-medium">Real Estate Services Trustee Centers</div>
                  <p className="text-muted-foreground text-xs">In-person registration • Official DLD centers</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    7 minutes excluding wait time • Requires documents
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">AED 215</div>
                <div className="text-muted-foreground text-xs">120+95 service</div>
              </div>
            </Label>

            <Label
              htmlFor="ejari-offline"
              className="bg-muted/20 hover:bg-muted/40 flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="offline" id="ejari-offline" />
                <div>
                  <div className="text-sm font-medium">Typing Centers / Service Providers</div>
                  <p className="text-muted-foreground text-xs">Third-party providers • Most convenient locations</p>
                  <p className="text-muted-foreground mt-1 text-xs">Premium service • Express options available</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">AED 290</div>
                <div className="text-muted-foreground text-xs">220-320 range</div>
              </div>
            </Label>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
