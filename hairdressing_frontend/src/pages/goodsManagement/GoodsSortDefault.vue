<template>
  <div class="goods-sort-default">
    <img class="img" src="@/assets/img/bg_default_goods.png" alt>
    <p class="text">{{text}}</p>
  </div>
</template>
<script>
export default {
  props: {
    text: String
  }
};
</script>
<style lang="scss" scoped>
.goods-sort-default {
  display: flex;
  flex-direction: column;
  align-items: center;
  .img {
    display: block;
    width: 293px;
    margin-top: 210px;
  }
  .text {
    font-size: 16px;
    margin-top: 40px;
    color: #999999;
  }
}
</style>
