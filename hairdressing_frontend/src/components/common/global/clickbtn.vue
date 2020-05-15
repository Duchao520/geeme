<template lang="pug">
  .g-clickbtn(
  @click="clickBtn"
  )
    i.icon.iconfont.iconfont(
    :class="['icon-' + icon]"
    )
    span.btn-title(:style="cssChange ? 'vertical-align: 0%;' : 'vertical-align: middle;'") {{ title }}
</template>
<script>
export default {
  props: {
    title: String, // 标题
    icon: String, // 图标
    mark: String, // 传入的标志
    cssChange:Boolean // 传入的样式标识
  },
  data() {
    return {

    }
  },
  methods: {
    clickBtn() {
      this.$emit('click', this.mark);
      if (this.mark) {
        this.$router.push(this.mark);
      }
    }
  },
}
</script>
<style lang="scss" scoped>
  .g-clickbtn {
    color: #58C9F3;
    font-size: 14px;
    display: inline-block;
    margin-left: 20px;
    cursor: pointer;

    .icon,
    .btn-title {
      vertical-align: middle;
    }

    .btn-title {
      margin-left: 6px;
    }
  }
</style>
