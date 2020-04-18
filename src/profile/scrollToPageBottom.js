const logger = require('../logger')

module.exports = async (page) => {
  const MAX_TIMES_TO_SCROLL = 10

  for (let i = 0; i < MAX_TIMES_TO_SCROLL; i++) {
    await page.evaluate(() => document.querySelector('body').scrollIntoView(false))
  }
}
