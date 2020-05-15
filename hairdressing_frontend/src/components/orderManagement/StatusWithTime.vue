<template>
  <div class="status_time">
    <span v-if="status==='WAITING_DELIVER'">付款时间：{{detail.paymentTime}}</span>
    <span v-if="status==='WAITING_CONFIRM'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span>发货时间：{{detail.deliverStart}}</span>
    </span>
    <span v-if="status==='WAITING_ASSESSMENT'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span>收货时间：{{detail.confirmTime}}</span>
    </span>
    <span v-if="status==='COMPLETED'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span>评价时间：{{detail.assessmentTime}}</span>
    </span>
    <span v-if="status==='CLOSED'">关闭时间：{{detail.finishTime}}</span>


    <!--
      退款相关时间
    -->

    <span v-if="status==='REFUNDING' && detail.productOrderType==='REFUND_ORDER'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span>申请退款时间：{{refundAfterSaleTime.refundApplyTime}}</span>
    </span>
    <span v-if="status==='REFUNDED' && detail.productOrderType==='REFUND_ORDER'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span>退款完成时间：{{refundAfterSaleTime.refundCompleteTime}}</span>
    </span>
    <span v-if="status==='REFUND_AFTER_SALES_CANCEL' && detail.productOrderType==='REFUND_ORDER'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span>退款取消时间：{{refundAfterSaleTime.refundCancelTime}}</span>
    </span>
    <span v-if="status==='REFUND_AFTER_SALES_REJECT' && detail.productOrderType==='REFUND_ORDER'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span>退款拒绝时间：{{refundAfterSaleTime.refundRejectTime}}</span>
    </span>

    <!--
      售后相关时间
    -->

    <span v-if="status==='AFTER_SALES_RIGHT' && detail.productOrderType==='AFTER_SALE_ORDER'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span>申请售后时间：{{refundAfterSaleTime.afterSaleApplyTime}}</span>
    </span>

    <span v-if="status==='REFUND_AFTER_SALES_REJECT' && detail.productOrderType==='AFTER_SALE_ORDER'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span>拒绝售后时间：{{refundAfterSaleTime.afterSaleRejectTime}}</span>
    </span>

    <span v-if="status==='REFUND_AFTER_SALES_CANCEL' && detail.productOrderType==='AFTER_SALE_ORDER'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span>售后取消时间：{{refundAfterSaleTime.afterSaleCancelTime}}</span>
    </span>
    <span v-if="status==='AFTER_SALES_CLOSE' && detail.productOrderType==='AFTER_SALE_ORDER'">
      <span>付款时间：{{detail.paymentTime}}</span>
      <span class="vertical-string">|</span>
      <span>售后完成时间：{{refundAfterSaleTime.afterSaleCompleteTime}}</span>
    </span>
  </div>
</template>
<script>
  export default {
    props: {
      detail: Object
    },
    computed: {
      status() {
        return this.detail.productOrderStatus;
      },
      refundAfterSaleTime() {
        return this.detail.refundAfterSaleTime ? this.detail.refundAfterSaleTime : {}
      }
    }
  };
</script>
<style lang="scss" scoped>
  .status_time {
    .vertical-string {
      margin: 0 10px;
      color: #ebecf0;
    }
  }
</style>
