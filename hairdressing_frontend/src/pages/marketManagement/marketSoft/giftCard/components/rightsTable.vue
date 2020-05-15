<template>
  <div class="class-table-wrapper">
    <el-table max-height="290" :data="list" :header-cell-style="{ background: '#F4F5F7', height: '40px'}">
      <el-table-column prop="typeOneName" label="一级分类"></el-table-column>
      <el-table-column prop="typeTwoName" label="二级分类"></el-table-column>
      <el-table-column prop="discount" label="折扣">
        <template slot-scope="scope">
          <span>{{scope.row.discount}}折</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    list: Array
  }
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

}
</style>