import { Toaster } from 'sonner'
import { BudgetPlannerForm } from './components/budget-planner-form'
import { ThemeToggle } from './components/theme-toggle'
import { AUTHOR_URL, REPOSITORY_URL } from './lib/site'
import { useTheme } from './theme'

export default function App() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto max-w-screen-2xl flex-1 px-4 py-8 md:py-12 lg:py-16">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Dubai Move-in Cost & Budget Planner</h1>
            <p className="text-muted-foreground mx-auto max-w-3xl text-base lg:text-lg">
              A free tool that estimates up-front and monthly living costs for people moving to Dubai. Includes
              deposits, broker fee, rent cheques, DEWA, district cooling, transport, food, and other Dubai-specific
              expenses.
            </p>
          </div>

          <BudgetPlannerForm themeToggle={<ThemeToggle theme={theme} onChange={setTheme} />} />
        </div>
      </main>

      <footer className="text-muted-foreground border-t px-4 py-6 text-center text-sm">
        <p>
          Built by{' '}
          <a href={AUTHOR_URL} className="text-foreground underline underline-offset-2">
            Alexander Kadyrov
          </a>{' '}
          ·{' '}
          <a href={REPOSITORY_URL} className="text-foreground underline underline-offset-2">
            Source on GitHub
          </a>
        </p>
        <p className="mt-2 text-xs">
          Estimates only, not financial advice. Not affiliated with any UAE government entity.
        </p>
      </footer>

      <Toaster theme={resolvedTheme} />
    </div>
  )
}
