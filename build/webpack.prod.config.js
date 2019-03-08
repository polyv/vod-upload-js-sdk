const merge = require('webpack-merge');
const config = require('./webpack.config.js');

module.exports = merge(config, {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    libraryTarget: 'commonjs2'
  }
});
