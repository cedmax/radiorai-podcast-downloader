const { getPage } = require('./utils/get-page')

module.exports = async (url, { getTitle, getList }) => {
  const $ = await getPage(url)
  const title = await getTitle($, url)
  const list = await getList($, url)

  return { title, list }
}
