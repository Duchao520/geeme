<template>
  <div class="business-list">
    <div class="list-filter-box" :class="{much: currentFilterType === 'filterMuchLine'}">
      <component @filterChanged="handleFilterChanged" :is="currentFilterType"/>
    </div>
    <!-- 财务报表 - 业绩报表 - 统计业绩 无详情 -->
    <IncomeComp :filterTime="filterTime" :filterData="filterData" v-if="currentFilterType === 'filterMuchLine'"/>

    <div class="list-table-box">
      <div class="user-defined-tab">
        <el-tabs type="card" v-model="currentType">
          <el-tab-pane
            v-for="item in dataTypes"
            :key="item.code"
            :name="item.code"
            :label="item.value"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="table-box" :class="{much: currentFilterType === 'filterMuchLine'}">
        <component :ref="currentType" :is="currentType" :filterData="filterData"/>
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from '@/util/axios'
import {mapState} from 'vuex'
import '@/assets/css/tab.scss'
// 两个筛选组件
import filterSingleLine from './components/business/filterArea_singleLine'
import filterMuchLine from './components/business/filterArea_muchLine'
import IncomeComp from '@/components/statistics_line/income' // 统计组件
// 6个表格组件
import store_total_revenue from './components/business/store_total_revenue_table'
import online_order from './components/business/online_order_table'
import revenue_type from './components/business/revenue_type_table'
import revenue_summary from './components/business/revenue_summary_table'
import cash_summary from './components/business/cash_summary_table'
import pre_pay from './components/business/pre_pay_table'
export default {
  name: 'business-list', // 业绩提成
  data() {
    return {
      currentFilterType: 'filterMuchLine', // 当前激活的筛选组件 filterMuchLine, filterSingleLine ==初始化==
      currentType: 'store_total_revenue', // 当前激活的表格主体 ==初始化==
      dataTypes: [
        {code: 'store_total_revenue', value: '门店总营收表'}, // -1- filterMuchLine
        {code: 'online_order', value: '线上订单营收'}, // -1- filterMuchLine
        {code: 'revenue_type', value: '门店营收分类'}, // -2- filterSingleLine
        {code: 'revenue_summary', value: '门店营收汇总'}, // -2- filterSingleLine
        // {code: 'cash_summary', value: '入账现金汇总'}, // -2- filterSingleLine
        // {code: 'pre_pay', value: '预收款汇总'}, // -2- filterSingleLine
      ],
      filterData: {},
    }
  },
  created() {},
  methods: {
    // - 根据筛选子组件的数据变化通知，再去通知表格组件更新数据, 
    handleFilterChanged(data) {
      this.filterData = data
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
    // 给统计用的格式化时间
    filterTime() {
      let today = new Date().format('yyyy-MM-dd')
      if (this.filterData.currentDateFlag) {
        return {
          beginDay: today,
          endDay: today,
        }
      } else if (this.filterData.currentWeekFlag) {
        let day = new Date().getDay() // 0 - 6 // 今天是周几
        let lastDay = day ? new Date(+(new Date()) - (8.64e7 * (day - 1))).format('yyyy-MM-dd') : new Date(+(new Date()) - (8.64e7 * (day - 6))).format('yyyy-MM-dd')
        return {
          beginDay: lastDay,
          endDay: today,
        }
      } else if (this.filterData.currentMonthFlag) {
        let lastDay = new Date().format('yyyy-MM') + '-01'
        return {
          beginDay: lastDay,
          endDay: today,
        }
      } else if (this.filterData.beginDay) {
        return {
          beginDay: new Date(this.filterData.beginDay).format('yyyy-MM-dd'),
          endDay: new Date(this.filterData.endDay).format('yyyy-MM-dd'),
        }
      } else {
        return {}
      }
    },
  },
  watch: {
    // 监听tabs 切换筛选子组件
    currentType(v,o) {
      if (v === 'store_total_revenue' || v === 'online_order') {
        this.currentFilterType = 'filterMuchLine'
      } else {
        this.currentFilterType = 'filterSingleLine'
      }
    }
  },
  filters: {},
  components: { filterMuchLine, filterSingleLine, store_total_revenue, online_order, revenue_type, revenue_summary, cash_summary, pre_pay, IncomeComp }
}
</script>
<style lang='scss' scoped>
.business-list {
  height: calc(100vh - 140px);
  margin: 0 20px 20px;
}

.list-filter-box {
  height: 35px;
  border-radius: 4px;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  padding: 15px 0  15px 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  /deep/ .el-input--small { width: 150px; }
  &.much { height: 80px; }
}

.table-box {
  padding: 0 10px;
  background-color: #fff;
  box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
  // min-height: calc(100vh - 257px);
  margin-bottom: 20px;
  // height: calc(100vh - 257px); // 设置高度后 合计行出不来了
  
  // &.much { height: calc(100vh - 302px); } // 统计还要减85
}
</style>
