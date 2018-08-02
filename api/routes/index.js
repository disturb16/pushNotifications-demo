const users = require('./users')
const messages = require('./messages')
const firebaseAdmin = require('../firebase-setup')
const DB = firebaseAdmin.firestore()

DB.settings({
  timestampsInSnapshots: true
})


module.exports = {
  users,
  messages
}