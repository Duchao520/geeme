<template>
  <div class="settle-account-right">
    <!-- 结算，微信或者支付宝 -->
    <scan-or-write-code
      ref="ScanOrWriteCode"
      :canWindUpAnAccount="canWindUpAnAccount"
      v-if="payTypeNumber===0 || payTypeNumber===1"
      :detail="detail"
      v-bind="$attrs"
    ></scan-or-write-code>
    <!-- 结算，现金支付 -->
    <user-defined-pay-type
      v-if="showBillIncash"
      :payTypeNumber="payTypeNumber"
      v-bind="$attrs"
      :detail="detail"
    ></user-defined-pay-type>
    <!-- 会员卡支付 -->
    <bill-in-vip-card ref="BillInVipCard" :finalPrice="detail.finalPrice" v-show="payTypeNumber===3"></bill-in-vip-card>
  </div>
</template>
<script>
import ScanOrWriteCode from "@/components/createOrder/settleAccounts/ScanOrWriteCode";
import UserDefinedPayType from "@/components/createOrder/settleAccounts/UserDefinedPayType";
import BillInVipCard from "./BillInVipCard";

export default {
  components: {
    BillInVipCard,
    ScanOrWriteCode,
    UserDefinedPayType
  },
  props: {
    detail: Object,
    canWindUpAnAccount: Boolean,
    payTypeNumber: Number,
    paymentModes:Array
  },
  computed: {
    showBillIncash() {
      return [0, 1, 3].indexOf(this.payTypeNumber) === -1;
    }
  }
};
</script>
<style lang="scss" scoped>
.settle-account-right {
  text-align: center;
  height: 100%;
}
</style>
