const he = require('he')
const { getPage } = require('../utils/get-page')
const getAttr = (elm, attr) => (attr === 'text' ? elm.text() : elm.attr(attr))
const queryString = require('querystring')

const selectors = {
  title: '.intestazione_ricerca_archivio .sezione',
  list: {
    link: '.anteprima_ricerca_archivio .cont_foto a',
  },
  episode: {
    title: '.titolo_articolo',
    media: '.multimedia.audio [itemprop="contentUrl"]',
  },
}

const getList = async (list, $, url) => {
  const pages = $(selectors.list.link)
    .toArray()
    .map(a => getAttr($(a), 'href'))

  if (!pages.length) {
    return list
  }

  for (let i = 0; i < pages.length; i++) {
    const $p = await getPage(pages[i])
    list.push({
      title: getAttr($p(selectors.episode.title), 'text').trim(),
      media: he.decode(getAttr($p(selectors.episode.media), 'content')),
    })
  }

  const [base, query] = url.split('?')
  const q = queryString.parse(query)

  q.page = parseInt(q.page, 10) + 1

  if (q.page > 5) {
    return list
  }

  console.log(`fetching page ${q.page}`.green)
  const nextUrl = base + '?' + queryString.stringify(q)

  const $n = await getPage(base + '?' + nextUrl)
  return await getList(list, $n, nextUrl)
}

module.exports = {
  getTitle: $ => getAttr($(selectors.title), 'text'),
  getList: async ($, url) => {
    const list = await getList([], $, url)
    return list
  },
}
