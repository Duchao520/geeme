<template>
  <div class="pay-type-list">
    <div
      class="pay-type"
      v-for="(item,index) in paymentModes"
      :key="index"
      :class="['pay-type-hover',activeClass_(item),notAllowed(item)?'not-allowed':'']"
      @click="changePayType(item)"
    >
      <div class="type-icon">
        <img
          :src="item.billType === 1 ? require(`@/assets/images/icon_pay_ali.png`) : utils.formatPicImg(item.image,'style',40)"
          :alt="item.type"
          :title="item.type"
        />
      </div>
      <div class="type-text">{{item.billTypeName}}</div>
    </div>
  </div>
</template>
<script>
/**?
 * 结算方式：0-微信支付，1-支付宝支付，2-现金支付，3-会员卡支付，4-自定义
 * 顺序：现金，会员卡，微信，支付宝
 */
import * as utils from "@/assets/js/utils";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    value: Number,
    paymentModes: Array,
    billDetail: Object,
    from: String
  },
  data() {
    return {
      utils: utils,
      activeClass: {
        0: "we-chat",
        1: "ali-pay",
        2: "cash",
        3: "card",
        8: "wallet"
      }
    };
  },
  computed: {
    ...mapGetters([
      "alreadySelectedCard",
      "alreadySelectedType",
      "selectedVipCardDiscountInfo"
    ]),
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    billInfo() {
      return this.$store.state.bill;
    },
    paymentModeId: {
      set(param) {
        this.setPaymentModeId(param);
      },
      get() {
        return this.billInfo.paymentModeId;
      }
    }
  },

  methods: {
    ...mapActions(["setPaymentModeId"]),

    changePayType(item) {
      if (this.notAllowed(item)) {
        return;
      }
      this.$emit("input", item.billType); // 没有发现接收的地方，用下面的vuex实现监听
      this.paymentModeId = item.id;
    },
    activeClass_(item) {
      if (item.billType !== 4 && this.value === item.billType) {
        return this.activeClass[item.billType];
      } else if (item.billType === 4 && this.paymentModeId === item.id) {
        return "user-defined";
      } else {
        return "";
      }
    },
    notAllowed(item) {
      let canPay = this.selectedVipCardDiscountInfo.canPay;
      let mustUseTimeOrCountCard =
        ["countCard", "timeCard"].includes(this.alreadySelectedType) && canPay;
      let mustUsePrePaid = this.alreadySelectedType === "prepaid";
      let mustUseCardToPay = mustUseTimeOrCountCard || mustUsePrePaid;

      // 兼容来自预收款充值
      let noMoney = this.billDetail && this.billDetail.finalPrice === 0;
      noMoney = this.from == "advance" && false;

      return (
        (mustUseCardToPay && item.billType !== 3) ||
        (noMoney && item.billType === 0)
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.pay-type-list {
  box-sizing: border-box;
  padding: 50px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 10px;
    background: #ffffff;
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #e3e3e3;
  }

  &::-webkit-scrollbar-track {
    border-radius: 0;
    background: #ffffff;
  }

  .pay-type {
    width: 182px;
    height: 50px;
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    margin-bottom: 30px;
    background: white;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
    transition: all 0.4s;

    &::before {
      content: " ";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 5px;
      transition: all 0.4s;
      border: 2px solid transparent;
    }

    &:hover {
      opacity: 0.7;
      box-shadow: 0px 0px 6px 0px rgba(174, 184, 229, 0.8);
    }

    .type-icon {
      width: 50px;
      height: 50px;

      img {
        width: 50px;
        height: 50px;
      }
    }

    .type-text {
      flex: auto;
      line-height: 50px;
      font-size: 18px;
      box-sizing: border-box;
      padding-left: 20px;
      color: #666666;
      z-index: 2;
    }
  }

  .pay-type-hover {
    .type-text {
      color: #333333;
    }
  }

  .not-allowed {
    cursor: not-allowed;
  }

  @mixin activeBorder($color) {
    &::before {
      border-color: $color;
    }
  }

  .we-chat {
    @include activeBorder(#00cf82);
  }

  .ali-pay {
    @include activeBorder(#58c9f3);
  }

  .cash,
  .wallet {
    @include activeBorder(#fcb322);
  }

  .card {
    @include activeBorder(#ff6d61);
  }

  .user-defined {
    @include activeBorder(#ff6d61);
  }
}
</style>
