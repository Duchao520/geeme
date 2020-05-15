<template>
  <span class="status-tag" :style="{background: background, borderColor: borderColor, color: color}">{{text}}</span>
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
      color: '',
      borderColor: '',
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
          this.text = '营业中',
          this.background = 'rgba(169, 216, 110, 0.1)'
          this.color = this.borderColor = '#A9D86E'
          break
        case 0:
          this.text = '已到期',
          this.background = 'rgba(255, 109, 97, 0.1)'
          this.color = this.borderColor = '#FF6D61'
          break
        case 2:
          this.text = '已下线',
          this.background = 'rgba(252, 179, 34, 0.1)'
          this.color = this.borderColor = '#FCB322'
          break
        case 3:
          this.text = '试用中',
          this.background = 'rgba(56, 202, 192, 0.1)'
          this.color = this.borderColor = '#41CAC0'
          break   
        case 4:
          this.text = '试用中',
          this.background = 'rgba(112, 113, 113, 0.1)'
          this.color = this.borderColor = '#707171'
          break  
      }
    }
  }
};
</script>

<style lang="less" scoped>
.status-tag {
  word-break: keep-all;
  padding: 1px 4px;
  font-size: 12px;
  line-height: 17px;
  border-radius: 8px;
  border: 1px solid;
}
</style>