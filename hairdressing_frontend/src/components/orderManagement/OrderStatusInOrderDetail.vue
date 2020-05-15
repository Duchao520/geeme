<template>
  <div style="display:flex; height:100px;">
    <div class="iconBox">
      <!-- 待付款 -->
      <i
        class="icon iconfont icon-icon_order_pay"
        style="color:#F52D56;"
        v-if="status === 'WAITING_PAY'"
      ></i>
      <!-- 已关闭 -->
      <i
        class="icon iconfont icon-icon_order_close"
        style="color:#707171;"
        v-if="status === 'CLOSED' || status==='REFUND_AFTER_SALES_CANCEL' || status==='REFUND_CANCELED'"
      ></i>
      <!-- 已拒绝 -->
      <i
        class="icon iconfont icon-icon_order_refund"
        style="color:#707171;"
        v-if="rejectRefund"
      ></i>
      <!-- 待服务 -->
      <i
        class="icon iconfont icon-icon_order_service"
        style="color:#58C9F3;"
        v-if="status === 'WAITING_SERVICE' || status === 'GROUP_BUY_WAIT'"
      ></i>
      <!-- 待评价 -->
      <i
        class="icon iconfont icon-icon_order_evaluate"
        style="color:#FCB322;"
        v-if="status === 'WAITING_ASSESSMENT'"
      ></i>
      <!-- 已完成 -->
      <i
        class="icon iconfont icon-icon_order_done"
        style="color:#A9D86E;"
        v-if="status === 'COMPLETED'"
      ></i>
      <!-- 售后中 -->
      <i
        class="icon iconfont icon-icon_order_refund"
        style="color:#707171;"
        v-if="status === 'AFTER_SALES_RIGHT'"
      ></i>
      <!-- 售后完成 -->
      <i
        class="icon iconfont icon-icon_order_done"
        style="color:#707171;"
        v-if="status === 'AFTER_SALES_CLOSE'"
      ></i>
      <!-- 退款中 -->
      <i
        class="icon iconfont icon-icon_order_refund"
        style="color:#707171;"
        v-if="status === 'REFUNDING'"
      ></i>
      <!-- 退款完成 -->
      <i
        class="icon iconfont icon-icon_order_done"
        style="color:#707171;"
        v-if="status === 'REFUNDED'"
      ></i>
      <!-- 待发货 -->
      <i
        class="icon iconfont icon-icon_order_receive"
        style="color:#58C9F3;"
        v-if="status === 'WAITING_SEND' || status === 'WAITING_DELIVER'"
      ></i>
      <!-- 待收货 -->
      <i
        class="icon iconfont icon-icon_order_send"
        style="color:#FF6D61 ;"
        v-if="status === 'WAITING_CONFIRM'"
      ></i>
    </div>
    <div class="order-status">
      <div class="status">
        <p class="h4">订单状态：{{status|statusFilter}}</p>
        <g-button name="撤回" v-if="rejectRefund" @click="$emit('whthdrawRefund')"
                  icon="icon_operate_recover"></g-button>
      </div>
      <!-- 待付款 -->
      <p v-if="status === 'WAITING_PAY'">客户已下单，请尽快联系客户{{isProduct?'':'预约或者'}}付款</p>
      <!-- 已关闭 -->
      <p
        v-if="status === 'CLOSED'"
      >取消时间:&nbsp;&nbsp;{{orderInfo.cancelTime}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消原因:&nbsp;&nbsp;{{orderInfo.cancelReason}}</p>
      <!-- 待服务 -->
      <p v-if="status === 'WAITING_SERVICE'">客户已付款，等待客户到店服务，请尽快联系客户预约或者到店服务</p>
      <!-- 待拼单 -->
      <p v-if="status === 'GROUP_BUY_WAIT'">客户已付款，等待客户完成拼单</p>
      <!-- 待评价 -->
      <p v-if="status === 'WAITING_ASSESSMENT'">{{isProduct?'客户已经确认收货，请邀请客户评价':'客户完成结算，请邀请客户评价'}}</p>
      <!-- 已完成 -->
      <!-- <p v-if="status === 'COMPLETED'"></p> -->
      <!-- 售后中 -->
      <p v-if="status === 'AFTER_SALES_RIGHT'">客户申请售后，请及时处理</p>
      <!-- 售后完成 -->
      <!-- <p v-if="status === 'AFTER_SALES_CLOSE'"></p> -->
      <!-- 退款中 -->
      <p v-if="status === 'REFUNDING'">客户申请退款，请及时处理</p>
      <!-- 退款完成 -->
      <!-- <p v-if="status === 'REFUNDED'"></p> -->
      <!-- 待发货 -->
      <p v-if="status === 'WAITING_SEND' || status === 'WAITING_DELIVER'">客户已付款，等待商户发货，请尽快发货</p>
      <!-- 待收货 -->
      <p v-if="status === 'WAITING_CONFIRM'">您已发货，请耐心等待客户收货</p>
      <!-- 已取消 -->
      <p
        v-if="status === 'REFUND_AFTER_SALES_CANCEL' || status === 'REFUND_CANCELED'"
      >取消时间：{{cancelTime}}</p>
      <!-- 已拒绝 -->
      <p
        v-if="rejectRefund"
      >拒绝理由：{{rejectReason}}</p>
    </div>
  </div>
</template>
<script>
  export default {
    computed: {
      status() {
        return this.orderInfo.orderStatus;
      },
      orderInfo() {
        return this.detail.orderInfo
      },
      cancelTime() {
        let status = this.detail.orderInfo.orderStatus;
        if (status==="REFUND_CANCELED") {
          if(this.detail.refundInfo){
            return this.detail.refundInfo.cancelTime;
          }else{
            return this.detail.refundOrderInfo.cancelTime;
          }
        } else if(status==="REFUND_AFTER_SALES_CANCEL") {
          return this.detail.afterSaleInfo.cancelTime;
        }
      },
      rejectRefund() {
        return this.status === 'REFUND_AFTER_SALES_REJECT' || this.status === "REFUND_REJECTED"
      },
      rejectReason() {
        if (this.detail.refundInfo) {
          return this.detail.refundInfo.rejectReason
        } else {
          return this.detail.refundOrderInfo.rejectReason
        }
      }
    },
    props: {
      detail: Object,
      isProduct: Boolean
    },
    filters: {
      statusFilter(status) {
        let map = {
          WAITING_PAY: '待付款',
          WAITING_DELIVER: "待发货",
          WAITING_CONFIRM: "待收货",
          WAITING_SERVICE: "待服务",
          WAITING_ASSESSMENT: "待评价",
          COMPLETED: "已完成",
          CLOSED: "已关闭",
          REFUNDING_OR_AFTER_SALES: "退款/售后",
          REFUNDING: "退款中",
          REFUNDED: "退款完成",
          AFTER_SALES_RIGHT: "售后中",
          AFTER_SALES_CLOSE: "售后完成",
          REFUND_AFTER_SALES_REJECT: "退款已拒绝",
          REFUND_REJECTED: "退款已拒绝",
          REFUND_AFTER_SALES_CANCEL: "已取消",
          REFUND_CANCELED: "已取消",
          GROUP_BUY_WAIT: "待拼单",
        }
        return map[status]
      }
    }
  };
</script>
<style lang="scss" scoped>
  .iconBox {
    width: 30px;
    height: 30px;
    margin-right: 12px;

    i {
      font-size: 30px;
    }
  }

  .order-status {
    .status {
      display: flex;
      align-items: center;

      .btn {
        margin: 0 0 0 10px;
      }
    }
    .h4 {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      margin-top: 0;
    }

    p {
      color: #999999;
      margin-top: 9px;
      font-size: 12px;
    }
  }


</style>
