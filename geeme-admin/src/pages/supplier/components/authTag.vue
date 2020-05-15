<template>
  <span class="auth-tag" :style="{background: background}">{{text}}</span>
</template>

<script>
export default {
  props: {
    status: Number,
  },
  mounted() {
    this.initTag()
  },
  data() {
    return {
      text: '',
      background: '',
    }
  },
  watch: {
    status(val) {
      this.initTag(val)
    }
  },
  methods: {
    initTag() {
      switch(this.status) {
        case 1: 
          this.text = '已认证',
          this.background = '#58C9F3'
          break
        case 0:
          this.text = '未认证',
          this.background = '#BEC3C6'
          break
        case 2:
          this.text = '认证中',
          this.background = '#FCB322'
          break
        case 3:
          this.text = '认证失败',
          this.background = '#F52D56'
          break    
      }
    }
  }
};
</script>

<style lang="less" scoped>
.auth-tag {
  word-break: keep-all;
  padding: 2px 7px;
  font-size: 12px;
  line-height: 17px;
  //background: #58c9f3;
  border-radius: 8px;
  color: #ffffff;
}
</style>