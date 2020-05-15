<template>
  <div class="upload-box">
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :headers="{Authorization: myHeaders}"
      :show-file-list="false"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :accept="accept"
    >
      <img
        class="avatar"
        v-if="superInfo.image" 
        :src="`${IMAGE_URL}/${superInfo.image}`" 
      >
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <p class="picture-tip" v-if="superInfo.tip">支持jpg，png格式，大小不超过{{ size }}M；点击图片可重新上传</p>
  </div>
</template>

<script>
import * as api from '@/assets/js/interface'
import * as utils from '@/assets/js/utils'
export default {
  props: {
    superInfo: {
      type: Object,
      default: () => {
        return {
          image: ''
        }
      }
    },
    size: {
      type: Number,
      default: 5
    },
    accept: {
      type: String,
      default: 'image/png, image/jpeg'
    }
  },
  data() {
    return {
      IMAGE_URL: IMAGE_URL
    }
  },
  methods: {
    handleSuccess(res, file) {
      let o = JSON.parse(JSON.stringify(this.superInfo))
      this.$emit('onSuccess', {...o, image: res.fileKey})
    },
    beforeUpload(file) {
      let isOverSize = file.size / 1024 / 1024 > this.size
      if (isOverSize) {
        this.$message.error(`文件超过${this.size}M了!`)
      } 
      return !isOverSize
    },
  },
  computed: {
    uploadUrl() {
      return api.uploadPicture.URL
    },
    myHeaders() {
      return utils.getCookieToken("geeme_pc_token")[2]
    },
  },
}
</script>

<style lang="scss" scoped>
.picture-tip {
  color: #9b9b9b;
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 24px;
}
</style>