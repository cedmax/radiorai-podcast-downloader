const he = require('he')

const getAttr = (elm, attr) => (attr === 'text' ? elm.text() : elm.attr(attr))

const selectors = {
  podcast: { title: '.playlistTitleContainer', listPrefix: '.elencoPlaylist' },
  puntate: { title: '.headerProgramma h1', listPrefix: '.archivioPuntate' },
}

const getConfig = url => {
  const type = url.includes('/archivio/puntate') ? 'puntate' : 'podcast'

  return {
    title: {
      selector: selectors[type].title,
      attribute: 'text',
    },
    list: {
      selector: `${selectors[type].listPrefix} [data-mediapolis]`,
      attributes: {
        media: 'data-mediapolis',
        title: 'data-title',
      },
    },
    type,
    url,
  }
}

module.exports = {
  getConfig,
  getTitle: ($, { selector, attribute }) => getAttr($(selector), attribute),
  getList: ($, { selector, attributes: { media, title } }, type) =>
    $(selector)
      .toArray()
      .map(i => ({
        title: `${
          type === 'puntate' ? $(i).find('.canale').text() : ''
        } ${he.decode(getAttr($(i), title).trim())}`,
        media: he.decode(getAttr($(i), media)),
      })),
}
