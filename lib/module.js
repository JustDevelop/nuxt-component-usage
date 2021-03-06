const { resolve } = require('path')

module.exports = async function (moduleOptions) {
  const options = {
    ...this.options['nuxt-component-usage'],
    ...moduleOptions
  }

  await this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-component-usage.js',
    options
  })
}

module.exports.meta = require('../package.json')
