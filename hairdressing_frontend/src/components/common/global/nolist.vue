<template lang="pug">
  .g-nolist
    .nolist-content
      img.img(
        :src="img"
      )
      .tip {{ tip }}
      g-btn(
        :name="btnname",
        :size="'large'",
        :type="'red'",
        :radius="'rpx'",
        :mark="btnurl",
        v-if="showBtn",
        @click="operate"
      )
</template>
<script>
export default {
  props: {
    img: String,
    tip: String,
    btnname: String,
    btnurl: String,
    showBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  methods: {
    operate(data) {
      this.$emit("todo",data);
    }
  }
};
</script>
<style lang="scss">
.g-nolist {
  text-align: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 96px;
  .nolist-content {
    .img {
      width: 300px;
    }
    .tip {
      padding: 50px 0 30px 0;
      color: #999999;
      font-size: 16px;
    }
  }
}
</style>