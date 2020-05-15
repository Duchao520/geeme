<template>
  <div>
    <el-table 
      height="calc(100vh - 267px)"
      stripe
      show-summary
      :data="tableData"
      v-loading.fullscreen.lock="pageLoading"
    >
      <el-table-column label="时间趋势" prop="occurDate" fixed>
        <template slot-scope="scope">
          {{filterData.type === 'DATE' ? scope.row.occurDate : scope.row.occurDate.slice(0,7)}}
        </template>
      </el-table-column>
      
      <el-table-column label="服务">
        <el-table-column label="现金类总额" prop="serviceTotalCashIncome"></el-table-column>
        <el-table-column label="现金" prop="serviceCashIncome"></el-table-column>
        <el-table-column label="支付宝" prop="serviceAlipayIncome"></el-table-column>
        <el-table-column label="微信" prop="serviceWepayIncome"></el-table-column>
        <el-table-column label="自定义" prop="serviceSelfdefIncome"></el-table-column>
        <el-table-column label="划卡类总额" prop="serviceTotalCardpayIncome"></el-table-column>
        <el-table-column label="储值金" prop="serviceRechargeIncome"></el-table-column>
        <el-table-column label="赠送金" prop="serviceGiftIncome"></el-table-column>
      </el-table-column>

      <el-table-column label="产品">
        <el-table-column label="现金类总额" prop="productTotalCashIncome"></el-table-column>
        <el-table-column label="现金" prop="productCashIncome"></el-table-column>
        <el-table-column label="支付宝" prop="productAlipayIncome"></el-table-column>
        <el-table-column label="微信" prop="productWepayIncome"></el-table-column>
        <el-table-column label="自定义" prop="productSelfdefIncome"></el-table-column>
        <el-table-column label="划卡类总额" prop="productTotalCardpayIncome"></el-table-column>
        <el-table-column label="储值金" prop="productRechargeIncome"></el-table-column>
        <el-table-column label="赠送金" prop="productGiftIncome"></el-table-column>
      </el-table-column>

      <el-table-column label="储值卡">
        <el-table-column label="现金类总额" prop="prePaidCardTotalCashIncome"></el-table-column>
        <el-table-column label="现金" prop="prePaidCardCashIncome"></el-table-column>
        <el-table-column label="支付宝" prop="prePaidCardAlipayIncome"></el-table-column>
        <el-table-column label="微信" prop="prePaidCardWepayIncome"></el-table-column>
        <el-table-column label="自定义" prop="prePaidCardSelfdefIncome"></el-table-column>
      </el-table-column>
      
      <el-table-column label="次卡">
        <el-table-column label="现金类总额" prop="countCardTotalCashIncome"></el-table-column>
        <el-table-column label="现金" prop="countCardCashIncome"></el-table-column>
        <el-table-column label="支付宝" prop="countCardAlipayIncome"></el-table-column>
        <el-table-column label="微信" prop="countCardWepayIncome"></el-table-column>
        <el-table-column label="自定义" prop="countCardSelfdefIncome"></el-table-column>
        <el-table-column label="划卡类总额" prop="countCardTotalCardpayIncome"></el-table-column>
        <el-table-column label="储值金" prop="countCardRechargeIncome"></el-table-column>
        <el-table-column label="赠送金" prop="countCardGiftIncome"></el-table-column>
      </el-table-column>
      
      <el-table-column label="时间卡">
        <el-table-column label="现金类总额" prop="timeCardTotalCashIncome"></el-table-column>
        <el-table-column label="现金" prop="timeCardCashIncome"></el-table-column>
        <el-table-column label="支付宝" prop="timeCardAlipayIncome"></el-table-column>
        <el-table-column label="微信" prop="timeCardWepayIncome"></el-table-column>
        <el-table-column label="自定义" prop="timeCardSelfdefIncome"></el-table-column>
        <el-table-column label="划卡类总额" prop="timeCardTotalCardpayIncome"></el-table-column>
        <el-table-column label="储值金" prop="timeCardRechargeIncome"></el-table-column>
        <el-table-column label="赠送金" prop="timeCardGiftIncome"></el-table-column>
      </el-table-column>
      
      <el-table-column label="身份卡">
        <el-table-column label="现金类总额" prop="identityCardTotalCashIncome"></el-table-column>
        <el-table-column label="现金" prop="identityCardCashIncome"></el-table-column>
        <el-table-column label="支付宝" prop="identityCardAlipayIncome"></el-table-column>
        <el-table-column label="微信" prop="identityCardWepayIncome"></el-table-column>
        <el-table-column label="自定义" prop="identityCardSelfdefIncome"></el-table-column>
        <el-table-column label="划卡类总额" prop="identityCardTotalCardpayIncome"></el-table-column>
        <el-table-column label="储值金" prop="identityCardRechargeIncome"></el-table-column>
        <el-table-column label="赠送金" prop="identityCardGiftIncome"></el-table-column>
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
        storeId: this.currentInfo.shopId,
        brandId: this.currentInfo.brandId,
        beginOccurDate: this.filterData.date[0],
        endOccurDate: this.filterData.date[1],
      }
      let url = '/getStoreDailyIncomeClassification'
      if (this.currentEntry === 'brand') {
        // 品牌端 - 选择了某个门店
        if (this.filterData.shopIdInBrand) {
          data.storeId = this.filterData.shopIdInBrand
        } else {
          url = '/getBrandDailyIncomeClassification'
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

