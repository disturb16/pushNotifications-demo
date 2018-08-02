const db = require('mongoose')
const Schema = db.Schema

const MessageGroup = new Schema({
  groupId: String,
  userId: String,
  status: String
})

module.exports = db.model('MessageGroup', MessageGroup)