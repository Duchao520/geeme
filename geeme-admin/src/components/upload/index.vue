<template>
<div class="geeme-upload-wrapper" :style="style">
  <a-upload 
    :action="uploadUrl" 
    :headers="headers"
    :beforeUpload="beforeUpload"
    @change="handleChange"
  >
    <!-- 普通模式 -->
    <div class="upload-content" type="upload" :style="style" v-if="type==='normal'">
      <!-- add icon -->
      <i class="iconfont add" v-show="initial">&#xe660;</i>
      <!-- loading -->
      <a-icon class="loading" type="loading" v-show="loading"/>
      <!-- img -->
      <img :src="utils.imgFormatter(imgSrc)" @load="onload" v-show="done && !loading" />
      <!-- mask -->
      <div class="mask" v-if="hasMask" @click="onMaskClick">
        <i class="iconfont" v-if="preview" @click="onPreview">&#xe704;</i>
        <i class="iconfont" v-if="remove" @click="onRemove">&#xe676;</i>
      </div>
    </div>
    <!-- 头像模式 -->
    <a-avatar :size="70" icon="user" v-if="type==='avatar' && reset" :src="utils.imgFormatter(imgSrc)"/>
  </a-upload>
  <!-- preview -->
  <a-modal v-if="preview" v-model="previewVisible" :footer="null" :width="modalWidth">
    <img :src="utils.imgFormatter(imgSrc)" :style="{width: previewWidth}" style="margin-top: 20px;"/>
  </a-modal>
</div>
</template>

<script>
import utils from '@/utils'
import { uploadUrl, uploadHeader } from '@/api/upload'
export default {
  props: {
    type: {
      type: String,
      default: 'normal'  // normal || avatar
    },
    width: {
      type: Number,
      default: 70,
    },
    height: {
      type: Number,
      default: 70,
    },
    size: {
      type: Number,
      default: 2,
    },
    preview: {
      type: Boolean,
      default: false,
    },
    remove: {
      type: Boolean,
      default: false,
    },
    defaultKey: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      utils,
      style: {
        width: `${this.width}px`,
        height: `${this.height}px`,
      },
      uploadUrl: uploadUrl,
      headers: uploadHeader(),
      loading: false,
      done: false,
      imgSrc: null,
      previewVisible: false,
      naturalWidth: 0,
      naturalHeight: 0,
      reset: true,
    }
  },
  watch: {
    defaultKey(val) {
      this.imgSrc = val
      this.done = true
    }
  },
  computed: {
    initial() {
      return !this.loading && !this.done
    },
    hasMask() {
      return this.preview && this.remove && this.done
    },
    modalWidth() {
      if (this.naturalWidth < 1000) {
        return this.naturalWidth + 50
      } else {
        return 1050
      }
    },
    previewWidth() {
      if (this.naturalWidth < 1000) {
        return `${this.naturalWidth}px`
      } else {
        return '1000px'
      }
    },
  },
  methods: {
    beforeUpload(file) {
      if (!this.checkImgType(file.type)) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!this.checkSize(file.size)) {
        this.$message.error(`上传图片大小不能超过${this.size}M！`)
        return false
      }
      return true
    },
    checkImgType(type) {
      return /(jpg|jpeg|png)$/.test(type)
    },
    checkSize(size) {
      return size/ 1024 /1024 < this.size
    },
    handleChange(info) {
      // 修复组件中存在的问题: 如果 beforeUpload 返回 false， 就不该进入该方法体内
      const file = info.file
      if (!this.checkImgType(file.type)) {
        return
      }
      if (!this.checkSize(file.size)) {
        return
      }
      // .....
      this.loading = true
      const status = info.file.status
      const res = info.file.response || {}
      if (status === 'uploading') {
        return
      }
      if (status === 'done' || status === 'error') {
        this.loading = false
      }
      if (status === 'done' && res.code === 1200) {
        this.$message.success('上传成功')
        this.imgSrc = res.data.fileKey
        this.done = true
        this.$emit('success', this.imgSrc)
        // 如果处于 avatar模式
        if (this.type === 'avatar') {
          this.reset = false
          this.$nextTick(() => {this.reset = true})
        }
        return
      }
      if (status === 'error' || res.code !== 1200) {
        this.$message.error('上传失败')
        if (this.imgSrc == null) { // 对应第一次上传失败, 返回初始状态
          this.done = false
        }
        return
      }
    },
    onload(e) {
      const element = e.target
      this.naturalWidth = element.naturalWidth
      this.naturalHeight = element.naturalHeight
      const proportion = this.naturalWidth / this.naturalHeight
      if (proportion >= 1) {
        [element.style.width, element.style.height] = [`${this.width}px`, `${this.width/proportion}px`]
      } else {
        [element.style.width, element.style.height] = [`${this.height*proportion}px`, `${this.height}px`]
      }
    },
    /* mask 存在时阻止点击上传事件被触发 */
    onMaskClick(e) {
      e.stopPropagation()
    },
    onRemove() {
      this.imgSrc = null
      this.done = false
      this.$emit('remove')
    },
    onPreview() {
      this.previewVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.geeme-upload-wrapper {
  overflow: hidden;
  .upload-content {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #DCDFE6;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    .add {
      font-size: 23px;
      color: #8C939D;
    }
    .loading {
      font-size: 23px;
      color: #75C74F
    }
    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      transform: scale(1.1, 1.1);
      align-items: center;
      justify-content: center;
      i {
        color: #ffffff;
        margin: 0 5px;
        cursor: pointer;
        font-size: 12px;
      }
    }
    &:hover {
      .mask {
        display: flex;
      }
    }
  }
}

</style>