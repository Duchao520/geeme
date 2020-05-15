<template>
  <div class="icon-upload-wrapper">

    <a-form-item
      label="备注头像"
      :required=true
      :validate-status="status"
      :help="help"
      v-bind="layout">
      <G-Upload-Pic :size=1 @success="onSuccess" :defaultKey="initValue" style="display:inline-block;"></G-Upload-Pic>
      <p class="tip">支持jpg，png格式，大小不超过1M；<br />点击图片可重新上传</p>
    </a-form-item>

  </div>
</template>

<script>
export default {
  props: {
    layout: {
      type: Object,
      default: () => ({ labelCol: { span: 3 }, wrapperCol: { span: 20 } })
    },
    status: String,
    help: String,
    initValue: String,
  },
  data() {
    return {}
  },
  methods: {
    onSuccess(data) {
      this.imgKey = data
      this.$emit('success', data)
    }
  }
}
</script>

<style lang="less" scoped>
.icon-upload-wrapper {
  .normal-form-item();
  .choose {
    display:block; 
    margin: 9px 0 10px 0;
  }
  .tip {
    margin: 0 0 0 10px;
    display: inline-block;
    line-height: 20px;
    color: rgba(153, 153, 153, 1);
    font-size: 12px;
  }
}
</style>