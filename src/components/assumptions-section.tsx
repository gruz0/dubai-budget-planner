import { Calendar, DollarSign, Home, Zap } from 'lucide-react'

export function AssumptionsSection() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Our calculations are based on these market assumptions (February 2026)
      </p>

      <div className="grid gap-3">
        <div className="flex items-start gap-2">
          <Calendar className="text-muted-foreground mt-1 h-4 w-4 flex-shrink-0" />
          <div>
            <p className="font-medium">Data Currency:</p>
            <p className="text-muted-foreground">February 2026 market rates and fee structures</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Home className="text-muted-foreground mt-1 h-4 w-4 flex-shrink-0" />
          <div>
            <p className="font-medium">Housing & Real Estate:</p>
            <p className="text-muted-foreground">
              Based on current Dubai rental market, RERA fee structures, and typical broker commissions (2-5%)
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Zap className="text-muted-foreground mt-1 h-4 w-4 flex-shrink-0" />
          <div>
            <p className="font-medium">Utilities & Services:</p>
            <p className="text-muted-foreground">
              DEWA tariffs, district cooling rates, telecom packages, and municipal fees as of 2026
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <DollarSign className="text-muted-foreground mt-1 h-4 w-4 flex-shrink-0" />
          <div>
            <p className="font-medium">Cost Ranges:</p>
            <p className="text-muted-foreground">
              Typical ranges for Dubai market - actual costs may vary significantly based on lifestyle, area, and
              choices
            </p>
          </div>
        </div>
      </div>

      <div className="border-t pt-3">
        <p className="text-muted-foreground text-sm">
          <strong>Important:</strong> These are estimates only. Always verify current rates with DEWA, cooling
          providers, real estate agents, and other service providers before making financial decisions. Not affiliated
          with any UAE government entity.
        </p>
      </div>
    </div>
  )
}
