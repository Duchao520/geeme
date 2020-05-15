<template>
  <div class="statistics-line" v-loading="loading">
    <div class="left-box layout-box">
      <div class="seem-btn">统计</div>
    </div>
    <div class="right-box layout-box" v-if="!noData">
      <p class="income-data">
        <span>总业绩: {{performanceStatistics.totalPerformance}}元;</span>
        <span>现金业绩: {{performanceStatistics.totalCashPerformance}}元;</span>
        <span>卡扣业绩: {{performanceStatistics.totalCardPerformance}}元;</span>
      </p>
      <p class="income-data">
        <span>劳动业绩: {{performanceStatistics.serviceTotalPerformance}}元;</span>
        <span>产品业绩: {{performanceStatistics.productTotalPerformance}}元;</span>
        <span>卡项业绩: {{performanceStatistics.cardTotalPerformance}}元;</span>
        <span>
          储值卡业绩: {{
            (performanceStatistics.prepaidCardOpenTotalPerformance + performanceStatistics.prepaidCardRenewalTotalPerformance).toFixed(2)
          }}元;
        </span>
        <span>
          身份卡业绩: {{
            (performanceStatistics.identityCardOpenTotalPerformance + performanceStatistics.identityCardRenewalTotalPerformance).toFixed(2)
          }}元;
        </span>
        <span>
          次卡业绩: {{
            (performanceStatistics.countCardOpenTotalPerformance + performanceStatistics.countCardRenewalTotalPerformance).toFixed(2)
          }}元;
        </span>
        <span>
          时间业绩: {{
            (performanceStatistics.timeCardOpenTotalPerformance + performanceStatistics.timeCardRenewalTotalPerformance).toFixed(2)
          }}元;
        </span>
        <span v-if="details" class="like-link" @click="handleDialogOpen">业绩明细</span>
      </p>
    </div>
    <div class="right-box no-data" v-if="noData">
      暂无数据,请先选择门店。
    </div>
    <performanceDialog 
      v-if="dialogVisible"
      :dialogVisible="dialogVisible" 
      @close="dialogVisible = false"
      :data="performanceStatistics"
      :date="filterTime"
      :shopId="currentShopId"
    />
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils.js";
import { mapState } from "vuex"
import performanceDialog from './performanceDialog'
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
      performanceStatistics: {},
      dialogVisible: false,
      loading: false,
      noData: true, 
      currentShopId: null, // -
    }
  },
  created() {},
  methods: {
    async getStoreDailyPerformance() {
      let shopId = this.currentEntry === 'brand' ? this.filterData.shopIdInBrand : this.currentInfo.shopId
      if (!this.filterTime.beginDay || !shopId) { return this.noData = true }
      let data = {
        ...this.filterTime,
        storeId: shopId,
        brandId: this.currentInfo.brandId,
      }
      this.loading = true
      this.performanceStatistics = await axios.post('/getStoreDailyPerformanceStatisticsBasicInfo', data)
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
        this.getStoreDailyPerformance()
      },
      immediate: true,
      deep: true,
    },
    filterData: {
      handler: function(v, o) {
        this.getStoreDailyPerformance()
      },
      immediate: true,
      deep: true,
    },
  },
  components: { performanceDialog }
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
