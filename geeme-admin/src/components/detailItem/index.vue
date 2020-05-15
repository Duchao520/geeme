<template>
  <div class="detail-item-wrapper">
    <div class="label" :style="{width: labelWidth}" v-html="label"></div>
    <div class="content" :style="{width: contentWidth}"><slot></slot></div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    layout: {
      type: Object,
      default: () => ({ label: 140, content: 500 })
    },
  },
  data() {
    return {}
  },
  computed: {
    labelWidth() {
      return `${this.layout.label}px`
    },
    contentWidth() {
      return `${this.layout.content}px`
    }
  }
}
</script>

<style lang="less" scoped>
.detail-item-wrapper {
  display: flex;
  .label {
    text-align: right;
    font-size: 14px;
    color: #666666;
    margin: 0 20px 0 0;
  }
  .content {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>