<template>
  <div class="selected-card-list-in-cart">
    <div
      v-for="(card, index) in billInfo.selectedCard" 
      :key="`${card.cardType}-${card.id}-${index}`" 
    >
      <div v-if="!card.deleted">
        <component style="margin-bottom: 8px;" :is="`cardInCart`" :index="index" :detail="{...card}" @toDeleteGoods="hanldeDeleteGoods(card, index)"/>
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import cardInCart from './suber/cardInCart.vue';
export default {
  data() {
    return {
      utils,
    }
  },
  methods: {
    ...mapActions(['deleteSelectedCards', 'setSelectedCardsValue']),
    hanldeDeleteGoods(card, index) {
      // 需要把已经删除的过滤掉
      if (card.id) {
        this.setSelectedCardsValue({deleted: true, index: index})
        this.$forceUpdate()
      } else {
        this.deleteSelectedCards(index)
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
  components: { cardInCart },
}
</script>
<style lang='scss' scoped>
.selected-card-list-in-cart {
  // overflow-y: auto; 
}
</style>
