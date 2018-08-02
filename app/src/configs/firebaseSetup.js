import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyBhpNajajvpcln7_jgm8Iq7iEXOmrhalZw",
  authDomain: "pwa-test-c92c7.firebaseapp.com",
  databaseURL: "",
  projectId: "pwa-test-c92c7",
  storageBucket: "gs://pwa-test-c92c7.appspot.com",
  messagingSenderId: "694767562588"
}

export default firebase.initializeApp(config)