<template lang="pug">
  .g-card
    ul.card-list
      router-link.card-item(
        v-for="(item, index) in list", 
        :to="item.url"
        :key="index"
        tag="li"
      )
        img.card-img(
          :src="item.img",
        )
        .card-text
          p.num {{item.count}}
          p.title {{ item.title }}

</template>
<script>
export default {
  props: {
    list: Array
  },
  data() {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
  .g-card {
    width: 100%;
    .card-list {
      display: flex;
      display: -webkit-flex;
      display: -moz-flex;
      display: -ms-flex;
      display: -o-flex;
      .card-item {
        flex: 1;
        -webkit-flex: 1;
        -moz-flex: 1;
        -ms-flex: 1;
        -o-flex: 1;
        text-align: left;
        margin-right: 20px;
        padding: 25px 30px;
        border-radius: 8px;
        -webkit-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
        -o-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
        -moz-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
        -ms-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
        box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
        &:last-child {
          margin-right: 0;
        }
        .card-img {
          width: 56px;
          height: 56px;
          vertical-align: middle;
        }
        .card-text {
          vertical-align: middle;
          display: inline-block;
          margin-left: 20px;
          .num {
            font-size: 32px;
            line-height: 40px;
            color: #999999;
          }
          .title {
            font-size: 16px;
            line-height: 30px;
            color: #606266;
          }
        }
      }
    }
  }
</style>