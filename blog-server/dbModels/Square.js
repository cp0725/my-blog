const mongoose = require('mongoose')
const Schema = mongoose.Schema

const squareSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  text: {
    type: String,
    required: true    
  },
  images: [
    {
      width: {
        type: String
      },
      height: {
        type: String
      },
      preview: {
        type: String
      },
      size: {
        type: String
      },
      type: {
        type: String
      },
      url: {
        type: String
      },
      watermark: {
        type: String
      }
    }
  ],
  links: [
    {
      link: {
        type: String 
      },
      title: {
        type: String
      },
      images: {
        type: Array
      }
    }
  ],
  likes: {
    type: Array
  },
  comments: {
    type: Array
  },
  date: {
    type: Date,
    default: Date.now  // 默认值
  }
})
const Square = mongoose.model('square', squareSchema)
module.exports = Square