<template>
  <div class="container">
    <el-table class="table-manage" stripe :data="data">
      <el-table-column prop="brandInfo" label="品牌logo/名称" width="300">
        <template slot-scope="scope">
          <div class="brand-info">
            <el-form ref="form" :model="scope.row" label-width="0">
              <el-form-item prop="orderNO" class="order-number">
                <number-input
                  maxlength="4"
                  v-model="scope.row.orderNo"
                  @blur="sortProductBrandManage(scope.row.id,scope.row.orderNo)"
                ></number-input>
              </el-form-item>
            </el-form>
            <img :src="utils.formatPicImg(scope.row.productBrand.logoSquare)" alt class="img" />
            <span>{{scope.row.brandName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="覆盖产品分类" width="325">
        <template slot-scope="scope">
          <div class="coverage">
            <span class="coverage-area">{{productClassList(scope.row.productBrand)}}</span>
            <span class="coverage-detail" @click="coverageDetail(scope.row)">明细</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="productBrand.createUserName" label="新增人"></el-table-column>
      <el-table-column prop="createTime" label="选择时间"></el-table-column>
      <el-table-column prop="operationAvailable" label="操作 ">
        <template slot-scope="scope">
          <div style="display:flex" class="buttons">
            <g-button
              type="remark"
              name="删除"
              icon="icon_operate_delete"
              @click="delBrand(scope.row.id,scope.row.productBrandId)"
            ></g-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <g-del-model
      :delTagDialogVisible="delTagDialogVisible"
      @close="delTagDialogVisible=false"
      @confirm="delTagDialogVisible=false"
      icon="icon_popup_plaint"
      title="暂时不能删除!"
      content="已有商品与该品牌相关联，须先将相关商品删除或更改品牌。"
      iconColor="#FCB322"
    ></g-del-model>
    <el-dialog
      title="覆盖产品分类"
      :visible.sync="coverageVisible"
      @close="coverageVisible = false"
      width="660px"
    >
      <div v-loading="dialogLoad">
        <div v-for="(item,index) in coverageList" :key="index" style="margin-bottom: 10px;">
          <p class="coverage-title">{{item.name}}</p>
          <p class="coverage-list">
            <span>{{item.subClass.map(i => i.name).join("、")}}</span>
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from "@/util/axios";

export default {
  props: {
    data: Array
  },
  data() {
    return {
      delTagDialogVisible: false,
      utils: utils,
      coverageVisible: false,
      coverageList: [],
      dialogLoad: false,
    };
  },
  created() {
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    }
  },
  methods: {
    sortProductBrandManage(id, orderNo) {
      axios.post("/sortProductBrandManage", { id, orderNo }).then(res => {
        this.$message({
          type: res.success ? "success" : "warning",
          message: res.message
        });
        if (res.success) {
          this.$emit("update");
        }
      });
    },
    delBrand(id, productBrandId) {
      let param = {
        brandId: this.currentInfo.brandId,
        id,
        productBrandId
      };
      axios.del("/delProductBrandManage", { data: param }).then(res => {
        if (res.code === "SUCCESS") {
          this.$emit("update");
          this.$message({ type: "success", message: "删除成功" });
        } else if (res.code === "CANNOT_DEL") {
          this.delTagDialogVisible = true;
        } else {
          this.$message({ type: "warning", message: "操作失败" });
        }
      });
    },
    productClassList(productBrand) {
      if (productBrand.productClassList) {
        return productBrand
          ? productBrand.productClassList.map(item => item.name).join("、")
          : "";
      } else {
        return "";
      }
    },
    // 查看明细
    async coverageDetail(row) {
      this.coverageVisible = true;
      this.$nextTick(() => {
        this.dialogLoad = true;
      })
      // 获取所有的分类信息进行遍历
      const res = await axios.get(`/getProductClass/${row.productBrand.id}`);
      this.coverageList = res.data
      this.dialogLoad = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.brand-info {
  .el-form {
    transform: translateY(10px);

    /deep/ .el-input__inner {
      text-align: center;
    }
  }

  display: flex;
  align-items: center;

  .img {
    margin: 0 10px;
    display: block;
    width: 40px;
    height: 40px;
  }

  .el-form {
    .el-form-item {
      margin-bottom: 0;
      transform: translateY(-10px);
    }
  }
}
.coverage {
  display: flex;
  align-items: center;
  .coverage-area {
    width: 78%;
    // display: inline-block;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .coverage-detail {
    margin-left: 2px;
    padding: 1px;
    color: #079bfe;
    cursor: pointer;
  }
}

.coverage-title {
  font-size: 18px;
  color: #000;
}

.coverage-list {
  font-size: 16px;
  color: #8E878D;
}

/deep/ .el-dialog {
  .el-dialog__header {
    .el-dialog__title {
      font-size: 20px;
      font-weight: 700;
    }
  }
}
</style>
