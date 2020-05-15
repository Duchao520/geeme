<template>
  <div class="card-lists">
    <card-item
      v-for="(item,index) in list"
      class="card"
      :key="index"
      :cardInfo="item"
      :selectedCardIds="selectedCardIds"
      v-on="$listeners"
    ></card-item>
  </div>
</template>
<script>
import CardItem from "@/components/createOrder/goodsCard/CardItem";

export default {
  components: {
    "card-item": CardItem
  },
  props: {
    list: Array,
    selectedCardIds: Array
  },
  mounted() {
    // console.log(this.list)
  },
};
</script>

