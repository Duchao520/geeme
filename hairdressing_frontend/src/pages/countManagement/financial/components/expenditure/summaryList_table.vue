<template>
  <div>
    <el-table 
      stripe
      show-summary
      height="calc(100vh - 267px)"
      :data="tableData"
      v-loading.fullscreen.lock="pageLoading"
    >
      <el-table-column label="时间趋势" prop="date" width="100">
        <template slot-scope="scope">
          {{filterData.type === 'DATE' ? scope.row.date : scope.row.date.slice(0,7)}}
        </template>
      </el-table-column>
      <el-table-column label="营业支出" prop="businessExpenseMoney"></el-table-column>
      <el-table-column label="客户返利" prop="customerRebateMoney"></el-table-column>
      <el-table-column label="员工提成" prop="staffCommissionMoney"></el-table-column>
      <el-table-column label="合计" prop="sumExpendMoney"></el-table-column>
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
      let shopId = this.currentEntry === 'brand' ? this.filterData.shopIdInBrand : this.currentInfo.shopId
      if (!shopId) { return }
      let data = {
        requestTimeType: this.filterData.type,
        storeId: shopId,
        brandId: this.currentInfo.brandId,
        beginTime: this.filterData.date[0],
        endTime: this.filterData.date[1],
      }
      this.pageLoading = true
      axios.post('/getStoreExpendSummaryList', data).then(res => {
        this.pageLoading = false
        if (res.success) {
          this.tableData = res.storeExpendSummaryList
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

