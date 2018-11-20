/*
 @name: api/loadImgKey.js
 @description: 图片上传key生成
 @date: 2018-8-10
*/
const qiniu = require('qiniu')
const KEYS = require('../config/key')

const getUploadToken = () => {
  const options = {
    scope: KEYS.qiniuSpaceName, // 空间名称
    expires: KEYS.qiniuTime,    // token有效期单位秒 2小时
    returnBody: KEYS.qiniuReturnBody // 返回数据格式
  }

  const mac = new qiniu.auth.digest.Mac(KEYS.qiniuAccessKey, KEYS.qiniuSecretKey)
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  return uploadToken
}
module.exports = getUploadToken