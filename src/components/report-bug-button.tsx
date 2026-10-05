import { Bug } from 'lucide-react'
import { Button } from './ui/button'

export function ReportBugButton() {
  return (
    <Button asChild className="flex cursor-pointer items-center gap-2" variant="outline">
      <a href="https://forms.gle/XvPnXeYD89zpc83h8" target="_blank" rel="noopener noreferrer nofollow">
        <Bug className="h-4 w-4" />
        <span className="hidden md:block">Report Bug</span>
      </a>
    </Button>
  )
}
