const util = {
  isEmpty(params){
    let status = true
    for (let key in params){
      if (!params[key]) {
        status = false
      }
    }
    return status
  },
  /**
   * @设置Cookie
   * @param name String Cookie名称
   * @param value String Cookie内容
   * @param time Number 过期时间毫秒为单位
   * @setCookie(name, value, 1)
   **/
  setCookie(name, value, time) {
    let d = new Date(new Date().getTime() + time)
    document.cookie = `${name}=${value};expires=${d}`
  },
  /**
   * @删除Cookie
   * @param name String Cookie名称
   * @removeCookie("name")
   **/
  removeCookie(name) {
    this.setCookie(name, undefined, -3600000)
  },
  /**
   * @读取Cookie
   * @param name String Cookie名称
   * @getCookie("name")
   **/
  getCookie(name) {
    let arr = document.cookie.split("; "), cookieObj = {}
    arr.map(item => {
      let arr2 = item.split("=")
      cookieObj[arr2[0]] = arr2[1]
    })
    return cookieObj[name]
  },
  /**
   * @获取时间间隔
   * @param date Date 时间
   * getTimeInterval('2018-08-19T03:41:27.261Z')
   **/
  getTimeInterval(date) {
    const ms = new Date().getTime() - new Date(date).getTime()
    const min = ms / 1000 / 60
    const hour = min / 60
    const day = hour / 24
    const week = day / 7
    const mon = day / 30
    const year = day / 365
    if (min < 1) {
      return '刚刚'
    } else if (min < 60) {
      return `${Math.floor(min)}分钟前`
    } else if (hour < 24) {
      return `${Math.floor(hour)}小时前`
    } else if (day < 7) {
      return `${Math.floor(day)}天前`
    } else if (week < 4) {
      return `${Math.floor(week)}周前`
    } else if (mon < 12) {
      return `${Math.floor(mon)}个月前`
    } else if (year < 2) {
      return `一年前`
    } else if (year < 3) {
      return `两年前`
    } else {
      return `${Math.floor(year)}年前`
    }
  },
  /**
   * @获取时间格式 
   * @param date Date 时间
   * getTimeFormat('2018-08-19T03:41:27.261Z') -> 2018年09月19日
  **/
  getTimeFormat(date){
    let DATE = new Date(date)
    let year = DATE.getFullYear()
    let month = DATE.getMonth() + 1
    let isDate = DATE.getDate()
    month = month < 10 ? '0' + month : month
    isDate = isDate < 10 ? '0' + isDate : isDate
    return `${year}年${month}月${isDate}日`
  }

}
export default util





/**
 * 深拷贝一个对象
 */
function clone(val) {
  return JSON.parse(JSON.stringify(val))
}
/**
 * 判断为空
 * obj.hasOwnProperty(key) 返回obj里是否有key属性
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isEmpty(obj) {
  // undefined 的判断
  if (obj == null) return true;
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;
  if (typeof obj !== "object") return true;
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}

// 深拷贝 未处理堆栈溢出
function type(data, key) {
  return Object.prototype.toString.call(data) == `[object ${key}]`
}
function clone(origin) {
  if (!origin || typeof origin !== "object") {
    return origin
  }
  if (type(origin, "String") || type(origin, "Number") || type(origin, "Date") || type(origin, "Boolean") || type(origin, "Function") || type(origin, "RegExp")) {
    return new origin.constructor(origin)
  }
  var ret = new origin.constructor()
  for (var key in origin) {
    ret[key] = clone(origin[key])
  }
  return ret
}