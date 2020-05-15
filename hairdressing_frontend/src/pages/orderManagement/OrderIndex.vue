<template>
  <div class="right-root">
    <router-view></router-view>
  </div>
</template>

<script>
  import '@/assets/css/base.scss';

  export default {}
</script>
<style lang="scss" scoped>
  .right-root {
    height: 100%;
    box-sizing: border-box;
    padding: 0;
  }

  /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background: #58C9F3;
    border-color: #58C9F3;
  }
</style>
<style lang="scss">
  .table-wrapper {
    height: calc(100vh - 376px);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }
</style>
