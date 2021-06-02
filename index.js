require('colors')
const fetchList = require('./modules/fetch-list')
const downloadMedia = require('./modules/download-media')
const validUrl = require('valid-url')
const radioRai = require('./modules/radio-rai')

const url = process.argv[2]

if (!validUrl.isWebUri(url)) {
  throw new Error('please use a valid URL'.red)
}

;(async () => {
  const data = await fetchList(url, radioRai)
  downloadMedia(data, `${__dirname}/downloaded`)
})()
