/*
 @name: routers/square.js
 @description: 广场模块相关路由
 @date: 2018-8-10
*/
const express = require('express')
const squareCtrl = require('../control/square-ctrl')
const router = express.Router()

/*
 *  $router POST square/getLinkTitle
 *  @desc   获取linkTitle
 */
router.post('/getLinkTitle', (req, res) => {
  squareCtrl.getLinkTitle(req.body)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json(returnData)
  })
})

/*
 *  $router post square/getSquareData
 *  @desc   获取热点
 */
router.post('/getSquareData', (req, res) => {
  squareCtrl.getSquareData(req.body)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json(returnData)
  })
})

/*
 *  $router POST square/pushSquareData
 *  @desc   发布热点
 */
router.post('/pushSquareData', (req, res) => {
  squareCtrl.pushSquareData(req.body, req.headers.authorization)
  .then(returnData => {
    console.log(returnData,1)
    res.json(returnData)
  })
  .catch(returnData => {
    console.log(returnData,2)
    res.json(returnData)
  })
})

/*
 *  $router POST square/likes
 *  @desc   点赞 & 取消点赞
 */
router.post('/likes', (req, res) => {
  squareCtrl.likes(req.body, req.headers.authorization)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json(returnData)
  })
})

/*
 * $router POST square/comment
 * @desc   评论
*/
router.post('/comment', (req, res) => {
  squareCtrl.comment(req.body, req.headers.authorization)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json(returnData)
  })
})
 
/*
 * $router get square/getComment
 * @desc   获取评论
*/
router.get('/getComment', (req, res) => {
  squareCtrl.getComment(req.query)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json(returnData)
  })
})

/*
 *  $router POST square/delete
 *  @desc   删除
 */
router.post('/delete', (req, res) => {
  squareCtrl.delete(req.body, req.headers.authorization)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json(returnData)
  })
})

module.exports = router