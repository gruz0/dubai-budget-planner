import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

export function AdPlacementSection() {
  return (
    <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900 lg:text-lg dark:text-gray-100">
              Get Your Business Featured
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              People use this calculator while they plan their move to Dubai. Your business could be featured right
              here, at the moment they are budgeting for it.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700" asChild>
              <a href="https://cal.com/alexkadyrov/startups" target="_blank" rel="noopener noreferrer nofollow">
                Book a quick call
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="mailto:kadyrov.dev@gmail.com?subject=Partnership Opportunity - Dubai Budget Planner"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Send an email
              </a>
            </Button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Perfect for real estate agents, moving services, utility providers, and Dubai business services
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
