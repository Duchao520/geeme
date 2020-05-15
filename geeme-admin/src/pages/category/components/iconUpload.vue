<template>
  <div class="icon-upload-wrapper">

    <a-form-item
      label="分类图标"
      :required=true
      :validate-status="status"
      :help="help"
      v-bind="layout">
      <a-radio-group v-model="iconOrigin">
        <a-radio :value="false" class="choose">
          <span>自定义上传</span>
          <div class="radio-content">
            <G-Upload-Pic :size=1 @success="onSuccess" :defaultKey="initValue"
                          style="display:inline-block;"></G-Upload-Pic>
            <p class="tip">点击图片可修改<br/>支持jpg，png格式，建议像素300*300px，大小不超过1M；</p>
          </div>
        </a-radio>

        <a-radio :value="true" class="choose">
          <span>从素材库选择</span>
          <choose-image
            class="radio-content"
            v-model="currentImage"
            @success="onSuccess"
            v-bind="$attrs"
            @change="onSuccess"
          ></choose-image>
        </a-radio>
      </a-radio-group>
    </a-form-item>
  </div>
</template>

<script>
  import ChooseImage from "@/components/ChooseImage/index"

  export default {
    components: {ChooseImage},
    props: {
      layout: {
        type: Object,
        default: () => ({labelCol: {span: 3}, wrapperCol: {span: 20}})
      },
      status: String,
      help: String,
      initValue: String,
    },
    data() {
      return {
        iconOrigin: false,
        currentImage: ""
      }
    },
    methods: {
      onSuccess(data) {
        this.$emit('success', data);
      },
      init(data) {
        this.iconOrigin = data.iconOrigin;
        this.currentImage = data.icon
      }
    }
  }
</script>

<style lang="less" scoped>
  .icon-upload-wrapper {
    .ant-form-item {
      /deep/ .ant-form-item-control {
        margin-top: 10px;
      }
    }

    .choose {
      display: block;

      .radio-content {
        margin-top: 10px;
      }
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
