const logger = require('../logger')

module.exports = async (page) => {
  const MAX_TIMES_TO_SCROLL = 30
  const TIMEOUT_BETWEEN_SCROLLS = 100
  const PAGE_BOTTOM_SELECTOR_STRING = '#footer-logo'

  for (let i = 0; i < MAX_TIMES_TO_SCROLL; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight))

    const hasReachedEnd = await page.waitForSelector(PAGE_BOTTOM_SELECTOR_STRING, {
      visible: true,
      timeout: TIMEOUT_BETWEEN_SCROLLS
    }).catch(() => {
      process.stdout.write(`scrolling to page bottom (${i + 1} / ${MAX_TIMES_TO_SCROLL}) \r`);
    })

    if (hasReachedEnd) {
      return
    }
  }

  // logger.warn('scrollToPageBottom', 'page bottom not found')
}