const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config.js');

module.exports = merge(config, {
  devtool: 'inline-source-map',
  mode: 'development',
  entry: {
    main: './demo/dev.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './demo/dev.html',
      inject: true
    })
  ],
  devServer: {
    host: '0.0.0.0',
    port: 14002,
    compress: true,
    overlay: true,
    proxy: {
    }
  }
});
