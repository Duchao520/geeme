<template>
  <div class="pay-by-cash" v-loading.fullscreen="loading">
    <div class="need-pay-money">
      <span>￥</span>
      <span class="money-num">{{needPay}}</span>
    </div>
    <div class="pay-ways scrollbar">
      <div class="pay-way" v-for="(way, index) in payWays" :key="way.id">
        <img :src="utils.formatPicImg(way.image)" alt />
        <p>{{way.billTypeName}}</p>
        <number-input
          class="pay-input"
          width="100px"
          v-model="payParams[index].payMoney"
          @input="inputPayMoney"
          :noBlur="true"
          :small="true"
        ></number-input>
        <el-button
          type="primary"
          class="pay-confirm"
          size="mini"
          width="60px"
          v-if="way.billType != 3"
          @click="payConfirm(way, index)"
          :loading="btnLoad"
        >支 付</el-button>
      </div>
    </div>
    <div class="pay-btn">
      <el-button class="normal_red_btn" @click="createBillAndPay" :loading="btnLoad">确认结算</el-button>
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
      btnLoad: false,
      // 混合支付参数-----
      payWays: [], // 支付方式
      payParams: [],
      billId: null
    };
  },
  mounted() {
    this.payWays = this.billInfo.paymentWay.filter(
      i => i.billType != 9 && i.openAccount
    );
    // 储值卡支付放到第一个？
    this.payWays.some((i, idx) => {
      this.payParams.push({
        payMoney: null
      });
      if (i.billType == 3) {
        this.payWays.splice(idx, 1);
        this.payWays.unshift(i);
      }
    });
    console.log(this.payWays);
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
      } else {
        params.consumerOrderCardInfoInfoList = this.$attrs.currentGoodsList;
        params.consumerOrderDetails = [];
      }
      if (this.$attrs.active.billType === 8) {
        // 先调用查询门店客户的钱包余额接口，如果不足不给予往下
        this.btnLoad = true;
        try {
          const data = await axios.post("/getWalletMoneyByCustomerId", {
            storeCustomerId: this.billInfo.customerInfo.id
          });
          if (data.walletMoney && data.walletMoney < this.needPay) {
            this.balance = data.walletMoney;
            this.enoughBalance = false;
          } else {
            this.enoughBalance = true;
          }
        } finally {
          this.btnLoad = false;
        }
      }
      if (!this.enoughBalance) return;
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
    // 混合支付事件----------------
    inputPayMoney(val) {
      this.payParams.payMoney = val;
    },
    async payConfirm(way, index) {
      this.btnLoad = true;
      try {
        // 先获取billId

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
          identityCardId: this.billInfo.selectedIdentityCardForPay
            .customerCardId // 身份卡
        };
        if (this.notInCard) {
          params.consumerOrderCardInfoInfoList = [];
          params.consumerOrderDetails = this.$attrs.currentGoodsList;
        } else {
          params.consumerOrderCardInfoInfoList = this.$attrs.currentGoodsList;
          params.consumerOrderDetails = [];
        }

        // this.loading = true;
        if (!this.billId) {
          // 给商品列表加索引 卡项不需要 deleted true 不要
          params.consumerOrderDetails.map((i, index) => {
            i.orderIndex = index + 1;
          });
          const res = await axios.post("/createConsumerOrder", params);
          if (res.success) {
            this.billId = res.billId;
          } else {
            this.$message.error(res.message);
          }
        }

        const response = await axios.post("/mixBillPay", {
          ...this.payParams[index],
          billId: this.billId,
          authCode: null,
          payType: way.billType,
          billTypeId: way.id,
          billTypeName: way.billTypeName,
          giftMoneyPay: null,
          rechargeMoneyPay: null
        });

        if (response.success) {
          this.$message.success("支付成功");
        } else {
          this.$message.error(response.message);
        }
      } finally {
        this.btnLoad = false;
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
    }
  }
};
</script>
<style lang='scss' scoped>
.pay-by-cash {
  margin: 75px 14px 0 34px;
  font-size: 14px;
}
.need-pay-money {
  color: #f52d56;
  .money-num {
    font-size: 24px;
    font-weight: 600;
  }
}
.pay-ways {
  min-height: 479px;
  // height: 200px;
  height: calc(100vh - 490px);
  position: relative;
  overflow-y: auto;
  margin-top: 10px;
  padding: 0 10px;
  .pay-way {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    & + .pay-way {
      margin-top: 15px;
    }
    > img {
      width: 24px;
      height: 24px;
      border-radius: 12px;
    }
    > p {
      margin-left: 5px;
      width: 60px;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /deep/ .pay-input {
      margin-right: 5px;
    }
    .pay-confirm {
      width: 60px;
      height: 30px;
      text-align: center;
      display: flex;
      padding: 0;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border: none;
      transition: all 0.6s;
      background-color: #58c9f3;
      &:hover {
        filter: brightness(90%);
      }
    }
  }
}
.pay-btn {
  // margin-bottom: 205px;
  margin-top: 20px;
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
