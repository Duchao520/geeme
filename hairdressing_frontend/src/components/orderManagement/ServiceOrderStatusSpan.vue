<template>
  <div class="span-root">
    <div v-if="detail.orderStatus==='WAITING_PAY'" style="color:#FF6D61">
      <span>未付款</span>
      <span class="vertical-string">|</span>
      <span>未服务</span>
    </div>
    <div v-if="detail.orderStatus==='WAITING_SERVICE'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span style="color:#FF6D61">未服务</span>
    </div>
    <div v-if="detail.orderStatus==='WAITING_ASSESSMENT'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span>服务时间：{{detail.serviceTime}}</span>
    </div>
    <div v-if="detail.orderStatus==='COMPLETED'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span>服务时间：{{detail.serviceTime}}</span>
    </div>
    <div v-if="detail.orderStatus==='CLOSED'">
      <span style="color:#FF6D61">未服务</span>
      <span class="vertical-string">|</span>
      <span>取消时间：{{detail.cancelTime}}</span>
    </div>
    <div v-if="detail.orderStatus==='GROUP_BUY_WAIT'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span style="color:#FF6D61">未服务</span>
    </div>



    <!--
      退款时间
    -->
    <div v-if="detail.orderStatus==='REFUNDED'">
      <span style="color:#FF6D61">未服务</span>
      <span class="vertical-string">|</span>
      <span>退款完成时间：{{refundAfterSaleTime.refundCompleteTime}}</span>
    </div>
    <div v-if="detail.orderStatus==='REFUNDING'">
      <span style="color:#FF6D61">未服务</span>
      <span class="vertical-string">|</span>
      <span>申请退款时间：{{refundAfterSaleTime.refundApplyTime}}</span>
    </div>
    <div v-if="detail.orderStatus==='REFUND_CANCELED'">
      <span style="color:#FF6D61">未服务</span>
      <span class="vertical-string">|</span>
      <span>退款取消时间：{{refundAfterSaleTime.refundCancelTime}}</span>
    </div>
    <div v-if="detail.orderStatus==='REFUND_REJECTED'">
      <span style="color:#FF6D61">未服务</span>
      <span class="vertical-string">|</span>
      <span>拒绝退款时间：{{refundAfterSaleTime.refundRejectTime}}</span>
    </div>
    <!--
      售后时间
    -->
    <div v-if="detail.orderStatus==='AFTER_SALES_CLOSE'">
      <span>服务时间：{{}}</span>
      <span class="vertical-string">|</span>
      <span>售后完成时间：{{}}</span>
    </div>

    <div v-if="detail.orderStatus==='CANCELED'">
      <span>服务时间：{{}}</span>
      <span class="vertical-string">|</span>
      <span>售后取消时间：{{}}</span>
    </div>
    <div v-if="detail.orderStatus==='AFTER_SALES_RIGHT'">
      <span style="color:#FF6D61">未服务</span>
      <span class="vertical-string">|</span>
      <span>申请售后时间：{{}}</span>
    </div>
    <!--
            已经理过的状态都在上方了，10种
    -->
  </div>
</template>
<script>
export default {
  props: {
    detail: Object
  },
  computed:{
    refundAfterSaleTime() {
      return this.detail.refundAfterSaleTime ? this.detail.refundAfterSaleTime : {}
    }
  }
};
</script>
<style lang="scss" scoped>
.span-root {
  color: #666666;
  font-size: 12px;
  > div {
    .vertical-string {
      margin: 0 10px;
      color: #ebecf0;
    }
  }
}
</style>

