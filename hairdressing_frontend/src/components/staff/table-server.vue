<template lang="pug">
.g-table
  .title 业绩总览
  el-table(
    :data="tableData",
    style="width: 100%",
    max-height="240",
    stripe
  )
    <template slot-scope="scope">
      el-table-column(
        prop="scene",
        label="时间",
        align="left",
        fixed
      )
      el-table-column(
        prop="classify",
        label="指定客数",
        align="left"
      )
      el-table-column(
        prop="className",
        label="劳动业绩",
        align="left"
      )
      el-table-column(
        prop="price",
        label="产品业绩",
        align="left"
      )
      el-table-column(
        prop="process",
        label="营业业绩",
        align="left"
      )
    </template>
</template>
<script>
  export default {
    data() {
      return {
        title: 'xxx'
      }
    },
    props: {
      tableData: Array
    }
  }
</script>
<style lang="scss" scoped>
  .g-table {
    padding: 20px;
    -webkit-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
    -o-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
    -ms-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
    box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
    .title {
      font-size: 16px;
      color: #333333;
      margin-left: 10px;
    }
  }
</style>