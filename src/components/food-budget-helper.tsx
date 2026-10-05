import { Calculator, TrendingDown, TrendingUp } from 'lucide-react'

export function FoodBudgetHelper() {
  return (
    <div className="bg-card space-y-4 rounded-lg border p-4">
      <div>
        <h4 className="mb-2 flex items-center gap-2 font-medium">
          <Calculator className="h-4 w-4" />
          Food Budget Breakdown
        </h4>
        <p className="text-muted-foreground mb-3 text-sm">
          Plan your monthly food expenses based on lifestyle and preferences.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Budget-Conscious (1,200-1,800 AED)</span>
          </div>
          <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-xs">
            <li>Home cooking 90% of meals</li>
            <li>Local and Asian grocery brands</li>
            <li>Bulk buying and meal planning</li>
            <li>Eating out 2-3 times per month</li>
          </ul>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Calculator className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Balanced Lifestyle (1,800-2,800 AED)</span>
          </div>
          <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-xs">
            <li>Mix of home cooking and dining out</li>
            <li>Combination of local and imported products</li>
            <li>Weekly restaurant visits</li>
            <li>Some premium ingredients and brands</li>
          </ul>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Premium Lifestyle (2,800-4,500+ AED)</span>
          </div>
          <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-xs">
            <li>Frequent dining at quality restaurants</li>
            <li>Premium and organic products</li>
            <li>International cuisine and specialty items</li>
            <li>Food delivery and convenience services</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
