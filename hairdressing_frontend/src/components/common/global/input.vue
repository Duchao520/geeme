<template lang="pug">
.g-input
  .input-wrap
    input(
      :id="mark",
      :type="type",
      placeholder=" ",
      v-model.trim="val",
      @input="change"
    )
    label.input-label(
      :for="mark",
      :data-label="placeholder",
    )
    i.clear.icon.iconfont.icon-icon_ope_cancel(
      v-show="!!val",
      @click="clear('val')"
    )
  g-tip(
    :position="'right'",
    :list="list"
  )

</template>
<script>
export default {
  props: {
    type: String, // 输入框的类型
    mark: String, // 输入框的标志
    value: String, // 输入框的值
    placeholder: String // 密码提示文字
  },
  data() {
    return {
      val: '',
      list: [{
        name: '6-20位数字、字母、标点符号组合（不可有空格）'
      }, {
        name: '至少包括数字、字母、标点中的两种'
      }, {
        name: '字母区分大小写'
      }]
    }
  },
  watch: {
    value(val) {
      this.val = this.value
    }
  },
  methods: {
    // 清空输入框
    clear(type) {
      this[type] = ''
      this.$emit('change', {
        mark: this.mark,
        val: this.val
      })
    },
    // 输入框change事件
    change() {
      if (!!this.val) {
        this.$emit('change', {
          mark: this.mark,
          val: this.val
        })
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.g-input {
  width: 100%;
  position: relative;
  &:hover {
    .g-tip {
      display: block;
    }
  }
  input {
    outline: none;
    display: block;
    width: 100%;
    height: 55px;
    font-size: 16px;
    line-height: 55px;
    color: #333;
    background-color: transparent;
    background-image: none;
    border: none;
    border-bottom: 1px solid #EBEBEB;
    text-indent: 15px;
    &:not(:placeholder-shown) ~ label:before {
      font-size: 12px;
      bottom: 55px;
    }
    &:focus ~ label:before {
      font-size: 12px;
      bottom: 55px;
      color: #9B9B9B;
    }
    &:focus ~ label:after {
      background-repeat: no-repeat;
      background-size: 1000% 1000%;
      background-image: radial-gradient(circle, #E22C37 10%, rgba(0, 0, 0, 0) 11%) !important;
    }
  }
  label {
    width: 100%;
    display: inline-block;
    &::before {
      content: attr(data-label);
      display: block;
      position: absolute;
      color: #9B9B9B;
      left: 15px;
      bottom: 25px;
      -webkit-transition: all .15s ease-in-out;
      transition: all .15s ease-in-out;
    }
    &::after {
      content: '';
      position: absolute;
      display: -webkit-inline-box;
      display: -ms-inline-flexbox;
      display: inline-flex;
      text-decoration: none;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      text-align: center;
      bottom: 14px;
      left: 0;
      width: 100%;
      height: 2px;
      -webkit-transition: all 0.4s ease-in-out;
      transition: all 0.4s ease-in-out;
      background-position: 50%;
      background-size: 200% 200%;
    }
  }
  .clear {
    color: #9B9B9B;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);
    -webkit-transform: translate(0, -50%);
    -moz-transform: translate(0, -50%);
    -ms-transform: translate(0, -50%);
    -o-transform: translate(0, -50%);
  }
}
</style>