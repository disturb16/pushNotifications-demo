<template>
  <div id="alert" class="uk-margin uk-alert-primary" uk-alert uk-grid v-show="isShowing">
    <p class="uk-width-expand uk-text-left">{{msg}}</p>
    <span uk-icon="close" class="uk-width-1-3 alert-close" @click="$emit('closed')"></span>
  </div>
</template>

<script>
export default {
  name: 'AlertPrimary',
  props: ['isShowing', 'msg']
}
</script>

<style scoped>
.alert-close{
  cursor: pointer;
  color: blue;
}
</style>
