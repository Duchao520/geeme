<template>
  <div>
    <el-table 
      stripe
      :data="table"
      show-summary
      :summary-method="summaryMethod"
    >
      <el-table-column label="产品编号" prop="stockProductNo"></el-table-column>
      <el-table-column label="产品名称" prop="stockProductName"></el-table-column>
      <el-table-column label="规格" prop="specificationName"></el-table-column>
      <el-table-column label="单位" prop="specificationUnit"></el-table-column>
      <el-table-column label="订货数量" prop="askNum"></el-table-column>
      <el-table-column label="订货价" prop="supplyPrice"></el-table-column>
      <el-table-column label="审批数量" prop="approvalNum"></el-table-column>
      <el-table-column label="审批价" prop="approvalPrice"></el-table-column>
      <el-table-column label="审批金额">
        <template slot-scope="{row}">
          {{ (Number(row.approvalNum) * Number(row.approvalPrice)).toFixed(2) }}
        </template>
      </el-table-column>
    </el-table>
    <div class="extra-data">
      <p v-if="info.specialOffers">
        <span>特别优惠:</span>
        <span class="container">￥{{info.specialOffers}}</span>
      </p>
      <p v-if="info.freight">
        <span>运费:</span>
        <span class="container">￥{{info.freight}}</span>
      </p>
      <p style="color: red;">
        <span>{{ 4 > info.newOrderStatus ? '应付款:' : info.needPay ? '实付款' : '应付款'}}</span>
        <span class="container">￥{{(info.finalCharge || totalMoney).toFixed(2)}}</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    table: {
      type: Array,
      required: true
    },
    info: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      totalMoney: 0
    }
  },
  methods: {
    summaryMethod() {
      let totalNum1 = 0
      let totalNum2 = 0
      let totalMoney = 0
      this.table.map(i => {
        totalNum1 += i.askNum
        totalNum2 += i.approvalNum
        totalMoney += (i.approvalPrice * i.approvalNum)
      })
      this.totalMoney = totalMoney
      return ['统计', '', '', '', totalNum1, '', totalNum2, '', totalMoney.toFixed(2) ]
    }
  },
}
</script>
<style lang='scss' scoped>
.extra-data { 
  text-align: right;
  font-size: 14px;
  margin: 12px;
  p {
    line-height: 24px;
  }
}
.container {
  display: inline-block;
  width: 120px;
}
</style>
