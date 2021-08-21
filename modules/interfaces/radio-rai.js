const he = require('he')

const getAttr = (elm, attr) => (attr === 'text' ? elm.text() : elm.attr(attr))

const selectors = {
  podcast: { title: '.playlistTitleContainer', listPrefix: '.elencoPlaylist' },
  puntate: { title: '.headerProgramma h1', listPrefix: '.archivioPuntate' },
}

const getType = url =>
  url.includes('/archivio/puntate') ? 'puntate' : 'podcast'

module.exports = {
  getTitle: ($, url) => {
    const type = getType(url)
    return getAttr($(selectors[type].title), 'text')
  },
  getList: ($, url) => {
    const type = getType(url)

    return $(`${selectors[type].listPrefix} [data-mediapolis]`)
      .toArray()
      .map(i => ({
        title: `${
          type === 'puntate' ? $(i).find('.canale').text() : ''
        } ${he.decode(getAttr($(i), 'data-title').trim())}`,
        media: he.decode(getAttr($(i), 'data-mediapolis')),
      }))
  },
}
