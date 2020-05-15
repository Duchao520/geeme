<template>
  <div>
    <img src="@/assets/imgs/rules/merchant_access.png" alt="">
  </div>
</template>

<script>
  import {postTitle} from "@/assets/js/jsBridge";
  export default {
    name: "merchantAccess",
    mounted() {
      postTitle('附件详情')
    }
  }
</script>

<style scoped>
  img{
    display: block;
    width: 100%;
  }
</style>
