<template>
  <div class="certi-upload-wrapper">
    <a-form-item
      label="商标证书"
      :validate-status="status"
      :help="help"
      v-bind="layout">
      <div class="upload-content">
        <div style="margin:20px 0 10px 20px;">
          <G-Upload-Pic 
            :size=1 
            :defaultKey="initValue"
            @success="onSuccess"
            :remove=true
            :preview=true
            @remove="onRemove"
          >
          </G-Upload-Pic>
          <p class="tip">支持jpg，png格式，大小不超过1M；</p>
        </div>
        <div>
          <img class="example" src="../assets/certificate.png" />
          <p class="tip">参考图样</p>
        </div>
      </div>
    </a-form-item>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    status: String,
    help: String,
    initValue: String,
    layout: {
      type: Object,
      default: () => ({ labelCol: { span: 3 }, wrapperCol: { span: 20 } })
    },
  },
  data() {
    return {
      
    }
  },
  methods: {
    onSuccess(key) {
      this.$emit('success', {
        name: this.name,
        value: key
      })
    },
    onRemove() {
      this.$emit('remove', this.name)
    }
  }
};
</script>

<style lang="less" scoped>
.certi-upload-wrapper {
  .normal-form-item();
  .upload-content {
    width: 527px;
    height: 230px;
    border: 1px solid #F0F1F4;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    .tip {
      line-height: 20px;
      color: rgba(153, 153, 153, 1);
      font-size: 12px;
      margin: 10px 0 0 0;
    }
    .example {
      width: 115px;
      height: 160px;
      margin: 30px 50px 0 0;
    }
  }
}
</style>