<template>
  <div>
    <div id="content" uk-grid>
      <div class="uk-width-1-3@m users-container">
        
        <h3>Users</h3>
        <ul class="uk-list uk-list-striped uk-list-large uk-text-left">
          <li class="usersItem" v-for="user in users" :key="user.id" @click.prevent="getUserGroups(user.id)">
            <span>
              name: {{user.name}} <br>
              username: {{user.username}}
            </span>
          </li>
        </ul>
      </div>

      <div class="uk-width-1-3@m">

        <h3>Groups</h3>

        <div uk-grid>
          <div class="uk-width-1-2@m">
            <select class="uk-select" ref="groupSelected">
              <option value="-1">Groups Availables</option>
              <option v-for="group in groups" :key="group.id" :value="group.id">{{group.name}}</option>
            </select>
          </div>
          <div class="uk-width-1-2@m">
            <button class="uk-button uk-button-default" @click.prevent="addGroup">Add Group</button>
          </div>
        </div>

        <ul class="uk-list uk-list-divider uk-list-large uk-text-left">
          <li v-for="group in userGroups" :key="group.id">{{group.name}} 
            <span class="group-action" uk-icon="trash" @click="deleteGroup(group.id)"></span> </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Users',
  data(){
    return {
      users: [],
      userSelected: '',
      userGroups: [],
      groups: [],
      groupAdded: false
    }
  },

  created(){
    this.getUsers()
    this.getAllGroups()
  },

  methods:{
    getUsers(){
      this.axios.get('/users/all').then(response=>{
        const result = response.data
        if(result.success)
          this.users = result.data

      }).catch(error=>{
        console.log(error)
      })
    },

    getAllGroups(){
      this.axios.get('/messages/groups').then(response=>{
        this.groups = response.data.data
      })
    },

    getUserGroups(id){
      this.userSelected = id
      this.axios.get(`users/${id}/groups`).then(response=>{
        this.userGroups = response.data.data
      }).catch(error=>{
        console.log(error)
      })
    },

    addGroup(){
      const groupId = this.$refs.groupSelected.value
      const userId = this.userSelected

      this.axios.post(`users/${userId}/add-group`, {groupId}).then(response=>{
        const result = response.data
        if(result.success)
          this.getUserGroups(userId)
          UIkit.notification("<span uk-icon='icon: check'> Group added Successfully", {pos: 'top-right', status:'success'})
      })
    },

    deleteGroup(id){
      const userId = this.userSelected
      this.axios.post(`users/${userId}/remove-group`, {id}).then(response=>{
        this.getUserGroups(userId)
        UIkit.notification("<span uk-icon='icon: check'> Group removed Successfully", {pos: 'top-right', status:'warning'})
      }).catch(err=>{
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
#content{
  margin: 0.5em;
}

.usersItem{
  cursor: pointer;
}

.arrow{
  top:40%;
}

.itemSelected{
  background-color: #bcffbc;
}

.group-action{
  cursor: pointer;
}

</style>
