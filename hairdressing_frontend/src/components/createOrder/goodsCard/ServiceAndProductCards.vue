<template>
  <ul class="service-lists">
    <goods-item-card
      v-for="(item, index) in list"
      :key="index"
      v-on="$listeners"
      :detail="item"
      :index="index"
      :selectedServiceList="selectedServiceList"
    ></goods-item-card>
  </ul>
</template>
<script>
  import GoodsItemCard from "@/components/createOrder/goodsCard/GoodsItemCard";

  export default {
    components: {GoodsItemCard},
    props: {
      list: Array,
      selectedServiceList: Array, // 处理库存用
      type: String, // 'product', 'service', 为产品时才处理数量是否超出库存
    },
    methods: {}
  };
</script>
<style lang="scss" scoped>
  @import "@/assets/css/scrollbar.scss";
  @import "@/assets/css/order/shadow.scss";
  @import "@/assets/css/mixin.scss";

  .service-lists {
    height: calc(100%);
    flex-wrap: wrap;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    overflow-y: auto;
    @include scroll-y(6px);
    padding-top: 20px;
    box-sizing: border-box;
  }
</style>
