const express = require('express')
const axios = require('axios')
const firebaseAdmin = require('../firebase-setup')
const router = express.Router()
const DB = firebaseAdmin.firestore()

router.get('/groups', async (req, res)=>{

  try{

    const groups = []
    const docRef = await DB.collection('topics').get()
    docRef.forEach(doc=>{
      const group = doc.data()
      group.id = doc.id
      groups.push(group)
    })

    res.status(200).json({
      success: true,
      data: groups
    })

  }catch(error){
    console.log(error)

    res.status(500).json({
      success: false,
      data: null
    })
  }

})

router.post('/subscribe-to-topic', async (req, res)=>{
  try{

    const userId = req.body.id
    const token = req.body.token
    const tokens = []

    await unsubscribeFromAllTopics(userId, token)

    // Get tokens user has available
    let tokenAlreadyAdded = false
    const userTokens = await DB.collection(`users/${userId}/tokens`).get()
    userTokens.forEach(usertoken=>{
      const _token = usertoken.data().token
      if(_token == token)
        tokenAlreadyAdded = true
    })

    if(!tokenAlreadyAdded){
      const added = await DB.collection(`users/${userId}/tokens`).add({token})
    }

    suscribeUserTopics(userId)

    return res.status(200).json({
      success: true,
      msg: 'Successfully subscribed to topic'
    })

  }catch(error){
    console.log(error)
  }
})

router.post('/send-to-group', async (req,res)=>{
  try{

    const message = req.body.text
    const username = req.body.username
    const topicId = req.body.group

    const topicRef = await DB.doc(`topics/${topicId}`).get()
    const topic = topicRef.data().name

    const axiosInst = axios.create({
      timeout: 60000,
      headers: {'X-Requested-With': 'XMLHttpRequest'},
    })
    const AUTH_TOKEN = 'key=AIzaSyBhpNajajvpcln7_jgm8Iq7iEXOmrhalZw'
    axiosInst.defaults.headers.common['Authorization'] = AUTH_TOKEN;

    // See documentation on defining a message payload.
    var messageData = {

      topic,

      webpush:{
        notification: {

          title: 'Messssage from ' + topic,
          body: message,
          // image: "img/ss.jpg",
          icon: "img/ss.jpg",
          data: {
            username,
            text: message
          },

          click_action: 'https://pwa-test-c92c7.firebaseapp.com',

          /* actions: [
            {
              "title": "Like",
              "action": "like",
              "icon": "icons/heart.png"
            }
          ] */
        },
      },
    }

    // Send a message to devices subscribed to the provided topic.
    firebaseAdmin.messaging().send(messageData)
    .then((response) => {
      // Response is a message ID string.
      // console.log('Successfully sent message:', response);
      res.status(200).json({success: true})
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    })

  }catch(error){
    console.log(error)
    res.status(200).json({success: false})
  }
})

async function unsubscribeFromAllTopics(userId, newToken = ''){
  const docs = await DB.collection(`topics`).get()
  const topics = []

  docs.forEach(doc =>{
    topics.push(doc.data().name)
  })

  const tokens = []
  const userTokens = await DB.collection(`users/${userId}/tokens`).get()
  userTokens.forEach(usertoken=>{
    const _token = usertoken.data().token
    tokens.push(_token)
  })

  if(newToken != '')
    tokens.push(newToken)

  if(tokens.length == 0)
    return

  topics.forEach(topic =>{
    firebaseAdmin.messaging().unsubscribeFromTopic(tokens, topic).then(res=>{
      // console.log('unsuscribed from '+ topic)
    })
  })

}

async function suscribeUserTopics(userId){

  try{

    // get topics user can subscribe to
    const topicsToSubscribe = []
    const topicsPerUser = await DB.collection(`users/${userId}/topics`).get()
    topicsPerUser.forEach(topicDoc =>{
      const userTopic = topicDoc.data()
      topicsToSubscribe.push(userTopic.name)
    })

    if(topicsToSubscribe.length == 0){
      return false
    }

    const tokens = []
    const userTokens = await DB.collection(`users/${userId}/tokens`).get()
    userTokens.forEach(usertoken=>{
      const _token = usertoken.data().token
      tokens.push(_token)
    })

    // subscribe to each Topic user has access
    for(let topic of topicsToSubscribe){
      firebaseAdmin.messaging().subscribeToTopic(tokens, topic).then(s=>{
        // console.log('subcribed to '+topic)
      })
    }
    return true

  }catch(err){
    console.log(err)
    return false
  }

}

module.exports = router