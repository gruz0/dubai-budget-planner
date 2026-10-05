import { Monitor, Moon, Sun } from 'lucide-react'
import type { Theme } from '../theme'
import { Button } from './ui/button'
import { Label } from './ui/label'

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
]

export function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium md:text-base">Theme</Label>
      <p className="text-muted-foreground text-sm">Choose how the planner looks.</p>
      <div className="flex gap-2">
        {options.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            type="button"
            variant={theme === value ? 'default' : 'outline'}
            size="sm"
            aria-pressed={theme === value}
            onClick={() => onChange(value)}
            className="flex-1 sm:flex-none"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}
