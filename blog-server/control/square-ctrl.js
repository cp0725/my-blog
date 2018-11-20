/*
 @name: control/square-ctrl.js
 @description: 广场相关控制器
 @date: 2018-8-10
*/
const dbControl = require('../api/dbControl')
const Square = require('../dbModels/Square')
const Article = require('../dbModels/Article')
const Comment = require('../dbModels/Comment')
const axios = require('axios')
const {token} = require('./user-ctrl')
const imageSize = require('image-size')
const http = require('http');

module.exports = {
  async getSquareData(params) {
    const squareList = await dbControl.find(Square).then(data => data).catch(err => err)
    if (!squareList.status) return squareList
    const nowEndList = squareList.data.filter(item => {
      return params.endDate == false ? true : new Date(item.date).getTime() < new Date(params.endDate).getTime()
    })
    const nowStartList = squareList.data.filter(item => {
      return params.startDate == false ? false : new Date(item.date).getTime() > new Date(params.startDate).getTime()
    })
    return {
      status: true,
      size: params.size,
      total: squareList.data.length,
      data: nowEndList.slice(0, params.size),
      new: nowStartList
    }
  },
  async getLinkTitle(params){
    const linkInfoHtml = await axios.get(params.link).then((res) => {
      return {
        status: true,
        html: res.data
      }
    }).catch((error) => {
      return {
        status: false,
        title: '点击此处跳转超链接',
        link: params.link,
        images: []
      }
    })
    if (!linkInfoHtml.status){
      return linkInfoHtml
    }
    const HTML = linkInfoHtml.html
    const title = HTML.match(/<title>(.+)<\/title>/) ? HTML.match(/<title>(.+)<\/title>/)[1] : '点击此处跳转超链接'
    const imgTagList = HTML.match(/<img.*?(?:>|\/>)/g) ? HTML.match(/<img.*?(?:>|\/>)/g) : []
    let imgSrcList = imgTagList.map(item => {
      const match = item.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/)
      return match ? match[1] : ''
    })
    imgSrcList = imgSrcList.filter(item => {
      const length = item.length > 20
      const protocol = item.slice(0, 4) == 'http' || item.slice(0, 5) == 'https' || item.slice(0, 2) == '//'
      return length && protocol
    })
    imgSrcList = imgSrcList.slice(0, 10) // 为节约流量只获取10个图的尺寸
    let imageSizeList = await Promise.all(imgSrcList.map(item => {
      return new Promise((resolve, reject) => {
        try {
          const src = item.replace(/^\/\/|https:\/\//, 'http://')
          http.get(src, response => {
            let chunks = []
            response.on('data', chunk => {
              chunks.push(chunk)
            }).on('end', () => {
              try {
                let buffer = Buffer.concat(chunks)
                let imgSize = imageSize(buffer)
                imgSize.link = item
                resolve(imgSize) 
              } catch (err) {
                resolve({}) 
              }
            })
          })
        } catch (err){
          resolve(err)
        }
      })
    }))
    imageSizeList = imageSizeList.filter(item => {
      return item.width > 38 && item.height > 38
    })
    return {
      status: true,
      title: title,
      link: params.link,
      images: imageSizeList
    }
  },
  async pushSquareData(params, authorizationToken){
    const tokenStatus = await token(authorizationToken).then(data => data).catch(err => err)
    if (!tokenStatus.status){
      return {
        message: '该用户暂未登陆不允许发布消息',
        status: false
      }
    }
    const saveStatus = await dbControl.create(Square, params).then(data => data).catch(err => err)
    const saveInfo = await dbControl.findById(Square, saveStatus.data.id).then(data => data).catch(err => err)
    return saveInfo
  },
  async likes(params, authorizationToken){
    const tokenStatus = await token(authorizationToken).then(data => data).catch(err => err)
    if (!tokenStatus.status) {
      return {
        message: '该用户暂未登陆不允许点赞',
        status: false
      }
    }

    const squareItem = await dbControl.findById(Square, params.squareId).then(data => data).catch(err => err)
    const length = squareItem.data.likes.filter(item => item == tokenStatus.data.id).length
    if (length > 0){ // 取消
      squareItem.data.likes = squareItem.data.likes.filter(item => item != tokenStatus.data.id)
    } else { // 点赞
      squareItem.data.likes.push(tokenStatus.data.id)
    }
    
    const newLikes = await squareItem.data.save().then(data => {
      return {
        status: true,
        likes: data.likes
      }
    }).catch(err => {
      return {
        status: false,
        err
      }
    })
    return newLikes
  },
  async comment(params, authorizationToken){
    const tokenStatus = await token(authorizationToken).then(data => data).catch(err => err)
    if (!tokenStatus.status) {
      return {
        message: '该用户暂未登陆不允许评论',
        status: false
      }
    }
    const commentInfo = await dbControl.create(Comment, params)
      .then(data => data)
      .catch(err => err)
    const id = params.squareId || params.articleId
    const MODELS = params.squareId ? Square : Article
    const targetItem = await dbControl.findById(MODELS, id)
      .then(data => data)
      .catch(err => err)
    targetItem.data.comments.push(params.user)
    await targetItem.data.save()
      .then(data => data)
      .catch(err => err)
    const commentUser = await dbControl.findById(Comment, commentInfo.data.id)
      .then(data => data)
      .catch(err => err)
    return commentUser
  },
  async getComment(params){
    const paramsId = params.squareId ? { squareId: params.squareId } : { articleId: params.articleId}
    const commentList = dbControl.find(Comment, {
      // squareId: params.id
      ...paramsId
    }).then(data => data).catch(data => data)
    return commentList
  },
  async delete(params, authorizationToken){
    // 先做token验证
    const squareItem = await dbControl.findOneAndRemove(Square, {
      _id: params.id
    }).then(data => {
      console.log(data)
    }).catch(err => err)
    return squareItem
  }
}