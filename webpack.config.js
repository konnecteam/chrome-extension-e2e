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
    'polly-build/polly' : './src/polly/polly-recorder.ts',
    'scripts/fake-time-script' : './src/scripts/fake-time-script.ts'
/*
    'constants/action-events' : './src/constants/action-events.ts',
    'constants/elements-tagName' : './src/constants/elements-tagName.ts',
    'constants/default-options' : './src/constants/default-options.ts',
    'constants/dom-events-to-record' : './src/constants/dom-events-to-record.ts',
    'constants/pptr-actions' : './src/constants/pptr-actions.ts',
    'constants/code-generate/footer-code' : './src/constants/code-generate/footer-code.ts',
    'constants/code-generate/header-code' : './src/constants/code-generate/header-code.ts',

    'factory/generate-code/scenario-generate-factory' : './src/factory/generate-code/scenario-generate-factory.ts',
    'factory/generate-code/footer-generate-factory' : './src/factory/generate-code/footer-generate-factory.ts',
    'factory/generate-code/header-generate-factory': './src/factory/generate-code/header-generate-factory.ts',
    'code-generator/code-generator' : './src/code-generator/code-generator.ts'
    */
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
    ]),
    new HtmlWebpackPlugin({
      template: './src/popup/template.html',
      chunks: ['popup']}),
    new HtmlWebpackPlugin({
      template: './src/options/template.html',
      chunks: ['options'],
      filename: 'options.html'
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  node : {
    fs : 'empty' // Utile pour pouvoir builder le fichier FileService
  }
};