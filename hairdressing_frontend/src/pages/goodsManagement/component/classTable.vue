<template>
  <div class="class-table-wrapper">
    <el-table max-height="316" :data="list" :header-cell-style="{ background: '#F4F5F7', height: '40px'}">
      <el-table-column prop="typeOneName" :label="classTypeName(1)" width=160></el-table-column>
      <el-table-column prop="typeTwoName" :label="classTypeName(2)" width=160></el-table-column>
      <el-table-column prop="typeTwoName" label="折扣">
        <template slot-scope="scope">
          <el-input v-model="scope.row.discount" maxlength="4" placeholder="数字" @change="onDiscountChange(scope.row)">
            <el-button slot="append">折</el-button>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i
            class="icon iconfont icon-icon_operate_delete delete-operation"
            @click="del(scope.row)"
          ></i>
        </template>
      </el-table-column>
      <div slot="append" style="display:flex; padding: 7px 0;">
        <div style="padding: 0 0 0 10px;width: 320px;">批量设置：</div>
        <el-input maxlength="4" placeholder="数字" v-model="batchDiscount" @change="onBatchChange">
          <el-button slot="append">折</el-button>
        </el-input>
      </div>
    </el-table>
  </div>
</template>
  
<script>
import * as rgxp from "@/util/regExp";
export default {
  props: {
    list: Array,
    type: String
  },
  data() {
    return {
      batchDiscount: null,
    };
  },
  computed: {},
  methods: {
    classTypeName(level) {
      let name;
      name = this.type === "Service" ? "服务分类" : "产品分类";
      name = level === 1 ? `一级${name}` : `二级${name}`;
      return name;
    },
    del(row) {
      this.$emit("delete", {
        type: this.type,
        id: row.typeTwoId
      });
    },
    onDiscountChange(row) {
      this.$emit('change', {
        type: this.type,
        data: row
      })
    },
    onBatchChange() {
      if (!rgxp.floatReg.test(this.batchDiscount) && this.batchDiscount !== '') {
        this.$message({ type: "error", message: '折扣值须为合法的数字'})
        this.batchDiscount = null
        return
      } else if (parseFloat(this.batchDiscount) > 10) {
        this.$message({ type: "error", message: '服务和产品折扣不能大于10'})
        this.batchDiscount = null
        return
      }
      this.$emit('batch', {
        type: this.type,
        data: this.batchDiscount
      })
    }
  }
};
</script>
  
<style lang="scss" scoped>
.class-table-wrapper {
  width: 660px;
  margin: 0 0 15px 0;
  i.delete-operation {
    cursor: pointer;
    color: #bec3c6;
  }
  /deep/ .el-table__header tr th {
    padding: 0;
  }
  /deep/ .el-table__body tr td {
    padding: 7px 0;
  }

  /deep/ .el-input-group--append {
    width: 100px;
    /deep/ .el-input-group__append {
      /deep/.el-input__inner {
        padding: 10px;
      }
      box-sizing: border-box;
      width: 40px;
      height: 40px;
      color: white;
      padding: 0;
      text-align: center;
      background: #d5dadf;
    }
  }
}
</style>
  