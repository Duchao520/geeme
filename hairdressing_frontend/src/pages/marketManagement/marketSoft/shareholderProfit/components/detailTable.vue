<template>
  <div class="customer_container container_normal" style="border-radius:6px;overflow:hidden">
    <div class="user-defined-tab">
      <el-tabs v-model="currentType" type="card" ref="tabsRef" @tab-click="changeTab">
        <el-tab-pane
          v-for="(item, index) in selectStatus"
          :key="index"
          :label="item.value"
          :name="item.code"
          :ref="item.code+'Ref'"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="table-box">
      <component
        ref="componentRef"
        :is="currentType"
      />
    </div>
  </div>
</template>

<script>
import "@/assets/css/tab.scss";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils.js";
import { mapState, mapActions } from "vuex";
import bindCustomer from "./bindCustomer";
import introduce from "./introduce";
import profitDetail from "./profitDetail";
import awardDetail from "./awardDetail";
import deposit from "./deposit";
import equityPlan from "./equityPlan";
export default {
  components: {
    bindCustomer,
    introduce,
    profitDetail,
    awardDetail,
    deposit,
    equityPlan
  },
  data() {
    return {
      currentType: 'bindCustomer'
    }
  },
  methods: {
    changeTab() {},
  },
  computed: {
    selectStatus() {
      return [
        { code: "bindCustomer", value: "绑定客户" },
        { code: "introduce", value: "介绍的股东" },
        { code: "profitDetail", value: "股东分红明细" },
        { code: "awardDetail", value: "介绍奖励明细" },
        { code: "deposit", value: "投资保证金" },
        { code: "equityPlan", value: "权益方案" },
      ];
    }
  }
};
</script>

<style>
</style>