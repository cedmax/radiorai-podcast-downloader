const interfaces = {
  'raiplayradio.it': './interfaces/radio-rai',
  '105.net': './interfaces/105',
  'spreaker.com': './interfaces/spreaker',
}

module.exports = url => {
  const intKey = Object.keys(interfaces).find(key => {
    return url.match(key)
  })

  if (intKey) return require(interfaces[intKey])

  throw new Error(
    `Missing interface for this website. Support is only for: ${
      Object.keys(interfaces).join(', ').white
    }.`.bold.red,
  )
}
