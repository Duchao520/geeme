<template>
  <div>
    <img src="@/assets/imgs/rules/merchant_course.png" alt="">
    <router-link to="/merchantAccess" tag="button"></router-link>
  </div>
</template>

<script>
  import {postTitle} from "@/assets/js/jsBridge";

  export default {
    name: "merchantCourse",
    mounted() {
      postTitle('服务商联盟商家落地服务八步曲')
    }
  }
</script>

<style lang="scss" scoped>
  img{
    display: block;
    width: 100%;
  }
  button{
    display: block;
    width: 7.2rem;
    height: 1rem;
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    top: 53.6rem;
  }
</style>
