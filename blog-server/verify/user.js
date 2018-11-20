/*
 @name: verify/user.js
 @description: 注册表单验证
 @date: 2018-8-10
*/
const validator = require('validator')
const KEYS = require('../config/key')

module.exports = {
  register(data){
    const userName = data.userName && validator.isLength(data.userName, { min: 5, max: 30 }) && (validator.isEmail(data.userName) || validator.isMobilePhone(data.userName, KEYS.country)) ? true : 'userName必须是合法邮箱或者电话5-30位'
    const nickName = data.nickName && validator.isLength(data.nickName, { min: 2, max: 7 }) ? true : 'nickName必须2-7位'
    const passWord = data.passWord && validator.isLength(data.passWord, { min: 6, max: 12 }) && validator.isAscii(data.passWord) ? true : 'passWord必须6-12位且不能包含中文'
    const verifyCode = data.verifyCode && validator.isLength(data.verifyCode, { min: 6, max: 6 }) && validator.isNumeric(data.verifyCode) ? true : 'verifyCode必须是6位数字'
    const status = userName === true && nickName === true && passWord === true && verifyCode == true
    return {
      status,
      data: {
        userName,
        nickName,
        passWord,
        verifyCode
      },
      message: status ? true : '字段不符合规定'
    }
  },
  login(data){
    const userName = data.userName && validator.isLength(data.userName, { min: 5, max: 30 }) && (validator.isEmail(data.userName) || validator.isMobilePhone(data.userName, KEYS.country)) ? true : 'userName必须是合法邮箱或者电话5-30位'
    const passWord = data.passWord && validator.isLength(data.passWord, { min: 6, max: 12 }) && validator.isAscii(data.passWord) ? true : 'passWord必须6-12位且不能包含中文'
    const status = userName === true && passWord === true
    return {
      status,
      data: {
        userName,
        passWord
      },
      message: status ? true : '字段不符合规定'
    }
  },
  verificationCode(data){
    const userName = data.userName && validator.isLength(data.userName, { min: 5, max: 30 }) && (validator.isEmail(data.userName) || validator.isMobilePhone(data.userName, KEYS.country)) ? true : 'userName必须是合法邮箱或者电话5-30位'
    const status = userName === true
    return {
      status,
      data: {
        userName
      },
      message: status ? true : '字段不符合规定'
    }    
  },
  return(data) {
    const userName = data.userName && validator.isLength(data.userName, { min: 5, max: 30 }) && (validator.isEmail(data.userName) || validator.isMobilePhone(data.userName, KEYS.country)) ? true : 'userName必须是合法邮箱或者电话5-30位'
    const status = userName === true
    return {
      status,
      data: {
        userName
      },
      message: status ? true : '字段不符合规定'
    }
  }
}