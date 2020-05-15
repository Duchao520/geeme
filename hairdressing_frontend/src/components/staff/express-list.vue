<template lang="pug">
.g-list
  ul.list
    li.list-item(
      v-for="(item, index) in list",
      :key="index"
    ) 
      span.time {{ item.time }}
      span.txt {{ item.txt }}
      i.icon.iconfont.icon-icon_operate_edit(
        v-if="index === (list.length - 1)"
      )
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
    display: inline-block;
    .list-item {
      font-size: 12px;
      padding: 0 10px 0 0;
      margin-right: 10px;
      .time {
        margin-right: 10px;
      }
    }
    .icon {
      color: #58C9F3;
    }
  }
  
</style>