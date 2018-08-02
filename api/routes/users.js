const express = require('express')
const bcrypt = require('bcryptjs')
const secretHash = 'pushnotif'
const saltRounds = 10
const firebaseAdmin = require('../firebase-setup')
const router = express.Router()

const DB = firebaseAdmin.firestore()


router.get('/create/:name/:username', async (req, res, next)=>{
  
  try{

    const name = req.params.name
    const username = req.params.username

    const user = {
      name,
      username: username.toLocaleLowerCase(),
      password: bcrypt.hashSync('1234', saltRounds)
    }

    const ref = await DB.collection('users').add(user)
  
    res.status(200).json({ test: 'user created'})

  }catch(error){

  }
  
})

router.post('/verify', async (req, res, next)=>{
  try{

    let success = false
    const user = req.body.user

    const dataCollection = await DB.collection('users')
                   .where('username', '==', user.username)
                   .get()
    if(dataCollection.docs.length == 0){
      return res.status(200).json({
        userdata: null,
        success
      })
    }
    
    const userdata = dataCollection.docs[0].data()
    userdata.id = dataCollection.docs[0].id
    let data = null
    
    bcrypt.compare(user.password, userdata.password).then(isValid=>{
      if(isValid){
        data = {id: userdata.id, name: userdata.name, username: userdata.username}
        success = true
      }

      res.status(200).json({
        userdata: data,
        success
      })

    })

  }catch(error){
    console.log(error)
  }
})

router.get('/all', async (req, res)=>{

  try{

    const users = []
    const docRef = await DB.collection('users').get()
    docRef.forEach(doc=>{
      const user = doc.data()
      user.id = doc.id

      users.push(user)
    })

    res.status(200).json({
      success: true,
      data: users
    })

  }catch(error){
    console.log(error)
    res.status(200).json({
      success: false,
      data: null
    })
  }

})

router.get('/:id/groups', async (req, res)=>{
  
  try{
    
    const userId = req.params.id

    const groups = []
    const docsRef = await DB.collection(`users/${userId}/topics`).get()
    
    docsRef.forEach(doc=>{
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

router.post('/:id/add-group', async (req, res)=>{

  try{

    const userId = req.params.id
    const groupId = req.body.groupId

    const doc = await DB.doc(`topics/${groupId}`).get()
    const group = doc.data()

    DB.collection(`users/${userId}/topics`).add({
      name: group.name
    }).then(added=>{
      
      suscribeUserToTopic(userId, group.name)

      res.status(200).json({
        success: true
      })
    })

  }catch(error){
    console.log(error)
    res.status(500).json({
      success: false
    })
  }


})

router.post('/:id/remove-group', async (req, res)=>{

  try{

    const userId = req.params.id
    const groupId = req.body.id

    const topicRef = await DB.doc(`users/${userId}/topics/${groupId}`).get()
    const topic = topicRef.data().name
    
    unsuscribeFromTopic(userId, topic)

    DB.doc(`users/${userId}/topics/${groupId}`).delete().then(deleted=>{
      res.status(200).json({
        success: true
      })
    })


  }catch(error){
    console.log(error)
    res.status(500).json({
      success: false
    })
  }


})

router.post('/logout', async (req, res)=>{

  try{

    const userId = req.body.id
    const token = req.body.token

    const docs = await DB.collection(`topics`).get()
    const topics = []

    docs.forEach(doc =>{
      topics.push(doc.data().name)
    })

    if (topics.length == 0)
      return res.status(200).json({success: true})

    
    const tokenRef = await DB.collection(`users/${userId}/tokens`).where('token', '==', token).get()
    const tokenId = tokenRef.docs[0].id

    DB.doc(`users/${userId}/tokens/${tokenId}`).delete().then(deleted=>{
      //... token deleted
    })

    
    topics.forEach(topic =>{
      firebaseAdmin.messaging().unsubscribeFromTopic([token], topic).then(res=>{
        //... topic unsuscribed
      })
    })

    res.status(200).json({
      success: true
    })
    

  }catch(err){
    console.log(err)
    res.status(500).json({
      success: false
    })
  }

})

async function unsuscribeFromTopic(userId, topic = ''){

  const tokens = []
  const userTokens = await DB.collection(`users/${userId}/tokens`).get()
  userTokens.forEach(usertoken=>{
    const _token = usertoken.data().token
    tokens.push(_token)
  })

  if(tokens.length == 0)
    return
  
  firebaseAdmin.messaging().unsubscribeFromTopic(tokens, topic).then(res=>{
    // console.log('unsuscribed from '+ topic)
  })

}

async function suscribeUserToTopic(userId, topic = ''){

  const tokens = []
  const userTokens = await DB.collection(`users/${userId}/tokens`).get()
  userTokens.forEach(usertoken=>{
    const _token = usertoken.data().token
    tokens.push(_token)
  })

  if(tokens.length == 0)
    return
  
  firebaseAdmin.messaging().subscribeToTopic(tokens, topic).then(s=>{
    //console.log('subcribed to '+ topic)
  })

}

module.exports = router