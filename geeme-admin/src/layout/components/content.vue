<template>
  <div class="geeme-app-content">
    <router-view />
  </div>
</template>

<script>

export default {
  
}
</script>

<style lang="less" scoped>
.geeme-app-content {
  flex: 1;
  height: calc(100vh - 40px - 55px);
  margin: 20px;
}
</style>