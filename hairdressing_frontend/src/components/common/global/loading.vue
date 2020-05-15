<template lang="pug">
  .g-loading
    img.img(
      :src="img"
    )
</template>
<script>
export default {
  data() {
    return {
      img: require('../../../../static/images/loading.gif')
    }
  }
}
</script>
<style lang="scss">
  .g-loading {
    width: 100%;
    height: 100%;
    position: relative;
    .img {
      width: 30%;
      height: 30%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  
</style>