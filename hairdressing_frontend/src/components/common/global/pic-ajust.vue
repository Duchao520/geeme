<template lang="pug">
  .g-pic-ajust
    .big-container
      .pic-container
        img.img(
          src="http://5b0988e595225.cdn.sohucs.com/images/20181219/7c43f965b41744bd8e0c219950b01d7e.jpeg"
        )
</template>
<script>
export default {
  props: {
    title: String
  },
  data() {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
  .big-container {
    width: 472px;
    height: 239px;
    background: red;
    text-align: center;
    .img {
      width: 180px;
      height: 180px;
    }
  }
</style>