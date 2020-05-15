<template>
  <div>
    <el-table 
      stripe
      show-summary
      height="calc(100vh - 267px)"
      :data="tableData"
      v-loading.fullscreen.lock="pageLoading"
    >
      <el-table-column label="时间趋势" prop="occurDate" width="100" fixed>
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

      <el-table-column label="产品">
        <el-table-column label="总额" prop="productTotalPerformance"></el-table-column>
        <el-table-column label="现金类总业绩" prop="productCashPerformance"></el-table-column>
        <el-table-column label="现金" prop="productCashpayPerformance"></el-table-column>
        <el-table-column label="支付宝" prop="productAlipayPerformance"></el-table-column>
        <el-table-column label="微信" prop="productWepayPerformance"></el-table-column>
        <el-table-column label="自定义" prop="productSelfdefPerformance"></el-table-column>
        <el-table-column label="划卡类总业绩" prop="productCardPerformance"></el-table-column>
        <!-- <el-table-column label="储值卡总业绩" prop="productPrepaidCardpayPerformance"></el-table-column> -->
        <el-table-column label="储值金" prop="productRechargeMoneyPerformance"></el-table-column>
        <el-table-column label="赠送金" prop="productGiftMoneyPerformance"></el-table-column>
        <!-- <el-table-column label="赠送" prop="productGivePerformance"></el-table-column> -->
      </el-table-column>

      <el-table-column label="储值卡">
        <el-table-column label="充卡总额" prop="prepaidCardTotalPerformance"></el-table-column>

        <el-table-column label="开卡总业绩" prop="prepaidCardOpenTotalPerformance"></el-table-column>
        <el-table-column label="现金类开卡总业绩" prop="prepaidCardOpenCashPerformance"></el-table-column>
        <el-table-column label="现金开卡" prop="prepaidCardOpenCashpayPerformance"></el-table-column>
        <el-table-column label="支付宝开卡" prop="prepaidCardOpenAlipayPerformance"></el-table-column>
        <el-table-column label="微信开卡" prop="prepaidCardOpenWepayPerformance"></el-table-column>
        <el-table-column label="自定义开卡" prop="prepaidCardOpenSelfdefPerformance"></el-table-column>

        <el-table-column label="续卡总业绩" prop="prepaidCardRenewalTotalPerformance"></el-table-column>
        <el-table-column label="现金类续卡总业绩" prop="prepaidCardRenewalCashPerformance"></el-table-column>
        <el-table-column label="现金续卡" prop="prepaidCardRenewalCashpayPerformance"></el-table-column>
        <el-table-column label="支付宝续卡" prop="prepaidCardRenewalAlipayPerformance"></el-table-column>
        <el-table-column label="微信续卡" prop="prepaidCardRenewalWepayPerformance"></el-table-column>
        <el-table-column label="自定义续卡" prop="prepaidCardRenewalSelfdefPerformance"></el-table-column>
      </el-table-column>

      <el-table-column label="身份卡">
        <el-table-column label="充卡总额" prop="identityCardTotalPerformance"></el-table-column>

        <el-table-column label="开卡总业绩" prop="identityCardOpenTotalPerformance"></el-table-column>
        <el-table-column label="现金类开卡总业绩" prop="identityCardOpenCashPerformance"></el-table-column>
        <el-table-column label="现金开卡" prop="identityCardOpenCashpayPerformance"></el-table-column>
        <el-table-column label="支付宝开卡" prop="identityCardOpenAlipayPerformance"></el-table-column>
        <el-table-column label="微信开卡" prop="identityCardOpenWepayPerformance"></el-table-column>
        <el-table-column label="自定义开卡" prop="identityCardOpenSelfdefPerformance"></el-table-column>
        <!-- <el-table-column label="储值卡支付开卡总业绩" prop="identityCardOpenPrepaidCardpayPerformance"></el-table-column> -->
        <!-- <el-table-column label="储值金支付开卡" prop="identityCardOpenRechargeMoneyPerformance"></el-table-column>
        <el-table-column label="赠送金支付开卡" prop="identityCardOpenGiftMoneyPerformance"></el-table-column> -->

        <el-table-column label="续卡总业绩" prop="identityCardRenewalTotalPerformance"></el-table-column>
        <el-table-column label="现金类续卡总业绩" prop="identityCardRenewalCashPerformance"></el-table-column>
        <el-table-column label="现金续卡" prop="identityCardRenewalCashpayPerformance"></el-table-column>
        <el-table-column label="支付宝续卡" prop="identityCardRenewalAlipayPerformance"></el-table-column>
        <el-table-column label="微信续卡" prop="identityCardRenewalWepayPerformance"></el-table-column>
        <el-table-column label="自定义续卡" prop="identityCardRenewalSelfdefPerformance"></el-table-column>
        <!-- <el-table-column label="储值卡支付续卡总业绩" prop="identityCardRenewalPrepaidCardpayPerformance"></el-table-column> -->
        <!-- <el-table-column label="储值金支付续卡" prop="identityCardRenewalRechargeMoneyPerformance"></el-table-column>
        <el-table-column label="赠送金支付续卡" prop="identityCardRenewalGiftMoneyPerformance"></el-table-column> -->
      </el-table-column>

      <el-table-column label="时间卡">
        <el-table-column label="充卡总额" prop="timeCardTotalPerformance"></el-table-column>

        <el-table-column label="开卡总业绩" prop="timeCardOpenTotalPerformance"></el-table-column>
        <el-table-column label="现金类开卡总业绩" prop="timeCardOpenCashPerformance"></el-table-column>
        <el-table-column label="现金开卡" prop="timeCardOpenCashpayPerformance"></el-table-column>
        <el-table-column label="支付宝开卡" prop="timeCardOpenAlipayPerformance"></el-table-column>
        <el-table-column label="微信开卡" prop="timeCardOpenWepayPerformance"></el-table-column>
        <el-table-column label="自定义开卡" prop="timeCardOpenSelfdefPerformance"></el-table-column>
        <!-- <el-table-column label="储值卡支付开卡总业绩" prop="timeCardOpenPrepaidCardpayPerformance"></el-table-column> -->
        <!-- <el-table-column label="储值金支付开卡" prop="timeCardOpenRechargeMoneyPerformance"></el-table-column>
        <el-table-column label="赠送金支付开卡" prop="timeCardOpenGiftMoneyPerformance"></el-table-column> -->

        <!-- <el-table-column label="续卡总业绩" prop="timeCardRenewalTotalPerformance"></el-table-column>
        <el-table-column label="现金类续卡总业绩" prop="timeCardRenewalCashPerformance"></el-table-column>
        <el-table-column label="现金续卡" prop="timeCardRenewalCashpayPerformance"></el-table-column>
        <el-table-column label="支付宝续卡" prop="timeCardRenewalAlipayPerformance"></el-table-column>
        <el-table-column label="微信续卡" prop="timeCardRenewalWepayPerformance"></el-table-column>
        <el-table-column label="自定义续卡" prop="timeCardRenewalSelfdefPerformance	"></el-table-column> -->
        <!-- <el-table-column label="储值卡支付续卡总业绩" prop="timeCardRenewalPrepaidCardpayPerformance"></el-table-column> -->
        <!-- <el-table-column label="储值金支付续卡" prop="timeCardRenewalRechargeMoneyPerformance"></el-table-column>
        <el-table-column label="赠送金支付续卡" prop="timeCardRenewalGiftMoneyPerformance"></el-table-column> -->
      </el-table-column>

      <el-table-column label="次卡">
        <el-table-column label="充卡总额" prop="countCardTotalPerformance"></el-table-column>

        <el-table-column label="开卡总业绩" prop="countCardOpenTotalPerformance"></el-table-column>
        <el-table-column label="现金类开卡总业绩" prop="countCardOpenCashPerformance"></el-table-column>
        <el-table-column label="现金开卡" prop="countCardOpenCashpayPerformance"></el-table-column>
        <el-table-column label="支付宝开卡" prop="countCardOpenAlipayPerformance"></el-table-column>
        <el-table-column label="微信开卡" prop="countCardOpenWepayPerformance"></el-table-column>
        <el-table-column label="自定义开卡" prop="countCardOpenSelfdefPerformance"></el-table-column>
        <!-- <el-table-column label="储值卡支付开卡总业绩" prop="countCardOpenPrepaidCardpayPerformance"></el-table-column> -->
        <!-- <el-table-column label="储值金支付开卡" prop="countCardOpenRechargeMoneyPerformance"></el-table-column>
        <el-table-column label="赠送金支付开卡" prop="countCardOpenGiftMoneyPerformance"></el-table-column> -->

        <!-- <el-table-column label="续卡总业绩" prop="countCardRenewalTotalPerformance"></el-table-column>
        <el-table-column label="现金类续卡总业绩" prop="countCardRenewalCashPerformance"></el-table-column>
        <el-table-column label="现金续卡" prop="countCardRenewalCashpayPerformance"></el-table-column>
        <el-table-column label="支付宝续卡" prop="countCardRenewalAlipayPerformance"></el-table-column>
        <el-table-column label="微信续卡" prop="countCardRenewalWepayPerformance"></el-table-column>
        <el-table-column label="自定义续卡" prop="countCardRenewalSelfdefPerformance"></el-table-column> -->
        <!-- <el-table-column label="储值卡支付续卡总业绩" prop="countCardRenewalPrepaidCardpayPerformance"></el-table-column> -->
        <!-- <el-table-column label="储值金支付续卡" prop="countCardRenewalRechargeMoneyPerformance	"></el-table-column>
        <el-table-column label="赠送金支付续卡" prop="countCardRenewalGiftMoneyPerformance"></el-table-column> -->
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

