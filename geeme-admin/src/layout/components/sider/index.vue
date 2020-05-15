<template>
  <div class="geeme-sider" :class="{hide: !show}">
    <SiderNav :list="siderNavList"/>
  </div>
</template>

<script>
  import SiderNav from './siderNav'

  export default {
    components: {
      SiderNav
    },
    props: {
      show: Boolean,
    },
    computed: {
      siderNavList() {
        return this.$store.getters.siderNavList.filter(item => !item.hide)
      }
    }
  }
</script>

<style lang="less" scoped>
  .geeme-sider {
    width: @siderW;
    height: 100%;
    background: @siderB;
    transition: @siderTransi;
    overflow: hidden;

    &.hide {
      transform: translateX(-100%);
      width: 0px;
    }
  }

</style>
