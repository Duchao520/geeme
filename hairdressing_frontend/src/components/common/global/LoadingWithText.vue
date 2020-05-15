<template>
  <div class="loading-root">
    <img src="@/assets/images/default/loading.gif" class="loading-img" alt>
    <p class="text">加载中...</p>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.loading-root {
  padding-top: 20px;
  .loading-img {
    width: 40px;
    display: block;
  }
  .text {
    margin-top: 20px;
  }
}
</style>
