<template>
    <input class="geeme-numinput" :value="value" :style="style" @input="onInput" @blur="onBlur"/>
</template>

<script>

export default {
  props: {
    width: {
      type: Number,
      default: 40,
    },
    height: {
      type: Number,
      default: 35,
    },
    max: {
      type: Number,
      default: 999,
    },
    default: {
      type: Number,
      default: 0,
    },
    id: Number,
    value: Number,
  },
  data() {
    return {
      style: {
        width: `${this.width}px`,
        height: `${this.height}px`,
      }
    }
  },
  methods: {
    onInput(e) {
      const element = e.target
      // 去除非数字字符
      element.value = element.value.replace(/\D/g, '')
      // 去除多余的0
      if (element.value.match(/^0\d+/)) {
        element.value = element.value.substr(1)
      }
      // 默认值
      if (element.value.length === 0) {
        element.value = this.default
      }
      if (parseInt(element.value) > this.max) {
        this.$message.warning(`最大值不允许超过${this.max}`)
        element.value = this.max
      }
    },
    onBlur(e) {
      this.$emit('blur', {
        id: this.id,
        value: parseInt(e.target.value)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.geeme-numinput {
  border: 1px solid rgba(220, 223, 230, 1);
  border-radius:4px; 
  text-align: center;
}
</style>