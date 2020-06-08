const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

exports = module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'bundle')
  },

  devServer: {
    // 指定本地服务从哪里获取静态资源，默认为当前目录（webpack的工作目录）
    contentBase: path.join(__dirname, 'bundle'),
    // 指定端口
    port: 8080,
    // 是否打开浏览器
    open: true,
    // 是否启用https服务
    https: false,
    // 是否启用gzip压缩
    compress: true,
    // 设置反向代理
    proxy: {
      // 请求 /api/user将代理到 http://localhost:3000/api/user
      '/api': 'http://localhost:3000',
      // path重定向，path从头匹配到/api替换为空
      // 请求 /api/user将代理到 http://localhost:3000/user
      pathRewrite: {
        '^/api': ''
      }
    }
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