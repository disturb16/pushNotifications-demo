const db = require('mongoose')
const Schema = db.Schema

const User = new Schema({
  name: String,
  age: String
})

module.exports = db.model('User', User)