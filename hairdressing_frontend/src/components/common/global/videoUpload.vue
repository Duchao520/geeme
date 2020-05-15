<template>
  <div class="video-upload" v-loading.fullscreen="uploading">
    <input class="video-input" id="videoInput" type="file" accept="video/mp4" @change="handleChange" ref="videoInput"/>
    <div class="upload-cover">
      <div v-if="url" class="controls">
        <div 
          class="controls-icon" 
          @click="togglePlayer"
        >
          <i class="icon iconfont" :class="`icon-icon_video_${playing ? 'pause' : 'play'}`"></i>
        </div>
        <video @ended="videoEnd" loop ref="videoDom" class="video-item" width="148" height="148">
          <source :src="`${IMAGE_URL}/${url}`" type="video/mp4"/>
        </video>
      </div>
      <label for="videoInput" class="label-masker" v-else>
        <i class="el-icon-plus"></i>
      </label>
    </div>
    <i v-if="url" class="icon iconfont icon-icon_operate_delete" @click="deleteVideo"></i>
  </div>
</template>

<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
    limit: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      uploading: false,
      IMAGE_URL: IMAGE_URL,
      playing: false, 
    }
  },
  methods: {
    handleChange(e) {
      const file = e.target.files[0]
      if (!file) return
      this.uploadFiles(file)
    },
    uploadFiles(file) {
      if (file.size / 1024 / 1024 > this.limit) {
        this.$message.error(`上传视频大小不能超过${this.limit}M!`)
        return false
      }
      this.upload(file)
    },
    upload(file) {
      this.$refs.videoInput.value = null
      let config = { headers: {"Content-Type": "multipart/form-data"} }
      let params = new FormData()
      params.append('file', file)
      this.uploading = true
      axios
        .post(this.uploadUrl, params, config).then(res => {
          res.success && this.$emit('onChanged', res.fileKey)
        })
        .catch(err => {})
        .then(() => {
          this.uploading = false
        })
    },
    deleteVideo() {
      this.$emit('onChanged', '')
    },
    togglePlayer() {
      let dom = this.$refs.videoDom
      // console.log( dom.duration + 's')
      if (this.playing) {
        dom.pause()
      } else {
        // dom.playbackRate = 2
        dom.play()
      }
      this.playing = !this.playing
    },
    videoEnd() {
      this.playing = false
    }
  },
  computed: {
    uploadUrl() {
      return api.uploadPicture.URL;
    },
    myHeaders() {
      return utils.getUploadHeader();
    },
  },
}
</script>
<style lang="scss" scoped>
.video-upload {
  width: 148px;
  height: 148px;
  position: relative;
  .upload-cover, .label-masker {
    position: absolute;
    width: 148px;
    height: 148px;
  }
  .label-masker { 
    left: 0; 
    font-size: 24px;
    line-height: 148px;
    text-align: center;
    border-radius: 6px;
    border: 1px dashed #333;
    cursor: pointer;
  }
  .video-item {
    border: 1px solid rgba(51, 51, 51, .7);
    border-radius: 6px;
  }
  .controls {
    width: 100%;
    height: 100%;
    position: relative;
    .controls-icon {
      position: absolute;
      display: none;
      width: 48px;
      height: 48px;
      top:50%;
      left: 50%;
      z-index: 1;
      transform: translate(-50%,-50%);
      border-radius: 50%;
      cursor: pointer;
      line-height: 48px;
      text-align: center;
      color: #fff;
      background: rgba(108,108,108, 0.7);
    }
    .iconfont {
      font-size: 48px;
    }
    &:hover .controls-icon {
      display: block;
    }
  }
  
}
.video-input {
  width: 1px;
  height: 1px;
  position: absolute;
  z-index: -1;
}
.icon-icon_operate_delete {
  position: absolute;
  bottom: -5px;
  right: -24px;
  cursor: pointer;
}
</style>