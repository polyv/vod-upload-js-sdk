const merge = require('webpack-merge');
const prodConfig = require('./webpack.prod.config.js');

module.exports = merge(prodConfig, {
  mode: 'production',
  devtool: false,
  entry: ['./src/index.js'],
  output: {
    filename: 'vod-upload-js-sdk.min.js',
    library: 'PlvVideoUpload',
    libraryTarget: 'umd',
    libraryExport: 'default'
  }
});
