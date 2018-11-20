/*
 @name: control/home-ctrl.js
 @description: 首页相关控制器
 @date: 2018-10-13
*/

// const dbControl = require('../api/dbControl')
// const Square = require('../dbModels/Square')
// const Article = require('../dbModels/Article')
// const Comment = require('../dbModels/comment')
const axios = require('axios')
// const { token } = require('./user-ctrl')
// const imageSize = require('image-size')

// const http = require('http');
const util = require('../api/util')

module.exports = {
  async getMusicList(params) {
    const musicListUrl = util.getUrlParams(`http://localhost:${global.myPort}/top/list`, params)
    const musicList = await axios.get(musicListUrl)
      .then((res) => {
        return res.data.playlist.tracks.slice(0, 10)
      })
    const musicIds = musicList.map(item => item.id)
    const musicHrefUrl = util.getUrlParams(`http://localhost:${global.myPort}/music/url`, { id: musicIds.join()})
    const musicUrlList = await axios.get(musicHrefUrl)
      .then((res) => {
        return res.data.data
      })
    // 只取10条数据暂不做 break ，map不支持break，待用for of重构
    musicList.map(item => {
      musicUrlList.map(_item => {
        if (item.id == _item.id){
          item.musicUrl = _item
        }
      })
    })
    return {
      data: musicList,
      status: true
    }
  },
  async getLrc(params){
    const getLrcUrl = util.getUrlParams(`http://localhost:${global.myPort}/lyric`, params)
    const lrc = await axios.get(getLrcUrl)
      .then((res) => {
        return res.data
      })
    return lrc

  }
}
