const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  text: {
    type: String
  },
  read: {
    type: Number,
    default: 0
  },
  likes: {
    type: Array
  },
  comments: {
    type: Array
  },
  date: {
    type: Date,
    default: Date.now
  }
})
const Article = mongoose.model('article', articleSchema)
module.exports = Article