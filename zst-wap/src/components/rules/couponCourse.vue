<template>
  <div class="couponCourse">
      <button>

      </button>
  </div>
</template>

<script>
  export default {
    name: "couponCourse"
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/global";

  .couponCourse {
    width: 100%;
    height: 24.61rem;
    background: url($ctxpath + "/static/customImgs/rules/couponCourse.png") center center no-repeat;
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
