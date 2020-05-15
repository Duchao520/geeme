<template>
  <div class="wrapper">
    <NavBar :navList="routesList" :withLink=true />

    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/navBar'
export default {
  components: {
    NavBar,
  },
  data() {
    return {
    }
  },
  // TODO: 有木有方法能通过此组件实例获取到该组件在路由中定义的 meta
  computed: {
    routesList() {
      return this.$store.getters.deepThreeMap.get(this.$route.matched[2].name)
    }
  },
  mounted() {},
  methods: {
    changeCurrentComponent(name) {
      this.currentComponent = name
    }
  },
}
</script>

<style lang="less" scoped>
.content:extend(.page-content) {
  .common-scrollbar();
}
</style>