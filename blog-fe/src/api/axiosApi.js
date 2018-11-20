import axios from 'axios'
import URL from './url.js'
import KEYS from './keys.js'
import util from './util.js'

const $http = axios.create({
  baseURL: 'http://140.143.64.43:5240',
  // baseURL: 'http://127.0.0.1:5240',
  timeout: 15000,
  headers: {
    'Authorization': util.getCookie('token')
  },
  onUploadProgress(e){
  },
  onDownloadProgress(e) {
  }
})

let requestNum = 0
$http.interceptors.request.use(config => { // 开始拦截
  ++requestNum
  if (requestNum == 1){
    window.progressVue.progressShow = 1
    window.progressVue.progressWidth = `${parseInt(Math.random() * 41 + 30)}%` // 30-70
  }
  return config
}, error => {
  console.error('myError: axiosRequest (axiosApi.js)')
  return Promise.reject(error)
})


$http.interceptors.response.use(response => { // 完成拦截
  --requestNum
  if (requestNum == 0){
    window.progressVue.progressWidth = '100%'
    setTimeout(() => {
      window.progressVue.progressShow = 0
      window.progressVue.progressWidth = '0%'
    }, 500)
  }

  if (response && response.data && response.data.data && response.data.data.token){
    util.setCookie('token', response.data.data.token, KEYS.cookieOverdue)    
    $http.defaults.headers.Authorization = response.data.data.token
  }
  if (response && response.data && response.data.message == '退出成功'){
    util.removeCookie('token')
    $http.defaults.headers.Authorization = ''
  }
  console.log(response.data)
  return response.data
}, error => {
  console.error('myError: axiosResponse (axiosApi.js)')
  return Promise.reject(error)
})


const urlCtrl = {}
let postApiNames = Object.keys(URL.postURL)
postApiNames.map(item => {
  urlCtrl[item] = param => {
    return $http.post(URL.postURL[item], param)
  }
})
let getApiNames = Object.keys(URL.getURL)
getApiNames.map(item => {
  urlCtrl[item] = param => {
    const paramKey = param ? Object.keys(param) : []
    const paramStr = paramKey.map(key => `${key}=${param[key]}`).join('&')
    const url = paramStr ? `${URL.getURL[item]}?${paramStr}`  : URL.getURL[item]
    return $http.get(url, param)
  }
})

export default urlCtrl