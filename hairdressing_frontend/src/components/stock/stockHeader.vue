<template>
  <!-- 头部 -->
  <div class="head">
    <div class="head-left">
      <el-button type="primary" class="add" v-if="type=='List' || type=='Enter'">新增入库</el-button>
      <el-button type="primary" class="remove" v-if="type == 'Enter'">批量导入</el-button>
      <el-button type="primary" class="out" v-if="type == 'Out'|| type == 'List'">新增出库</el-button>
      <el-button type="primary" class="debug" v-if="type == 'Transfers'">新增调拨</el-button>
      <el-button type="primary" class="provide" v-if="type == 'Supplier'">新增供应商</el-button>
    </div>
    <div class="searchInput">
      <el-input @input="change" placeholder="请输入产品名称/品牌/操作人"></el-input>
      <el-button type="primary" icon="el-icon-search" id="button"></el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: String
  },
  data() {
    return {};
  },
  methods: {
    change(e) {
      this.$emit("searchChange", e);
    }
  }
};
</script>
<style lang="scss" scoped>
// 头部
.head {
  width: 100%;
  height: 35px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 18px;
  .head-left {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    button {
      margin-left: 15px;
    }
    button:first-child {
      margin-left: 0;
    }
    .add {
      border: 0;
      background-color: #58c9f3;
    }
    .remove {
      border: 0;
      background-color: #75c74f;
    }
    .out {
      border: 0;
      background-color: #58c9f3;
    }
    .debug {
      border: 0;
      background-color: #58c9f3;
    }
    .provide {
      border: 0;
      background-color: #58c9f3;
    }
  }
}
// 搜索框
.searchInput {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  border-radius: 4px;
  overflow: hidden;
}

#button {
  width: 40px;
  height: 35px;
  text-align: center;
  line-height: 35px;
  background-color: #58c9f3;
  height: 35px;
  border-radius: 0%;
  border: 0;
  padding: 0;
}

/deep/ .el-input__inner {
  // width: auto;
  height: 100%;
  border: 0;
}
</style>
