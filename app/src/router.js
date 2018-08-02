import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
const Home = ()=> import('@/views/Home')
const Users = ()=> import('@/views/Users')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      meta:{
        requiresAuth: true
      }
    }
  ]
})
