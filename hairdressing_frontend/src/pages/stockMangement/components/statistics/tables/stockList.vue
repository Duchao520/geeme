<template>
  <el-table 
    stripe
    :data="tableData"
    height="calc(100vh - 310px)"
  >
    <el-table-column label="产品编号" prop="stockProductNo"></el-table-column>
    <el-table-column label="产品名称" prop="stockProductName"></el-table-column>
    <el-table-column label="规格" prop="specificationName"></el-table-column>
    <!-- <el-table-column label="单位" prop="specificationUnit" width="80"></el-table-column> -->
    <el-table-column label="出入库类型" prop="storageType">
      <template slot-scope="{row}">
        {{row.storageType | storageTypeFilter}}
      </template>
    </el-table-column>
    <el-table-column label="出入库单号" prop="stockOrderNo"></el-table-column>
    <el-table-column label="出入库时间" prop="checkTime"></el-table-column>
    <el-table-column label="出入库数量" prop="signNum">
      <template slot-scope="{row}">
        <span class="stock-num" :class="{'is-out': row.operateType}">
          {{`${row.operateType ? '-' : '+'}${row.signNum}`}}
        </span>  
      </template>
    </el-table-column>
    <el-table-column label="库存量" prop="validStock"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="{row}">
        <g-button
          :name="'单据详情'"
          type="detail"
          :icon="'icon_operate_eyes'"
          @click="handleDetail(row)"
        ></g-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
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