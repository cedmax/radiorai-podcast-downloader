require('colors')
const fetchList = require('./modules/fetch-list')
const config = require('./.downloadrc')
const downloadMedia = require('./modules/download-media')
const validUrl = require('valid-url')

const url = process.argv[2]

if (!validUrl.isWebUri(url)) {
  throw new Error('please use a valid URL'.red)
}

;(async () => {
  const type = url.includes('/archivio/puntate') ? 'puntate' : 'podcast'
  const { title, list } = config(type)

  const data = await fetchList({ url, list, title, type })
  downloadMedia(data, `${__dirname}/downloaded`)
})()
