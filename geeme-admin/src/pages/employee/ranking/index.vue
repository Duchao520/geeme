<template>
  <div class="employee-ranking-wrapper">
    <div class="operation">
      <a-button-group>
        <a-button 
          :type="type === 'salary'? 'primary': ''" 
          style="width: 98px;" 
          @click="onTypeChange('salary')">
          业绩薪酬
        </a-button>
        <a-button 
          :type="type === 'ranking'? 'primary': ''" 
          style="width: 98px;" 
          @click="onTypeChange('ranking')">
          排行榜
        </a-button>
      </a-button-group>
      <a-input-search placeholder="搜索员工姓名/手机号/编号" style="width: 280px" enterButton/>
    </div>
    
    <SalarySearch v-if="searchReset" v-show="type==='salary'" @reset="onReset" @search="onSearch" />

    <RankingSearch v-show="type==='ranking'" />
    
    <G-NavBar :navList="statusNavList" v-show="type==='salary'" @change="onNavChange"/>
    
    <div class="content salary" v-show="type==='salary'">
      <a-table>
        <a-table-column title="员工"></a-table-column>
        <a-table-column title="职务身份"></a-table-column>
        <a-table-column title="部门/分公司"></a-table-column>
        <a-table-column title="门店新购数"></a-table-column>
        <a-table-column title="门店新购业绩"></a-table-column>
        <a-table-column title="门店续费业绩"></a-table-column>
        <a-table-column title="门店升级业绩"></a-table-column>
        <a-table-column title="供应商新购数"></a-table-column>
        <a-table-column title="供应商新购业绩"></a-table-column>
        <a-table-column title="供应商续费业绩"></a-table-column>
        <a-table-column title="供应商升级业绩"></a-table-column>
        <a-table-column title="提成薪酬合计"></a-table-column>
        <a-table-column title="操作"></a-table-column>
      </a-table>
    </div>

    <div class="content ranking" v-show="type==='ranking'">
      <a-table>
        <a-table-column title="排名"></a-table-column>
        <a-table-column title="员工"></a-table-column>
        <a-table-column title="职务身份"></a-table-column>
        <a-table-column title="部门/分公司"></a-table-column>
        <a-table-column title="门店新购数"></a-table-column>
        <a-table-column title="门店新购业绩"></a-table-column>
        <a-table-column title="门店续费业绩"></a-table-column>
        <a-table-column title="门店升级业绩"></a-table-column>
        <a-table-column title="供应商新购数"></a-table-column>
        <a-table-column title="供应商新购业绩"></a-table-column>
        <a-table-column title="供应商续费业绩"></a-table-column>
        <a-table-column title="供应商升级业绩"></a-table-column>
        s<a-table-column title="提成薪酬合计"></a-table-column>
      </a-table>
    </div>
  </div>
</template>

<script>
import SalarySearch from './components/salarySearch'
import RankingSearch from './components/rankingSearch'
export default {
  components: {
    SalarySearch,
    RankingSearch,
  },
  data() {
    const statusNavList = [{id: 1, title: '已启用'}, {id: 2, title: '已禁用'}, {id: 3, title: '已删除'}]
    return {
      statusNavList,
      type: 'salary', // salary || ranking
      searchReset: true,
    }
  },
  methods: {
    onTypeChange(type) {
      this.type = type
    },
    onReset() {
      this.searchReset = false
      this.$nextTick(() => this.searchReset = true)
    },
    onSearch() {},
    onNavChange() {}
  }
};
</script>

<style lang="less" scoped>
.employee-ranking-wrapper {
  height: @mainContentH;
  .operation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .content:extend(.normal-content-one) {
    .common-scrollbar();
    overflow: hidden;
    padding: 0 20px 20px 20px;
    border-radius: 0 0 4px 4px;
    &.salary {
      height: calc(100% - 239px);
    }
    &.ranking {
      height: calc(100% - 135px);
    }
     /* 通用表格 */
    .ant-table-content();
  }
}
</style>