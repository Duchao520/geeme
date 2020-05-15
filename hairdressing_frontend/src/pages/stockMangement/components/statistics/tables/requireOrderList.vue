<template>
  <el-table 
    stripe
    :data="tableData"
    height="calc(100vh - 405px)"
  >
    <el-table-column label="日期" prop="countDate"></el-table-column>
    <el-table-column label="订货单量" prop="invoiceNum"></el-table-column>
    <el-table-column label="订货客户数" prop="invoiceCustomerNum"></el-table-column>
    <el-table-column label="订单总金额" prop="invoiceTotalMoney"></el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array
    }
  },
}
</script>

<style lang="scss" scoped>

</style>