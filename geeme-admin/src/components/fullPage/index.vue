<template>
  <div class="full-page-component">
    <div class="header">
      <div class="header-content">
        <p class="title">{{title}}</p>
        <span class="back" @click="back"><a-icon style="font-size: 14px;" type="left"/>关闭</span>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
  methods: {
    back() {
      this.$emit('back')
    }
  }
};
</script>

<style lang="less" scoped>
.full-page-component:extend(.full-page) {
  .header {
    height: 65px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 8px 0px rgba(174, 184, 229, 0.3);
    overflow: hidden;
    .header-content {
      height: 100%;
      width: calc(100% - 40px);
      margin: 0 auto;
      .title {
        color: rgba(51, 51, 51, 1);
        font-size: 18px;
        margin: 8px 0 4px 0;
        font-weight: 600;
      }
      .back {
        user-select: none;
        color: rgba(149, 149, 149, 1);
        font-size: 12px;
        cursor: pointer;
      }
    }
  }
  .content:extend(.normal-content-two) {
    .common-scrollbar();
    height: calc(100vh - 105px);
    margin: 20px;
  }
  @media screen and (min-width: 1480px) {
    .content:extend(.normal-content-two) {
      .common-scrollbar();
      height: calc(100vh - 105px);
      width: 1440px;
      margin: 20px auto;
    }
    .header {
      .header-content {
        height: 100%;
        width: 1440px;
        margin: 0 auto;
      }
    }
  }
}
</style>