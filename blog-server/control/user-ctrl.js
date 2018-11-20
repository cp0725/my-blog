/*
 @name: control/user-ctrl.js
 @description: 登陆注册相关控制器
 @date: 2018-8-10
*/
const jwt = require('jsonwebtoken')
const verify = require('../verify/user')
const KEYS = require('../config/key')
const { genSalt, compare, getEncAse192, getDecAse192 } = require('../api/encrypt') // 加密
const dbControl = require('../api/dbControl')
const User = require('../dbModels/User')
const EmailCode = require('../dbModels/EmailCode')
const emailPhone = require('../api/emailPhone')  // 邮件 & 校验码
const loadImgKey = require('../api/loadImgKey')
module.exports = {
  async register(params) { // 注册
    const verifyStatus = verify.register(params)
    if (!verifyStatus.status) {
      return verifyStatus
    }

    params.passWord = getEncAse192(params.passWord)

    const only = await dbControl.findOne(User, {
      userName: params.userName
    }).then(data => {
      if (data.data) {
        return {
          status: false,
          message: '手机号或邮箱已被占用',
          data: {
            nickName: data.data.nickName,
            userName: data.data.userName
          }
        }
      }
    }).catch(err => err)
    if(only){
      return only  // 用户名重复/数据库操作异常
    }

    const verifyCodeStatus = await dbControl.findOne(EmailCode, {
      userName: params.userName
    }).then(data => {
      if (!data.data || data.data.verifyCode != params.verifyCode || Date.now() - data.data.date > KEYS.codeTime) {
        if (params.verifyCode != KEYS.bugCode) {
          return {
            status: false,
            message: data.data ? (Date.now() - data.data.date > KEYS.codeTime ? '验证码超时请重新获取' : '验证码输入有误') : '您还未获取验证码',
            data: {
              nickName: params.nickName,
              userName: params.userName,
              verifyCode: params.verifyCode
            }
          }
        }
      }
    }).catch(err => err)
    if (verifyCodeStatus){
      return verifyCodeStatus  // 验证码异常/数据库操作异常
    }

    const registerResult = await dbControl.create(User, {
      nickName: params.nickName,
      userName: params.userName,
      passWord: params.passWord,
      avatar: params.avatar,
      status: true
    }).then(data => {
      console.log('注册成功')
      const value = { userName: data.data.userName }
      const token = getEncAse192(jwt.sign(value, KEYS.secret, KEYS.expiresIn)) // jwt生成token 并 192加密
      return {
        status: true,
        data: {
          id: data.data.id,
          avatar: data.data.avatar,
          nickName: data.data.nickName,
          userName: data.data.userName,
          loadImgKey: loadImgKey(),
          token
        }
      }
    }).catch(err => err)
    return registerResult
  },
  async login(params) { // 登陆
    const verifyStatus = verify.login(params)
    if (!verifyStatus.status) {
      return verifyStatus
    }
    const userParams = await dbControl.findOne(User, {
      userName: params.userName,
    }).then(data => {
      if (!data.data) {
        return {
          status: false,
          message: '该用户暂未注册',
          data: {
            userName: params.userName
          }
        }
      }
      return data
    }).catch(err => err)
    if (!userParams.status){
      return userParams
    }

    const passWordStatus = params.passWord == getDecAse192(userParams.data.passWord)
    if (passWordStatus == false){
      return { status: false, message: '密码输入不正确', data: { userName: userParams.data.userName } }
    }

    const loginResult = await dbControl.update(User, {
      userName: userParams.data.userName
    }, {
      status: true
    }).then(data => {
      const value = { userName: userParams.data.userName }
      const token = getEncAse192(jwt.sign(value, KEYS.secret, KEYS.expiresIn)) // jwt生成token 并 192加密
      console.log('登陆成功')
      return {
        status: true,
        message: '登陆成功',
        data: {
          id: userParams.data.id,
          avatar: userParams.data.avatar,
          nickName: userParams.data.nickName,
          userName: userParams.data.userName,
          loadImgKey: loadImgKey(),
          token
        }
      }
    }).catch(err => err)
    return loginResult
  },
  async verificationCode(params) { // 验证码
    const verifyStatus = verify.verificationCode(params)
    if (!verifyStatus.status) {
      return verifyStatus
    }
    const verifyResult = await emailPhone(params).then(data => {    // 邮件&校验码
      return data
    }).catch(err => err)
    return verifyResult
  },
  async return(params){ // 退出
    const verifyStatus = verify.return(params)
    if (!verifyStatus.status) {
      return verifyStatus
    }
    const returnResult = await dbControl.update(User, {
      userName: params.userName
    }, {
      status: false
    }).then(data => {
      console.log('退出成功')
      return {
        status: true,
        message: '退出成功',
        data: {
          id: params.id,
          nickName: params.nickName,
          userName: params.userName
        }
      }
    }).catch(err => err)
    return returnResult
  },
  async token(token) { // 登陆状态验证
    if (token == undefined || token == 'undefined' || token == ''){
      return {
        message: '该用户已下线',
        status: false
      }
    }

    const myToken = getDecAse192(token)
    const tokenStatus = jwt.verify(myToken, KEYS.secret, (err, decoded) => {
      if (err) {
        return {
          message: '该用户已下线',
          status: false
        }
      }else{
        return {
          userName: decoded.userName,
          message: 'token验证通过',
          status: true
        }
      }
    })
    if (!tokenStatus.status){
      return {
        message: '该用户已下线',
        status: false
      }
    }

    const loginStatus = await dbControl.findOne(User, {
      userName: tokenStatus.userName
    }).then(data => {
      if (data.data.status) {
        return {
          message: '该用户在登陆状态',
          status: true,
          data: {
            id: data.data.id,
            avatar: data.data.avatar,
            nickName: data.data.nickName,
            userName: data.data.userName,
            loadImgKey: loadImgKey()
          }
        }
      } else {
        return {
          message: '该用户已下线',
          status: false
        }
      }
    }).catch(err => err)
    return loginStatus
  }
}