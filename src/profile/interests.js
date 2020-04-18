const cheerio = require('cheerio');

const logger = require('scrapedin/src/logger')

const showSelector = 'a[data-control-name=view_interest_details]'

const getInterestsInfo = async (page) => {
  await page.waitFor(showSelector, { timeout: 500 })
    .then(async () => {
      const element = await page.$(showSelector)
      await element.click()
      await page.waitFor('#pv-interests-modal__following-groups')
      const groups_element = await page.$('#pv-interests-modal__following-groups')
      await groups_element.click();
      await page.waitFor('.entity-list-wrapper')
      // await new Promise((resolve) => { setTimeout(() => { resolve() }, 1000) })
      const groups = await page.evaluate(async () => {
        document.querySelector('.entity-list-wrapper').scrollIntoView(false);
        await new Promise((resolve) => { setTimeout(() => { resolve() }, 300) })
        document.querySelector('.entity-list-wrapper').scrollIntoView(false);
        await new Promise((resolve) => { setTimeout(() => { resolve() }, 300) })
        document.querySelector('.entity-list-wrapper').scrollIntoView(false);
        await new Promise((resolve) => { setTimeout(() => { resolve() }, 300) })
        document.querySelector('.entity-list-wrapper').scrollIntoView(false);
        await new Promise((resolve) => { setTimeout(() => { resolve() }, 300) })
        document.querySelector('.entity-list-wrapper').scrollIntoView(false);
        await new Promise((resolve) => { setTimeout(() => { resolve() }, 300) })
        return Array.from(document.querySelectorAll('.entity-list.row li'), element => element.innerHTML)
      })

      const formattedGroups = groups.map(item => {
        const $ = cheerio.load(item);
        return {
          uri: `https://www.linkedin.com/${$(".ember-view .interest-content a").attr(
            "href"
          )}`,
          name: $(".pv-entity__summary-title-text").text(),
          size: $('.pv-entity__follower-count').text()
        };
      });

      const modal = await page.$('.artdeco-modal__dismiss');
      await modal.click();

      return formattedGroups
    })
    .catch(() => {
      logger.warn('interests-info', 'selector not found')
      return {}
    })
}

module.exports = getInterestsInfo