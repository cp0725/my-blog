const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  text: {
    type: String,
    required: true
  },
  squareId: {
    type: String
  },
  articleId: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})
const Comment = mongoose.model('comments', commentSchema)
module.exports = Comment