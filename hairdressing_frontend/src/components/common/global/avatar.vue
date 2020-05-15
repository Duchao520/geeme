<template lang="pug">
  #img-box
    .large.img
      span.spanImg(
        :style="{backgroundImage: 'url(' + formatPicImage(pic, 'circle', 160, 'someone', six) + ')'}"
      )
      //- img(:src="formatPicImage(pic?pic:remarkPic, 'circle', 160, 'someone')")
    .small-box
      .small.img
        el-upload(
          :disabled="disabled"
          style="margin-left:0"
          class="avatar-uploader"
          :action="uploadUrl"
          :headers="myHeaders"
          :show-file-list="false"
          :on-success="uploadPic"
          :before-upload="beforeAvatarUpload"
        )
          el-row(type="flex" justify="center" class="g-upload" v-if="!disabled")
            i(class="icon iconfont icon-icon_ope_add")
          span.spanImg(
            :style="{backgroundImage: 'url(' + formatPicImage(remarkPic?remarkPic:remarkPic, 'circle', 70, 'someone', six) + ')'}"
          )
          //- img(:src="formatPicImage(remarkPic?remarkPic:remarkPic, 'circle', 70, 'someone')")
        p.title {{ stext }}
</template>
<script>
import * as utils from '@/assets/js/utils'
import * as api from "@/assets/js/interface";
export default {
  props: {
    pic: String,
    remarkPic:String,
    smallTitle: String,
    stext: String,
    six: {
      type: String,
      default: ''
    },
    disabled: Boolean
  },
  data() {
    return {
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      sendData: false
    }
  },
  computed: {
    myHeaders() {
      return utils.getUploadHeader();
    },
    uploadUrl() {
      return api.uploadPicture.URL;
    },
  },
  methods: {
    uploadPic(data) {
      this.sendData = true
      this.$emit('uploadPic',data)
    },
    beforeAvatarUpload(file) {
      const isJPG = utils.checkImgType(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2M!");
      }
      return isJPG && isLt2M;
    },
  }
}
</script>
<style lang="scss">
  #img-box .avatar-uploader .el-upload {
  border-radius: 50%;
}
</style>
<style lang="scss" scoped>

@import '@/assets/css/theme.scss';
  #img-box {
    position: relative;
    font-size: 12px;
    color: $font_color1;
    .img {
      &.large {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        overflow: hidden;
        .spanImg {
          width: 160px;
          height: 160px;
          background-size: cover;
          background-position: center;
          display: block;
        }
      }
    }
    .small-box {
      position: absolute;
      bottom: -60px;
      left: 130px;
      text-align: center;
      .small {
        width: 77px;
        height: 77px;
        .avatar-uploader {
          width: 100%;
          height: 100%;
          display: block;
          &:hover{
            .g-upload{
              display: block;
            }
          }
        }
        .g-upload{
          position: absolute;
          width: 100%;
          height: 100%;
          display: none;
          background: rgba(222,222,222,.9);
          i{
            font-size: 29px;
            color: #fff;
            line-height: 70px;
          }
        }
        .spanImg {
          width: 77px;
          height: 77px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          display: block;
        }
        .title{
          margin-top: 10px;
        }
      }
    }
  }
</style>