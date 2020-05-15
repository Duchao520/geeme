<template lang="pug">
  .g-num-input
    .reduce(
      @click="change('reduce')"
    )
      i.icon.iconfont.icon-icon_num_minus
    .num
      input(
        type="number",
        v-model="myVal",
        @input="change('modify')"
      )
    .add(
      @click="change('add')"
    )
      i.icon.iconfont.icon-icon_num_add
</template>
<script>
export default {
  props: {
    val: Number,
    limit: Number
  },
  data() {
    return {
      myVal: 0
    }
  },
  watch: {
    val(n) {
      this.myVal = n
    }
  },
  mounted() {
    this.myVal = this.val
  },
  methods: {
    change(type) {
      if (type === 'reduce' && this.myVal > this.limit) {
        this.myVal--
      } else if (type === 'add'){
        this.myVal++
      } 
      this.$emit('change', this.myVal)
    }
  },
}
</script>
<style lang="scss" scoped>
  .g-num-input {
    .reduce, .num, .add {
      display: inline-block;
      width: 32px;
      height: 32px;
      line-height: 32px;
      vertical-align: top;
      border: 1px solid #DCDFE6;
      text-align: center;
      color: #979797;
    }
    .reduce {
      cursor: pointer;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .num {
      cursor: pointer;
      border-left: none;
      border-right: none;
      input {
        display: block;
        border: none;
        width: 100%;
        height: 100%;
        text-align: center;
        outline: none;
      }
    }
    .add {
      cursor: pointer;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
</style>