<template>
  <div class="programa-card-box">
    <div class="card-box-container">
      <img :src="require(`@/assets/images/center_NoviceGuide/${icon}.png`)">
      <div class="title">{{title}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'programa-card',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
.programa-card-box {
  display: inline-block;
  width: 240px;
  height: 90px;
  border-radius: 8px;
  box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.3);
  &:hover {
    cursor: pointer;
  }
  .card-box-container {
    display: flex;
    img {
      width: 34px;
      height: 34px;
      margin-top: 28px;
      margin-left: 20px;
    }
    .title {
      flex: 1;
      line-height: 90px;
      margin-left: 10px;
    }
  }
}
</style>
