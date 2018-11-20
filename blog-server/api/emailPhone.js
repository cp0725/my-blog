/*
 @name: api/emailPhone.js
 @description: 短信验证码 & 邮件验证码
 @date: 2018-8-10
*/
const validator = require('validator')
const axios = require('axios')
const nodemailer = require('nodemailer')
const KEYS = require('../config/key')
const dbControl = require('../api/dbControl')
const User = require('../dbModels/User')
const EmailCode = require('../dbModels/EmailCode')

function mailOptions(userName, CODE){
  return {
    from: KEYS.email.from, 
    to: userName,                 // 接受者,可以同时发送多个,以逗号隔开
    subject: '船长个人博客验证邮件', // 标题
    text: '船长个人博客验证邮件',    // 文本 
    html: `
        <h3>你好，欢迎注册船长的个人博客。</h3>
        <h2>您的验证码是：${CODE}</h2>
        <h5>------------------------------------</h5>
        <h5>请勿将验证码透露给其他人，如非本人操作请忽略。</h5>
      `
  }
}
const createTransport = nodemailer.createTransport({
  service: KEYS.email.service,
  // secureConnection: true,
  // port: 465,
  auth: {
    user: KEYS.email.from,
    pass: KEYS.email.pass  //授权码,通过QQ获取
  }
})


function setCodeDB(params, CODE) {
  return new Promise((resolve, reject) => {
    dbControl.findOne(User, {
      userName: params.userName
    }).then(data => {
      if (data.data) {
        return Promise.reject({
          status: false,
          message: '手机号或邮箱已被占用',
          data: {
            userName: data.data.userName
          }
        })        
      }
    }).then(data => {
      console.log('验证码已发送')
      return dbControl.findCreate(EmailCode,{
        userName: params.userName,
        verifyCode: CODE,
        date: Date.now()        
      },{
        userName: params.userName
      }).then(data => {
        return resolve(data)
      })
    }).catch( err => {
      reject(err)
    })
  })
}

function setEmailCode(params, CODE, PromiseResolve){
  createTransport.sendMail(mailOptions(params.userName, CODE), (err, info) => {
    if (err) {
      PromiseResolve({
        status: false,
        message: '验证码发送失败',
        data: {
          err,
          code: CODE,
          userName: params.userName
        }
      })
    } else {
      PromiseResolve({
        status: true,
        message: '验证码发送成功',
        data: {
          userName: params.userName
        }
      })
    }
  })
}

function setPhoneCode(params, CODE, PromiseResolve){
  axios.post(KEYS.telephone.url, {
    apikey: KEYS.telephone.apikey,
    content: KEYS.telephone.GbgStr(CODE),
    mobile: params.userName
  }).then((res) => {
    const status = res.data.result == 0
    PromiseResolve({
      status,
      message: status ? '短信验证码发送成功' : '短信验证码发送失败',
      data: {
        userName: params.userName,
        code: status ? '/' : CODE
      }
    })
  }).catch((error) => {
    PromiseResolve({
      status: false,
      message: '验证码发送失败',
      data: {
        error,
        code: CODE,
        userName: params.userName
      }
    })
  })
}
module.exports = (params) => {
  return new Promise((resolve, reject) => {
    const CODE = parseInt(Math.random() * 900000 + 100000)  // 生成6位数验证码
    setCodeDB(params, CODE).then(data => {
      if (validator.isEmail(params.userName) && data.status) {
        setEmailCode(params, CODE, resolve)
      }
      if (validator.isMobilePhone(params.userName, KEYS.country) && data.status) {
        setPhoneCode(params, CODE, resolve)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
