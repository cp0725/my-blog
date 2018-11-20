/*
 @name: control/article-ctrl.js
 @description: 文章相关控制器
 @date: 2018-9-21
*/
const dbControl = require('../api/dbControl')
const Article = require('../dbModels/Article')
const { token } = require('./user-ctrl')
const fs = require('fs')
const path = require('path')

module.exports = {
  async getArticleData(params){
    const articleList = await dbControl.find(Article).then(data => data).catch(err => err)
    if (!articleList.status) return articleList
    const nowEndList = articleList.data.filter(item => {
      return params.endDate == false ? true : new Date(item.date).getTime() < new Date(params.endDate).getTime()
    })
    const nowStartList = articleList.data.filter(item => {
      return params.startDate == false ? false : new Date(item.date).getTime() > new Date(params.startDate).getTime()
    })
    return {
      status: true,
      size: params.size,
      total: articleList.data.length,
      data: nowEndList.slice(0, params.size),
      new: nowStartList
    }
  },
  async pushArticleData(params, authorizationToken){
    const tokenStatus = await token(authorizationToken)
                              .then(data => data)
                              .catch(err => err)
    if (!tokenStatus.status) {
      return {
        message: '该用户暂未登陆不允许发布文章',
        status: false
      }
    }
    
    const saveStatus = await dbControl.create(Article, params)
                             .then(data => data)
                             .catch(err => err)
    const saveInfo = await dbControl.findById(Article, saveStatus.data.id)
                           .then(data => data)
                           .catch(err => err)
    const address = path.resolve(__dirname, `../file/article/${saveStatus.data.id}.md`)
    const fileStatus = await new Promise((resolve, reject) => {
      fs.writeFile(address, params.file, (err) => {
        err ? reject({ status: false, data: err }) : resolve({ status: true, data: saveInfo.data}) 
      })      
    })
    return fileStatus
  },
  async articleLikes(params, authorizationToken){
    const tokenStatus = await token(authorizationToken)
                              .then(data => data)
                              .catch(err => err)
    if (!tokenStatus.status) {
      return {
        message: '该用户暂未登陆不允许点赞',
        status: false
      }
    }

    const articleItem = await dbControl.findById(Article, params.articleId)
                              .then(data => data)
                              .catch(err => err)
    const length = articleItem.data.likes.filter(item => item == tokenStatus.data.id).length
    if (length > 0) { // 取消
      articleItem.data.likes = articleItem.data.likes.filter(item => item != tokenStatus.data.id)
    } else { // 点赞
      articleItem.data.likes.push(tokenStatus.data.id)
    }
    const newLikes = await articleItem.data.save()
                          .then(data => {
                            return {
                              status: true,
                              likes: data.likes
                            }
                          })
                          .catch(err => {
                            console.log(err)
                            return {
                              status: false,
                              err
                            }
                          })
    return newLikes
  },
  async getArticleInfo(params){
    const articleItem = await dbControl.findById(Article, params.id)
      .then(data => data)
      .catch(err => err)
    articleItem.data.read++ 
    articleItem.data.save()

    const address = path.resolve(__dirname, `../file/article/${params.id}.md`)
    const fileStatus = await new Promise((resolve, reject) => {
      fs.readFile(address, 'utf-8', (err, data) => {
        err ? reject({ status: false, data: err }) : resolve({ status: true, data}) 
      })
    })
    return {
      data: {
        ...articleItem.data,
        file: fileStatus.data
      },
      status: articleItem.status && fileStatus.status
    }
  }
}