<template>
  <div class="choose-goods-center">
    <!-- 这里按需加载不同的内容主体组件 -->
    <component :is="billInfo.currentLeftType"/>
  </div>
</template>
<script>
import { mapState } from "vuex";
import service from './serviceMain.vue'
import product from './productMain.vue'
import card from './cardMain.vue'
import renewal_card from './renewalCardMain.vue'
export default {
  computed: {
    ...mapState({
      billInfo: state => state.bill,
    })
  },
  components: { service, product, card, renewal_card },
  watch: {
    "billInfo.currentLeftType"(val) {
    }
  },
}
</script>
<style lang='scss' scoped>
.choose-goods-center {
  box-sizing: border-box;
  background: #fff;
  border-radius: 8px;
  margin-right: 450px;
  margin: 85px 450px 20px 80px;
  height: calc(100vh - 105px);
  min-height: 400px;
  // min-width: 270px; /* 800 - 450 - 80 已经被header限制 */
  padding: 20px 0 20px 20px;
}
</style>
