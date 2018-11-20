/*
 @name: routers/static.js
 @description: 获取资源
 @date: 2018-11-07
*/

const url = require('url')
const path = require('path')
const fs = require('fs')
const express = require('express')
const router = express.Router()

router.get('*', (req, res) => {
  var pathname = url.parse(req.url).pathname
  var filepath = path.join(path.resolve('../blog-fe/dist/static'), pathname)

  fs.stat(filepath, function (err, stats) {  // 获取文件状态
    if (!err && stats.isFile()) {  // 没有出错并且文件存在
      res.writeHead(200)
      fs.createReadStream(filepath).pipe(res)
    } else {   // 出错了或者文件不存在
      res.writeHead(404)
      res.end('404 Not Found')
    }
  })

})

module.exports = router