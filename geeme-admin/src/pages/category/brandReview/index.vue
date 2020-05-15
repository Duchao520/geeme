<template>
  <div class="brandReview-wrapper">
    <div class="operation">
      <a-input-search placeholder="请输入分类名称" style="width: 280px" enterButton/>
    </div>

    <G-NavBar :navList="navList"/>
    <div class="content"></div>

    <router-view />
  </div>
</template>

<script>

export default {
  data() {
    return {
      navList: [{id: 1, title: '待审核'}, {id: 2, title: '已驳回'}, {id: 3, title: '已通过'}]
    }
  },
}
</script>

<style lang="less" scoped>
.brandReview-wrapper {
  height: @mainContentH;
  .operation {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 20px;
  }
  .content:extend(.normal-content-one) {
    .common-scrollbar();
    overflow-y: auto;
    height: calc(100% - 84px);
    padding: 0 20px;
    border-radius: 0 0 4px 4px;
  }
}
</style>