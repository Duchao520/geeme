<template>
  <div v-loading.fullscreen="loading">
    <div class="choose-card"></div>
    <div class="pay-by-card">
      <div class="prepay-card-text" :style="cardList.length ? '' : 'display: none'">
        <p>已选的时间卡/次卡：</p>
      </div>
      <div class="choose-cards scrollbar" :style="cardList.length ? '' : 'display: none'">
        <singleOwnedCard
          v-for="(card, index) in cardList"
          :key="`${card.customerCardId}-${+(new Date())}-${index}`"
          :card="card"
        ></singleOwnedCard>
      </div>
      <div class="prepay-card-text" style="margin-top: 5px;">
        <p>请选择储值卡：</p>
      </div>
      <div class="no-card" v-if="!$attrs.hasCard">该客户暂无储值卡</div>
      <div class="no-goods" v-if="!list.length && $attrs.hasCard">暂无需要储值卡支付的商品</div>
      <div
        class="has-cards scrollbar"
        v-if="list.length"
        :class="{'has-count-card': !cardList.length, 'has-one-count-card': cardList.length == 1}"
      >
        <singleOwnedPrepayCard
          v-for="(card, index) in list"
          :key="`${card.customerCardId}-${+(new Date())}-${index}`"
          :card="card"
          :cardType="1"
          @setPrepaidCardPayValue="handleGetPrepaidCardPayValue"
        ></singleOwnedPrepayCard>
      </div>
      <!-- v-if="list.length" -->
    </div>
    <div class="pay-btn">
      <el-button class="normal_red_btn" @click="createBillAndPay">确认结算</el-button>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import singleOwnedCard from "./singleOwnedCard.vue";
