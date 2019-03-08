const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');


module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                loose: true,
                modules: 'commonjs'
              }]
            ],
            plugins: [
              // Stage 3
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-syntax-import-meta',
              ['@babel/plugin-proposal-class-properties', { loose: false }],
              '@babel/plugin-proposal-json-strings'
            ]
          }
        }
      },
      {
        test: /\.m?js$/,
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ],
        loader: 'eslint-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new StyleLintPlugin({
      files: [
        '**/*.css',
        '**/*.scss'
      ],
      context: path.resolve(__dirname, '../src')
    })
  ]
};
