<template>
  <div id="main-content">
    <img src="../../public/img/ss.jpg" width="200px" height="200px" uk-img>
    <div uk-grid>
      <div class="uk-width-1-3@m"></div>
      <div class="uk-width-1-3@m">
        <form class="uk-form-stacked">

          <div class="uk-margin">
           <label class="uk-form-label uk-align-left">Username</label>
            <input class="uk-input" type="text" v-model="user.username">
          </div>

          <div class="uk-margin">
           <label class="uk-form-label uk-align-left" >Password</label>
            <input class="uk-input" id="pass" type="password" v-model="user.password" >
          </div>

          <alert-danger :isShowing="incorrectCredentials" msg="Username or Password are incorrect" @closed="incorrectCredentials = false" />

          <div class="uk-margin">
            <button class="uk-button uk-button-primary uk-align-left" @click.prevent="verifyUser" >Log In</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data(){
    return {
      user: {
        username: '',
        password: ''
      },
      incorrectCredentials: false
    }
  },
  methods:{
    verifyUser(){

      const user = this.user

      this.axios.post('/users/verify', {user}).then(response=>{
        const result = response.data
        if(result.success){
          this.$store.state.user = result.userdata
          this.$router.push('/home')
        }else{
          this.incorrectCredentials = true
          const el = document.querySelector('#alert')
          UIkit.alert(el)
        }

      }).catch(err=>{
        console.log(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main-content{
  padding: 3em;
}

</style>
