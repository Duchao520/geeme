<template>
  <div class="common-search-line">
    <input-search
      placeholder="请输入名称或店内编码"
      v-model="keyword"
      @search="queryGoodsName"
    ></input-search>
    <switch-menu v-if="['service', 'product'].includes(billInfo.currentLeftType)" v-model="goodsViewWithImg"></switch-menu>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      keyword: '',
    }
  },
  methods: {
    ...mapActions(['setGoodsViewWithImg']),
    queryGoodsName() {
      this.$emit('search', this.keyword)
    },
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
    }),
    goodsViewWithImg: {
      get() {
        return this.$store.state.bill.goodsViewWithImg
      },
      set(str) {
        this.setGoodsViewWithImg(str) // 'card' => img; 'list' => text
      }
    }
  },
}
</script>
<style lang='scss' scoped>
.common-search-line {
  margin-bottom: 10px;
  margin-right: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
