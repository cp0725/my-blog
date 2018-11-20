const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  verifyCode: {
    type: String,
    required: true  // 必填
  },
  userName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})
const VerificationCode = mongoose.model('verificationCode', userSchema)
module.exports = VerificationCode