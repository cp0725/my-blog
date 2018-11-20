const util = {
  getUrlParams(url, params){
    const entries = Object.entries(params)
    const result = entries.map(item => item.join('=')).join('&')
    return url + (result ? `?${result}` : ``)
  }
}
module.exports = util