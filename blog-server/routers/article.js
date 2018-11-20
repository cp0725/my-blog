/*
 @name: routers/article.js
 @description: 文章模块相关路由
 @date: 2018-9-21
*/
const express = require('express')
const squareCtrl = require('../control/article-ctrl')
const router = express.Router()

/*
 *  $router POST article/pushArticleData
 *  @desc   发布文章
 */
router.post('/pushArticleData', (req, res) => {
  squareCtrl.pushArticleData(req.body, req.headers.authorization)
    .then(returnData => {
      res.json(returnData)
    })
    .catch(returnData => {
      res.json(returnData)
    })
})

/*
 *  $router post article/getArticleData
 *  @desc   获取文章列表
 */
router.post('/getArticleData', (req, res) => {
  squareCtrl.getArticleData(req.body)
    .then(returnData => {
      res.json(returnData)
    })
    .catch(returnData => {
      res.json(returnData)
    })
})

/*  $router post article/articleLikes
 *  @desc   文章点赞
 */
router.post('/articleLikes', (req, res) => {
  squareCtrl.articleLikes(req.body, req.headers.authorization)
    .then(returnData => {
      res.json(returnData)
    })
    .catch(returnData => {
      res.json(returnData)
    })
})

/*  $router post article/getArticleInfo
 *  @desc   获取文章详情
 */
router.post('/getArticleInfo', (req, res) => {
  squareCtrl.getArticleInfo(req.body)
    .then(returnData => {
      res.json(returnData)
    })
    .catch(returnData => {
      res.json(returnData)
    })
})


module.exports = router