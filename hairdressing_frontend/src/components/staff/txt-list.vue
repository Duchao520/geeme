<template lang="pug">
.g-list
  ul.list
    li.list-item(
      v-for="(item, index) in list",
      :key="index"
    ) {{ item }}
</template>
<script>
export default {
  props: {
    list: Array
  }
}
</script>
<style lang="scss" scoped>
  .list {
    width: 100%;
    display: flex;
    .list-item {
      font-size: 12px;
      display: inline-block;
      padding: 2px 10px;
      border: 1px solid #EBEBEB;
      border-radius: 10px;
      margin-right: 10px;
    }
  }
  
</style>