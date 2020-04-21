const cheerio = require('cheerio');
const logger = require('scrapedin/src/logger')
const showSelector = 'a[data-control-name=view_interest_details]'

const getInterestsInfo = async (page) => {
  return await page.waitFor(showSelector)
    .then(async () => {
      const element = await page.$(showSelector)
      await element.click()

      // get influencers
      const influencers = await fetchItems(page, 'influencers')
      const formattedInfluencers = formatInfluencers(influencers)

      // get companies
      const companies = await fetchItems(page, 'companies')
      const formattedCompanies = formatClassic(companies)

      // get groups
      const groups = await fetchItems(page, 'groups')
      const formattedGroups = formatClassic(groups)

      // get schools
      const schools = await fetchItems(page, 'schools')
      const formattedSchools = formatClassic(schools)

      // close modal
      const modal = await page.$('.artdeco-modal__dismiss');
      await modal.click();

      return {
        influencers: formattedInfluencers,
        companies: formattedCompanies,
        groups: formattedGroups,
        schools: formattedSchools
      }
    })
    .catch(() => {
      return {}
    })
}

const fetchItems = async (page, entity) => {
  return await page.waitFor(`#pv-interests-modal__following-${entity}`).then(async () => {
    const element = await page.$(`#pv-interests-modal__following-${entity}`)
    await element.click()
    await page.waitFor('.entity-list-wrapper')
    return await page.evaluate(async () => {
      document.querySelector('.entity-list-wrapper').scrollIntoView(false);
      await new Promise((resolve) => { setTimeout(() => { resolve() }, 100) })
      document.querySelector('.entity-list-wrapper').scrollIntoView(false);
      await new Promise((resolve) => { setTimeout(() => { resolve() }, 100) })
      document.querySelector('.entity-list-wrapper').scrollIntoView(false);
      await new Promise((resolve) => { setTimeout(() => { resolve() }, 100) })
      document.querySelector('.entity-list-wrapper').scrollIntoView(false);
      await new Promise((resolve) => { setTimeout(() => { resolve() }, 100) })
      document.querySelector('.entity-list-wrapper').scrollIntoView(false);
      await new Promise((resolve) => { setTimeout(() => { resolve() }, 100) })
      return Array.from(document.querySelectorAll('.entity-list.row li'), element => element.innerHTML)
    })
  }).catch(() => {
    logger.warn(`interests-info [${entity}]`, 'selector not found')
    return {}
  })
}

const formatClassic = entity => {
  return entity.map(item => {
    const $ = cheerio.load(item);
    return {
      uri: `https://www.linkedin.com/${$(".ember-view .interest-content a").attr("href")}`,
      name: $(".pv-entity__summary-title-text").text(),
      size: $('.pv-entity__follower-count').text()
    };
  });
}

const formatInfluencers = entity => {
  return entity.map(item => {
    const $ = cheerio.load(item);
    return {
      uri: `https://www.linkedin.com${$(".ember-view .interest-content a").attr(
        "href"
      )}`,
      name: $(".pv-entity__summary-title-text").text(),
      occupation: $('.pv-entity__occupation').text(),
      following: $(".pv-entity__follower-count").text()
    };
  });
}

module.exports = getInterestsInfo