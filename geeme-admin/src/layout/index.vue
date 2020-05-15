<template>
  <div class="geeme-admin-wrapper">
    <Header @isOpen="toggleSider"/>
    <div class="main-content">
      <Sider :show="siderShow"/>
      <Content />
    </div>
  </div>
</template>

<script>
import Header from './components/header/index'
import Sider from './components/sider/index'
import Content from './components/content'
/* 测试用 */
import Role from '@/utils/role'
export default {
  components: {
    Header,
    Sider,
    Content,
  },
  data() {
    return {
     siderShow: true
    }
  },
  mounted() {
    /* 测试权限分配 */
    //const role = new Role()
    //window.console.log(role)
  },
  methods: {
    toggleSider(data) {
      this.siderShow = !!data
    }
  },
}
</script>

<style lang="less" scoped>
.geeme-admin-wrapper {
  height: 100vh;
  .main-content {
    display: flex;
    height: calc(100vh - @headerH);
    background: @mainContentB;
  }
}
</style>