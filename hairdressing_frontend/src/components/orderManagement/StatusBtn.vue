<template>
  <div>
    <p style="background:#E22C37;" v-if="status === 'WAITING_PAY'">待付款</p>
    <p style="background:#58C9F3;" v-if="status === 'WAITING_SERVICE'">待服务</p>
    <p style="background:#FCB322;" v-if="status === 'WAITING_ASSESSMENT'">待评价</p>
    <p style="background:#A9D86E;" v-if="status === 'COMPLETED'">已完成</p>
    <p style="background:#BEC3C6;" v-if="status === 'CLOSED'">已关闭</p>
    <p style="background:#707171;" v-if="status === 'REFUNDING'">退款中</p>
    <p style="background:#707171;" v-if="status === 'AFTER_SALES_RIGHT'">售后中</p>
    <p style="background:#A9D86E;" v-if="status === 'AFTER_SALES_CLOSE'">售后完成</p>
    <p style="background:#BEC3C6;" v-if="status === 'CANCELED' || status === 'REFUND_AFTER_SALES_CANCEL'">已取消</p>
    <p style="background:#E22C37;" v-if="status === 'REFUND_REJECTED' || status === 'REFUND_AFTER_SALES_REJECT'">已拒绝</p>
    <p style="background:#E22C37;" v-if="status === 'WAITING_DELIVER'">待发货</p>
    <p style="background:#FCB322;" v-if="status === 'WAITING_CONFIRM'">待收货</p>
    <p style="background:#A9D86E;" v-if="status === 'REFUNDED'">退款完成</p>
    <p style="background:#BEC3C6;" v-if="status === 'REFUND_CANCELED'">已取消</p>
    <p style="background:#E22C37;" v-if="status === 'GROUP_BUY_WAIT'">待拼单</p>
  </div>
</template>
<script>
export default {
  name: "StatusBtn",
  props: {
    status: String
  }
};
</script>
<style lang="scss" scoped>
p {
  display: inline-block;
  height: 18px;
  color: white;
  line-height: 18px;
  border-radius: 9px;
  margin-bottom: 10px;
  box-sizing: border-box;
  padding: 0 8px;
}
</style>

