const { getJson } = require('../utils/get-page')
const getAttr = (elm, attr) => (attr === 'text' ? elm.text() : elm.attr(attr))

const selectors = {
  title: '#show_profile_image',
  list: {
    link: '[data-playlist_url]',
  },
}

const getList = async ($, url) => {
  const apiBase = $(selectors.list.link)
    .attr('data-playlist_url')
    .split('/playlist')[0]

  const apiUrl = `${apiBase}?c=en_US&escape=true&include_externals=true&sorting=oldest&page=1&max_per_page=100`

  const {
    response: {
      pager: { results },
    },
  } = await getJson(apiUrl)

  const list = results.map(({ title, download_url: media }) => ({
    title: title.toLowerCase(),
    media,
  }))
  return list
}

module.exports = {
  getTitle: $ => getAttr($(selectors.title), 'alt'),
  getList: async ($, url) => {
    const list = await getList($, url)
    return list
  },
}
