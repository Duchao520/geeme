<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted() {
    window.document.title=""
  }
}
</script>

<style>
  @import './assets/css/base.css';

</style>

