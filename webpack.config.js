require('dotenv').config();
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

require('es6-promise').polyfill();

const webpackConfig = {
  mode: process.env.MODE === 'development' ? 'development' : 'production',
  output: {
    filename: 'vlibras-plugin.js',
    // libraryExport: 'default',
    library: 'VLibras',
    libraryTarget: 'window',
    publicPath: process.env['ROOT_PATH__' + `${process.env.MODE}`.toUpperCase()],
  },
  resolve: {
    modules: [
      path.join(__dirname, 'plugin'),
      'node_modules',
    ],

    alias: {
      '~utils': path.resolve(__dirname, 'plugin/utils'),
      '~icons': path.resolve(__dirname, 'plugin/assets/icons'),
    }
  },
  externals: {
    window: 'window',
  },
  module: {
    rules: [
      {
        test: /\.s?css/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.html/,
        loader: 'raw-loader',
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ],
  },
  plugins: [new CompressionPlugin()],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
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


const pluginWebpackConfig = {
  entry: {
    plugin: './plugin/index.js',
  },
  ...webpackConfig,
};

const widgetWebpackConfig = {
  entry: {
    widget: './widget/src/index.js',
  },
  ...webpackConfig,
};

module.exports = {
  pluginWebpackConfig,
  widgetWebpackConfig,
};
