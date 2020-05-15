<template>
  <div class="bottom-btn" v-loading.fullscreen.lock="loading">
    <div class="left-price">
      <div class="total-in-order" :title="`总金额: ${totalPrice}`">
        总金额
        <span>￥{{totalPrice}}</span>
      </div>
      <div class="need-pay" :title="`待付款: ${needPay}`">
        待付款
        <span class="red">￥{{needPay}}</span>
      </div>
    </div>
    <div class="right-btn">
      <div class="hang-up-order" @click="handleHangUpOrder(false)">挂单</div>
      <div class="settlement-bill" @click="handleSettlementBill">结算</div>
    </div>
    <!-- 核销线上订单 -->
    <VerificationOrder
      v-if="verificationVisible"
      :detail="verificationDetail"
      :noMoneyVisible="verificationVisible"
      @close="verificationVisible = false"
    />
    <!-- 结算线下订单, 可能含线上订单及取单删除订单 -->
    <settlementOfflineOrder
      v-if="offlineSettlementVisible"
      :visible="offlineSettlementVisible"
      @close="offlineSettlementVisible = false"
    />
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";

import VerificationOrder from "@/components/createOrder/settleAccounts/AccountDetailNoMoney";
import settlementOfflineOrder from "../settlementOfflineOrder/index.vue";
export default {
  data() {
    return {
      utils,
      loading: false, //
      verificationVisible: false, // 核销单组件
      verificationDetail: {}, // 核销单组件数据
      offlineSettlementVisible: false // 有线下订单的结算
    };
  },
  methods: {
    ...mapActions(["setBillId", "setCreateTime"]),
    // 挂单 - 允许也有客户没有商品挂单， 不允许没有客户挂单
    handleHangUpOrder(bool) {
      if (this.billInfo.customerInfo.id) {
        let params = {
          consumerOrderCardInfoInfoList: this.notInCard
            ? []
            : this.billInfo.selectedCard,
          consumerOrderDetails: this.notInCard
            ? this.billInfo.selectedGoods
            : [],
          handCode: this.billInfo.usbReaderCode, // 手牌号
          createBill: false, // 挂单
          tempFinalPrice: this.needPay, //
          storeId: this.currentInfo.shopId,
          isCount: this.billInfo.isCount,
          id: this.billInfo.consumerOrderId, // 挂单的id
          appointmentId: this.billInfo.appointId,
          serviceTime: this.billInfo.serviceTime,
          paperOrderId: this.billInfo.paperOrderId,
          customerId: this.billInfo.customerInfo.id,
          staffId: this.billInfo.billingStaff.staffId
        };
        this.utils.levelIdAdd(params.consumerOrderDetails);
        console.log(params);
        // 给商品列表加索引 卡项不需要 deleted true 不要
        params.consumerOrderDetails.map((i, index) => {
          i.orderIndex = index + 1;
        });
        this.loading = true;
        axios
          .post("/createConsumerOrder", params)
          .then(res => {
            if (res.success) {
              if (bool) {
                this.getConsumerOrderDetail(res.id); // => 获取核销组件详情
                // 核销的
              } else {
                this.$router.push("/shop-inner/cashier-dask/cashier-list"); // 在次页面加载必须有 this.clearBillInfo()
              }
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(err => {})
          .then(() => {
            this.loading = false;
          });
      } else {
        this.$message.error("请先选择一个客户");
      }
    },
    // 结算
    handleSettlementBill() {
      // let t = new Date().format('yyyy-MM-dd hh:mm')
      // this.setCreateTime(t)
      if (!this.billInfo.customerInfo.id)
        return this.$message.error("请先选择一个客户");
      if (this.notInCard) {
        // 会员卡不会出现在线上需核销订单
        // 1 服务、产品
        let computedGoods = this.billInfo.selectedGoods.filter(i => !i.deleted);
        if (!computedGoods.length)
          return this.$message.error("没有可结算的商品!");
        let noStationOne = false;
        this.billInfo.selectedGoods.some(i => {
          if (
            !i.deleted &&
            i.goodsType == "service" &&
            i.stationOne.length == 0
          ) {
            noStationOne = true;
          }
        });
        if (noStationOne)
          return this.$message.error("服务的第一工位不能为空！");
        // 只有当所有商品都有goodsOrderId 才走核销
        let onlyOffline = computedGoods.some(i => !i.goodsOrderId);
        if (onlyOffline) {
          // 1.2 线上、线下订单(服务、产品、取单、预订单) 可能存在deleted和paymentStatus为true
          this.offlineSettlementVisible = true;
        } else {
          // 1.1 仅线上订单 - 核销
          // 1.1.1 createConsumerOrder
          // 1.1.2 getConsumerOrderInfoById
          // 1.1.3 verifyGoodsOrder
          console.log(1);
          this.handleHangUpOrder(true);
        }
      } else {
        let computedGoods = this.billInfo.selectedCard.filter(i => !i.deleted);
        if (!computedGoods.length)
          return this.$message.error("没有可结算的卡项!");
        // 2 卡项订单(只有线下)
        this.offlineSettlementVisible = true;
      }
    },
    // 获取消费账单详情再核销
    getConsumerOrderDetail(id) {
      axios.get(`/getConsumerOrderInfoById/${id}`).then(res => {
        this.verificationDetail = res;
        this.verificationVisible = true;
      });
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
    totalPrice() {
      // 记录应付和已付累计
      let goods = this.notInCard
        ? this.billInfo.selectedGoods
        : this.billInfo.selectedCard;
      let computedGoods = goods.filter(i => !i.deleted);
      let price = 0;
      computedGoods.map(i => {
        if (i.paymentStatus) {
          price += i.received;
        } else {
          price += i.tempFinalPrice;
        }
      });
      return Number(price.toFixed(2));
    },
    needPay() {
      // 记录应付累计
      let goods = this.notInCard
        ? this.billInfo.selectedGoods
        : this.billInfo.selectedCard;
      let computedGoods = goods.filter(i => !i.deleted);
      let price = 0;
      computedGoods.map(i => {
        if (!i.paymentStatus && !i.deleted) {
          price += i.tempFinalPrice;
        }
      });
      return Number(price.toFixed(2));
    }
  },
  components: {
    VerificationOrder,
    settlementOfflineOrder
  }
};
</script>
<style lang='scss' scoped>
.bottom-btn {
  border-top: 1px solid #f0f1f4;
  height: 100%;
  display: flex;
  .left-price {
    width: 190px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-indent: 20px;
    div {
      margin-right: 10px;
      display: flex;
      flex-wrap: nowrap;
      span {
        flex: 1;
        text-indent: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .right-btn {
    width: 220px;
    height: 100%;
    display: flex;
    font-size: 20px;
    div {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      cursor: pointer;
    }
    .hang-up-order {
      background: #58c9f3;
    }
    .settlement-bill {
      background: #ff6d61;
    }
  }
}

.red {
  color: #ff6d61;
}
</style>
