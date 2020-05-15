<template>
  <div class="page_con">
    <web-view :src="srcUrl"></web-view>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return {
        userId:'',
        srcUrl:'',
        token:''
      }
    },
    mounted(){
      this.userId = this.$store.state.userLiId;
      this.token = this.$store.state.token;
      console.log(this.userId);
      this.srcUrl = `https://zst-test.tenzhao.com:8443/zst-wap/index.html#/drawType?userId=${this.userId}&apptype=1&token=${this.token}`;
    }
  }
</script>

<style scoped>

</style>