import singleOwnedPrepayCard from "./singleOwnedPrepayCard.vue";
export default {
  // getPrePaidCardPayCardCountInfo 卡买卡可以用的储值卡
  // getAllCardPayGoodsCountInfo 卡买服务、产品 (4种卡)
  props: {
    cardInfoList: Array
  },
  data() {
    return {
      utils,
      list: [], // 当前商品可以用的储值卡数组
      indexObjForPrepayCard: {}, // 左侧详情中的服务/产品,在右侧过滤后的下标匹配 {原始下标： 过滤后下标(删除、次卡等)}
      serviceIndexObj: {}, // 服务的下标匹配{过滤后下标： 在服务数组中的下标}
      productionIndexObj: {}, // 产品的下标匹配{过滤后下标： 在产品数组中的下标}
      loading: false,
      needBreakLoop: false, //
      cardList: [],
      prepaidCardPayValue: {
        rechargeMoneyPay: null,
        giftMoneyPay: null
      }
    };
  },
  mounted() {
    // console.log(this.cardInfoList)
    this.initCanUseCards();
  },
  methods: {
    ...mapActions(["setSelectedPrepaidCardForPay"]),
    initCanUseCards() {
      // 按需查询卡
      if (!this.$attrs.hasCard) return;
      // console.log("");
      // console.log("次卡、时间卡变化监听...可用储值卡...");
      if (this.notInCard) {
        // 产品、服务可能会打折， 卡项不会打折
        let idx = 0;
        let obj = {};
        let goodsList = [];
        this.$attrs.currentGoodsList.map((goods, index) => {
          // 需要过滤掉线上支付的服务、产品，已经选了次卡、时间卡的服务, 取单后删除的商品
          if (
            goods.deleted ||
            goods.paymentStatus ||
            goods.timeCardId ||
            goods.countCardId
          ) {
            // 删除的、支付的、选了次卡、选了时间卡的, 这些的价格全部不能重置
          } else {
            goodsList.push(goods);
            obj[index] = idx;
            idx++;
          }
        });
        this.indexObjForPrepayCard = obj;
        if (goodsList.length) {
          this.readyToGetCardsBuyGoods(goodsList); // 1.1
        } else {
          this.list = [];
        }
      } else {
        // 过滤掉挂单删除的即可
        let cardsList = this.$attrs.currentGoodsList.filter(i => !i.deleted);
        if (cardsList.length) {
          this.readyToGetCardsBuyCards(cardsList); // 1.2
        } else {
          this.list = [];
        }
      }
    },
    // 卡买服务
    readyToGetCardsBuyGoods(goodsList) {
      let serviceList = [];
      let productList = [];
      let serviceObj = {};
      let productObj = {};
      let serviceIdx = 0;
      let productIdx = 0;
      goodsList.map((goods, index) => {
        if (goods.goodsType === "service") {
          serviceList.push({
            amount: goods.count,
            serviceSpecificationsId: goods.specificationId,
            serviceSpecificationsSnapshotId: goods.snapshotId,
            storePreference: goods.storePreference || 0
          });
          serviceObj[index] = serviceIdx;
          serviceIdx++;
        } else {
          productList.push({
            amount: goods.count,
            productSpecificationsId: goods.specificationId,
            productSpecificationsSnapshotId: goods.snapshotId,
            storePreference: goods.storePreference || 0
          });
          productObj[index] = productIdx;
          productIdx++;
        }
      });
      if (!serviceList.length && !productList.length) return;
      this.serviceIndexObj = serviceObj;
      this.productionIndexObj = productObj;
      this.loading = true;
      axios
        .post("/getAllCardPayGoodsCountInfo", {
          brandId: this.currentInfo.brandId,
          storeId: this.currentInfo.shopId,
          customerId: this.billInfo.customerInfo.id,
          listCountProductInfo: productList,
          listCountServiceInfo: serviceList
        })
        .then(res => {
          if (res.success) {
            this.list = res.listCardPayGoodsCountInfo || []; // 储值卡的
            this.loading = false; // 其他任何错误，需要用户用其他方式支付
          } else {
            this.$message.error(res.message);
          }
        });
    },
    // 卡买卡
    readyToGetCardsBuyCards(cardsList) {
      let list = cardsList.map(card => {
        return {
          amount: 1,
          cardKindId: card.cardKindId,
          cardKindSnapshotId: card.cardKindSnapshotId,
          storePreference: card.storePreference || 0
        };
      });
      this.loading = true;
      axios
        .post("/getPrePaidCardPayCardCountInfo", {
          brandId: this.currentInfo.brandId,
          storeId: this.currentInfo.shopId,
          customerId: this.billInfo.customerInfo.id,
          countCardInfoList: list
        })
        .then(res => {
          this.list = res.listCardPayGoodsCountInfo;
          this.loading = false; // 其他任何错误，需要用户用其他方式支付
          // if (res.success) {
          // } else {
          //   this.$message.error(res.message)
          // }
        });
    },
    // 储值卡子组件发送上来的储值金， 赠送金的自定义值
    handleGetPrepaidCardPayValue(valueObj) {
      this.prepaidCardPayValue = valueObj;
    },
    createBillAndPay() {
      if (this.billInfo.selectedIdentityCardForPay.customerCardId)
        return this.$message.error("身份卡、储值卡不能同时使用");
      if (!this.billInfo.selectedPrepaidCardForPay.customerCardId && this.needPay != 0)
        return this.$message.error("请先选择一个储值卡");
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
        identityCardId: null, // 不许用身份卡
        prepaidCardId: this.billInfo.selectedPrepaidCardForPay.customerCardId
      };
      if (this.notInCard) {
        params.consumerOrderCardInfoInfoList = [];
        params.consumerOrderDetails = this.$attrs.currentGoodsList;
        // 给商品列表加索引 卡项不需要 deleted true 不要
        params.consumerOrderDetails.map((i,index) => {
          i.orderIndex = index + 1
        })
      } else {
        params.consumerOrderCardInfoInfoList = this.$attrs.currentGoodsList;
        params.consumerOrderDetails = [];
      }
      this.utils.levelIdAdd(params.consumerOrderDetails);
      this.loading = true;
      axios.post("/createConsumerOrder", params).then(res => {
        if (res.success) {
          if (this.billInfo.selectedPrepaidCardForPay.customerCardId) {
            this.afterBill(res.billId);
          } else {
            this.payByCash(res.billId);
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    afterBill(billId) {
      axios
        .post("/billingByPrepaidCard", {
          billId: billId,
          giftMoneyPay: this.prepaidCardPayValue.giftMoneyPay,
          rechargeMoneyPay: this.prepaidCardPayValue.rechargeMoneyPay,
          customerCardId: this.billInfo.selectedPrepaidCardForPay.customerCardId
        })
        .then(res => {
          this.afterPay(res);
        });
    },
    // 现金支付, 当最终金额为0 ， 切没有选择储值卡的时候 走这里
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
    // 根据选择的储值卡重置产品、服务的最终价格
    setGoodsTempFinalPrice() {
      if (this.notInCard) {
        // 仅卡买服务、产品会存在打折
        this.$attrs.currentGoodsList.map((goods, index) => {
          // 仅以下情况存在
          if (
            goods.deleted ||
            goods.paymentStatus ||
            goods.timeCardId ||
            goods.countCardId
          ) {
            // 删除的、支付的、选了次卡、选了时间卡的, 这些的价格全部不能重置
          } else {
            let key = this.indexObjForPrepayCard[index];
            if (goods.goodsType === "service") {
              let goodsArr = this.billInfo.selectedPrepaidCardForPay
                .listServiceCardDiscountInfo;
              if (goodsArr && goodsArr.length) {
                goods.tempFinalPrice =
                  goodsArr[this.serviceIndexObj[key]].finalPrice;
              }
            } else {
              let goodsArr = this.billInfo.selectedPrepaidCardForPay
                .listProductCardDiscountInfo;
              if (goodsArr && goodsArr.length) {
                goods.tempFinalPrice =
                  goodsArr[this.productionIndexObj[key]].finalPrice;
              }
            }
          }
        });
      } else {
        // 储值卡买其他卡不打折
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
  components: { singleOwnedPrepayCard, singleOwnedCard },
  watch: {
    "$attrs.rootTimeCardChange": {
      handler: function(v, o) {
        if (v) {
          this.setSelectedPrepaidCardForPay({ customerCardId: null });
          this.initCanUseCards();
        }
      }
    },
    "$attrs.rootStorePreferenceChang": {
      handler: function(v, o) {
        if (v) {
          this.setSelectedPrepaidCardForPay({ customerCardId: null });
          this.initCanUseCards();
        }
      }
    },
    // 监听选中的储值卡的变化， 修改左侧商品的价格(储值卡可能会对服务、产品进行打折)
    "billInfo.selectedPrepaidCardForPay": {
      handler: function(v, o) {
        if (v.customerCardId) {
          this.setGoodsTempFinalPrice();
        }
        // 储值卡变化 清空之前卡的输入
        this.prepaidCardPayValue = {
          giftMoneyPay: null,
          rechargeMoneyPay: null
        };
      },
      immediate: true,
      deep: true
    },
    cardInfoList: {
      handler: function(v, o) {
        console.log(v)
        this.cardList = [];
        v.map(i => {
          if (i && i.id) {
            this.cardList.push(i);
          }
        });
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
.pay-by-card {
  // height: calc(100vh - 369px);
  height: 600x;
  font-size: 14px;
  margin: 50px 34px 0 34px;
}
.no-card {
  margin-top: 200px;
  text-align: center;
}
.no-goods {
  margin-top: 200px;
  text-align: center;
}
.has-cards {
  min-height: 393px;
  // max-height: 453px;
  height: calc(100vh - 576px);
  overflow-y: auto;
}
.has-one-count-card {
  min-height: 453px;
  // max-height: 453px;
  height: calc(100vh - 516px);
  overflow-y: auto;
}
.has-count-card {
  min-height: 569px;
  height: calc(100vh - 400px);
  overflow-y: auto;
}
.choose-cards {
  max-height: 150px;
  // height: calc(100vh - 769px);
  overflow-y: auto;
}
.pay-btn {
  position: absolute;
  bottom: 30px;
  right: 70px;
  // margin-top: 15px;
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

.prepay-card-text {
  margin-left: -20px;
  font-size: 15px;
  font-weight: 700;
  color: #000;
}
</style>
