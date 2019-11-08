const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

require('es6-promise').polyfill();

const webpackConfig = {
  mode: process.env.MODE || 'development',
  output: {
    filename: 'vlibras-plugin.js',
    // libraryExport: 'default',
    library: 'VLibras',
    libraryTarget: 'window',
  },
  resolve: {
    modules: [
      path.join(__dirname, 'plugin'),
      'node_modules',
    ],
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
    ],
  },
  plugins: [new CompressionPlugin()],
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
