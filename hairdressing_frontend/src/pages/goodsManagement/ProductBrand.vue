<template>
  <div class="con-root">
    <div class="top-add-searce">
      <div>
        <el-button
          class="normal_blue_btn"
          size='medium'
          :loading="selectButtonLoading"
          @click="selectBrand"
        >选择品牌
        </el-button>
        <router-link to="/brand-inner/create-new-brand">
          <el-button class="normal_pink_btn" size='medium' type="danger">创建品牌</el-button>
        </router-link>
      </div>
      <input-search @search="query()" width="280px" v-model="keyWord" placeholder="请输入分类名称"></input-search>
    </div>
    <div class="con-table" v-loading="tableLoading">
      <div class="user-defined-tab">
        <el-tabs v-model="activePath" type="card" @tab-click="query()">
          <el-tab-pane
            v-for="(item,index) in [{name:'经营品牌',en:'manageBrand'},{name:'创建品牌',en:'createBrand'}]"
            :key="index"
            :label="item.name"
            :name="item.en"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="table-contain">
        <product-brand-manage-brand
          :data="activePath==='manageBrand'?productBrandManageList:[]"
          v-if="activePath==='manageBrand'"
          @update="query"
        ></product-brand-manage-brand>
        <product-brandC-createB-brand
          @update="query"
          :data="activePath==='manageBrand'?[]:productBrandManageList"
          v-else
        ></product-brandC-createB-brand>
      </div>
      <div class="page">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page.pageNum"
          :page-size="page.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="page.totalCount"
        ></el-pagination>
      </div>
    </div>
    <select-brand
      ref="selectBrand"
      :visible="addBrandVisible"
      @close="addBrandVisible=false"
      @ready="selectButtonLoading = false"
      @update="query"
    ></select-brand>
  </div>
</template>
<script>
  import * as axios from "@/util/axios";
  import * as utils from "@/assets/js/utils";
  import InputSearch from "@/components/common/InputSearch";
  import SelectBrand from "@/components/goodsManagement/productBrand/SelectBrand";
  import ProductBrandCreateBrand from "@/components/goodsManagement/productBrand/ProductBrandCreateBrand";
  import ProductBrandManageBrand from "@/components/goodsManagement/productBrand/ProductBrandManageBrand";
  import "@/assets/css/tab.scss";

  export default {
    components: {
      "input-search": InputSearch,
      "select-brand": SelectBrand,
      "product-brandC-createB-brand": ProductBrandCreateBrand,
      "product-brand-manage-brand": ProductBrandManageBrand
    },
    data() {
      let sequenceValidator = (rule, value, callback) => {
        if (value < 0 || typeof value === "string") {
          callback(new Error("请输入大于0的数字"));
          return;
        }
        callback();
      };
      return {
        utils: utils,
        productBrandManageList: [],
        activePath: "manageBrand",
        keyWord: null,
        page: {
          pageSize: 20,
          pageNum: 1,
          totalCount: 0
        },
        tableLoading: false,
        addBrandVisible: false,
        selectButtonLoading: false
      };
    },
    computed: {
      currentInfo() {
        return this.$store.state.manage.currentInfo;
      },
      queryParams() {
        return {
          brandId: this.currentInfo.brandId,
          keyWord: this.keyWord,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize
        };
      }
    },
    mounted() {
      this.query();
    },
    methods: {
      query() {
        this.productBrandManageList = [];
        this.tableLoading = true;
        let url =
          this.activePath === "manageBrand"
            ? "/queryProductBrandManage"
            : "/queryProductBrandCreate";
        axios.post(url, this.queryParams).then(res => {
          this.productBrandManageList =
            res.productBrandManageList || (res.data ? res.data.productBrandList : []);
          this.tableLoading = false;
          this.page.totalCount = ('total' in res) ? res.total : res.data.total;
        });
      },
      handleCurrentChange(pageNumber) {
        this.page.pageNum = pageNumber;
        this.query()
      },
      selectBrand() {
        this.selectButtonLoading = true;
        this.$refs.selectBrand.readyToChoose();
      },
      sortProductBrandManage(id, orderNo) {
        axios.post("/sortProductBrandManage", {id, orderNo}).then(res => {
          this.$message({
            type: res.success ? "success" : "warning",
            message: res.message
          });
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  @mixin border {
    border: 1px solid red;
  }

  @mixin button {
    height: 35px;
    color: white;
    padding: 0 18px;
    border: 0;
    line-height: 35px;
    transition: all 0.6s;
    &:hover {
      filter: brightness(90%);
    }
  }

  @mixin button-small($color) {
    height: 28px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
    border-radius: 3px;
    color: $color;
    border: 1px solid $color;
    padding: 0;
    transition: all 0.6s;
    padding: 0 6px;
    span {
      margin-left: 5px;
    }
    &:hover {
      background: #efefef;
    }
  }

  .con-root {
    box-sizing: border-box;
    padding: 23px 20px;

    .top-add-searce {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }

    .con-table {
      box-sizing: border-box;
      background: #ffffff;
      box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
      border-radius: 8px 8px 4px 4px;
      color: #333333;

      .table-contain {
        box-sizing: border-box;
        padding: 10px 20px;

        .table-manage {
          /deep/ .el-table tr:nth-child(2n + 1) {
            background: #f0f1f4;
          }

          /deep/ .el-table__row {
            background: red;
          }
        }
      }

      .brand-info {
        display: flex;
        align-items: center;

        .img {
          margin: 0 10px;
          display: block;
          width: 40px;
          height: 40px;
          background: red;
        }

        .order-number {
          /deep/ .el-input__inner {
            width: 40px;
            height: 35px;
            padding: 4px;
            transform: translateY(10px);
          }

          /deep/ .el-form-item__error {
            top: 110%;
            width: 200px;
          }
        }

        .el-form {
          .el-form-item {
            margin-bottom: 0;
            transform: translateY(-10px);
          }
        }
      }

      .status-text {
        > p {
          color: white;
          line-height: 17px;
          height: 17px;
          font-size: 12px;
          border-radius: 8px;
          width: 50px;
          text-align: center;
        }
      }

      .buttons {
        .button-edit {
          @include button-small(#58c9f3);
        }

        .button-update {
          @include button-small(#58c9f3);
        }
      }

      .page {
        padding: 10px 0 20px;
      }
    }
  }
</style>
