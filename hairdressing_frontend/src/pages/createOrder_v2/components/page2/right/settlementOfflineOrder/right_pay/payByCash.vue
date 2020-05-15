<template>
  <div class="pay-by-cash" v-loading.fullscreen="loading">
    <div class="need-pay-money">
      <span>￥</span>
      <span class="money-num">{{needPay}}</span>
    </div>
    <div class="info">
      <span class="left">实收</span>
      <span class="right">不找零</span>
    </div>
    <div class="money-input">
      <el-input disabled class="store-preference-input" v-model.trim="money"></el-input>
      <div class="icon">￥</div>
      <div class="no-enough" v-if="$attrs.active.billType === 8">
        <p>钱包余额: ￥{{balance}}</p>
        <p class="red-text" v-if="!enoughBalance">账户余额不足</p>
      </div>
    </div>
    <div class="pay-btn">
      <el-button
        class="normal_red_btn"
        @click="createBillAndPay"
        :loading="btnLoad"
        v-if="$attrs.active.billType !== 8 || enoughBalance"
      >确认结算</el-button>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      utils,
      money: null,
      loading: false,
      balance: null,
      enoughBalance: true, // 余额支付时， 余额是否足够的标识
      btnLoad: false
    };
  },
  async mounted() {
    if (this.$attrs.active.billType === 8) {
        this.showBalance()
      }
  },
  methods: {
    // 创建订单并完成支付
    async createBillAndPay() {
      let params = {
        mixBill: true,
        createBill: true,
        storeId: this.currentInfo.shopId,
        isCount: this.billInfo.isCount,
        tempFinalPrice: this.needPay,
        id: this.billInfo.consumerOrderId, // 挂单的id
        appointmentId: this.billInfo.appointId,
        serviceTime: this.billInfo.serviceTime,
        paperOrderId: this.billInfo.paperOrderId,
        customerId: this.billInfo.customerInfo.id,
        staffId: this.billInfo.billingStaff.staffId,
        identityCardId: this.billInfo.selectedIdentityCardForPay.customerCardId // 身份卡
      };
      if (this.notInCard) {
        params.consumerOrderCardInfoInfoList = [];
        params.consumerOrderDetails = this.$attrs.currentGoodsList;
        // 给商品列表加索引 卡项不需要 deleted true 不要
        params.consumerOrderDetails.map((i, index) => {
          i.orderIndex = index + 1;
        });
      } else {
        params.consumerOrderCardInfoInfoList = this.$attrs.currentGoodsList;
        params.consumerOrderDetails = [];
      }
      // console.log(params)
      // 职级id添加装换
      this.utils.levelIdAdd(params.consumerOrderDetails);
      console.log(params);
      // return
      this.loading = true;
      const res = await axios.post("/createConsumerOrder", params);
      if (res.success) {
        this.afterBill(res.billId);
      } else {
        this.$message.error(res.message);
      }
    },
    afterBill(billId) {
      if (this.$attrs.active.billType === 2) {
        this.payByCash(billId);
      } else if (this.$attrs.active.billType === 4) {
        this.payBySlefMethods(billId);
      } else if (this.$attrs.active.billType === 8) {
        this.payByWallet(billId);
      } else {
        console.log("...没有这个接口");
      }
    },
    // 现金支付, 支付不成功也要跳转收款台页面，避免重复创建消费账单
    payByCash(billId) {
      axios
        .post("/billingByCash", { billId: billId, received: this.needPay })
        .then(res => {
          this.afterPay(res);
        })
        .catch(err => {
          this.refreshOrTurnToPage();
        });
    },
    // 钱包支付, 支付不成功也要跳转收款台页面，避免重复创建消费账单
    payByWallet(billId) {
      axios
        .post("/billingByWalletMoney", {
          billId: billId,
          storeCustomerId: this.billInfo.customerInfo.id
        })
        .then(res => {
          this.afterPay(res);
        })
        .catch(err => {
          this.refreshOrTurnToPage();
        });
    },
    // 自定义支付, 支付不成功也要跳转收款台页面，避免重复创建消费账单
    payBySlefMethods(billId) {
      axios
        .post("/billingByBrandSelfdefWay", {
          billId: billId,
          received: this.needPay,
          billTypeId: this.$attrs.active.id
        })
        .then(res => {
          this.afterPay(res);
        })
        .catch(err => {
          this.refreshOrTurnToPage();
        });
    },
    afterPay(res) {
      if (res.success) {
        this.$message.success("支付成功");
      } else {
        this.$message.error(res.message);
      }
      this.refreshOrTurnToPage();
    },
    refreshOrTurnToPage() {
      this.loading = false;
      if (this.$route.path === "/shop-inner/cashier-dask/cashier-list") {
        // 此结算组件不会在收款台的未支付状态出现了
        // 刷新收款台页面
        // ...
      } else {
        this.$router.push("/shop-inner/cashier-dask/cashier-list");
      }
    },
    // 显示余额
    async showBalance() {
      // 先调用查询门店客户的钱包余额接口，如果不足不给予往下
        this.loading = true;
        try {
          const data = await axios.post("/getWalletMoneyByCustomerId", {
            storeCustomerId: this.billInfo.customerInfo.id
          });
          this.balance = data.walletMoney;
          if (data.walletMoney && data.walletMoney < this.needPay) {
            this.enoughBalance = false;
          } else {
            this.enoughBalance = true;
          }
        } finally {
          this.loading = false;
        }
    }
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo
    }),
    notInCard() {
      return ["service", "product"].includes(this.billInfo.currentLeftType);
    },
    needPay() {
      let money = 0;
      this.$attrs.currentGoodsList.map(i => {
        if (!i.paymentStatus && !i.deleted) {
          money += i.tempFinalPrice;
        }
      });
      this.money = money = Number(money.toFixed(2));
      return money;
    }
  },
  watch: {
    "$attrs.active.billType"(val) {
      this.enoughBalance = true;
      if (val === 8) {
        this.showBalance()
      }
    },
    "needPay"(val) {
      this.enoughBalance = true;
      if (this.$attrs.active.billType === 8) {
        this.showBalance()
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.pay-by-cash {
  margin: 95px 44px 0 34px;
  font-size: 14px;
}
.need-pay-money {
  color: #f52d56;
  .money-num {
    font-size: 24px;
    font-weight: 600;
  }
}
.info {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  .left {
    color: #333;
  }
  .right {
    color: #58c9f3;
  }
}
.money-input {
  min-height: 449px;
  height: calc(100vh - 520px);
  position: relative;
  margin-top: 10px;
  /deep/ .el-input__inner {
    text-indent: 18px;
  }
  .icon {
    position: absolute;
    top: 0;
    left: 12px;
    width: 24px;
    height: 100%;
    line-height: 40px;
  }
  .no-enough {
    margin-top: 10px;
    color: #333333;
    .red-text {
      color: #f52d56 !important;
    }
  }
}
.pay-btn {
  // margin-bottom: 205px;
  margin-left: 11px;
  display: flex;
  justify-content: center;
  .normal_red_btn {
    width: 200px;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    padding: 0 20px;
  }
}
</style>
