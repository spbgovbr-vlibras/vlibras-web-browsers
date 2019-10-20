var path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin')

require('es6-promise').polyfill();

module.exports = {
  mode: process.env.MODE || 'development',
  output: {
    filename: 'vlibras-plugin.js'
  },
  resolve: {
    modules: [
      path.join(__dirname, 'plugin'),
      'node_modules'
    ]
  },
  externals: {
    'window': 'window'
  },
  module: {
    rules: [
      {
        test: /\.s?css/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.html/,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [ new CompressionPlugin()],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
        extractComments: true,
      }),
    ],
  },
};
