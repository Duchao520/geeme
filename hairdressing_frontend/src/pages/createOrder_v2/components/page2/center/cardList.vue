<template>
  <ul class="card-list scrollbar" v-infinite-scroll="load">
    <cardSingle 
      v-for="card in list" 
      :key="card.id + Math.random()" 
      :card="card"
    />
  </ul>
</template>
<script>
import cardSingle from './cardSingle.vue';
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
    // 滚动条回到顶部
    returnTop() {
      document.querySelector('.scrollbar').scrollTop = 0
    },
  },
  components: { cardSingle },
  computed: {
    ...mapState({
      billInfo: state => state.bill
    }),
    noMore() {
      return this.list.length >= this.totle;
    },
    disabled() {
      return this.loading || this.noMore;
    }
  }
}
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
.card-list {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: auto;
  height: calc(100vh - 190px); // - 105 - 50 - 35
  padding: 10px 0;
  box-sizing: border-box;
}
</style>
