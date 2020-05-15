<template>
  <div id="app">
    <transition name="slide" mode="out-in">
      <router-view :tokenPromise="token"></router-view>
    </transition>
  </div>
</template>

<script>
  import {getToken, unableDropDownRefresh} from "@/assets/js/jsBridge.js";

  export default {
    name: 'App',
    data() {
      return {
        token: getToken()
      }
    },
    beforeCreate() {
      console.log("app.vue beforeCreate");
    },
    created() {
      console.log("app.vue created")
    },
    beforeMount() {
      console.log("app.vue beforemount")
    },
    mounted() {
      unableDropDownRefresh();
      console.log('app.vue mounted');
    },
    methods: {}
  }
</script>

<style>
  #app {
  @import './assets/css/base.css';
  @import url("./assets/css/myBase.css");
  @import url('./assets/css/animate.css');
  @import url('./assets/fonts/svip/iconfont.css');
  @import url('./assets/fonts/iconfont.css');
  @import url('https://at.alicdn.com/t/font_969071_m6sxqdl2i8i.css');
  }

  .slide-enter-active {
    animation: slideInRight .3s;
  }

  .slide-leave-active {
    animation: slideOutLeft .3s;
  }
</style>
