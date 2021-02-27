require('colors')
const axios = require('axios')
const FileType = require('file-type')
const fs = require('fs')
const ProgressBar = require('progress')

module.exports = (url, filenameBase) =>
  new Promise(async resolve => {
    const { data, headers } = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    })

    const { ext } = await FileType.fromStream(data)

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

    const filename = `${filenameBase}.${ext}`
    const writer = fs.createWriteStream(filename)
    data.on('data', chunk => progressBar.tick(chunk.length))
    data.pipe(writer)
    data.on('end', () => {
      progressBar.update(1)
      resolve(filename)
    })
  })
