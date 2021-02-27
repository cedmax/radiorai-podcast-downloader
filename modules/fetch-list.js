const axios = require('axios')
const cheerio = require('cheerio')
const he = require('he')

const getAttr = (elm, attr) => (attr === 'text' ? elm.text() : elm.attr(attr))

const getTitle = ($, { selector, attribute }) => getAttr($(selector), attribute)

const getList = ($, { selector, attributes: { media, title } }, type) =>
  $(selector)
    .toArray()
    .map(i => ({
      title: `${
        type === 'puntate' ? $(i).find('.canale').text() : ''
      } ${he.decode(getAttr($(i), title).trim())}`,
      media: he.decode(getAttr($(i), media)),
    }))

module.exports = async ({ url, list, title, type }) => {
  const { data } = await axios(url)
  const $ = cheerio.load(data)

  return { title: getTitle($, title), list: getList($, list, type) }
}
