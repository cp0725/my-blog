/*
 @name: routers/home.js
 @description: 首页模块相关路由
 @date: 2018-10-13
*/
const express = require('express')
const homeCtrl = require('../control/home-ctrl')
const router = express.Router()

/*
 * $router get home/getMusicList
 * @desc   获取音乐列表接口
*/
router.get('/getMusicList', (req, res) => {
  homeCtrl.getMusicList(req.query)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json(returnData)
  })
})

/*
 * $router get home/getLrc
 * @desc   获取歌词
*/
router.get('/getLrc', (req, res) => {
  homeCtrl.getLrc(req.query)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json(returnData)
  })
})




/*
 * $router post home/getMusicList
 * @desc   评论
*/
router.post('/comment', (req, res) => {
  homeCtrl.comment(req.body, req.headers.authorization)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json(returnData)
  })
})

module.exports = router