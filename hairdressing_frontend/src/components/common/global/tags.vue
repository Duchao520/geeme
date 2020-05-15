<template lang="pug">
  ul.g-tags
    li.g-tags-item(v-for="(item, index) in tags") {{ item }}
      i.icon.iconfont.icon-icon_close(@click="$emit('change', item)")
</template>
<script>
export default {
  props: {
    tags:Array
  },
}
</script>
<style lang="scss">
  .g-tags {
    width: 100%;
    &-item {
      position: relative;
      font-size: 14px;
      color: #686868;
      display: inline-block;
      padding: 8px;
      line-height: 12px;
      background: #F7F7F7;
      margin-right: 10px;
      border-radius: 4px;
      .icon { 
        display: none;
      }
      &:hover {
        .icon {
          display: block;
          position: absolute;
          top: -5px;
          right: -5px;
          cursor: pointer;
          font-size: 12px;
          color: #fff;
          background: #D8D8D8;
          border-radius: 50%;
        }
      }
      
    }
  }
</style>