<template>
  <div class="material-wrapper">
    <G-NavBar :navList="routesList" :withLink="true"/>

    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    routesList() {
      return this.$store.getters.deepThreeMap.get(this.$route.matched[2].name);
    }
  }
};
</script>

<style lang="less" scoped>
.content:extend(.page-content) {
  .common-scrollbar();
}
</style>