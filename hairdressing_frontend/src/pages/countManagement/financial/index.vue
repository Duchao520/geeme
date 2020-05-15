<template>
  <div class="financial-data-index">
    <div class="page-type-box">
      <el-radio-group class="btn-group" v-model="active">
        <el-radio-button
          v-for="item in tags"
          :key="item.name"
          :label="item.comp"
        >{{item.name}}</el-radio-button>
      </el-radio-group>
    </div>
    <component :is="active" :ref='active'></component>
  </div>
</template>
<script>
import business from './businessList'
import performance from './performanceList'
import acrossStore from './acrossStoreList'
import expenditure from './expenditureList'
import profit from './profitList'
export default {
  name: 'financial-data-index',
  data() {
    return {
      active: 'business', // 激活的页面组件
      tags:[
        {name:'营收报表', comp:'business'},
        {name:'业绩报表', comp:'performance'},
        // {name:'跨店结算', comp:'acrossStore'},
        {name:'支出报表', comp:'expenditure'},
        {name:'利润表', comp:'profit'},
      ]
    }
  },
  components: { business, performance, acrossStore, expenditure, profit },
}
</script>
<style lang='scss' scoped>
.financial-data-index {
  .page-type-box {
    margin: 15px 20px;
    height: 35px;
  }

  /deep/ .el-radio-button__inner {
    width: 98px;
    height: 35px;
    line-height: 35px;
    padding-top: 0;
    padding-bottom: 0;
  }

  /deep/ .el-radio-button.is-active {
    .el-radio-button__inner {
      background: #58C9F3;
      border: none;
    }
  }
}
</style>
