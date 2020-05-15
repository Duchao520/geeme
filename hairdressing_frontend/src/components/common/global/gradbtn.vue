<template lang="pug">
  button.g-gradbtn(
    @click="btnClick"
  ) {{ title }}
    i.icon.iconfont.add_btn(
      :class="['icon-' + icon]"
    )
</template>
<script>
export default {
  props: {
    title: String,
    mark: String,
    icon: String
  },
  data() {
    return {

    }
  },
  methods: {
    btnClick(data) {
      this.$emit('click', this.mark)
    }
  }
}
</script>
<style lang="scss" scoped>
  .g-gradbtn {
    width: 140px;
    height: 40px;
    border: none;
    background: -webkit-gradient(linear, right top, left top, from(#FB598F), to(#F52D56));
    background: linear-gradient(to left, #FB598F, #F52D56);
    color: #fff;
    font-size: 16px;
    outline: none;
    border-radius: 20px;
    cursor: pointer;
    padding-left: 12px;
    line-height: 40px;
    .icon {
      width: 17px;
      height: 17px;
      vertical-align: middle;
      margin-left: 12px;
      color: #fff;
      font-size: 14px;
      padding: 4px;
      border-radius: 50%;
      background: #F6315B;
    }
  }
</style>