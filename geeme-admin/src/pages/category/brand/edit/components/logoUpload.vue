<template>
  <div class="brand-icon-upload-wrapper">

    <a-form-item
      :label="label"
      :required="required"
      :validate-status="status"
      :help="help"
      v-bind="layout">
      <G-Upload-Pic 
        :width=140 
        :size=1 
        @success="onRectangle" 
        :defaultKey="rectangleLogo" 
        class="logo-upload"
        >
      </G-Upload-Pic>
      <G-Upload-Pic 
        :size=1 
        @success="onSquare" 
        :defaultKey="squareLogo" 
        class="logo-upload"
      ></G-Upload-Pic>
      <p class="tip">支持jpg，png格式，大小不超过1M；<br />点击图片可重新上传</p>
      <div class="size-tip">
        <span class="tip1">长方形（600px*300px）</span>
        <span class="tip2">正方形（300px*300px）</span>
      </div>
    </a-form-item>

  </div>
</template>

<script>
export default {
  props: {
    name: String,
    label: String,
    required: Boolean,
    layout: {
      type: Object,
      default: () => ({ labelCol: { span: 3 }, wrapperCol: { span: 20 } })
    },
    status: String,
    help: String,
    initValue: String,
  },
  data() {
    return {
      rectangleLogo: '',
      squareLogo: '',
    }
  },
  watch: {
    initValue(val) {
      const logo = val.split('&')
      this.rectangleLogo = logo[0]
      this.squareLogo = logo[1]
    }
  },
  methods: {
    onRectangle(key) {
      this.rectangleLogo = key
      this.onSuccess()
    },
    onSquare(key) {
      this.squareLogo = key
      this.onSuccess()
    },
    onSuccess() {
      const value = `${this.rectangleLogo}&${this.squareLogo}`
      this.$emit('success', {
        name: this.name,
        value,
      })
    }
  }
}
</script>

<style lang="less" scoped>
.brand-icon-upload-wrapper {
  .normal-form-item();
  position: relative;
  .logo-upload {
    display:inline-block;
    margin-right:10px;
  }
  .tip {
    display: inline-block;
    line-height: 20px;
    color: rgba(153, 153, 153, 1);
    font-size: 12px;
    vertical-align: top;
  }
  .size-tip {
    padding: 10px 0 0 0;
    color: rgba(153, 153, 153, 1);
    font-size: 12px;
    line-height: 17px;
    margin: -15px 0 0 0;
    .tip1 {
      display: inline-block;
      width: 150px;
    }
  }
}
</style>