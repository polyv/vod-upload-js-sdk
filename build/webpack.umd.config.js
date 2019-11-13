const merge = require('webpack-merge');
const prodConfig = require('./webpack.prod.config.js');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(prodConfig, {
  mode: 'production',
  devtool: false,
  entry: ['./src/index.js'],
  output: {
    filename: 'vod-upload-js-sdk.min.js',
    library: 'PlvVideoUpload',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  // plugins: [
  //   new BundleAnalyzerPlugin()
  // ]
});
