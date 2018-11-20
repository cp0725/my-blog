/*
 @name: routers/user.js
 @description: 登陆注册相关路由
 @date: 2018-8-10
*/
const express = require('express')
const userCtrl = require('../control/user-ctrl')
const router = express.Router()

/*
 *  $router POST api/users/register
 *  @desc   注册
 *  @access public
 */
router.post('/register', (req, res) => {
  userCtrl.register(req.body)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json(returnData)
  })
})

/*
 *  $router POST api/users/login
 *  @desc   登陆
 *  @access public
 */
router.post('/login', (req, res) => {
  userCtrl.login(req.body)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json(returnData)
  })  
})

/*
 *  $router POST api/users/verificationCode
 *  @desc   获取验证码
 *  @access public
 */
router.post('/verificationCode', (req, res) => {
  userCtrl.verificationCode(req.body)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json(returnData)
  })
})

/*
 *  $router POST api/users/return
 *  @desc   退出
 *  @access public
 */
router.post('/return', (req, res) => {
  userCtrl.return(req.body)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json(returnData)
  })
})

/*
 *  $router GET api/users/token
 *  @desc   验证登陆状态
 *  @access public
 */
router.get('/token', (req, res) => {
  userCtrl.token(req.headers.authorization)
  .then(returnData => {
    res.json(returnData)
  })
  .catch(returnData => {
    res.json({
      data: returnData,
      message: '该用户已下线',
      status: false
    })
  })
})
module.exports = router