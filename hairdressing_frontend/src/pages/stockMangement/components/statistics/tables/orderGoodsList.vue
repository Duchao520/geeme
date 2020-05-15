<template>
  <el-table 
    stripe
    :data="tableData"
    height="calc(100vh - 310px)"
  >
    <el-table-column v-if="currentEntry === 'brand'" label="门店名称" prop="toStoreName"></el-table-column>
    <el-table-column label="订货单号" prop="productInvoiceNo"></el-table-column>
    <el-table-column label="订货时间" prop="askTime"></el-table-column>
    <el-table-column label="产品编号" prop="stockProductNo"></el-table-column>
    <el-table-column label="产品名称" prop="stockProductName"></el-table-column>
    <el-table-column label="规格" prop="specificationName"></el-table-column>
    <!-- <el-table-column label="单位" prop="specificationUnit" width="80"></el-table-column> -->
    
    <el-table-column label="审批数量" prop="approvalNum"></el-table-column>
    <el-table-column label="审批价" prop="approvalPrice"></el-table-column>
    <el-table-column label="审批金额">
      <template slot-scope="{row}">
        {{ (Number(row.approvalNum) * Number(row.approvalPrice)).toFixed(2) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {mapState, mapActions} from 'vuex';
export default {
  props: {
    tableData: {
      type: Array
    }
  },
  methods: {
    // 详情
    handleDetail(row) {
      this.$emit('setRow', row)
    },
  },
  filters: {
    storageTypeFilter(type) {
      let map = {
        1: '采购入库',
        2: '订货入库',
        3: '调拨入库',
        4: '销售退货',
        5: '盘盈入库',
        6: '初始入库',
        7: '赠送入库',
        8: '其他入库',
        9: '订货退回', // 品牌入库
        11: '退采购出库',
        12: '订货出库',
        13: '调拨出库',
        14: '销售出库',
        15: '盘亏出库',
        16: '赠送出库',
        17: '其他出库',
        18: '订货退回', // 门店出库
        19: '门店领用',
      }
      return map[type]
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
}
</script>

<style lang="scss" scoped>
.stock-num {
  color: green;
}
.is-out {
  color: red;
}
</style>