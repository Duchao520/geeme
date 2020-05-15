<template>
  <div class="cashier-default">
    <img src="@/assets/images/default/bg_default_order.png" class="img" alt>
    <span class="text">{{currentStatus==='recycle'?"暂无数据":"还没有订单，赶紧开个单"}}</span>
    <el-button
      class="error-button"
      v-if="currentStatus==='cashierList'&&checkHasBtnPermission('/shop-inner/choose-person','path')"
      @click="$emit('openBill')"
    >快速开单</el-button>
  </div>
</template>
<script>
export default {
  props: {
    currentStatus: String
  }
};
</script>
<style lang="scss" scoped>
.cashier-default {
  margin-top: 20px;
  border-radius: 5px;
  background: white;
  box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
  height: calc(100vh - 280px);
  display: flex;
  flex-direction: column;
  align-items: center;
  .img {
    width: 293px;
    margin-top: 100px;
  }
  .text {
    line-height: 80px;
    font-size: 16px;
    color: #999999;
  }
  .error-button {
    width: 160px;
    height: 40px;
    background: #f52d56;
    border-color: transparent;
    border-radius: 20px;
    font-size: 16px;
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
