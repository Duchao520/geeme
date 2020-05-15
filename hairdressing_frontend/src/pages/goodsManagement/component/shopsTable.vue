<template>
  <div class="shops-table-wrapper">
    <el-table :data="list" max-height="240" :header-cell-style="{ background: '#F4F5F7', height: '40px'}">
    <el-table-column prop="storeName" label="门店名称"></el-table-column>
    <!-- <el-table-column prop="city" label="所在城市"></el-table-column>
    <el-table-column label="会员数"></el-table-column>
    <el-table-column label="门店创建时间"></el-table-column> -->
    <el-table-column label="操作">
      <template slot-scope="scope">
        <i class="icon iconfont icon-icon_operate_delete delete-operation" @click="delStop(scope.row)"></i>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
    name: String
  },
  data() {
    return {};
  },

  methods: {
    delStop(row) {
      this.$emit('delete', {
        id: row.storeId,
        type: this.name,
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.shops-table-wrapper {
  width: 660px;
  margin: 0 0 15px 0;  
  i.delete-operation {
    cursor: pointer;
    color: #BEC3C6;
  }
  /deep/ .el-table__header tr th {
    padding: 0;
  }
  /deep/ .el-table__body tr td {
    padding: 7px 0;
  }
}
</style>
  