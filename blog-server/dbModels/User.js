const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  nickName: {
    type: String,
    required: true  // 必填
  },
  userName: {
    type: String,
    required: true
  },
  passWord: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  status: {
    type: Boolean
  },
  date: {
    type: Date,
    default: Date.now  // 默认值
  }
})
const User = mongoose.model('users', userSchema)
module.exports = User