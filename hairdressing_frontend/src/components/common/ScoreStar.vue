<template>
  <div class="scoreImg">
    <div :style="{'width':`${width}px`,'max-width':'75px'}"></div>
    <img src="@/assets/img/icon_stars.png" alt>
  </div>
</template>
<script>
export default {
  props: {
    score: Number
  },
  computed: {
    width(){
      return this.score/5*75
    }
  },
};
</script>
<style lang="scss" scoped>
.scoreImg {
  width: 75px;
  height: 14px;
  position: relative;
  margin-top: -2px;
  div {
    height: 100%;
    background: red;
  }
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 75px;
  }
}
</style>
