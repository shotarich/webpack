const path = require('path')

exports = module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        // use: 'css-loader'
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.md$/,
        use: './loader/markdown-loader'
      }
    ]
  }
}