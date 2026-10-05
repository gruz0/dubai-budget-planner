import { type Browser, chromium, type Locator, type Page } from 'playwright-core'

const address = 'http://127.0.0.1:4173/'
const outputDirectory = 'public/showcase'

type SocialPreviewFormat = {
  fileName: string
  width: number
  height: number
  paddingX: number
  copyWidth: number
  headingSize: number
  descriptionSize: number
  screenWidth: number
  screenHeight: number
  screenRight: number
  screenTop: number
}

const socialPreviewFormats: SocialPreviewFormat[] = [
  {
    fileName: 'social-preview.png',
    width: 1280,
    height: 640,
    paddingX: 74,
    copyWidth: 450,
    headingSize: 58,
    descriptionSize: 19,
    screenWidth: 700,
    screenHeight: 498,
    screenRight: 40,
    screenTop: 71,
  },
  {
    fileName: 'og-image.png',
    width: 1200,
    height: 630,
    paddingX: 68,
    copyWidth: 425,
    headingSize: 54,
    descriptionSize: 18,
    screenWidth: 650,
    screenHeight: 462,
    screenRight: 34,
    screenTop: 84,
  },
]

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(address)
      if (response.ok) return
    } catch {
      // The development server is still starting.
    }
    await Bun.sleep(100)
  }
  throw new Error(`Dubai Budget Planner did not start at ${address}`)
}

async function openTemplate(page: Page, templateId: string) {
  await page.goto(`${address}?template=${templateId}`, { waitUntil: 'networkidle' })
  await page.addStyleTag({
    content:
      '*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; } [data-sonner-toaster] { display: none !important; }',
  })
}

async function showBudgetInsights(page: Page) {
  await page
    .getByRole('button', { name: /Show Budget Insights/ })
    .first()
    .click()
  await page.getByText('Yearly Calendar').first().waitFor()
}

async function scrollToTop(page: Page, target: Locator) {
  await target.evaluate((element) => element.scrollIntoView({ block: 'start' }))
  await page.evaluate(() => window.scrollBy(0, -32))
}

async function capturePage(page: Page, name: string) {
  await page.screenshot({
    path: `${outputDirectory}/${name}.jpg`,
    type: 'jpeg',
    quality: 91,
    fullPage: false,
  })
}

async function captureSocialPreview(page: Page, format: SocialPreviewFormat) {
  const overview = Buffer.from(await Bun.file(`${outputDirectory}/budget-overview.jpg`).arrayBuffer()).toString(
    'base64',
  )
  await page.setViewportSize({ width: format.width, height: format.height })
  await page.setContent(
    `
    <!doctype html>
    <html>
      <head>
        <style>
          * { box-sizing: border-box; }
          html, body { width: ${format.width}px; height: ${format.height}px; margin: 0; overflow: hidden; }
          body {
            position: relative;
            display: flex;
            align-items: center;
            padding: 70px ${format.paddingX}px;
            color: #171717;
            background:
              radial-gradient(circle at 90% 3%, rgba(126,34,206,.16), transparent 320px),
              radial-gradient(circle at 8% 92%, rgba(37,99,235,.14), transparent 350px),
              #fafafa;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          .copy { position: relative; z-index: 2; width: ${format.copyWidth}px; }
          .brand { display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700; }
          .mark { width: 38px; height: 38px; display: flex; align-items: flex-end; justify-content: center; gap: 3px; padding: 9px; border-radius: 11px; background: #171717; }
          .mark i { width: 5px; border-radius: 1px; background: #fafafa; }
          h1 { margin: 44px 0 20px; font-size: ${format.headingSize}px; font-weight: 750; letter-spacing: -.04em; line-height: 1; }
          p { margin: 0; color: #525252; font-size: ${format.descriptionSize}px; line-height: 1.55; }
          .labels { display: flex; gap: 9px; margin-top: 28px; }
          .labels span { padding: 8px 11px; border: 1px solid #d4d4d4; border-radius: 99px; background: rgba(255,255,255,.7); font-size: 12px; font-weight: 700; }
          .screen { position: absolute; width: ${format.screenWidth}px; height: ${format.screenHeight}px; right: ${format.screenRight}px; top: ${format.screenTop}px; overflow: hidden; border: 1px solid rgba(23,23,23,.16); border-radius: 22px; background: white; box-shadow: 0 30px 80px rgba(23,23,23,.2); transform: rotate(-1.2deg); }
          .screen img { width: ${format.screenWidth}px; display: block; }
        </style>
      </head>
      <body>
        <section class="copy">
          <div class="brand"><span class="mark"><i style="height:9px"></i><i style="height:20px"></i><i style="height:14px"></i></span>Dubai Budget Planner</div>
          <h1>Know the real cost of moving to Dubai.</h1>
          <p>Up-front move-in costs and a monthly budget, calculated privately in your browser.</p>
          <div class="labels"><span>Free and open source</span><span>No sign-up, no server</span></div>
        </section>
        <div class="screen"><img src="data:image/jpeg;base64,${overview}" alt="" /></div>
      </body>
    </html>
  `,
    { waitUntil: 'load' },
  )
  await page.locator('.screen img').evaluate((image: HTMLImageElement) => image.decode())
  await page.screenshot({
    path: `${outputDirectory}/${format.fileName}`,
    type: 'png',
    clip: { x: 0, y: 0, width: format.width, height: format.height },
  })
}

await Bun.$`mkdir -p ${outputDirectory}`

const server = Bun.spawn(['bun', 'run', 'dev', '--', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
  stdout: 'ignore',
  stderr: 'ignore',
})

let browser: Browser | undefined
try {
  await waitForServer()
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox'] })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1024 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()

  await page.goto(address, { waitUntil: 'networkidle' })
  await capturePage(page, 'starting-points')

  await openTemplate(page, 'family-2children')
  await showBudgetInsights(page)
  await scrollToTop(page, page.getByRole('button', { name: 'PDF' }))
  await capturePage(page, 'budget-overview')

  await page.setViewportSize({ width: 1600, height: 1024 })
  await scrollToTop(page, page.getByText('Yearly Calendar').first())
  await capturePage(page, 'yearly-calendar')

  const [report] = await Promise.all([context.waitForEvent('page'), page.getByRole('button', { name: 'PDF' }).click()])
  await report.waitForLoadState()
  await capturePage(report, 'pdf-report')
  await report.close()

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  })
  const mobilePage = await mobile.newPage()
  await openTemplate(mobilePage, 'solo-unfurnished')
  await capturePage(mobilePage, 'mobile-dark')
  await mobile.close()

  for (const format of socialPreviewFormats) {
    await captureSocialPreview(page, format)
  }
  await context.close()
} finally {
  await browser?.close()
  server.kill()
  await server.exited
}

console.log(`Showcase assets written to ${outputDirectory}`)
