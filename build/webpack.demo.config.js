const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config.js');

module.exports = merge(config, {
  mode: 'none',
  entry: './demo/dev.js',
  output: {
    path: path.resolve(__dirname, '../demo/dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './demo/dev.html',
      inject: true
    })
  ]
});
