const selectors = {
  podcast: { title: '.playlistTitleContainer', listPrefix: '.elencoPlaylist' },
  puntate: { title: '.headerProgramma h1', listPrefix: '.archivioPuntate' },
}

module.exports = type => ({
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
})
