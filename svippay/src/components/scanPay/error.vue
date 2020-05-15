<template>
  <div class="error">
    <div class="errorLogo">
      <img src="@/assets/imgs/scanPay/error.png" alt="">
    </div>
    <p>404页面未找到!!!</p>
  </div>
</template>

<script>
  export default {
    name: "error"
  }
</script>

<style lang="scss" scoped>
  .error{
    .errorLogo{
      width: 2.2rem;
      height: 2.2rem;
      margin: 2rem auto;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    p{
      margin-top: 3rem;
      font-size: .48rem;
      /*color: #F7094D;*/
      text-align: center;
    }
  }
</style>
