<template>
  <div class="trial-merchant-wrapper">
    <OrderSearch />

    <div class="content">
      <a-table>
        <a-table-column title="门店编号"></a-table-column>
        <a-table-column title="门店名称"></a-table-column>
        <a-table-column title="城市"></a-table-column>
        <a-table-column title="创建人"></a-table-column>
        <a-table-column title="手机号码"></a-table-column>
        <a-table-column title="版本"></a-table-column>
        <a-table-column title="申请试用时间"></a-table-column>
        <a-table-column title="试用到期时间"></a-table-column>
        <a-table-column title="销售公司"></a-table-column>
        <a-table-column title="销售人"></a-table-column>
        <a-table-column title="状态"></a-table-column>
        <a-table-column title="操作"></a-table-column>
      </a-table>
    </div>
  </div>
</template>

<script>
import OrderSearch from '../components/orderSearch'
export default {
  components: {
    OrderSearch,
  }
}
</script>

<style lang="less" scoped>
.trial-merchant-wrapper {
  height: @mainContentH;
  .content:extend(.normal-content-one) {
    .common-scrollbar();
    .ant-table-content();
    overflow-y: auto;
    height: calc(100% - 131.39px);
    padding: 0 20px 20px 20px;
  }
}
</style>