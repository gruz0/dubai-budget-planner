import { Users } from 'lucide-react'
import { useState } from 'react'
import type { BudgetTemplate } from '../lib/budget-calculator'
import { QuickStartTemplatesSection } from './quick-start-templates-section'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

interface QuickStartTemplatesDialogProps {
  onTemplateSelect: (template: BudgetTemplate) => void
}

export function QuickStartTemplatesDialog({ onTemplateSelect }: QuickStartTemplatesDialogProps) {
  const [open, setOpen] = useState(false)

  const handleTemplateSelect = (template: BudgetTemplate) => {
    onTemplateSelect(template)
    // Close dialog after template selection
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Users className="h-4 w-4" />
          <span className="hidden md:block">Templates</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Templates
          </DialogTitle>
        </DialogHeader>
        <div>
          <QuickStartTemplatesSection onTemplateSelect={handleTemplateSelect} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
