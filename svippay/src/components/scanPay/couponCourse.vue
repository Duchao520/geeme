<template>
  <div class="couponCourse">
      <button @click="targetHref('https://a.app.qq.com/o/simple.jsp?pkgname=com.hh.csipsimple')">

      </button>
  </div>
</template>

<script>
  export default {
    name: "couponCourse",
    methods: {
      targetHref(url){
        window.location.href = url
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/global";

  .couponCourse {
    width: 100%;
    height: 24.61rem;
    background: url($ctxpath + "/static/customImgs/scanPay/couponCourse.png") center center no-repeat;
    background-size: 100% 100%;
    position: relative;
    button{
      display: block;
      width: 7rem;
      height: .65rem;
      position: absolute;
      bottom: .1rem;
      left: .22rem;
    }
  }
</style>
