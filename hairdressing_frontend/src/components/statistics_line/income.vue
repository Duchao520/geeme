<template>
  <div class="statistics-line" v-loading="loading">
    <div class="left-box layout-box">
      <div class="seem-btn">统计</div>
    </div>
    <div class="right-box layout-box" v-if="!noData">
      <p class="income-data">
        <span>总收入: {{incomeStatistics.totalIncome}}元;</span>
        <span>现金类总收入: {{
            (incomeStatistics.totalCashPayIncome +
            incomeStatistics.totalWechatPayIncome +
            incomeStatistics.totalAliPayIncome +
            incomeStatistics.totalSelfDefinePayIncome).toFixed(2)
          }}元;
        </span>
      </p>
      <p class="income-data">
        <span>服务总收入: {{incomeStatistics.serviceTotalIncome}}元;</span>
        <span>产品总收入: {{incomeStatistics.productTotalIncome}}元;</span>
        <span>会员卡总收入: {{incomeStatistics.cardTotalIncome}}元;</span>
        <span>身份卡总收入: {{incomeStatistics.identityCardTotalIncome}}元;</span>
        <span>储值卡总收入: {{incomeStatistics.prePaidCardTotalCashIncome}}元;</span>
        <span>次卡总收入: {{incomeStatistics.countCardTotalIncome}}元;</span>
        <span>时间卡总收入: {{incomeStatistics.timeCardTotalIncome}}元;</span>
        <span v-if="details" class="like-link" @click="handleDialogOpen">收入明细</span>
      </p>
    </div>
    <div class="right-box no-data" v-if="noData">
      暂无数据,请先选择门店。
    </div>
    <incomeDialog 
      v-if="dialogVisible"
      :dialogVisible="dialogVisible" 
      @close="dialogVisible = false"
      :data="incomeStatistics"
      :date="filterTime"
      :shopId="currentShopId"
    />
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils.js";
import { mapState } from "vuex"
import incomeDialog from './incomeDialog'
export default {
  props: {
    filterTime: { // 统计数据用的时间参数
      type: Object
    },
    details: {
      type: Boolean,
      default: true,
    },
    filterData: {
      type: Object,
    }
  },
  data() {
    return {
      incomeStatistics: {},
      dialogVisible: false,
      loading: false,
      noData: true,
      currentShopId: null, // -
    }
  },
  created() {},
  methods: {
    async getStoreDailyIncome() {
      let shopId = this.currentEntry === 'brand' ? this.filterData.shopIdInBrand : this.currentInfo.shopId
      if (!this.filterTime.beginDay || !shopId) { return this.noData = true }
      let data = {
        ...this.filterTime,
        storeId: shopId,
        brandId: this.currentInfo.brandId,
      }
      this.loading = true
      this.incomeStatistics = await axios.post('/getStoreDailyIncomeStatisticsList', data)
      this.noData = false
      this.loading = false
    },
    handleDialogOpen() {
      this.currentShopId = this.currentEntry === 'brand' ? this.filterData.shopIdInBrand : this.currentInfo.shopId
      this.dialogVisible = true
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
  watch: {
    filterTime: {
      handler: function(v, o) {
        this.getStoreDailyIncome()
      },
      immediate: true,
      deep: true,
    },
    filterData: {
      handler: function(v, o) {
        this.getStoreDailyIncome()
      },
      immediate: true,
      deep: true,
    },
  },
  components: { incomeDialog }
}
</script>
<style lang='scss' scoped>
.statistics-line {
  background: #fff;
  height: 70px;
  border-radius: 4px;
  margin-top: 15px;
  margin-bottom: 15px;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  display: flex;
  flex-wrap: nowrap;
}
.layout-box {
  width: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  .seem-btn {
    width: 50px;
    height: 24px;
    border-radius: 4px;
    background-color: rgba(88, 201, 243, 1);
    color: #fff;
    text-align: center;
    font-size: 14px;
    line-height: 24px;
  }
}
.right-box {
  flex: 1;
  text-align: left;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  &.no-data {
    line-height: 70px;
  }
}
.income-data span {
  margin-right: 6px;
  font-size: 12px;
  color: #333;
  &.like-link {
    cursor: pointer;
    color: rgb(88, 201, 243);
  }
}
</style>
