const qiniu = require('qiniu-js')

const setImg = (param) => {
  const observer = {
    next(res) {
      res.status = 'next'
      param.completeFun(res)
    },
    error(err) {
      err.status = 'err'
      param.completeFun(err)
    },
    complete(res) {  // 返回信息取决于后端sdk配置
      res.status = 'success'
      res.preview = `${res.url}?imageView2/1/w/250/h/250`
      res.watermark = `${res.url}?watermark/2/text/QOiIuemVvw==/font/5b6u6L2v6ZuF6buR/fontsize/450/fill/I0ZGRkZGRg==/dissolve/80/gravity/SouthEast/dx/10/dy/10`
      param.completeFun(res)
    }
  }
  const config = {
  }
  const putExtra = {
    // fname: "a.png",
    params: {}, // 自定义变量
    mimeType: ['image/png', 'image/jpeg', 'image/gif']
  }
  const token = param.loadImgKey
  const observable = qiniu.upload(param.myFile, null, token, putExtra, config)
  const subscription = observable.subscribe(observer) // 上传开始
// http://pczp7a1z5.bkt.clouddn.com/namekey3?imageView2/1/w/200/h/100
// http://pczp7a1z5.bkt.clouddn.com/namekey2?watermark/2/text/QOiIuemVvw==/font/5b6u6L2v6ZuF6buR/fontsize/450/fill/I0ZGRkZGRg==/dissolve/80/gravity/SouthEast/dx/10/dy/10
}
export default setImg