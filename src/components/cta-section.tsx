import { ArrowRight, Calendar } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function CtaSection() {
  return (
    <Card className="border-border bg-card text-card-foreground gap-4 border shadow-sm">
      <CardHeader className="space-y-2 text-center md:space-y-4">
        <CardTitle className="text-base font-semibold md:text-lg lg:text-xl">Need Custom Platform? 🚀</CardTitle>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          I help businesses and individuals build custom software solutions and automation systems.{' '}
          <br className="hidden md:block" />
          Whether you need a personal dashboard, business automation, or a complete web application - let&apos;s bring
          your ideas to life!
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" className="flex items-center gap-2" asChild>
          <a href="https://cal.com/alexkadyrov/startups" target="_blank" rel="noopener noreferrer nofollow">
            <Calendar className="h-4 w-4" />
            Book a Quick Call
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
