<template>
  <el-table 
    stripe
    :data="tableData"
    height="calc(100vh - 310px)"
  >
    <el-table-column label="产品编号" prop="stockProductNo"></el-table-column>
    <el-table-column label="产品名称" show-overflow-tooltip prop="stockProductName"></el-table-column>
    <el-table-column label="规格" show-overflow-tooltip prop="specificationName"></el-table-column>
    <!-- <el-table-column label="单位" prop="specificationUnit"></el-table-column> -->

    <el-table-column label="期初">
      <el-table-column label="数量" prop="num" width="80px"></el-table-column>
      <el-table-column label="成本金额" prop="costMoney"></el-table-column>
    </el-table-column>

    <el-table-column label="入库">
      <el-table-column label="数量" prop="inNum" width="80px"></el-table-column>
      <el-table-column label="成本金额" prop="inCostMoney"></el-table-column>
    </el-table-column>

    <el-table-column label="出库">
      <el-table-column label="数量" prop="outNum" width="80px"></el-table-column>
      <el-table-column label="成本金额" prop="outCostMoney"></el-table-column>
    </el-table-column>

    <el-table-column label="期末">
      <el-table-column label="数量" prop="endNum" width="80px"></el-table-column>
      <el-table-column label="成本金额" prop="endCostMoney"></el-table-column>
    </el-table-column>
    
    <!-- <el-table-column label="操作">
      <template slot-scope="{row}">
        <g-button
          :name="'单据详情'"
          type="detail"
          :icon="'icon_operate_eyes'"
          @click="handleDetail(row)"
        ></g-button>
      </template>
    </el-table-column> -->

  </el-table>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  props: {
    tableData: {
      type: Array
    },
  },
  data() {
    return {
      detailVisible: false,
    }
  },
  methods: {
    handleDetail(row) {

    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
  },  
}
</script>

<style lang="scss" scoped>

</style>