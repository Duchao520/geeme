<template>
  <div class="upload-root">
    <el-upload
      style="margin-left:0"
      class="avatar-uploader"
      :action="uploadUrl"
      :headers="myHeaders"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="value" :src="utils.formatPicImg(value)">
      <i v-else class="icon iconfont icon-icon_num_add"></i>
    </el-upload>
    <p class="tip">{{tip}}</p>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as api from "@/assets/js/interface";

export default {
  props: {
    value: String,
    tip:String,
    size: Number,
    uploadType: {
      type: String,
      default: '头像'
    }
  },
  data() {
    return {
      utils: utils
    };
  },
  computed: {
    uploadUrl() {
      return api.uploadPicture.URL;
    },
    myHeaders() {
      return utils.getUploadHeader();
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.$emit("input", file.response.fileKey);
      this.$emit("success")
    },
    beforeAvatarUpload(file) {
      const isJPG = utils.checkImgType(file.type)
      const isLt2M = file.size / 1024 /1024 < this.size;
      if (!isJPG) {
        this.$message.error('上传'+this.uploadType+'图片只能是 JPG/PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传'+this.uploadType+'图片大小不能超过 ' + this.size + 'M!');
      }
      return isJPG && isLt2M;
    },
  }
};
</script>
<style lang="scss" scoped>
.upload-root{
    /deep/ .el-upload.el-upload--text{
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            width: 100px;
            height: 100px;
            display: block;
            box-sizing: border-box;
        }
        .icon-icon_num_add{
            font-size: 30px;
            font-weight: 600;
            color: #8C939D;
        }
    }
    .tip{
        line-height: 20px;
        font-size: 12xp;
        color: #999999;
        width: 240px;
        line-height: 20px;
    }
}
</style>
