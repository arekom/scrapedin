const openPage = require('../openPage')
const scrapSection = require('../scrapSection')
const scrollToPageBottom = require('./scrollToPageBottom')
const contactInfo = require('./contactInfo')
const interestsInfo = require('./interests')
const activityInfo = require('./activity')
const template = require('./profileScraperTemplate')
const cleanProfileData = require('./cleanProfileData')

const logger = require('../logger')

module.exports = async (browser, cookies, url, waitTimeToScrapMs = 0, hasToGetContactInfo = true, puppeteerAuthenticate = undefined) => {
  logger.info('profile', `starting scraping url: ${url}`)

  const page = await openPage({ browser, cookies, url, puppeteerAuthenticate })
  const profilePageIndicatorSelector = '.pv-profile-section'

  await page.waitFor(profilePageIndicatorSelector, { timeout: 500 })
    .catch(() => {
      logger.warn('profile', 'profile selector was not found')
    })

  await scrollToPageBottom(page)

  if (waitTimeToScrapMs) {
    logger.info('profile', `applying 1st delay`)
    await new Promise((resolve) => { setTimeout(() => { resolve() }, waitTimeToScrapMs / 2) })
  }

  if (waitTimeToScrapMs) {
    logger.info('profile', `applying 2nd delay`)
    await new Promise((resolve) => { setTimeout(() => { resolve() }, waitTimeToScrapMs / 2) })
  }

  const interests_results = await interestsInfo(page)
  const interests = {
    groups: interests_results.groups,
    companies: interests_results.companies,
    influencers: interests_results.influencers,
    schools: interests_results.schools
  }
  const contact = await contactInfo(page)
  const [profileAlternative] = await scrapSection(page, template.profileAlternative)
  const [aboutAlternative] = await scrapSection(page, template.aboutAlternative)
  const positions = await scrapSection(page, template.positions)
  const educations = await scrapSection(page, template.educations)
  const [recommendationsCount] = await scrapSection(page, template.recommendationsCount)
  const recommendationsReceived = await scrapSection(page, template.recommendationsReceived)
  const recommendationsGiven = await scrapSection(page, template.recommendationsGiven)
  const skills = await scrapSection(page, template.skills)
  const accomplishments = await scrapSection(page, template.accomplishments)
  const volunteerExperience = await scrapSection(page, template.volunteerExperience)
  const peopleAlsoViewed = await scrapSection(page, template.peopleAlsoViewed)

  const activity = await activityInfo(page, url)

  await page.close()
  logger.info('profile', `finished scraping url: ${url}`)

  const rawProfile = {
    contact,
    profileAlternative,
    aboutAlternative,
    positions,
    educations,
    skills,
    recommendations: {
      givenCount: recommendationsCount ? recommendationsCount.given : "0",
      receivedCount: recommendationsCount ? recommendationsCount.received : "0",
      given: recommendationsReceived,
      received: recommendationsGiven
    },
    accomplishments,
    peopleAlsoViewed,
    volunteerExperience,
    interests,
    activity
  }

  const cleanedProfile = cleanProfileData(rawProfile)
  return cleanedProfile
}
