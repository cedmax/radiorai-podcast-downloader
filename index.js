require('colors')
const fetchList = require('./modules/fetch-list')
const downloadMedia = require('./modules/download-media')
const validUrl = require('valid-url')
const getPlatformInterface = require('./modules/get-platform-interface')

const url = process.argv[2]

if (!validUrl.isWebUri(url)) {
  throw new Error('please use a valid URL'.red)
}

const interface = getPlatformInterface(url)

;(async () => {
  const data = await fetchList(url, interface)
  downloadMedia(data, `${__dirname}/downloaded`)
})()
