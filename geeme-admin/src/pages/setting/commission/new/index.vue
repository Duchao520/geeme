<template>
  <div class="new-purchase-wrapper">
    <div class="operation">
      <a-button type="primary" @click="add">新增提成方案</a-button>
      <a-input-search placeholder="搜索方案名称/适用职务" style="width: 280px" enterButton />
    </div>
    <a-table>
      <a-table-column title="提成方案名称"></a-table-column>
      <a-table-column title="适用职务"></a-table-column>
      <a-table-column title="提成方式"></a-table-column>
      <a-table-column title="创建人"></a-table-column>
      <a-table-column title="创建时间"></a-table-column>
      <a-table-column title="操作"></a-table-column>
    </a-table>

    <router-view />
  </div>
</template>

<script>

export default {
  methods: {
    add() {
      this.$router.push('/app/setting/commission/new/add')
    }
  }
}
</script>

<style lang="less" scoped>
.new-purchase-wrapper {
  height: 100%;
  overflow: hidden;
  padding: 30px 20px 40px 20px;
    /* 通用表格 */
  .ant-table-content();
  .operation {
    display: flex;
    justify-content: space-between;
  }
}
</style>