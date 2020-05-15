<template lang="pug">
  button.g-btn(
    type="button",
    :class="[type, size, radius]"
    @click="clickBtn"
    :disabled='isdisabled'
    :loading="btnLoad"
  ) 
    span {{ name }}
</template>
<script>
export default {
  props: {
    name: String, // 按钮名称
    type: {
      // 按钮类型 red / blue1 / blue / detail / green / red / redFill
      type: String,
      default: "green"
    },
    size: {
      // 按钮尺寸 large / middle /small
      type: String,
      default: "large"
    },
    radius: {
      // 按钮圆角 rpx
      type: String,
      default: ""
    },
    mark: {
      // 传递的标识
      type: String,
      default: ""
    },
    isdisabled: {
      type: Boolean,
      default: false
    },
    btnLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    clickBtn() {
      if (!!this.mark) {
        this.$emit("click", {
          mark: this.mark
        });
        return;
      }
      this.$emit("click");
    }
  }
};
</script>
<style lang="scss" scoped>
.g-btn {
  font-size: 12px;
  border-radius: 3px;
  min-width: 32px;
  cursor: pointer;
  border: none;
  outline: none;
  // display: block;
  // size大小
  // 大
  &.large {
    width: 92px;
    height: 39px;
    line-height: 31px;
  }
  // 特大
  &.extend {
    width: 160px;
    height: 40px;
    line-height: 40px;
  }
  &.middle {
    width: 56px;
    height: 24px;
  }
  &.middle1 {
    padding: 10px 20px;
  }
  &.small {
    min-width: 72px;
    padding: 0 10px;
    height: 37px;
  }
  // 颜色
  // 红色
  &.red {
    font-size: 14px;
    color: #fff;
    background: #e6333f;
  }
  // 橙色
  &.orange {
    font-size: 14px;
    color: #fff;
    background: #ff6d61;
  }
  // 蓝绿色
  &.blue1 {
    font-size: 14px;
    color: #fff;
    background: #58c9f3;
  }
  // 白色
  &.black {
    font-size: 14px;
    color: #666666;
    background: #fff;
    border: 1px solid #c6c6c6;
  }
  // 灰色
  &.gray {
    font-size: 14px;
    color: #fff;
    background: #bec3c6;
    border: 1px solid #bec3c6;
    cursor: not-allowed;
  }
  // 绿色
  &.green {
    font-size: 14px;
    color: #fff;
    background: #75C74F;
    border: 1px solid #75C74F;
  }
  // 按钮圆角
  // 全圆
  &.rpx {
    width: 160px;
    height: 40px;
    border-radius: 40px;
  }
}
</style>