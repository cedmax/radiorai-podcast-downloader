require('colors')
const axios = require('axios')
const FileType = require('file-type')
const fs = require('fs')
const ProgressBar = require('progress')
const https = require('https')

module.exports = (url, filenameBase) =>
  new Promise(async resolve => {
    const CancelToken = axios.CancelToken
    let cancel
    const { data, headers } = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      httpsAgent: new https.Agent({ keepAlive: true }),
      cancelToken: new CancelToken(function executor(c) {
        cancel = c
      }),
    })

    const { ext } = await FileType.fromStream(data)

    const filename = `${filenameBase}.${ext}`
    if (fs.existsSync(filename)) {
      cancel()
      return resolve(filename)
    }

    const totalLength = headers['content-length']
    console.log(' Starting download')
    const progressBar = new ProgressBar(
      ' -> downloading [:bar] :percent :etas'.green.dim,
      {
        width: 40,
        complete: '=',
        incomplete: ' ',
        renderThrottle: 1,
        total: parseInt(totalLength),
      },
    )

    const filenamePart = `${filename}.part`
    const writer = fs.createWriteStream(filenamePart)
    data.on('data', chunk => progressBar.tick(chunk.length))
    data.pipe(writer)
    data.on('end', () => {
      progressBar.update(1)
      fs.renameSync(filenamePart, filename)
      resolve(filename)
    })
  })
