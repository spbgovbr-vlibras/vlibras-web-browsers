require('dotenv').config();

const mode = process.env.MODE;
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const constants = require(`./plugin/constants/${mode}-paths`);

const webpackConfig = {
  mode: mode === 'development' ? 'development' : 'production',
  output: {
    filename: 'vlibras-plugin.js',
    chunkFilename: 'vlibras-plugin.chunk.js',
    library: 'VLibras',
    libraryTarget: 'window',
    publicPath: constants.ROOT_PATH,
  },
  resolve: {
    modules: [path.join(__dirname, 'plugin'), 'node_modules'],
    alias: {
      '~utils': path.resolve(__dirname, 'plugin/utils'),
      '~icons': path.resolve(__dirname, 'plugin/assets/icons'),
      '~constants': path.resolve(__dirname, `plugin/constants/${mode}-paths`),
    },
    fallback: {
      path: require.resolve('path-browserify'),
      events: require.resolve('events/'),
    },
  },
  externals: {
    window: 'window',
  },
  module: {
    rules: [
      {
        test: /\.s?css/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.html/,
        loader: 'raw-loader',
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
    ],
  },
  plugins: [
    new CompressionPlugin(),
    new webpack.ProvidePlugin({ '~constants': '~constants' }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 2 }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: true,
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
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

module.exports = { pluginWebpackConfig, widgetWebpackConfig };
