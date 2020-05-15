<template>
  <el-dialog
    :width="width"
    :visible="dialogVisible"
    :before-close="handleClose"
    :append-to-body="appendBody"
  >
    <div class="dialog-body">
      <div class="icon">
        <i class="icon iconfont" :class="`icon-${icon}`" :style='{color: color}'></i>
      </div>
      <div class="right-box">
        <div class="title">{{title}}</div>
        <slot></slot>
      </div>
    </div>
    <div class="footer-btns">
      <el-button plain class="plain_gray_btn" v-if="rejectInfo" @click="handleClose">{{rejectInfo}}</el-button>
      <el-button class="normal_blue_btn" @click="handleResolve" :loading="btnLoad">{{resolveInfo}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'model-with-slot',
  props: {
    icon: {
      type: String,
      default: 'icon_order_close'
    },
    color: {
      type: String,
      default: '#FCB322'
    },
    appendBody: {
      type: Boolean,
      default: false
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    rejectInfo: {
      type: String,
      default: '取消'
    },
    resolveInfo: {
      type: String,
      default: '确定'
    },
    btnLoad: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '500px'
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleResolve() {
      this.$emit('resolve')
    }
  }
}
</script>
<style lang='scss' scoped>
.dialog-body {
  display: flex;
  flex-wrap: nowrap;
  div.icon {
    width: 50px;
    height: 50px;
    margin-left: 60px;
    margin-right: 15px;
    border-radius: 50%;
    .iconfont {
      font-size: 50px;
      line-height: 50px;
      // color: #fff;
    }
  }
  .right-box {
    flex: 1;
    .title {
      height: 32px;
      font-size: 20px;
      font-weight: 600;
    }
  }
}
.footer-btns {
  margin-top: 35px;
  display: flex;
  justify-content: flex-end;
}
</style>
