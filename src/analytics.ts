type AnalyticsEvent = 'budget_calculated' | 'pdf_download_clicked'

declare global {
  interface Window {
    umami?: { track: (event: string) => void }
  }
}

const queuedEvents: AnalyticsEvent[] = []
// Create a website in Umami for this app and paste its ID here; analytics stays off while it is empty.
const UMAMI_WEBSITE_ID = ''
const UMAMI_DOMAIN = 'gruz0.github.io'

function isEnabled() {
  return import.meta.env.PROD && UMAMI_WEBSITE_ID !== '' && window.location.hostname === UMAMI_DOMAIN
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
