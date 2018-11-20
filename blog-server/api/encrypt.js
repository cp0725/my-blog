const bcrypt = require('bcrypt') // 密码加密
const crypto = require('crypto') // token加密
const KEYS = require('../config/key.js')
const saltRounds = require('../config/key').saltRounds
function genSalt(param) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => { //生成salt并获取hash值
      bcrypt.hash(param.passWord, salt, (err, hash) => {
        if(err){
          reject(err)
        }else{
          param.passWord = hash
          resolve()
        }
      })
    })
  })
}
function compare(password1, password2){
  return new Promise((resolve, reject) => {
    bcrypt.compare(password1, password2, (err, res) => {
      if(err){
        reject(err)
      }else{
        resolve(res)
      }      
    })
  })  
}

/**
 * @aes192加密方法
 * @param str string 加密字符串
 * @param secret string 加密密钥
 * @retrun string 加密后的字符串
 **/
function getEncAse192(str) {
  let cipher = crypto.createCipher("aes192", KEYS.secret) //设置加密类型 和 要使用的加密密钥
  let enc = cipher.update(str, "utf8", "hex")    //编码方式从utf-8转为hex
  enc += cipher.final("hex") //编码方式从转为hex
  return enc //返回加密后的字符串
}
/**
 * @aes192解密方法
 * @param str string 解密字符串
 * @param secret string 解密密钥
 * @retrun string 解密后的字符串
 **/
function getDecAse192(str) {
  let decipher = crypto.createDecipher("aes192", KEYS.secret)
  let dec = decipher.update(str, "hex", "utf8") //编码方式从hex转为utf-8
  dec += decipher.final("utf8") //编码方式从utf-8
  return dec
}

module.exports = {
  genSalt,
  compare,
  getEncAse192,
  getDecAse192
}