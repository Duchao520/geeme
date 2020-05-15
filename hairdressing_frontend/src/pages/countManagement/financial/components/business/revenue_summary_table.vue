<template>
  <div>  
    <el-table 
      height="calc(100vh - 267px)"
      stripe
      show-summary
      :data="tableData"
      v-loading.fullscreen.lock="pageLoading"
    >
      <el-table-column label="时间趋势" prop="occurDate">
        <template slot-scope="scope">
          {{filterData.type === 'DATE' ? scope.row.occurDate : scope.row.occurDate.slice(0,7)}}
        </template>
      </el-table-column>
      <el-table-column label="总额" prop="totalIncome"></el-table-column>
      <el-table-column label="现金类">
        <el-table-column label="总额" prop="totalCashIncome"></el-table-column>
        <el-table-column label="现金" prop="totalCashPayIncome"></el-table-column>
        <el-table-column label="支付宝" prop="totalAliPayIncome"></el-table-column>
        <el-table-column label="微信" prop="totalWechatPayIncome"></el-table-column>
        <el-table-column label="自定义" prop="totalSelfDefinePayIncome"></el-table-column>
      </el-table-column>
      <el-table-column label="划卡类">
        <el-table-column label="总额" prop="totalPrePaidCardPayIncome"></el-table-column>
        <el-table-column label="储值金" prop="totalRechargeMoneyPayIncome"></el-table-column>
        <el-table-column label="赠送金" prop="totalGiftMoneyPayIncome"></el-table-column>
      </el-table-column>
    </el-table>
    <div class="padding-box"></div>
  </div>
</template>
<script>
// 门店营收汇总表 - 饿了么组件
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
        storeId: this.currentInfo.shopId,
        brandId: this.currentInfo.brandId,
        beginOccurDate: this.filterData.date[0],
        endOccurDate: this.filterData.date[1],
      }
      let url = '/getStoreDailyIncomeSummary'
      if (this.currentEntry === 'brand') {
        // 品牌端 - 选择了某个门店
        if (this.filterData.shopIdInBrand) {
          data.storeId = this.filterData.shopIdInBrand
        } else {
          url = '/getBrandDailyIncomeSummary'
        }
      }
      this.pageLoading = true
      axios.post(url, data).then(res => {
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

