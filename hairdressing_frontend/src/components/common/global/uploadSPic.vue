<template lang="pug">
  .g-upload
    el-upload.pic-uploader(
      :style="{width: width, height: height}",
      :action="uploadUrl",
      :headers="myHeaders",
      :show-file-list="false",
      :on-success="handleAvatarSuccess",
      :before-upload="beforeAvatarUpload"
    )
      img.my-avatar(
        v-if="imgId",
        :src="formatPicImage(imgId, 'style', 146, 'someone')"
      )
      i.el-icon-plus.avatar-uploader-icon(
        :style="{width: width, height: height, 'line-height': (height + ' !important')}",
        v-else
      )
    .tip( :style="!isBanner && !isPhoto ? tipWidth ? 'width: ' + tipWidth : 'width: 200px' : ''" v-if="showTip")
      span( v-if="isBanner" ) 建议像素宽边900px以上，宽高比为2：1;
      span( v-if="isPhoto" ) 建议像素宽边900px以上，高度不限;
      br
      div(v-if="text")
        span {{text}}
        br
        span 支持jpg，png格式，大小不超过{{size}}M；
        br
        span 点击图片可重新上传
      span(v-else) 支持jpg，png格式，大小不超过{{size}}M；点击图片可重新上传
</template>
<script>
import * as api from '@/assets/js/interface'
import * as utils from '@/assets/js/utils'
import * as datas from '@/assets/js/datas'
export default {
  props: {
    width: String, // 上传框的宽度
    height: String, // 上传框的高度
    photo: String, // 上传图片默认显示
    size: Number, // 限制图片的大小，M为单位
    text: {
      type: String,
      default: ''
    },
    isBanner: { // 广告图片标识
      type: Boolean,
      default: false
    },
    isPhoto: { // 广告海报标识
      type: Boolean,
      default: false
    },
    showTip: {
      type: Boolean,
      default: true
    },
    tipWidth: String,
  },
  data() {
    return {
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      imgId: '',
    }
  },
  watch: {
    photo(val) {
      this.imgId = this.photo
    }
  },
  computed: {
    uploadUrl() {
      // 获取服务器端上传图片的URL
      return api.uploadPicture.URL
    },
    myHeaders() {
      return utils.getUploadHeader()
    },
  },
  created() {
    this.imgId = this.photo
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imgId = file.response.fileKey
      // 传值给父组件
      this.$emit('change', this.imgId)
    },
    beforeAvatarUpload(file) {
      const isJPG = utils.checkImgType(file.type)
      const isLt2M = file.size / 1024 /1024 <= this.size;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 ' + this.size + 'M!');
      }
      return isJPG && isLt2M;
    },
  },
}
</script>
<style lang="scss" scoped>
  .g-upload {
    position: relative;
    .pic-uploader {
      width: 70px;
      height: 70px;
      vertical-align: bottom;
      display: inline-block;
      border: 1px dashed #EBEBEA;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      .el-upload {
        width: 100%;
        height: -webkit-fill-available;
        line-height: initial;
        .my-avatar {
          // width: 100%;
          height: -webkit-fill-available;
          height: -moz-fill-available;
          height: -ms-fill-available;
          height: -o-fill-available;
          height: fill-available;
        }
        .avatar-uploader-icon {
          width: 70px;
          height: 100%;
          line-height: 70px!important;
        }
      }
    }
    .tip {
      font-size: 12px;
      line-height: 20px;
      display: inline-block;
      vertical-align: bottom;
      margin-left: 15px;
      color: #999999;
    }
  }
</style>
