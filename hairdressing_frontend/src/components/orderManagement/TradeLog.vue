<template>
  <div class="root">
    <h3>交易流水</h3>
    <div class="table">
      <div class="tabs" style="border-left: 1px solid #ebecf0;">
        <div class="tab-top">交易流水号</div>
        <div class="tab-bottom">{{transactionStream.payNo}}</div>
      </div>
      <div class="tabs" v-if="transactionStream.paySource">
        <div class="tab-top">付款来源</div>
        <div class="tab-bottom">{{transactionStream.paySource}}</div>
      </div>
      <div class="tabs">
        <div class="tab-top">付款方式</div>
        <div class="tab-bottom">{{payType(transactionStream.payType)}}</div>
      </div>
      <div class="tabs">
        <div class="tab-top">实收金额</div>
        <div
          class="tab-bottom"
        >￥{{transactionStream.received&&(transactionStream.received+"").replace('￥','')}}
        </div>
      </div>
      <div class="tabs" style="border-right: 1px solid #ebecf0;">
        <div class="tab-top">第三方支付订单号</div>
        <div class="tab-bottom">{{transactionStream.transactionNo || "--"}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      detail: {
        type: Object,
        default: null
      },
      transactionInfo: {
        type: Object,
        default: null
      }
    },
    computed: {
      transactionStream() {
        return this.detail ? this.detail.transactionStream : this.transactionInfo;
      },
    },
    methods: {
      payType(type) {
        if (type === null) {
          return ""
        }
        if (typeof type !== 'number') {
          return type
        }
        let payTypes = {
          0: "微信", 1: "支付宝", 2: "现金", 3: "会员卡", 8: '余额'
        }
        return payTypes[type]
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
        //   text-align: center;
        box-sizing: border-box;
        padding-left: 15px;
      }

      .tab-bottom {
        height: 34px;
        line-height: 34px;
        font-size: 12px;
        color: #333333;
        //   text-align: center;
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
