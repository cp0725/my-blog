module.exports = {
  mongoURI: 'mongodb://cp0725:528637598cp@ds113870.mlab.com:13870/my_website',
  country: ['zh-CN'],
  saltRounds: 10, // bcrypt加密salt的迭代次数
  secret: 'mywebsite', // token加密秘钥
  expiresIn: { // token过期时间
    expiresIn: '1d' // 过期时间默认是秒；可支持以下单位 1d, 10h, 2.5 hrs, 2h, 1m, 5s, 1y;
  },
  email: {
    from: '528637598@qq.com',
    service: 'qq',
    pass: 'pszxdcetspcrbgee'
  },
  telephone: {
    url: 'http://api01.monyun.cn:7901/sms/v2/std/single_send',
    apikey: '12bd2b6af4118a13cf06b5abd698e847',
    GbgStr(code){
      return `%D1%E9%D6%A4%C2%EB%A3%BA${code}%A3%AC%B4%F2%CB%C0%B6%BC%B2%BB%D2%AA%B8%E6%CB%DF%B1%F0%C8%CB%C5%B6%A3%A1`
    }
  },
  codeTime: 300000, // 验证码有效时间 5分钟
  bugCode: 528637,
  qiniuAccessKey: 'w1ItrK8m4vPQ0pWLOl-3VSY5pdK7bzoeMoc7jleS',
  qiniuSecretKey: 'kXnC5TmIjEuxPuZlC3wC8SVT29-lTI4nXXb6EFCy',
  qiniuSpaceName: 'blog-server-img',
  qiniuReturnBody: '{"url":"http://pczp7a1z5.bkt.clouddn.com/$(key)","size":"$(fsize)","width":"$(imageInfo.width)","height":"$(imageInfo.height)","type":"$(mimeType)"}',
  qiniuTime: 7200  // token有效期单位秒 2小时
}
