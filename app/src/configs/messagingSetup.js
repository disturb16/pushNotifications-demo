import showNotification from '../notificationMessage'
import firebaseApp from '@/configs/firebaseSetup'
import axios from 'axios'
const messaging = firebaseApp.messaging()



export default function requestPermission(context){
  const user = context.$store.state.user

  if(!user)
    return

  const id = context.$store.state.user.id

  messaging.requestPermission().then(function() {
    console.log('Notification permission granted.');
    return messaging.getToken()

  }).then(token=>{
    
    const url = `https://f4d8dc3a.ngrok.io/messages/subscribe-to-topic`
    axios.post(url, {token, id}).then(response=>{
      context.$store.state.token = token
    }).catch(error=>{
      console.log(error)
    })

  }).catch(function(err) {
    console.log('Unable to get permission to notify.', err);
  })

  messaging.onMessage(function(payload) {

    const message = payload.notification.data
    let currentNotifications = context.$store.state.notifications
    
    if (!currentNotifications)
      currentNotifications = [message]
    else
      currentNotifications.push(message)

    context.$store.state.notifications = currentNotifications
    console.log('Message received. ', payload);
    showNotification('#app', message.text, 'Attention')
  })
}