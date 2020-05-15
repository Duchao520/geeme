<template>
  <div class="card-lists" style="padding-top:0;display:block" v-loading.fullscreen="loading">
    <div style="display:block; margin-bottom: 10px;">
      <select-customer
        v-if="!billInfo.serialCode"
        width="420px"
        style="margin-bottom:10px"
        @choose="getCustomerCardByCustomerId"
      ></select-customer>
      <!-- 加上去显示会有问题 -->
      <!-- <history-customers v-show="!billInfo.consumerOrderId"  @choose="getCustomerCardByCustomerId"></history-customers> -->
      <user-box :list="customerInfo" v-if="customerInfo&&customerInfo.length>0"></user-box>
    </div>
    <div class="renewal-card-container scrollbar" :style="billInfo.billOrigin ? 'height: calc(100vh - 221px);' : ''">
      <div class="cards-customer" v-if="customerCards.usingCards.length>0">
        <p class="text">所持会员卡如下：</p>
        <renewalCardList :list="customerCards.usingCards" type="cardAdd" @chooseCard="chooseCard" />
      </div>
      <div class="cards-customer" v-if="customerCards.uselessCards.length>0">
        <p class="text">无法充值和续卡：</p>
        <renewalCardList :list="customerCards.uselessCards" type="cardAdd" :useful="false" />
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import CardItem from "@/components/createOrder/goodsCard/CardItem";
import SelectCustomer from "@/components/appoModule/selectCustomer";
import UserBox from "@/components/appoModule/userBox";
import historyCustomers from "../right/historyCustomers";
import renewalCardList from "./renewalCardList.vue";
import { mapActions, mapState } from "vuex";
import animation from "@/util/animation";
export default {
  components: {
    "card-item": CardItem,
    "select-customer": SelectCustomer,
    "user-box": UserBox,
    historyCustomers,
    renewalCardList
  },
  data() {
    return {
      customerHoldCards: [],
      loading: false
    };
  },
  watch: {
    visible(bool) {
      console.log(bool);
      if (bool && this.billInfo.customerInfo.id) {
        this.getCustomerCardByCustomerId();
      }
    },
    // 监听客户信息变化， 查询新的续卡
    protoCustomerInfo: {
      handler: function(v, o) {
        // - 监听选中的客户信息变化，或者新增了客户
        if (o && v.id !== o.id) {
          this.getCustomerCardByCustomerId();
        }
      },
      deep: true,
      immediate: true
    },
    "billInfo.currentTopStatus.renewal_card"(val) {
      this.getCustomerCardByCustomerId();
    }
  },
  computed: {
    ...mapState({
      protoCustomerInfo: state => state.bill.customerInfo // 监听这个数据， 说明有选择操作
    }),
    customerInfo() {
      let customer = this.$store.state.bill.customerInfo;
      return customer.name ? [this.$store.state.bill.customerInfo] : [];
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    billInfo() {
      return this.$store.state.bill;
    },
    carPosition() {
      return this.billInfo.carPosition;
    },
    customerCards() {
      let cards = this.customerHoldCards;
      return {
        usingCards: cards
          .filter(item => item.supportRenewal)
          .sort(function(a, b) {
            if (a.cardType < b.cardType) {
              return -1;
            } else if (a.cardType == b.cardType) {
              return 0;
            } else {
              return 1;
            }
          }),
        uselessCards: cards
          .filter(item => !item.supportRenewal)
          .sort(function(a, b) {
            if (a.cardType < b.cardType) {
              return -1;
            } else if (a.cardType == b.cardType) {
              return 0;
            } else {
              return 1;
            }
          })
      };
    },
    // 存入的开卡的数量
    alreadySelectedListsLen() {
      let count = 0;
      let list = ["service", "product"].includes(this.billInfo.currentLeftType)
        ? this.billInfo.selectedGoods || []
        : this.billInfo.selectedCard || [];
      list.forEach(item => {
        if (!item.deleted) {
          count++;
        }
      });
      return count;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions([
      "saveSelectedCard", // 保存当前选择的卡项
      "setSelectedCardsValue"
    ]),
    init() {
      if (this.billInfo.customerInfo.id) {
        this.getCustomerCardByCustomerId();
      }
    },
    getCustomerCardByCustomerId() {
      if (!this.billInfo.customerInfo.id)  return this.customerHoldCards = []
      this.loading = true;
      axios
        .post("/getEnabledBrandCustomerCardByStoreCustomerId", {
          brandId: this.currentInfo.brandId,
          storeId: this.currentInfo.shopId,
          customerId: this.billInfo.customerInfo.id,
          // 过滤礼品卡
          // giftCard: false
        })
        .then(res => {
          if (this.billInfo.currentTopStatus.renewal_card == 0) {
            this.customerHoldCards = (res.listCustomerCardDetail || []).filter(
              i => i.cardType == 0
            );
          } else if (this.billInfo.currentTopStatus.renewal_card == 1) {
            this.customerHoldCards = (res.listCustomerCardDetail || []).filter(
              i => i.cardType == 1
            );
          } else {
            this.customerHoldCards = res.listCustomerCardDetail || [];
          }
          this.customerHoldCards = this.customerHoldCards.map(item => {
            return {
              customerCardId: item.id,
              cardKindId: item.cardKindId,
              cardKindSnapshotId: item.cardKindSnapshotId,
              cardType: item.cardType,
              cardName: item.cardName,
              cardCover: item.cardCover,
              cardFirstRechargeNum: item.cardFirstRechargeNum,
              remainingSum: (item.rechargeMoney + item.giftMoney).toFixed(2),
              // 充值金的使用情况？ 续卡详情给的字段是客户开项所有的使用情况
              rechargeMoney: item.rechargeMoney,
              // 后续组件可能使用到的值
              chargeMoney:
                item.cardType == 1 ? item.cardFirstRechargeNum : item.cardPrice,
              // 赠送金的使用情况？ 续卡详情给的字段是客户开项所有的使用情况
              reGiftMoney: item.giftMoney,
              // 后续组件可能使用到的值
              giftMoney: item.giftMoney,
              cardGiftNum: item.cardGiftNum,
              cardPrice: item.cardPrice,
              finishTime: item.finishTime,
              validNum: item.validNum,
              validUnit: item.validUnit,
              supportRenewal: item.supportRenewal,
              listCardRenewalRule: item.listCardRenewalRule,
              goodsType: "card",
              operateType: 1, // 续卡标识
              validPermanent: item.validPermanent,
              storeRemarkCardNo: item.storeRemarkCardNo || "",
              // 门店优惠
              storePreference: 0,
              storeId: this.currentInfo.shopId
            };
          });
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    chooseCard(item, event, bool) {
      if (bool) {
        return;
      } else {
        // 存入购物车的数量不得大于20,核销的数量可能超过20 ，所以这里限制大于等于20
        if (this.alreadySelectedListsLen >= 20)
          return this.$message.error("开单卡项数量不得超过20！");
        // 如果购物车中已经存在由该卡修改的续卡卡项， 则实现编辑该卡项的逻辑
        let flag = true;
        this.billInfo.selectedCard.forEach((i, index) => {
          if (i.customerCardId == item.customerCardId) {
            flag = false;
            this.setSelectedCardsValue({ ...item, index });
          }
        });
        if (flag) {
          this.saveSelectedCard(item);
        }
        animation.animationEvent(event, 100, 0.4, this.carPosition);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.renewal-card-container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: auto;
  height: calc(100vh - 271px); // - 105 - 50 - 35
  padding: 10px 0;
  box-sizing: border-box;
  .cards-customer {
    .text {
      font-size: 12px;
      line-height: 50px;
      color: #333333;
    }
    .cards {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
