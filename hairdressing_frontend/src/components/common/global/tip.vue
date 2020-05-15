<template lang="pug">
  .g-tip(
    :class="[position, transform]"
  )
    ul.tip-list(
      v-if="list.length > 1"
    )
      li.list-item(
        v-for="(item, index) in list",
        :key="index"
      ) {{ item.name }}
    span(v-else) {{list[0].name}}
</template>
<script>
import { deflate } from 'zlib'
export default {
  props: {
    position: String,
    transform: String,
    list: {
      type: Array,
      default: () => {
       return [
          {name: '手机号: 13311223344'},
          {name: '400电话: 400-1234567 (-号必须)'},
          {name: '固定电话: 010-12345678 (-号必须)'},
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .g-tip {
    display: none;
    width: 250px;
    box-sizing: border-box;
    padding: 10px 10px 10px 30px;
    line-height: 18px;
    color: #999;
    border: none !important;
    font-size: 12px;
    border-radius: 4px;
    -webkit-box-shadow: 0px 0px 34px 0 rgba(231, 231, 231, 0.6), 0 0 0 transparent;
    box-shadow: 0px 0px 34px 0 rgba(231, 231, 231, 0.6), 0 0 0 transparent;
    &.right {
      position: absolute;
      right: 0%;
      top: -10%;
      transform: translate(120%, 0)
    }
    &.top {
      position: absolute;
      right: 165%;
      top: -200%;
      transform: translate(120%, 0);
      .tip-list{
        position: relative;
        &:before{
          top: 100%;
          left: 44%;
          transform: translateY(50%);
          // content: '';
          // width: 10px;
          // height: 10px;
          // background: #fff;
          // position: absolute;
          // transform: rotate(-45deg); 
          // -webkit-box-shadow: 0px 0px 34px 0 rgba(231, 231, 231, 0.6), 0 0 0 transparent;
          // box-shadow: 0px 0px 34px 0 rgba(231, 231, 231, 0.6), 0 0 0 transparent;
        }
      }
    }
    &.none-transform {
      transform: none;
    }
    .tip-list {
      position: relative;
      .list-item {
        list-style: disc;
      }
      &:before {
        content: '';
        width: 10px;
        height: 10px;
        background: #fff;
        position: absolute;
        top: 44%;
        left: -16%;
        transform: rotate(-45deg); 
        -webkit-box-shadow: 0px 0px 34px 0 rgba(231, 231, 231, 0.6), 0 0 0 transparent;
        box-shadow: 0px 0px 34px 0 rgba(231, 231, 231, 0.6), 0 0 0 transparent;
      }
    }
  }
</style>