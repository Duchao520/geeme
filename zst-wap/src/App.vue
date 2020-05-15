<template>
  <div id="app">
    <div class="shade" v-show="isLoad">
      <img src="@/assets/imgs/proShow/loading.gif" alt="" class="loadImg">
    </div>
    <transition :name="transitionName" mode="out-in">
      <keep-alive include="purHistory">
        <router-view  :tokenPromise="token" @showLoad="showLoad">
        </router-view>
      </keep-alive>
    </transition>

  </div>
</template>

<script>
  import {getToken, unableDropDownRefresh, noShare , getUserAgentType} from "@/assets/js/jsBridge";

  export default {
    name: 'App',
    data() {
      return {
        token: getToken(),
        transitionName: 'slide_go',
        isLoad: 0
        // partnerToken: getParterToken()
      }
    },
    beforeCreate() {
      console.log("app.vue beforeCreate");
    },
    created() {
      console.log("app.vue created")
      // console.log(this.$route);
    },
    beforeMount() {
      console.log("app.vue beforemount")
    },
    mounted() {
      unableDropDownRefresh();
      noShare();
      console.log('app.vue mounted');
    },
    beforeRouteEnter(to, from, next) {
      console.log(from)
      next();
    },
    methods: {
      showLoad(status){
        this.isLoad = status;
      }
    },
    watch: {
      '$route'(to, from) {
        let routersArr=sessionStorage.getItem('routers')&&sessionStorage.getItem('routers').split(',')||[];
        if(routersArr.length==0){
          routersArr.push(from.path)
          routersArr.push(to.path);
        }else{
          if(routersArr.indexOf(to.path)!=-1){
            this.transitionName='slide_back'
            routersArr.splice(routersArr.indexOf(to.path)+1,100)
          }else{
            this.transitionName='slide_go'
            routersArr.push(to.path)
          }
        }
        sessionStorage.setItem('routers',routersArr.join(','))
      }
    }
  }
</script>

<style>
  #app {
  @import './assets/css/base.css';
  @import url('./assets/css/animate.css');
  @import url('https://at.alicdn.com/t/font_967051_sliqvnsdown.css');
  /*@import url('./assets/font/iconfont.css');*/
  }
  .shade{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(12,12,12,.5);
    z-index: 999;
  }
  .loadImg{
    display: block;
    width: 2rem;
    height: 2rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  .slide_go-enter-active {
    animation: slideInRight .3s;
  }

  .slide_go-leave-active {
    animation: slideOutLeft .3s;
  }

  .slide_back-enter-active {
    animation: slideInLeft .3s;
  }

  .slide_back-leave-active {
    animation: slideOutRight .3s;
  }
</style>
