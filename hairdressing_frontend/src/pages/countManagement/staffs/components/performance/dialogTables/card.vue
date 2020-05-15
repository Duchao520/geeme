<template>
  <el-table
    stripe
    :data="dialogTableData"
    style="width: 100%"
    height="50vh"
  >
    <el-table-column label="服务单号" width="120">
      <template slot-scope="scope">
        <div @click="getOrderInfo(scope.row.consumerOrderId)" class="order-details">
          {{scope.row.consumerOrderNo}}
          <br />
          <span v-if="scope.row.paperOrderId">纸单号: {{scope.row.paperOrderId}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="serviceTime" label="服务时间" width="100"></el-table-column>
    <!-- <el-table-column prop="isCount" label="计客数">
      <template slot-scope="scope">
        {{scope.row.isCount ? '计' : '不计'}}
      </template>
    </el-table-column>-->
    <el-table-column prop="cardType" label="消费分类">
      <template
        slot-scope="scope"
      >{{scope.row.cardType|cardTypeFilter}}-{{scope.row.operateType ? '续卡' : '开卡'}}</template>
    </el-table-column>
    <el-table-column prop="cardName" label="卡项"></el-table-column>
    <el-table-column prop="received" label="实收金额(￥)"></el-table-column>
    <el-table-column prop="payType" label="支付方式" width="120">
      <template slot-scope="scope">
        <p v-if="scope.row.payType !== 3">{{scope.row.payType|payTypeFilter}}</p>
        <p v-else>
          <span>储值金: {{scope.row.rechargeMoneyCost}}</span>
          <br />
          <span>赠送金: {{scope.row.giftMoneyCost}}</span>
        </p>
      </template>
    </el-table-column>
    <el-table-column prop="cashPerformance" label="现金业绩(￥)"></el-table-column>
    <el-table-column prop="cardSalesPerformance" label="售卡业绩(￥)"></el-table-column>
    <el-table-column prop="commission" label="提成(￥)"></el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    dialogTableData: {
      type: Array,
      required: true
    }
  },
  methods: {
    getOrderInfo(id) {
      this.$emit('getOrderInfo', id)
    }
  },
  filters: {
    cardTypeFilter(type) {
      let map = {
        0: "身份卡",
        1: "储值卡",
        2: "次  卡",
        3: "时间卡"
      };
      return map[type];
    },
    // - 此处可能有问题
    payTypeFilter(payType) {
      let map = {
        0: "微信",
        1: "支付宝",
        2: "现金",
        3: "储值卡",
        4: "自定义",
        5: "次卡",
        6: "时间卡",
        7: "赠送",
        8: "余额支付"
      };
      return map[payType];
    }
  },
}
</script>

<style lang="scss" scoped>
.order-details {
  &:hover {
    color: #58c9f3;
    cursor: pointer;
  }
}
</style>