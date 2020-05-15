<template>
  <div class="selected-goods-list-in-cart">
    <div
      v-for="(goods, index) in billInfo.selectedGoods" 
      :key="`${goods.goodsType}-${goods.id}-${index}`" 
    >
      <div v-if="!goods.deleted">
        <component style="margin-bottom: 8px;" :is="`${goods.goodsType}Item`" :index="index" :detail="{...goods}" @toDeleteGoods="hanldeDeleteGoods(goods, index)"/>
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import serviceItem from './suber/serviceInCart.vue';
import productionItem from './suber/productInCart.vue';
export default {
  data() {
    return {
      utils,
    }
  },
  methods: {
    ...mapActions(['deleteSelectedGoods', 'setSelectedGoodsValue']),
    hanldeDeleteGoods(goods, index) {
      // 需要把已经删除的过滤掉
      if (goods.id) {
        this.setSelectedGoodsValue({deleted: true, index: index})
        this.$forceUpdate()
      } else {
        this.deleteSelectedGoods(index)
      }
      // this.$forceUpdate()
    },
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    }),
  },
  components: { serviceItem, productionItem },
}
</script>
<style lang='scss' scoped>
.selected-goods-list-in-cart {
  // overflow-y: auto; 
}
</style>
