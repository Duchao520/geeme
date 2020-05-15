<template>
  <div class="code">
    <img src="@/assets/imgs/scanPay/minapp_code.jpg" alt="">
  </div>
</template>

<script>
  export default {
    name: "code"
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/global";

  .code{
    width: 100%;
    height: 12.05rem;
    background: url($ctxpath + "/static/customImgs/scanPay/code_bg.png") center center no-repeat;
    background-size: 100% 100%;
    position: relative;
    img{
      display: block;
      width: 4.9rem;
      height: 4.9rem;
      position: absolute;
      top: 3.35rem;
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
