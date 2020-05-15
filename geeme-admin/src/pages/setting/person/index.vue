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
  computed: {
    routesList() {
      return this.$store.getters.deepThreeMap.get(this.$route.matched[2].name)
    }
  },
  mounted() {},
  methods: {
  },
}
</script>

<style lang="less" scoped>
.content:extend(.page-content) {
  .common-scrollbar();
}
</style>