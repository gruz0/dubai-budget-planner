type AnalyticsEvent = 'budget_calculated' | 'pdf_download_clicked'

declare global {
  interface Window {
    umami?: { track: (event: string) => void }
  }
}

const queuedEvents: AnalyticsEvent[] = []
const UMAMI_WEBSITE_ID = '328e3242-d066-497a-b81c-8cc222dd22ba'
const UMAMI_DOMAIN = 'gruz0.github.io'

function isEnabled() {
  return import.meta.env.PROD && window.location.hostname === UMAMI_DOMAIN
}

export function trackEvent(event: AnalyticsEvent) {
  if (!isEnabled()) return
  if (window.umami) window.umami.track(event)
  else queuedEvents.push(event)
}

export function initAnalytics() {
  if (!isEnabled()) return

  const script = document.createElement('script')
  script.defer = true
  script.src = 'https://cloud.umami.is/script.js'
  script.dataset.websiteId = UMAMI_WEBSITE_ID
  script.dataset.domains = UMAMI_DOMAIN
  script.addEventListener('load', () => {
    for (const event of queuedEvents) window.umami?.track(event)
    queuedEvents.length = 0
  })
  document.head.appendChild(script)
}
