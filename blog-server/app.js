/*
 @name: app.js
 @description: 服务端入口
 @date: 2018-8-10
*/
const fs = require('fs')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser') // 解析post请求参数
const KEYS = require('./config/key')
const user = require('./routers/user')
const square = require('./routers/square')
const article = require('./routers/article')
const home = require('./routers/home')
const static = require('./routers/static')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/*
 * 连接 mongoDB
 */
mongoose.connect(KEYS.mongoURI, {useNewUrlParser:true})
        .then(() => console.log('MongoDB Connectd ing ...'))
        .catch( err => console.log(err))

/*
 * 允许跨域
 */
app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  next()
})

/*
 *  $router GET api/profile/experience
 *  @desc   测试
 *  @access public
 */
app.get('/test', (req, res) => {
  res.send('Hello, Word!')
})

// 登陆注册相关
app.use('/user', user)
// 广场模块
app.use('/square', square)
// 文章模块
app.use('/article', article)
// 首页模块
app.use('/home', home)
// 部署后获取资源
app.use('/static', static)

// 客户端访问入口
app.get('/pChang', (req, res) => {
  fs.stat('../blog-fe/dist/index.html', (err, stats) => {
    if (!err && stats.isFile()) {
      res.writeHead(200)
      fs.createReadStream('../blog-fe/dist/index.html').pipe(res)
    } else {
      res.writeHead(404);
      res.end('404 Not Found')
    }
  })
})

// node app.js -p 8080
const port = process.argv[3] || 5240
global.myPort = port
app.listen(port, () => {
  console.log(`server runing on port ${port} ...`)
})


// 提供网易云音乐的数据通过5240访问
require('../wangyi-api/wangyiApi.js')(app)