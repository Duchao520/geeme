<template>
  <div class="border-content-wrapper">
    <div class="title">{{title}}</div>
    <div class="content" :style="defualtStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    defualtStyle: Object
  }
};
</script>

<style lang="less" scoped>
.border-content-wrapper {
  .title {
    color: rgba(51, 51, 51, 1);
    font-size: 16px;
    margin: 0 0 8px 0;
  }
  .content {
    border-radius: 2px;
    border: 1px solid rgba(240, 241, 244, 1);
  }
}
</style>