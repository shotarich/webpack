const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

exports = module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'bundle')
  },

  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: './main.html',
      title: 'webpack series blogs',
      filename: 'index.html',
      minify: process.env.NODE_ENV === 'production' ? true : {
        collapseWhitespace: false
      },
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        keyword: '博客，web前端，shotarich'
      }
    })
  ]
}