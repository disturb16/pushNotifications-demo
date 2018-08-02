const firebaseAdmin = require('firebase-admin')
const firebaseCredentials = require('./firebase-admin-credentials')

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseCredentials),
  databaseURL: 'https://pwa-test-c92c7.firebaseio.com'
})

module.exports = firebaseAdmin