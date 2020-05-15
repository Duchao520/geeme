<template>
  <div>
    <el-table 
      stripe
      show-summary
      height="calc(100vh - 267px)"
      :data="tableData"
      v-loading.fullscreen.lock="pageLoading"
    >
      <el-table-column label="时间趋势" prop="occurDate" width="100">
        <template slot-scope="scope">
          {{filterData.type === 'DATE' ? scope.row.occurDate : scope.row.occurDate.slice(0,7)}}
        </template>
      </el-table-column>
      <el-table-column label="服务">
        <el-table-column label="总额" prop="serviceTotalPerformance"></el-table-column>
        <el-table-column label="现金类总业绩" prop="serviceCashPerformance"></el-table-column>
        <el-table-column label="现金" prop="serviceCashpayPerformance"></el-table-column>
        <el-table-column label="支付宝" prop="serviceAlipayPerformance"></el-table-column>
        <el-table-column label="微信" prop="serviceWepayPerformance"></el-table-column>
        <el-table-column label="自定义" prop="serviceSelfdefPerformance"></el-table-column>
        <el-table-column label="划卡类总业绩" prop="serviceCardPerformance"></el-table-column>
        <!-- <el-table-column label="储值卡总业绩" prop="servicePrepaidCardpayPerformance"></el-table-column> -->
        <el-table-column label="储值金" prop="serviceRechargeMoneyPerformance"></el-table-column>
        <el-table-column label="赠送金" prop="serviceGiftMoneyPerformance"></el-table-column>
        <el-table-column label="时间卡" prop="serviceTimeCardpayPerformance"></el-table-column>
        <el-table-column label="次卡" prop="serviceTimeCardpayPerformance"></el-table-column>
        <!-- <el-table-column label="赠送业绩" prop="serviceGivePerformance"></el-table-column> -->
      </el-table-column>
    </el-table>
    <div class="padding-box"></div>
  </div>
</template>
<script>
// 门店营收分类表 - 饿了么组件
import * as axios from '@/util/axios'
import {mapState} from 'vuex'
export default {
  props: {
    filterData: { type: Object }
  },
  data() {
    return {
      pageLoading: false,
      tableData: [],
    }
  },
  created() {},
  methods: {
    init() {
      this.tableData = []
      if (!this.filterData.date) { return false } // 第一次初始化的时候,可能没有
      let data = {
        requestTimeType: this.filterData.type,
        storeId: this.currentEntry === 'brand' ? this.filterData.shopIdInBrand : this.currentInfo.shopId,
        brandId: this.currentInfo.brandId,
        beginOccurDate: this.filterData.date[0],
        endOccurDate: this.filterData.date[1],
      }
      this.pageLoading = true
      axios.post('/getStoreDailyPerformanceStatisticsList', data).then(res => {
        this.pageLoading = false
        if (res.success) {
          this.tableData = res.statisticsForLists
        } else {
          this.tableData = []
          this.$message({ type: 'error', message: res.message })
        }
      }).catch(err => {
        this.pageLoading = false
      })
    },
  },
  watch: {
    filterData: {
      handler: function(v, o) {
        if (v) {
          this.currentPage = 1
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
}
</script>
<style lang='scss' scoped>
// /deep/ .el-table__footer-wrapper {
//   position: fixed;
//   z-index: 1;
// }
.padding-box {
  height: 10px;
}
.el-table{
  overflow: visible !important; // 合计行不显示的bug, 不能改!!!
}
</style>

