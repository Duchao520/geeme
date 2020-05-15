<template>
  <div class="page-container">
<!--    <el-radio-group class="btn-group" v-model="componentId">-->
<!--      <el-radio-button-->
<!--        v-for="(item,index) in tags"-->
<!--        :key="index"-->
<!--        :label="item.comp"-->
<!--      >{{item.name}}</el-radio-button>-->
<!--    </el-radio-group>-->
    <component :is="componentId" :ref='componentId'></component>
  </div>
</template>

<script>
  import BusinessList from '@/components/countManagement/businessList'
  import EmptyPage from '@/pages/emptyPageInShop.vue'
  export default {
    name: 'CountBusiness',
    data(){
      return {
        componentId:'BusinessList',
        tags:[
          // {name:'营业流水', comp:'BusinessList'},
          // {name:'现金业绩', comp:'EmptyPage'},
          // {name:'订单数据', comp:'EmptyPage'},
          // {name:'预约统计', comp:'EmptyPage'},
          // {name:'商品统计', comp:'EmptyPage'},
          // {name:'日常开支', comp:'EmptyPage'},
          // {name:'利润表', comp:'EmptyPage'},
        ]
      }
    },
    components:{
      BusinessList,
      EmptyPage
    }
  }
</script>

<style lang="scss" scoped>
  .page-container{
    margin:15px 20px;

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

  .btn-group{
    margin-bottom: 15px;
  }

</style>
