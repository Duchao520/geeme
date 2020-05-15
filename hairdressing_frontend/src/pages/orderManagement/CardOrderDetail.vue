<template>
  <div class="card-order-detail" v-loading="loading&&!init">
    <details-header title="卡项订单详情" :hasTabs="false"></details-header>
    <div class="card-detail-main-con">
      <div class="card-detail-con">
        <div class="left">
          <card-main-info :detail="detail" @remark="remark"></card-main-info>
        </div>
        <div class="right-con">
          <card-bill-detail :detail="detail"></card-bill-detail>
          <trade-log :transactionInfo="transactionInfo"></trade-log>
        </div>
      </div>
    </div>
    <btn-remark
      ref="btnRemark"
      :btnReamrkVisible="showBtnRemark"
      @closeRemark="showBtnRemark=false"
      @confirmRemark="submitDesc"
    ></btn-remark>
  </div>
</template>
<script>
  import * as axios from "@/util/axios";
  import * as api from "@/assets/js/interface";
  import CardMainInfo from "@/components/orderManagement/detail/CardMainInfo";
  import TradeLog from "@/components/orderManagement/TradeLog";
  import CardBillDetail from "@/components/orderManagement/detail/CardBillDetail.vue";
  import BtnRemark from "@/components/orderManagement/BtnRemark";

  export default {
    components: {
      "card-main-info": CardMainInfo,
      "trade-log": TradeLog,
      "card-bill-detail": CardBillDetail,
      "btn-remark": BtnRemark
    },
    data() {
      return {
        detail: {},
        loading: true,
        init: false,
        showBtnRemark: false
      };
    },
    computed: {
      queryParams() {
        return this.$store.state.queryParams;
      },
      transactionInfo() {
        let detail = this.detail;
        return {
          payNo: detail.paySerialNumber,
          paySource: detail.orderSource === 0 ? "门店开单" : "线上订单",
          payType: detail.payType,
          received: detail.received,
          transactionNo: detail.transactionId
        };
      }
    },
    mounted() {
      this.getCardOrderDetailInfo();
    },
    methods: {
      getCardOrderDetailInfo() {
        axios
          .get("/getCardOrderDetailInfo/" + Number(this.$route.query.orderId))
          .then(res => {
            this.detail = res;
            this.init = true;
            this.loading = false;
          });
      },
      submitDesc(remarks) {
        axios
          .put(api.modifyCardOrderRemarks.URL, {
            remarks: remarks,
            orderId: this.queryParams.orderDetailParam.orderId
          })
          .then(res => {
            this.showBtnRemark = false;
            this.getCardOrderDetailInfo();
          });
      },
      remark() {
        this.showBtnRemark = true;
        this.$refs.btnRemark.remark = this.detail.remarks;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .card-order-detail {
    box-sizing: border-box;
    padding-top: 85px;

    .card-detail-main-con {
      padding: 0 20px;
      box-sizing: border-box;

      .card-detail-con {
        margin: 0 auto;
        max-width: 1400px;
        box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
        box-sizing: border-box;
        background: #ffffff;
        padding: 20px;
        height: calc(100vh - 100px);
        display: flex;

        .left {
          border: 1px solid #f0f1f4;
          flex: 0 0 360px;
          box-sizing: border-box;
          padding: 20px;
        }

        .right-con {
          border: 1px solid #f0f1f4;
          border-left: 0;
          flex: auto;
          box-sizing: border-box;
          padding: 20px;
        }
      }
    }
  }
</style>
