import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import alertDanger from '@/components/alert-danger'
import alertPrimary from '@/components/alert-primary'
window.UIkit = require('uikit');
window.Icons = require('uikit/dist/js/uikit-icons');
UIkit.use(Icons);


Vue.config.productionTip = false

Vue.component('alert-danger', alertDanger)
Vue.component('alert-primary', alertPrimary)

Vue.mixin({
  data(){
    return {
      axios: null,
      baseUrl: 'https://pwa-test-c92c7.firebaseapp.com/'
    }
  },
  created(){
    this.axios = axios.create({
      baseURL: 'https://f4d8dc3a.ngrok.io',
      timeout: 60000
    })
  }
})

router.beforeEach( (to, from, next)=>{

  if(to.matched.some(route => route.meta.requiresAuth)){
    if(store.state.user == null){
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    }else
      next()
  }else
    next()

})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// register service worker

if('serviceWorker' in navigator){
  try{

    navigator.serviceWorker.register('sw.js')
    console.log('SW successfully registered')
  
  }catch(error){
    console.log(error)
  }
}else
  console.log('service worker not supported')

