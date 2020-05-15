<template>
  <div class="right-detail">
    <component v-bind="$attrs" v-on="$listeners" :is="activePayComp"></component>
    <!-- <component v-bind="$attrs" v-on="$listeners" :is="'payByMix'"></component> -->
  </div>
</template>
<script>
import payByCash from './right_pay/payByCash.vue';
import payByCard from './right_pay/payByCard.vue';
import scanToPay from './right_pay/scanToPay.vue';
import payByMix from './right_pay/payByMix.vue';
export default {
  methods: {

  },
  computed: {
    activePayComp() {
      switch(this.$attrs.active.billType) {
        case 0: // 微信
        case 1: // 支付宝
          return 'scanToPay'
        case 2: // 现金
        case 4: // 自定义
        case 8: // 余额-钱包
          return 'payByCash'  
        case 9: // 混合支付
          return 'payByMix'  
        case 3: // 会员卡
          return 'payByCard'  
        default:
          return 'payByCash'
      }
    }
  },
  components: { payByCash, payByCard, scanToPay, payByMix }
}
</script>
<style lang='scss' scoped>
.right-detail {
  width: 343px;
  min-height: 730px;
  height: calc(100vh - 240px);
  background: #fff;
}
</style>
