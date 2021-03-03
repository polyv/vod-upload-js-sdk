const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config.js');
const md5 = require('md5');

// TODO
const accountData = {
  userid: 'your userid',
  secretkey: 'your secretkey',
  writeToken: 'your writeToken',
};

const subAccountData = {
  appId: 'your appId',
  secretkey: 'your secretkey',
};

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

        const timestamp = Date.now();
        if (req.query.isSubAccount === 'Y') {
          const { secretkey, appId } = subAccountData;
          const sign = md5(`${secretkey}appId${appId}timestamp${timestamp}${secretkey}`).toUpperCase();

          res.send({
            appId,
            timestamp,
            sign,
          });
        } else {
          const { userid, writeToken, secretkey } = accountData;
          const hash = md5(timestamp + writeToken);
          const sign = md5(secretkey + timestamp);
          res.send({
            timestamp,
            hash,
            sign,
            userid,
          });
        }
      });
    }
  }
});
