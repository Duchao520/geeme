<template>
  <div class="expenditure-list">
    <div class="list-filter-box" :class="{much: currentFilterType === 'filterMuchLine'}">
      <component @filterChanged="handleFilterChanged" :is="currentFilterType"/>
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
import filterSingleLine from './components/business/filterArea_singleLine' // 引用的是营收表的组件
import filterMuchLine from './components/expenditure/filterArea_muchLine' // 支出---
// 多行筛选组件可能仅改一下营收的 消费类型 为 销售类型 // 暂时不处理 如果是的话增加prop即可
import recordList from './components/expenditure/recordList_table'
import summaryList from './components/expenditure/summaryList_table'
export default {
  name: 'expenditure-list', // 支出报表
  data() {
    return {
      currentFilterType: 'filterMuchLine', // 当前激活的筛选组件 filterMuchLine, filterSingleLine ==初始化==
      currentType: 'recordList', // 当前激活的表格主体 ==初始化==
      dataTypes: [
        {code: 'recordList', value: '支出流水表'}, // -1- filterMuchLine
        {code: 'summaryList', value: '支出汇总表'}, // -2- filterSingleLine
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
  },
  watch: {
    // 监听tabs 切换筛选子组件
    currentType(v,o) {
      if (v === 'recordList') {
        this.currentFilterType = 'filterMuchLine'
      } else {
        this.currentFilterType = 'filterSingleLine'
      }
    }
  },
  filters: {},
  components: { filterSingleLine, filterMuchLine, recordList, summaryList }
}
</script>
<style lang='scss' scoped>
.expenditure-list {
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
  margin-bottom: 20px;
  // height: calc(100vh - 257px); // 设置高度后 合计行出不来了
  
  // &.much { height: calc(100vh - 302px); } // 统计还要减85
}
</style>
