<template>
  <div class="card-lists" style="padding-top:0;display:block">
    <div style="display:block">
      <select-customer
        width="420px"
        style="margin-bottom:10px"
        @choose="getCustomerCardByCustomerId"
      ></select-customer>
      <user-box :list="customerInfo" v-if="customerInfo&&customerInfo.length>0"></user-box>
    </div>
    <div class="cards-customer" v-if="customerCards.usingCards.length>0">
      <p class="text">所持会员卡如下：</p>
      <div class="cards">
        <card-item
          v-for="(item,index) in customerCards.usingCards"
          class="card"
          :key="index"
          :cardInfo="item"
          type="cardAdd"
          v-on="$listeners"
        ></card-item>
      </div>
    </div>
    <div class="cards-customer" v-if="customerCards.uselessCards.length>0">
      <p class="text">无法充值和续卡：</p>
      <div class="cards">
        <card-item
          v-for="(item,index) in customerCards.uselessCards"
          class="card"
          :key="index"
          :cardInfo="item"
          :useful="false"
          type="cardAdd"
          v-on="$listeners"
        ></card-item>
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
import { mapActions, mapState } from "vuex";
export default {
  components: {
    "card-item": CardItem,
    "select-customer": SelectCustomer,
    "user-box": UserBox
  },
  data() {
    return {
      customerHoldCards: []
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
          this.getCustomerCardByCustomerId()
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState({
      protoCustomerInfo: state => state.bill.customerInfo, // 监听这个数据， 说明有选择操作
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
    customerCards() {
      let cards = this.customerHoldCards;
      return {
        usingCards: cards.filter(item => item.supportRenewal),
        uselessCards: cards.filter(item => !item.supportRenewal)
      };
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let type = this.billInfo.currentChooseTypeAndSortOneId.sortGoodsType;
      if (type === "cardAdd" && this.billInfo.customerInfo.id) {
        this.getCustomerCardByCustomerId();
      }
    },
    getCustomerCardByCustomerId() {
      axios
        .post("/getEnabledBrandCustomerCardByStoreCustomerId", {
          brandId: this.currentInfo.brandId,
          storeId: this.currentInfo.shopId,
          customerId: this.billInfo.customerInfo.id,
          // 过滤礼品卡
          giftCard: false
        })
        .then(res => {
          this.customerHoldCards = (res.listCustomerCardDetail||[]).map(item => {
            return {
              customerCardId: item.id,
              cardKindId: item.cardKindId,
              cardKindSnapshotId: item.cardKindSnapshotId,
              cardType: item.cardType,
              cardName: item.cardName,
              cardCover: item.cardCover,
              cardFirstRechargeNum: item.cardFirstRechargeNum,
              remainingSum: (item.rechargeMoney + item.giftMoney).toFixed(2),
              rechargeMoney: item.rechargeMoney,
              giftMoney: item.giftMoney,
              cardGiftNum:item.cardGiftNum ,
              cardPrice:item.cardPrice ,
              finishTime: item.finishTime,
              validNum: item.validNum,
              validUnit: item.validUnit,
              supportRenewal: item.supportRenewal,
              listCardRenewalRule: item.listCardRenewalRule,
              goodsType: "card",
              operateType: 1,
              validPermanent: item.validPermanent,
              storeRemarkCardNo: item.storeRemarkCardNo || ''
            };
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.cards-customer {
  .text {
    font-size: 12px;
    line-height: 50px;
    margin-top: 15px;
    color: #333333;
  }
  .cards {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
