[toc]

上一个系列简单认识了下webpack，我们使用webpack的默认配置打包了一些js文件，但默认的配置肯定是相当弱鸡的。这节介绍一下webpack的自定义配置。



# 使用配置文件

比如我们现在要开发一个图片列表页，那常规的操作是新建index.html，引入css、js文件，然后开撸。那我们就用这种方式在根目录下新建index.html，并新建style目录和js目录并分别新建index.css、index.js文件。那根据我们上节内容，我们需要在index.html中引入打包后的dist目录下的main.js文件，那就引入呗。

假设我们的图片信息是要从服务器端拿过来，那html文件中对图片的插入是无能为力的。于是我们在index.js中引入jquery，使用ajax获取服务端的图片信息。

好，场景就介绍到这里。针对于这个场景现在有几个问题：

- 在index.html总是需要手动引入main.js

- index.html只是个模板文件，我只是将生成的html插入到某个节点中。
- 直接双击index.html文件打开的是本地文件无法请求服务器，因为跨域了。
- ......

现在针对以上问题，我们使用webpack的默认配置是无法解决的。这时候就需要自定义webpack的配置了。那我们调整一下我们的目录，并使用webpack的自定义配置。

新建src目录，我们将源码全部移入到src目录中(包括css和js文件)，将index.html与src在同一级(因为现在index.html承担的是模板的角色，并非我们的源码)。在根目录下(与src同级)新建webpack.config.js(webpack的配置文件)。这时候就可以在配置文件中自由发挥了。



# 从入口开始

犹豫webpack的运行环境是node，因此在写webpack配置的时候遵循的应该是commonjs的规范。配置文件需要导出一个json对象或者一个应该返回对象的函数，一般配置都是用json对象表示这也不难理解。

使用了自定义配置后，你猜猜第一个配置的是什么呢？如果你是webpack的作者，你希望用户给你的配置应该是什么呢？

不错，当然是入口了。webpack打包，你得告诉人从哪里开始啊。所以在导出的对象中应该指定打包的入口。如果不指定，webpack还是回去找当前目录(根目录)的src下的index.js文件。那我们还是老老实实的指定入口文件吧。在导出的对象中使用entry指定打包的入口。

```javascript
module.exports = {
  entry: './src/js/index.js'
}
```

看到这里，如果你是否可以配置多个入口的疑问说明你还是挺有程序员思维的。答案当然是可以配置的，不过在此我不打算做介绍，现在针对的只是上面描述的场景，我们不需要多入口。等到后面再介绍多入口的配置方法。另外，我们先补充一下index.js文件的内容，从服务端获取图片信息，获取成功后生成html内容插入到id为app的div中。上代码：

```javascript
import $ from 'jquery'

$.ajax({
  url: '/getList',
  method: 'get',
  data: 'json',
  success(resp) {
	const html = genHtml(resp)
    $('#app').append(html)
  },
  error(err) {
    console.error(err)
  }
})

function genHtml(data) {
  // ...
}
```

有入口那就得有出口啊，打包好的文件放到哪里去。那这个也可以配置，如果不做配置那webpack也是默认打包在当前目录下创建dist目录再将打包的结果放入其中。那我们在这里就做一个修改，让webpack的打包结果放入我们自定义的目录中。打包后的目录使用output做配置，需要注意的是，与入口不同，出口需要的是绝对路径的方式。因此我们引入node的路径处理path模块。

```javascript
const path = require('path')

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'bundle')
  }
}
```

到现在为止，命令行输入`npx webpack`我们的项目就已经可以成功打包了，但此时命令行会出现一行警告:

```javascript
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults 
for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

这个警告的大概含义时没有配置当前的运行环境，默认已生产环境为准进行打包。那由此引发的问题将会涉及因到当前运行环境的不同而采取不同的处理方式。比如我们在实际的项目开发中，可能在开发环境下请求服务器的地址是开发地址，而在测试环境下请求的是测试地址，生产类似。那就可以在mode这个字段中设置当前的运行环境而在代码中根据环境做出相应的处理。

既然如此，那在打包的时候就要指定当前的运行环境。目前webpack默认支持的环境有三种：production、development、none。那在打包时就要指定运行环境，我们在package中添加使用npm运行的命令行脚本，这样在每次打包的时候就可以使用npm工具。

在scripts字段中指定dev脚本为启动开发环境，如下:

```javascript
"scripts": {
  "dev": "webpack --mode development"
}
```

现在每次启动打包就可以使用`npm run dev`的方式启动。

# 使用插件-自动引入打包后的文件

index.html作为模板文件，我们更希望在打包后将其也移入bundle目录并自动引入打包后的文件。这时就要借助webpack的插件机制了。plugin机制的目的是解决项目中一些自动化的工作，比如这里用到的自动生成html文件并引入打包后的文件。

这里用到的是`html-webpack-plugin`，使用之前要先安装。废话不多讲，直接上代码：

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'bundle')
  },

  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```

此时直接打包代码就可以看到bundle目录下生成的html文件了，打开可以看到也已经成功引入的main.js。但这种不做配置使用默认配置的生成方式还是弱，比如在很多页面的项目中需要自定义title，有可能要生成多个html文件引入不同的bundle，这时就要对html-webpack-plugin做出配置。

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'bundle')
  },

  plugins: [
    new HtmlWebpackPlugin({
      // 指定模板的位置
      template: './main.html',
      // 指定title
      title: 'webpack series blogs',
      // 生成后的html文件名
      filename: 'index.html',
      // 指定要注入的打包文件，我们这里就只有一个bundle，因此就不指定了
      // chunks: [],

      // 是否压缩
      minify: process.env.NODE_ENV === 'production',
      // 指定meta
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        keyword: '博客，web前端，shotarich'
      }
    })
  ]
}
```

更多配置请移步[这里](https://www.npmjs.com/package/html-webpack-plugin)查看更多。

# 使用dev-server开启开发服务

使用了html-webpack-plugin插件后尽管已经实现了一部分自动化，但还远远不够。每次都要’更改源码 --> webpack打包 --> 运行应用 --> 浏览器查看‘，这样的开发方式还是很影响频率的。

另外在平时的开发中难免要与后端进行ajax形式的接口联调，总是以file的协议形式访问总会产生一些问题，此时我们难免要开个本地服务进行一些调试。

还有我们每次修改源码后都要重新打包编译，然后重新刷新浏览器查看最新效果，这与webpack要实现的自动化开发的设计初衷显然背道而驰。

针对以上问题，devServe对其都有了解决方案。devServe提供了一个很好的本地开发服务，不仅可以实现自动打包构建的功能，还可以设置反向代理从而避免后端设置跨域允许访问的服务。webpack-dev-server是一个独立的npm模块，在使用之前要先安装。

上代码：

```javascript
module.exoprts = {
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

      // 或者
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
}
```

这时再次更改package.json的dev脚本为:

```javascript
"scripts": {
  "dev": "webpack-dev-server --mode development"
}
```

执行脚本npm run dev将启动本地开发服务。至此，以上列出的三个问题都已经解决。执行脚本后可以发现，磁盘中并没有dundle目录，这是因为webpack-dev-server实在内存中打包构建并读取这些文件，这样一来就会避免很多不必要的读写磁盘操作，大大提高整体的构建效率。

# 总结

本系列次节通过一个图片列表的项目介绍了webpack的配置文件，使用了html-webpack-plugin插件实现自动注入bundle文件，另外还可根据不同需求配置相应的option得到应有的期望。webpack-dev-server工具启动本地服务实现更好的调试，另外可以打开watch模式实现更改源码而自动刷新页面的功能。