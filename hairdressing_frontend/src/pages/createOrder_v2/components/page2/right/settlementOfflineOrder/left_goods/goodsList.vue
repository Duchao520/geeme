<template>
  <div class="goods-list" v-loading.fullscreen="loading">
    <div class="goods-in-cart" 
      v-for="(goods, index) in $attrs.currentGoodsList" 
      :key="`${goods.goodsType}-${goods.id}-${index}`"
    >
      <div v-if="!goods.deleted">
        <!-- 
          以下数据是服务专用
          @suberCardChanged
          :suggestCard
          :usefulCard
         -->
        <component 
          :is="`${goods.goodsType}InList`" 
          v-on="$listeners"
          v-bind="$attrs" 
          :detail="goods" 
          :index="index"
          @suberCardChanged="handleGedSuberCountCardChanged"
          @saveCardInfo="saveCardInfo"
          :suggestCard="$attrs.usefulCardList[$attrs.indexObjForApi[index]] && $attrs.usefulCardList[$attrs.indexObjForApi[index]].suggestCardForService"
          :usefulCard="$attrs.usefulCardList[$attrs.indexObjForApi[index]]"
        />
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";

import serviceInList from './goodsInList_service.vue';
import productionInList from './goodsInList_product.vue';
import cardInList from './goodsInList_card.vue';

export default {
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    // 监听子服务订单次卡选择的动态回调
    handleGedSuberCountCardChanged(cardInfo) {
      // console.log(cardInfo)
      this.$attrs.usefulCardList[this.$attrs.indexObjForApi[cardInfo.index]].countCardSelectedStatus.countCardId = cardInfo.countCardId
    },
    saveCardInfo(card) {
      this.$attrs.usefulCardList[this.$attrs.indexObjForApi[card.index]].info = {...card.data, index: card.index}
      this.cardInfo = this.$attrs.usefulCardList.map(i => i.info)
      console.log(this.cardInfo)
      // 把这个信息传递给兄弟组件。
      this.$emit('saveCardInfoList',this.cardInfo)
    }
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    }),
    notInCard() {
      return ['service', 'product'].includes(this.billInfo.currentLeftType)
    },
  },
  watch: {},
  components: {serviceInList, productionInList, cardInList }
}
</script>
<style lang='scss' scoped>
.goods-list {
  margin: 0 15px;
  border-top: 1px dotted #efefef;
}
</style>
