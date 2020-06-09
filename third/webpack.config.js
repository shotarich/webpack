const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

exports = module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'bundle')
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
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
      '/api': {
        target: 'http://localhost:3000',
          
        // path重定向，path从头匹配到/api替换为空
      	// 请求 /api/user将代理到 http://localhost:3000/user
        pathRewrite: {
          '^/api': ''
        },
        // 默认代理服务器会以我们实际在浏览器中请求的主机名，也就是localhost:8080 作为代理
        // 请求中的主机名。而一般服务器需要根据请求的主机名判断是哪个网站的请求，
        // 那localhost:8080 这个主机名可能对于某些服务器无法正常请求
        // changeOrigin设置为true后,请求这个地址的主机名是什么，实际请求GitHub 时就会设置成什么
        changeOrigin: true
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