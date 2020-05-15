<template>
  <!-- 4/4 [aec8054] 郝志强创建 -->
  <!-- 4/19 [7c56836] 潘力扬创建 -->
  <div @click="showGroups=false">
    <el-dialog
      title="设置店长"
      :visible.sync="selectStoreManageModelVisible"
      width="500px"
      :before-close="dialogBeforeClose"
    >
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="门店名称">
          <el-input disabled v-model="addStoreManageInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="设置店长">
          <el-select v-model="selectedManagers" multiple placeholder="请选择">
            <el-option
              v-for="item in staffs"
              :key="item.userId"
              :label="item.name"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as axios from "@/util/axios"
export default {
  props: {
    selectStoreManageModelVisible: Boolean,
    addStoreManageInfo: Object,
    staffs: Array
  },
  data() {
    return {
      selectedManagers: [],
      form: {},
      showGroups: false,
    };
  },
  watch: {
    'addStoreManageInfo.managerInfos'(v) {
      this.selectedManagers = []
      if (v.length) {
        v.forEach(user => {
          this.selectedManagers.push(user.userId)
        });
      }
    }
  },
  methods: {
    dialogBeforeClose() {
      this.$emit("close");
    },
    confirm() {
      axios
        .post('/editStoreManager', {
          userIdList: this.selectedManagers,
          storeId: this.addStoreManageInfo.storeId
        })
        .then(res => {
          this.setStoreManagerRes(res);
        });
    },
    setStoreManagerRes(res) {
      if (res.success) {
        this.$emit("refresh");
        this.$emit("close");
        this.$message({
          type: "success",
          message: "设置店长成功"
        });
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.el-form-item {
  /deep/ .el-input__inner {
    width: 200px;
  }
}
.store-manager {
  width: 200px;
  height: 40px;
  border: 1px solid #f4f4f4;
  border-radius: 4px;
  position: relative;
  .p {
    line-height: 38px;
    text-indent: 15px;
    color: #c7cad1;
    cursor: pointer;
  }
  @mixin arrowddeg($deg) {
    position: absolute;
    top: 1px;
    right: 10px;
    font-weight: 600;
    font-size: 2px;
    color: #4c495b;
    transition: all 0.6s;
    transform: rotateZ($deg);
  }
  .arrow90 {
    @include arrowddeg(-90deg);
  }
  .arrow270 {
    @include arrowddeg(90deg);
  }
  .group {
    position: absolute;
    top: 102%;
    left: -1px;
    border: 1px solid #f4f4f4;
    border-top: 0;
    width: 100%;
    background: #fff;
    z-index: 9;
    overflow: auto;
    max-height: 300px;
    .el-checkbox-group {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding-left: 15px;
      /deep/ .el-checkbox {
        margin-left: 0;
      }
    }
  }
}
.selected-manager {
  display: flex;
  p {
    width: 90px;
    color: #999999;
  }
}
</style>
