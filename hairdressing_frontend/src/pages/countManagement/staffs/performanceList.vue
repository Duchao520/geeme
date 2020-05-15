<template>
  <div class="performance-list">
    <div class="list-filter-box">
      <component :ref="currentFilterType" @filterChanged="handleFilterChanged" :is="currentFilterType"/>
    </div>
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
      <div class="table-box">
        <component :ref="currentType" :is="currentType" :filterData="filterData" :tableHeight="tableHeight"/>
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from '@/util/axios'
import {mapState} from 'vuex';
import '@/assets/css/tab.scss';
// 3个页面的筛选组件
import filter_total from './components/performance/filterArea_total'
import filter_types from './components/performance/filterArea_types'
// 3个页面的表格组件
import total_table from './components/performance/total_table'
import goodsTypes_table from './components/performance/goodsTypes_table'
export default {
  name: 'performance-list', // 业绩提成
  data() {
    return {
      filterData: {},
      // - 提成列表 - 
      currentFilterType: 'filter_total',
      currentType: 'total_table',
      dataTypes: [
        {code: 'total_table', value: '业绩提成汇总表'},
        {code: 'goodsTypes_table', value: '业绩提成分类表'},
        // {code: '3', value: '排行榜'},
      ],
      // = 提成列表 =
    }
  },
  created() {},
  methods: {
    handleFilterChanged(data) {
      this.filterData = data
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
    tableHeight() {
      switch (this.currentType) {
        case 'total_table':
          return 'calc(100vh - 302px)' // 顶部\底部-140 页码-65 筛选-130 tabs-32 // 页码作废， 这里改成传给div table再计算-60(固定悬浮的合计)
        default:
          return 'calc(100vh - 302px)'
      }
    }
  },
   watch: {
    // 监听tabs 切换筛选子组件
    currentType(v, o) {
      if (v === 'total_table') {
        this.currentFilterType = 'filter_total'
      } else if (v === 'goodsTypes_table') {
        this.currentFilterType = 'filter_types'
      } else {

      }
    }
  },
  components: { filter_total, total_table, filter_types, goodsTypes_table }
}
</script>
<style lang='scss' scoped>
.performance-list {
  height: calc(100vh - 140px);
  margin: 0 20px 20px;
}
.list-filter-box {
  height: 110px;
  width: 100%;
  margin-bottom: 20px;
}
.table-box {
  padding: 0 10px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
  min-height: calc(100vh  - 302px);
  margin-bottom: 20px;
}
</style>
