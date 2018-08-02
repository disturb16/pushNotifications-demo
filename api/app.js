const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const routes = require('./routes')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  // midleware for verified users
  next()
})

app.listen('3000', ()=>{
  console.log("server started")

  mongoose.connect('mongodb://ds157901.mlab.com:57901/cms-notifications', { useNewUrlParser: true })
  mongoose.connection.once('open', ()=>{
    console.log('database connected')

    app.use('/users', routes.users)
    console.log('users route open')

    app.use('/messages', routes.messages)
    console.log('messages route open')
  })
})
