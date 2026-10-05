import { BUDGET_TEMPLATES, type BudgetTemplate } from '../lib/budget-calculator'
import { Button } from './ui/button'

interface QuickStartTemplatesSectionProps {
  onTemplateSelect: (template: BudgetTemplate) => void
}

export function QuickStartTemplatesSection({ onTemplateSelect }: QuickStartTemplatesSectionProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Choose a pre-configured template based on your situation to get started quickly
        </p>
        <div className="grid grid-cols-1 gap-2">
          {BUDGET_TEMPLATES.map((template) => (
            <Button
              key={template.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onTemplateSelect(template)}
              className="flex h-auto cursor-pointer items-center gap-6 px-4 py-2 text-left md:px-6"
            >
              <div className="flex-shrink-0">
                <template.icon className="text-primary h-8 w-8" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-semibold md:text-base">{template.name}</span>
                <span className="text-muted-foreground line-clamp-1 text-sm leading-relaxed text-ellipsis">
                  {template.description}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
