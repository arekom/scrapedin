const cheerio = require('cheerio');
const logger = require('scrapedin/src/logger')
const scrollToPageBottom = require('./scrollToPageBottom')
const showSelector = '#voyager-feed'

const getActivityInfo = async (page, url) => {
  await page.goto(`${url}/detail/recent-activity/`)
  return await page.waitFor(showSelector)
    .then(async () => {
      await scrollToPageBottom(page)
      const feed = await fetchFeed(page)
      const formattedFeed = format(feed);
      return formattedFeed
    })
    .catch(() => {
      logger.warn(`activity-info`, 'couldnt get activity feed')
      return {}
    })
}

const fetchFeed = async (page) => {
  return await page.waitFor('#voyager-feed .feed-shared-update-v2').then(async () => {
    await page.waitFor('#voyager-feed .feed-shared-update-v2')
    return await page.evaluate(async () => {
      return Array.from(document.querySelectorAll('#voyager-feed .feed-shared-update-v2'), element => element.innerHTML)
    })
  }).catch(() => {
    logger.warn(`activity-feed`, 'selector not found')
    return {}
  })
}

const format = feed => {
  return feed.map(item => {
    const $ = cheerio.load(item);
    const initializer = $(".feed-shared-header").text().replace("this", "").replace("on", "").trim();
    const author = $(".feed-shared-actor__name span").eq(0).text().trim();
    const article_content_link = $('.feed-shared-article__description-container .feed-shared-article__title').text().trim()
    const context = $('.feed-shared-text__text-view').text().trim()
    const hashtags = context.match(/#[\w]+(?=\s|$)/g) || 'no_hashtags_found'
    const liked_by_user = $('.feed-shared-social-actions').html().includes('Unlike')

    return {
      initializer,
      author,
      context,
      hashtags,
      article_content_link,
      liked_by_user
    };
  });
}

module.exports = getActivityInfo