<template>
  <div id="app">
    <div id="nav">
      <div v-if="isLogged">
        <router-link to="/home" >Compose</router-link> |
        <router-link to="/users">Users</router-link> |
        <a href="#" @click.prevent="logout">LogOut</a>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',

  methods:{
    logout(){
      const id = this.userId
      const token = this.$store.state.token
      this.axios.post('/users/logout', {id, token}).then(response=>{
        window.location = this.baseUrl
      })
    }
  },

  computed:{
    isLogged(){
      return this.$store.state.user != null
    },

    userId(){
      return this.$store.state.user.id || -1
    }
  }
}
</script>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
