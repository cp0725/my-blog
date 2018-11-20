import validator from 'validator'
import KEYS from './keys.js'

const validatorCtrl = {
  result: {
  },
  nickName(value) { 
    this.result.nickName = value && validator.isLength(value, { min: 2, max: 7 }) ? true : false    
  },
  userName(value) { 
    this.result.userName = value && validator.isLength(value, { min: 5, max: 30 }) && (validator.isEmail(value) || validator.isMobilePhone(value, KEYS.country)) ? true : false
  },
  verifyCode(value) { 
    this.result.verifyCode = value && validator.isLength(value, { min: 6, max: 6 }) && validator.isNumeric(value) ? true : false
  },
  passWord(value) { 
    this.result.passWord = value && validator.isLength(value, { min: 6, max: 12 }) && validator.isAscii(value) ? true : false
  },
  passWord2(value, passWord) { 
    this.result.passWord2 = value != '' && value == passWord
  },
  link(value){
    this.result.link = value && validator.isURL(value)
  }
}

export default function (params) {
  validatorCtrl.result = {}
  const paramsKey = Object.keys(params)
  paramsKey.map(item => validatorCtrl[item](params[item], params.passWord))
  return validatorCtrl.result
}