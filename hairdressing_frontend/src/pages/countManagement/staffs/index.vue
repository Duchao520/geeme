<template>
  <div class="staff-data-index">
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
import performance from './performanceList'
import production from './productionList'
import assessment from './assessmentList'
export default {
  name: 'staff-data-index',
  data() {
    return {
      active: 'performance', // 激活的页面组件
      tags:[
        {name:'业绩提成', comp:'performance'},
        // {name:'作品动态', comp:'production'},
        // {name:'客户评价', comp:'assessment'},
      ]
    }
  },
  components: {performance, production, assessment},
}
</script>
<style lang='scss' scoped>
.staff-data-index {
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
