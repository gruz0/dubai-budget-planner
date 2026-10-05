import { Clock, DollarSign, Lightbulb, ShoppingCart } from 'lucide-react'

export function FoodSavingsHelper() {
  return (
    <div className="bg-card space-y-4 rounded-lg border p-4">
      <div>
        <h4 className="mb-2 flex items-center gap-2 font-medium">
          <Lightbulb className="h-4 w-4" />
          Smart Food Shopping in Dubai
        </h4>
        <p className="text-muted-foreground mb-3 text-sm">
          Practical tips to optimize your food budget without compromising quality.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Shopping Strategy</span>
          </div>
          <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-xs">
            <li>Shop at hypermarkets for bulk items (Carrefour, Lulu)</li>
            <li>Use grocery apps for price comparison</li>
            <li>Take advantage of weekend sales and promotions</li>
            <li>Buy local produce at traditional souks for better prices</li>
          </ul>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Timing & Planning</span>
          </div>
          <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-xs">
            <li>Plan meals weekly to reduce food waste</li>
            <li>Shop during off-peak hours for better selection</li>
            <li>Use loyalty programs and cashback apps</li>
            <li>Batch cook and freeze portions</li>
          </ul>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Cost-Effective Choices</span>
          </div>
          <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-xs">
            <li>Choose Asian and Middle Eastern brands</li>
            <li>Buy seasonal fruits and vegetables</li>
            <li>Consider store brands for basic items</li>
            <li>Limit imported Western products to essentials</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
