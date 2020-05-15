<template>
  <div class="goods-detail">
    <goods-item-detail v-bind="$attrs" v-for="(item,index) in goodsList" :key="index" :detail="item" :index="index" :isLast="index===goodsList.length - 1"></goods-item-detail>
  </div>
</template>
<script>
  import GoodsItemDetail from "./GoodsItemDetail"
  export default {
    components:{GoodsItemDetail},
    props: {
      goodsList: [Array, Object]
    },
  }
</script>
