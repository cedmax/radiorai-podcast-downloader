require('colors')
const skewered = require('skewered')
const mkdirp = require('mkdirp')
const download = require('./download-file')

module.exports = async ({ title, list }, path) => {
  const folderPath = `${path}/${skewered(title)}`
  await mkdirp(folderPath)

  for (let i = 0; i < list.length; i++) {
    const { title: episodeTitle, media } = list[i]
    console.log(`${title.green} - ${episodeTitle.green}`)
    const filename = await download(
      media,
      `${folderPath}/${skewered(episodeTitle)}`,
    )
    console.log(` ${filename.gray}`)
  }
}
