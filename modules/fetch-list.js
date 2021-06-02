const axios = require('axios')
const cheerio = require('cheerio')

module.exports = async (url, { getConfig, getTitle, getList }) => {
  const { list, title, type } = getConfig(url)

  const { data } = await axios(url)
  const $ = cheerio.load(data)

  return { title: getTitle($, title), list: getList($, list, type) }
}
