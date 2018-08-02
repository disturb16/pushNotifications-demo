<template>
  <div class="pushNotification-container">
    <div class="pushNotifcation-content">
      <h1>{{msg}}</h1>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste aut labore blanditiis? In, quas inventore. Officiis totam nesciunt nisi commodi. Facilis omnis placeat, nesciunt facere nam minima aut. Officiis, provident.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PushNotification',
  props: ['msg']
}
</script>

<style scoped>
.pushNotification-container{
  /* background-color: rgba(0, 0, 0, 0.475); */
  width: 100%;
  padding: 1em;
}

.pushNotifcation-content{
  background-color: #fff;
  width: 50%;
  -webkit-box-shadow: 0 3px 3px 2px #B8B8B8;
  box-shadow: 0 3px 3px 2px #B8B8B8;
  margin-left: 25%;
  padding: 0.5em;
  border-radius: .3em;
}
</style>
