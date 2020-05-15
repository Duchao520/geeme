<template>
  <!-- <div>
    <ul class="product-list scrollbar" v-infinite-scroll="load">
      <productSingle v-for="product in list" :key="product.id + Math.random()" :product="product" />
      <br />
    </ul>
  </div>-->
  <div>
    <ul class="product-list scrollbar"  v-infinite-scroll="load">
      <productSingle v-for="product in list" :key="product.id + Math.random()" :product="product" />
    </ul>
  </div>
</template>
<script>
import productSingle from "./productSingle.vue";
import { mapState } from "vuex";

export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    totle: Number,
    loading: Boolean
  },
  mounted() {},
  methods: {
    // 实现滚动懒加载数据
    load() {
      if (this.noMore) return;
      this.$emit("loadGoods");
    },
    // 存在顶部分类的时候不予下拉
    noLoad() {},
    // 滚动条回到顶部
    returnTop() {
      document.querySelector('.scrollbar').scrollTop = 0
    },
  },
  components: { productSingle },
  computed: {
    ...mapState({
      billInfo: state => state.bill
    }),
    noMore() {
      return (
        this.list.length >= this.totle
      );
    },
    disabled() {
      return this.loading || this.noMore;
    }
  }
};
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
.product-list {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: auto;
  height: calc(100vh - 190px); // - 105 - 50 - 35
  padding: 10px 0;
  box-sizing: border-box;
}

.noMore {
  display: block;
}
</style>
