<template lang="pug">
.center-person__wrap.modify-avatar
  .avatar-wrap
    .top-avatar
      g-upload-spic(
        @change="uploadPic",
        :photo="photo",
        :size="2"
      )
    div
      g-btn(
        :type="'blue1'",
        :size="'large'",
        :name="'保存'",
        @click.native="submit('saveAvatar')"
      )
</template>
<script>
export default {
  props: {
    photo: String
  },
  data() {
    return {
      picId: ''
    }
  },
  methods: {
    // 处理上传的图片
    uploadPic(data) {
      this.picId = data
    },
    submit(type) {
      this.$emit('submit', {
        type: type,
        data: this.picId === ''? this.photo: this.picId
      })
    }
  },
}
</script>
