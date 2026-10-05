export function FitnessOptionsHelper() {
  return (
    <div className="space-y-3">
      <h4 className="font-medium">🏋️ Fitness Options</h4>
      <ul className="space-y-2 text-sm">
        <li className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-2">
          <span className="text-muted-foreground">Budget:</span>
          <span className="font-medium">Local gyms (200-400 AED)</span>
        </li>
        <li className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-2">
          <span className="text-muted-foreground">Mid-range:</span>
          <span className="font-medium">Fitness First (400-600 AED)</span>
        </li>
        <li className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-2">
          <span className="text-muted-foreground">Premium:</span>
          <span className="font-medium">1Rebel, Barry&apos;s (600-800+ AED)</span>
        </li>
        <li className="text-muted-foreground mt-2 text-xs">Outdoor: Beach gyms, running tracks (free)</li>
      </ul>
    </div>
  )
}
