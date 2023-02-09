const { CheckerPlugin } = require('awesome-typescript-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { optimize } = require('webpack');
const { join } = require('path');
let prodPlugins = [];
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push(
    new optimize.AggressiveMergingPlugin(),
    new optimize.OccurrenceOrderPlugin()
  );
}
module.exports = {
  mode: process.env.NODE_ENV,
  devtool: 'inline-source-map',
  entry: {
    'content-script': './src/content-scripts/content-script.ts',
    background: './src/controller/recording-controller.ts',
    popup: './src/popup/index.js',
    options: './src/options/index.js',
    'services/chrome/chrome-service' : './src/services/chrome/chrome-service.ts',
    'services/file/file-service' : './src/services/file/file-service.ts',
    'services/key-down/key-down-service' : './src/services/key-down/key-down-service.ts',
    'services/polly/polly-service' : './src/services/polly/polly-service.ts',
    'services/selector/selector-service' : './src/services/selector/selector-service.ts',
    'services/storage/storage-service' : './src/services/storage/storage-service.ts',
    'services/window/window-service' : './src/services/window/window-service.ts',
    'services/zip/zip-service' : './src/services/zip/zip-service.ts',
    'lib/scripts/polly/polly' : './lib/scripts/polly/polly-recorder.ts',
    'lib/scripts/fake-time/fake-time' : './lib/scripts/fake-time/fake-time.ts',
    download : './src/download/download.ts'
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/i,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/i,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        exclude: /node_modules/,
        test: /\.ts?$/,
        use: 'awesome-typescript-loader?{configFileName: "tsconfig.json"}',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'sass-loader' // compiles Sass to CSS
          }
        ]
      }
    ],
  },
  plugins: [
    new CheckerPlugin(),
    ...prodPlugins,
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CopyPlugin([
      { from: './src/manifest.json', to: './manifest.json' },
      { from: './assets/images', to: 'assets/images' },
      { from: './lib/scripts/services', to: 'services/scenario/'}
    ]),
    new HtmlWebpackPlugin({
      template: './src/popup/template.html',
      chunks: ['popup']}),
    new HtmlWebpackPlugin({
      template: './src/options/template.html',
      chunks: ['options'],
      filename: 'options.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/download/download.html',
      chunks: ['download'],
      filename: 'download.html'
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      "fs": false,
      util: require.resolve("util/")
    }
  },
};