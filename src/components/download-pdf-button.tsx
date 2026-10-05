import { Download } from 'lucide-react'
import { trackEvent } from '../analytics'
import { type BudgetData, calculateBudget } from '../lib/budget-calculator'
import { generatePrintHTML } from '../lib/print-report'
import { Button } from './ui/button'

export function DownloadPdfButton({ budgetData }: { budgetData: BudgetData }) {
  function handlePdfDownload() {
    trackEvent('pdf_download_clicked')

    const htmlContent = generatePrintHTML(budgetData, calculateBudget(budgetData))

    // Open in new window for printing using blob URL (modern approach)
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const blobUrl = URL.createObjectURL(blob)
    const printWindow = window.open(blobUrl, '_blank')
    if (printWindow) {
      printWindow.focus()
      // Clean up blob URL after a delay to allow window to load
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
    } else {
      URL.revokeObjectURL(blobUrl)
      alert('Please allow popups to generate the print report')
    }
  }

  return (
    <Button onClick={handlePdfDownload} className="flex cursor-pointer items-center gap-2" variant="default">
      <Download className="h-4 w-4" />
      <span className="hidden md:block">PDF</span>
    </Button>
  )
}
