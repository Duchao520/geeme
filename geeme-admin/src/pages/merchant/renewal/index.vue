<template>
  <div class="renewal-merchant-wrapper">
    <OrderSearch />

    <G-NavBar :navList="navList"/>

    <div class="content">
      <a-table>
        <a-table-column title="订单号"></a-table-column>
        <a-table-column title="门店名称"></a-table-column>
        <a-table-column title="城市"></a-table-column>
        <a-table-column title="行业"></a-table-column>
        <a-table-column title="系统版本"></a-table-column>
        <a-table-column title="单价"></a-table-column>
        <a-table-column title="续费时长"></a-table-column>
        <a-table-column title="金额"></a-table-column>
        <a-table-column title="续费后到期时间"></a-table-column>
        <a-table-column title="支付方式"></a-table-column>
        <a-table-column title="支付时间"></a-table-column>
        <a-table-column title="服务者"></a-table-column>
        <a-table-column title="订单状态"></a-table-column>
        <a-table-column title="续费生效"></a-table-column>
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
  },
  data() {
    return {
      navList: [{id: 1, title: '全部'}, {id: 2, title: '已付款'}, {id: 3, title: '待付款'},  {id: 4, title: '已关闭'},  {id: 5, title: '已删除'}]
    }
  },
}
</script>

<style lang="less" scoped>
.renewal-merchant-wrapper {
  height: @mainContentH;
  .content:extend(.normal-content-one) {
    .common-scrollbar();
    .ant-table-content();
    overflow-y: auto;
    height: calc(100% - 163.39px);
    border-radius: 0 0 4px 4px;
    padding: 0 20px 20px 20px;
  }
}
</style>