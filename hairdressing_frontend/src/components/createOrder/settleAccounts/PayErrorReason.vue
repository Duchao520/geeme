<template>
  <div class="pay-error-reason">
    <i class="icon iconfont icon-icon_popup_plaint"></i>
    <p class="error-text">支付失败</p>
    <span class="error-reason">失败原因：{{errorInfo.message}}</span>
    <el-button class="error-button" @click="$emit('anewPay')">重新支付</el-button>
  </div>
</template>
<script>
export default {
  props: {
    errorInfo: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.pay-error-reason {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 65px;
  .iconfont {
    font-size: 50px;
    color: #f52d56;
  }
  .error-text {
    line-height: 30px;
    font-size: 18px;
    color: #333333;
  }
  .error-reason {
    color: #f52d56;
    font-size: 14px;
    line-height: 1;
    margin-bottom: 140px;
  }
  .error-button {
    width: 200px;
    height: 40px;
    background: #f52d56;
    border-color: transparent;
    color: white;
    transition: all 0.6s;
    &:hover {
      background: #e02047;
    }
    &:active {
      background: #d11d42;
    }
  }
}
</style>
