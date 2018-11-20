const mongoose = require('mongoose')

const loginStatusSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})
const LoginStatus = mongoose.model('loginStatus', loginStatusSchema)
module.exports = LoginStatus