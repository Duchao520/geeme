<template>
  <div class="card-header-wrapper">
    <div class="card-header-content">
      <div class="title">{{title}}</div>
      <span class="close" @click="close"><i class="iconfont">&#xe6bc;</i>关闭</span>
    </div>
  </div>
</template>

<script>
export default {
 props: {
   title: String,
 },
 methods: {
   close() {
    this.$router.go(-1)
   }
 }
}
</script>

<style lang="scss" scoped>
.card-header-wrapper {
  width: 100%;
  background: #ffffff;
  -webkit-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
  box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
  position: fixed;
  top: 0;
  z-index: 999;
  height: 65px;
  .card-header-content {
    width: 1400px;
    height: 100%;
    margin: 0 auto; 
    .title {
      margin: 10px 0 5px 0;
      font-size: 18px;
      color: #333333;
      font-weight: 600;
      line-height: 25px;
    }
    .close {
      color: rgba(149, 149, 149, 1);
      font-size: 12px;
      cursor: pointer;  
    }
  }
}
</style>