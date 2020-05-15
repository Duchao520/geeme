<template>
  <div class="encoding-list-wrapper">
    <a-button type="primary">新增地区码</a-button>
    <a-table>
      <a-table-column title="编号"></a-table-column>
      <a-table-column title="对应地区"></a-table-column>
      <a-table-column title="地区码"></a-table-column>
      <a-table-column title="创建/修改人"></a-table-column>
      <a-table-column title="创建/修改时间"></a-table-column>
      <a-table-column title="操作"></a-table-column>
    </a-table>
  </div>
</template>

<script>

export default {
  
}
</script>

<style lang="less" scoped>
.encoding-list-wrapper {
  height: 100%;
  overflow: hidden;
  padding: 30px 20px 20px 20px;
  /* 通用表格 */
  .ant-table-content();
}
</style>