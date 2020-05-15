<template>
  <ul class="sider-nav">
    <router-link 
      tag="li" 
      v-for="item in list" 
      :key="item.title"
      :to="item.link"
    >
    <i class="iconfont" v-html="item.icon"></i>
      {{item.title}}
    </router-link>
  </ul>
</template>

<script>
export default {
  props: {
    list: Array
  }
};
</script>

<style lang="less" scoped>
.sider-nav {
  padding: 12px 0 0 19px;
  li {
    height: 32px;
    margin: 0 0 26px 0;
    font-size: 14px;
    color: #ffffff;
    border-radius: 15px 0 0 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    /* 防止在收缩动效中出现字体挤压的情况 */
    word-break: keep-all;
    overflow: hidden;
    i {
      font-size: 24px;
      margin: 0 17px 0 13px;
    }
    &.router-link-active {
      background: #ffffff;
      color: #398CFC;
    }
  }
}
</style>