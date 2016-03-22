var path = require('path');

require('es6-promise').polyfill();

module.exports = {
  output: {
    filename: 'vlibras-plugin.js'
  },
  resolve: {
    root: path.join(__dirname, 'plugin')
  },
  externals: {
    'window': 'window'
  },
  module: {
    loaders: [
      { test: /\.s?css/, loaders: ['style', 'css?-url', 'sass'] },
      { test: /\.html/, loaders: ['raw'] }
    ]
  }
}
