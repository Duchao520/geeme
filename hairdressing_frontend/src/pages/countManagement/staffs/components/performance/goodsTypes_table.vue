<template>
  <!-- :style="{height: tableHeight}" -->
  <div>
      <!-- height="calc(100vh - 362px)" -->
    <el-table
      stripe
      show-summary
      :data="tableData"
      v-loading.fullscreen.lock="pageLoading"
    >
      <el-table-column label="员工姓名" fixed>
      <!-- <el-table-column label="员工姓名" show-overflow-tooltip> -->
        <template slot-scope="{row}">
          <p>{{row.staffName}}</p>
          <p style="color:#999;">{{row.levelName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="服务客数" prop="serviceCustomerNum"></el-table-column>
      <el-table-column label="指定客数" prop="specified"></el-table-column>
      <el-table-column label="现金业绩" prop="totalCashPerformance"></el-table-column>
      <el-table-column label="提成合计" prop="totalCommission"></el-table-column>

      <el-table-column label="服务项目业绩">
        <el-table-column label="总业绩" prop="laborPerformance"></el-table-column>
        <el-table-column label="总提成" prop="laborCommission"></el-table-column>
        <el-table-column label="单数" prop="serviceOrderCount"></el-table-column>
        <el-table-column label="现金类" prop="serviceCashPerformance"></el-table-column>
        <el-table-column label="现金类提成" prop="serviceCashCommission"></el-table-column>
        <el-table-column label="卡扣类" prop="serviceCardPerformance"></el-table-column>
        <el-table-column label="卡扣类提成" prop="serviceCardCommission"></el-table-column>
        <el-table-column label="赠送类" prop="serviceGiftPerformance"></el-table-column>
        <el-table-column label="赠送类提成" prop="serviceGiftCommission"></el-table-column>
        <el-table-column label="指定" prop="serviceAppointedPerformance"></el-table-column>
        <el-table-column label="指定提成" prop="serviceAppointedCommission"></el-table-column>
        <el-table-column label="非指定" prop="serviceUnAppointedPerformance"></el-table-column>
        <el-table-column label="非指定提成" prop="serviceUnAppointedCommission"></el-table-column>
      </el-table-column>

      <el-table-column label="产品业绩">
        <el-table-column label="总业绩" prop="productSalesPerformance"></el-table-column>
        <el-table-column label="总提成" prop="productCommission"></el-table-column>
        <el-table-column label="单数" prop="productCount"></el-table-column>
        <el-table-column label="现金类" prop="productCashPerformance"></el-table-column>
        <el-table-column label="现金类提成" prop="productCashCommission"></el-table-column>
        <el-table-column label="卡扣类" prop="productCardPerformance"></el-table-column>
        <el-table-column label="卡扣类提成" prop="productCardCommission"></el-table-column>
        <el-table-column label="赠送类" prop="productGiftPerformance"></el-table-column>
        <el-table-column label="赠送类提成" prop="productGiftCommission"></el-table-column>
      </el-table-column>

      <el-table-column label="售卡业绩">
        <el-table-column label="总业绩" prop="cardSalesPerformance"></el-table-column>
        <el-table-column label="总提成" prop="cardCommission"></el-table-column>
        <el-table-column label="单数" prop="cardOrderCount"></el-table-column>
        <el-table-column label="现金类" prop="cardCashPerformance"></el-table-column>
        <el-table-column label="现金类提成" prop="cardCashCommission"></el-table-column>
        <el-table-column label="卡扣类" prop="cardCardPerformance"></el-table-column>
        <el-table-column label="卡扣类提成" prop="cardCardCommission"></el-table-column>
      </el-table-column>
    </el-table>
    <div class="padding-box"></div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapState } from "vuex";
export default {
  props: {
    tableHeight: {
      type: String
    },
    filterData: {
      type: Object
    }
  },
  data() {
    return {
      tableData: [],
      pageLoading: false,
    }
  },
  created() {
    // this.init()
  },
  methods: {
    init() {
      this.tableData = []
      if (!this.filterData.date) { return } // 第一次初始化的时候,可能没有
      let shopId = this.currentEntry === 'brand' ? this.filterData.shopIdInBrand : this.currentInfo.shopId
      if (!shopId) { return }
      let  data = {
        ...this.filterData,
        storeId: shopId
      }
      this.pageLoading = true
      axios.post('/getStaffPerformanceAndSalaryDetail', data).then(res => {
        this.tableData = res.detailInfoList || []
        this.pageLoading = false
      }).catch(err => {
        this.pageLoading = false
      })
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
  watch: {
    filterData: {
      handler: function(v, o) {
        if (v) {
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },
}
</script>
<style lang='scss' scoped>
.padding-box {
  height: 10px;
}
// /deep/ .el-table__footer-wrapper {
//   position: fixed;
//   z-index: 1;
// }
</style>
