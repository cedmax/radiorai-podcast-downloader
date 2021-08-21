const axios = require('axios')
const cheerio = require('cheerio')

const { setupCache } = require('axios-cache-adapter')

const cache = setupCache({
  maxAge: 15 * 60 * 1000,
})

const api = axios.create({
  adapter: cache.adapter,
})

module.exports = {
  getPage: async url => {
    const { data } = await api.get(url)
    return cheerio.load(data)
  },
  getJson: async url => {
    const { data } = await api.get(url)
    return data
  },
}
