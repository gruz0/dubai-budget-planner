export function MobilePlansHelper() {
  return (
    <div className="space-y-3">
      <h4 className="font-medium">📱 Mobile Plans</h4>
      <ul className="space-y-2 text-sm">
        <li className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-2">
          <span className="text-muted-foreground">Etisalat:</span>
          <span className="font-medium">100-400 AED/month</span>
        </li>
        <li className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-2">
          <span className="text-muted-foreground">du:</span>
          <span className="font-medium">90-350 AED/month</span>
        </li>
        <li className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-2">
          <span className="text-muted-foreground">Virgin Mobile:</span>
          <span className="font-medium">80-250 AED/month</span>
        </li>
        <li className="text-muted-foreground mt-2 text-xs">Include generous data + international minutes</li>
      </ul>
    </div>
  )
}
