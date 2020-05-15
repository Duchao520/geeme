<template>
  <div class="seller-seller-list">
    <div class="table-main">
      <div class="table-box">
        <div class="user-defined-tab">
          <el-tabs type="card" v-model="componentId">
            <el-tab-pane
              v-for="item in sendRecords"
              :key="item.value"
              :name="item.value"
              :label="item.label"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <component :is="componentId" ref="componentRef"></component>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsStatistics from "./components/goodsStatistics";
import OrderStatistics from "./components/orderStatistics";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    GoodsStatistics,
    OrderStatistics
  },
  mounted() {
  },
  data() {
    return {
      // tab栏选中数据
      componentId: "OrderStatistics",
      // tab栏可选数组
      sendRecords: [
        {
          value: "OrderStatistics",
          label: "订单统计"
        },
        {
          value: "GoodsStatistics",
          label: "商品统计"
        }
      ],
    };
  },
  methods: {
    // 调用子组件事件
    callSonEvent(data,flag) {
      if(this.componentId === 'GoodsStatistics') {
        this.$refs.componentRef.getGoodsList(data,flag)
      } else {
        this.$refs.componentRef.getOrderList(data,flag)
      }
    }
  },
  watch: {
    'componentId'() {
      // 清空父组件搜索框的值
      this.$emit('sonTabsChange')
    }
  },
};
</script>

<style  lang='scss' scoped>
.table-main {
  width: 100%;
  margin-top: 20px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  height: calc(100vh - 240px);
  border-radius: 6px;
  .table-box {
    box-sizing: content-box;
  }
  // .pages-line {
  //   height: 82px;
  //   display: flex;
  //   align-items: center;
  //   justify-content: flex-end;
  // }
}

.el-tabs {
  background: #dee1e6;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  height: 32px;
}

.user-defined-tab /deep/ .el-tabs--card .el-tabs__item {
  // border: 0;
  height: 32px;
  line-height: 32px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: none !important;
}
</style>