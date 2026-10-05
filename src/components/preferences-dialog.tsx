import { Settings2 } from 'lucide-react'
import { useState } from 'react'
import { PreferencesSection } from './preferences-section'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

interface PreferencesData {
  displayCurrency: 'AED' | 'USD'
  exchangeRate: number
  ignoreEmptyValues: boolean
  visibleSections: {
    household: boolean
    food: boolean
    extras: boolean
    moving: boolean
  }
}

interface PreferencesDialogProps {
  data: PreferencesData
  onChange: (data: Partial<PreferencesData>) => void
}

export function PreferencesDialog({ data, onChange }: PreferencesDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Settings2 className="h-4 w-4" />
          <span className="hidden md:block">Preferences</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Preferences
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">
          <PreferencesSection data={data} onChange={onChange} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
