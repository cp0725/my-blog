const postURL = {
  userLogin: '/user/login',
  userRegister: '/user/register',
  userReturn: '/user/return',
  verificationCode: '/user/verificationCode',
  getLinkTitle: '/square/getLinkTitle',
  pushSquareData: '/square/pushSquareData',
  squareLikes: '/square/likes',
  comment: '/square/comment',
  delete: '/square/delete',
  squareGetData: '/square/getSquareData',
  pushArticleData: '/article/pushArticleData',
  getArticleData: '/article/getArticleData',
  articleLikes: '/article/articleLikes',
  getArticleInfo: '/article/getArticleInfo',

}
const getURL = {
  getStatus: '/user/token',
  getComment: '/square/getComment',
  getMusicList: '/home/getMusicList',
  getLrc: '/home/getLrc'
}


export default {
  postURL,
  getURL
}