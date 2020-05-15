<template>
  <a-form-item :label="label" v-bind="layout">{{initValue}}</a-form-item>
</template>

<script>
export default {
  props: {
    label: String,
    initValue: [String, Number,Boolean],
    layout: {
      type: Object,
      default: () => ({ labelCol: { span: 3 }, wrapperCol: { span: 7 } })
    }
  },
  data() {
    return {}
  },
}
</script>

<style lang="less" scoped>
.normal-form-item();
</style>