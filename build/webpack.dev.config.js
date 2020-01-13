const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config.js');
const tokenData = require('./getToken');

module.exports = merge(config, {
  devtool: 'inline-source-map',
  mode: 'development',
  entry: './demo/dev.js',
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
    before: function(app) {
      app.get('/getToken', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json;charset=utf8');
        res.send(tokenData);
      });
    }
  }
});
