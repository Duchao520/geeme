<template>
  <div class="root">
    <h3>退款交易流水</h3>
    <div class="table">
      <div class="tabs" style="border-left: 1px solid #ebecf0;">
        <div class="tab-top">交易流水号</div>
        <div class="tab-bottom">{{refundTransactionStream.payNo || '-'}}</div>
      </div>
      <div class="tabs">
        <div class="tab-top">退款来源</div>
        <div class="tab-bottom">{{refundTransactionStream.paySource || '-'}}</div>
      </div>
      <div class="tabs">
        <div class="tab-top">退款方式 </div>
        <div class="tab-bottom">￥{{refundTransactionStream.payType || '-' }}</div>
      </div>
      <div class="tabs">
        <div class="tab-top">退款金额</div>
        <div class="tab-bottom">￥{{refundTransactionStream.received}}</div>
      </div>
      <div class="tabs" style="border-right: 1px solid #ebecf0;">
        <div class="tab-top">第三方支付退款编号</div>
        <div class="tab-bottom">{{refundTransactionStream.transactionNo || '-'}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    detail: Object
  },
  computed: {
    refundTransactionStream() {
      return this.detail.refundTransactionStream;
    }
  }
};
</script>
<style lang="scss" scoped>
.root {
  overflow: hidden;
}
h3 {
  font-size: 14px;
  margin: 12px 0;
}
.table {
  min-width: 760px;
  display: flex;
  .tabs {
    flex: auto;
    border: 1px solid #ebecf0;
    border-right: 0;
    border-left: 0;
    .tab-top {
      height: 34px;
      line-height: 34px;
      font-size: 12px;
      color: #5f6368;
      box-sizing: border-box;
      padding-left: 15px;
    }
    .tab-bottom {
      height: 34px;
      line-height: 34px;
      font-size: 12px;
      color: #333333;
      border-top: 1px solid #ebecf0;
      padding-left: 15px;
    }
  }
}

/deep/ .el-button {
  width: 62px;
  height: 28px;
  padding: 0;
  margin: 10px 0;
  float: right;
  font-size: 12px;
}
.infoBox {
  display: flex;
  img {
    display: inline-block;
    width: 70px;
    height: 70px;
    border-radius: 5px;
    background: #000;
    margin-right: 8px;
  }
  .goodsInfo {
    p:nth-child(1) {
      line-height: 17px;
      max-width: 170px;
    }
    p:nth-child(2) {
      color: #999999;
      line-height: 24px;
    }
  }
}
</style>
