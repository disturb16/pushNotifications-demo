importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase.js');

var config = {
  apiKey: "AIzaSyBhpNajajvpcln7_jgm8Iq7iEXOmrhalZw",
  authDomain: "pwa-test-c92c7.firebaseapp.com",
  databaseURL: "",
  projectId: "pwa-test-c92c7",
  storageBucket: "gs://pwa-test-c92c7.appspot.com",
  messagingSenderId: "694767562588"
}

firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload){
  const title = '';
  const options = {
    body: payload.data.status
  };
  return self.registration.showNotification(title, options);
})