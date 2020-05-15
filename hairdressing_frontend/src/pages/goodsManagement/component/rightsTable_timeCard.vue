<template>
  <div class="class-table-wrapper">
    <el-table
      max-height="290"
      :data="list"
      :header-cell-style="{ background: '#F4F5F7', height: '40px' }"
    >
      <el-table-column
        prop="serviceName"
        label="服务项目名称"
      ></el-table-column>
      <el-table-column
        prop="serviceSpecificationName"
        label="规格名称"
      ></el-table-column>
      <el-table-column label="单次耗卡业绩">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.servicePerformance
                ? scope.row.servicePerformance + "元"
                : "--"
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="是否赠送">
        <template slot-scope="scope">
          <p>{{ scope.row.isGift ? "是" : "否" }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="countLimit" label="次数" width="120px">
        <template slot-scope="scope">
          <span v-if="cardType === 2">{{
            scope.row.countLimit > 0 ? scope.row.countLimit + "次" : "--"
          }}</span>
          <span v-if="cardType === 3">{{
            scope.row.countLimit > 0 ? scope.row.countLimit + "次" : "无限次"
          }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="total-count-limit" v-if="totalLimit >= 0 && cardType === 2">
      <span class="left">共用次数:</span>
      <span class="right">{{ totalLimit }}次</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
    cardType: Number,
    totalLimit: Number
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.class-table-wrapper {
  width: 660px;
  margin: 0 0 20px 0;
  /deep/ .el-table__header tr th {
    padding: 0;
  }
  /deep/ .el-table__body tr td {
    padding: 13px 0;
  }
  .total-count-limit {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    color: #606266;
    display: flex;
    .left {
      flex: 1;
      text-indent: 10px;
    }
    .right {
      width: 120px;
      text-indent: 8px;
    }
  }
}
</style>
