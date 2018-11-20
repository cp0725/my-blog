const express = require('express')
const axios = require('axios')


// var url = 'http://localhost:5240/login/cellphone?phone=18634225535&password=528637598cp'
// var url = 'http://localhost:5240/recommend/resource'
var url = 'http://localhost:5240/top/list?idx=3'

axios.get(url, {
  headers: {
    // xhrFields: { withCredentials: true }
  }
}).then((response) => {
  console.log(response.data.playlist.tracks[0].name, 1)
}).catch((e) => {
  console.log(e, 2)
})


return
var query = {
  g_tk: '1928093487',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: '0',
  format: 'json',
  platform: 'yqq',
  hostUin: '0',
  sin: '0',
  ein: '29',
  sortId: '5',
  needNewCode: '0',
  categoryId: '10000000',
  rnd: '0.35315941744783164'
}
  // /getDiscList
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {  // axios在node发送的是一个http请求，并非ajax请求
    headers: {      // 可以自行配置请求的header
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: query
  }).then((response) => {
    console.log(response.data, 1)
  }).catch((e) => {
    console.log(e, 2)
  })



  return
  // lyric
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {  // axios在node发送的是一个http请求，并非ajax请求
    headers: {      // 可以自行配置请求的header
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: query
  }).then((response) => {
    console.log(response.data, 1)
  }).catch((e) => {
    console.log(e, 2)
  })

  








