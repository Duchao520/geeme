<template>
  <div>
    <el-table 
      stripe
      show-summary
      height="calc(100vh - 267px)"
      :summary-method="getSummaries"
      :data="tableData"
      v-loading.fullscreen.lock="pageLoading"
    >
      <el-table-column label="时间趋势" prop="date" width="100">
        <template slot-scope="scope">
          {{filterData.type === 'DATE' ? scope.row.date : scope.row.date.slice(0,7)}}
        </template>
      </el-table-column>
      <el-table-column label="入账现金">
        <el-table-column label="劳动现金" prop="incomeRecord.serviceTotalCashIncome"></el-table-column>
        <el-table-column label="产品现金" prop="incomeRecord.productTotalCashIncome"></el-table-column>
        <el-table-column label="身份卡现金" prop="incomeRecord.identityCardTotalCashIncome"></el-table-column>
        <el-table-column label="储值卡现金" prop="incomeRecord.prePaidCardTotalCashIncome"></el-table-column>
        <el-table-column label="次卡现金" prop="incomeRecord.countCardTotalCashIncome"></el-table-column>
        <el-table-column label="时间卡现金" prop="incomeRecord.timeCardTotalCashIncome"></el-table-column>
      </el-table-column>
      <el-table-column label="营业开支">
        <el-table-column label="房租" prop="expendRecord.houseRent"></el-table-column>
        <el-table-column label="水电费" prop="expendRecord.waterAndElectricity"></el-table-column>
        <el-table-column label="物业费" prop="expendRecord.propertyFee"></el-table-column>
        <el-table-column label="办公费" prop="expendRecord.officeAllowance"></el-table-column>
        <el-table-column label="管理费用" prop="expendRecord.managementCost"></el-table-column>
        <el-table-column label="工资提成" prop="expendRecord.deductionWage"></el-table-column>
        <el-table-column label="固定资产分摊" prop="expendRecord.allocationOfFixedAssets"></el-table-column>
        <el-table-column label="产品材料" prop="expendRecord.productMaterial"></el-table-column>
        <el-table-column label="财务费用" prop="expendRecord.financialCost"></el-table-column>
        <el-table-column label="其他费用" prop="expendRecord.otherCharges"></el-table-column>
      </el-table-column>
      <el-table-column label="净利润" prop="profit"></el-table-column>
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
        beginDate: this.filterData.date[0],
        endDate: this.filterData.date[1],
        pageType: 'INCOME', // 
      }
      this.pageLoading = true
      axios.post('/getStoreProfitList', data).then(res => {
        this.pageLoading = false
        if (res.success) {
          this.tableData = res.profitResponseList
        } else {
          this.tableData = []
          this.$message({ type: 'error', message: res.message })
        }
      }).catch(err => {
        this.pageLoading = false
      })
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        const values = data.map(item => 
          {
            let arr = column.property.split('.')
            let result = ''
            let data = JSON.parse(JSON.stringify(item))
            arr.map(i => {
              data = result = data[i]
            })
            return Number(data)
          }
        );
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(2);
        } else {
          sums[index] = '-';
        }
      });
      return sums;
    }
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

