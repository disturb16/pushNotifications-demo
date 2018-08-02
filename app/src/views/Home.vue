<template>
  <div id="main-content">
    <h1>Welcome {{user.username}}</h1>


    <div id="compose-message" uk-grid>
      <div class="uk-margin uk-width-1-3@m">
        <label class="uk-text-left" >Compose Message</label>
        <textarea 
          class="uk-textarea"
          rows="5"
          placeholder="Textarea"
          v-model="message"></textarea>
      </div>

      <div class="uk-width-1-3@m">

        <div class="uk-margin">
          <label for="">Select a Group</label>
          <select class="uk-select" ref="groupSelected">
            <option>---</option>
            <option v-for="group in groups" :key="group.id" :value="group.id">{{group.name}}</option>
          </select>
        </div>
      </div>

      <div class="uk-margin uk-width-1-3@m">
         <button 
          type="submit"
          class="uk-button uk-button-default uk-align-left"
          @click.prevent="sendMessage">Send</button>
      </div>
    </div>
    
    <div class="uk-margin">
      <ul class="uk-list uk-list-large uk-list-divider uk-text-left">
      <li v-for="(message, index) in messages" :key="index">
        <div>
          <h5>{{message.username}}</h5>
          <p>{{message.text}}</p>
        </div>
      </li>
    </ul>
    </div>
    
  </div>
</template>

<script>

import messagingSetup from '@/configs/messagingSetup'

export default {
  name: 'Home',
  data(){
    return {
      message: '',
      groups: []
    }
  },

  mounted(){
    messagingSetup(this)
    this.getGroups()
  },

  methods:{
    sendMessage(){
      const group = this.$refs.groupSelected.value

      const messageToSend = {
        username:this.user.username,
        text:this.message,
        group
      }

      this.axios.post('/messages/send-to-group', messageToSend).then(response=>{
        const result = response.data
        UIkit.notification("<span uk-icon='icon: check'> Message Sent", {pos: 'top-right', status:'success'})
      }).catch(err=>{
        console.log(err)
      })
    },

    getGroups(){
      this.axios.get('/messages/groups').then(response=>{
        const result = response.data
        if(result.success){
          this.groups = result.data
        }
      })
    },
  },
  computed:{
    user(){
      return this.$store.state.user
    },
    messages(){
      return this.$store.state.notifications
    }
  }
}
</script>

<style scoped>
#main-content{
  padding: 3em;
}
</style>

