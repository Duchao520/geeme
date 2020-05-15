<template>
  <div class="gm-service-box">
    <div class="top">
      <el-button
        class="normal_pink_btn normal_red_btn"
        size="medium"
        @click="$router.push('/brand-inner/product-add')"
        >新增产品模板
      </el-button>
      <input-search
        v-model="params.keyword"
        @search="handleSearch"
        placeholder="请输入产品名称"
      ></input-search>
    </div>
    <div id="gm_service_list" class="margin_main">
      <div
        class="user-defined-tab container-normal-list"
        style="margin-top:20px;"
        v-loading="tableLoading"
      >
        <div class="main-con">
          <div v-if="total !== 0">
            <el-table
              :data="tableData"
              tooltip-effect="dark"
              stripe
              style="width: 100%"
              class="table-data-list"
              height="calc(100vh - 229px)"
            >
              <el-table-column width="250" label="产品名称">
                <template slot-scope="scope">
                  <div class="service-message">
                    <div
                      class="image-box"
                      @click="toEditServer(scope.row.productTempId, true)"
                    >
                      <img
                        :src="
                          formatPicImage(
                            scope.row.image,
                            'style',
                            70,
                            'brandLogo'
                          )
                        "
                        class="image"
                      />
                    </div>

                    <div class="service-info-text">
                      <div
                        class="text"
                        @click="toEditServer(scope.row.productTempId, true)"
                      >
                        <p class="ser_name">{{ scope.row.name }}</p>
                        <p class="ser_code">
                          {{
                            scope.row.code
                              ? scope.row.code
                              : "编号由门店创建后生成"
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="产品分类">
                <template slot-scope="scope">{{scope.row.productLevelOneName}}</template>
              </el-table-column>
              <el-table-column label="门店价">
                <template slot-scope="scope">
                  <span class="price"
                    >¥{{
                      utils.formatPrice(scope.row.minPrice, scope.row.maxPrice)
                    }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="创建时间"
                prop="shelvesDate"
                show-overflow-tooltip
              >
              <template slot-scope="{row}">
                <p>{{ row.shelvesDate ? row.shelvesDate.split('T')[0] + ' ' + row.shelvesDate.split('T')[1] : '' }}</p>
              </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <p v-if="scope.row.deleted">
                    <status-text :type="'mred'" :name="'已删除'"></status-text>
                  </p>
                  <p v-else>
                    <status-text :type="'green'" :name="'已创建'"></status-text>
                  </p>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="220">
                <div slot-scope="scope" class="manage">
                  <g-button
                    :name="'编辑'"
                    type="detail"
                    :icon="'icon_operate_edit'"
                    @click="toEditServer(Number(scope.row.productTempId))"
                  ></g-button>
                  <g-button
                    name="详情"
                    type="detail"
                    :icon="'icon_operate_eyes'"
                    @click="toEditServer(Number(scope.row.productTempId), true)"
                  ></g-button>
                  <g-button
                    v-if="!scope.row.deleted"
                    :name="'删除'"
                    type="cancel"
                    :icon="'icon_operate_delete'"
                    @click="toDelServer(scope.row)"
                  ></g-button>
                  <g-button
                    v-else
                    name="恢复"
                    type="green"
                    :icon="'icon_operate_recover'"
                    @click="toRecovery(Number(scope.row.productTempId))"
                  ></g-button>
                  <!-- @click="recoverProduct(scope.row.id)" -->
                </div>
              </el-table-column>
            </el-table>
            <div class="service-operation">
              <div
                v-if="!checkHasBtnPermission('shop_goods_service_tableButtons')"
              ></div>
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="params.pageNum"
                :page-size="params.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
          <search-default
            class="search-default"
            v-if="total === 0"
            @clear-back="resetForm"
          ></search-default>
        </div>
      </div>
    </div>
    <!-- 删除服务模板提示 -->
    <g-del-model
      :delTagDialogVisible="delConfirmVisible"
      @confirm="confirmDelete"
      @close="delConfirmVisible = false"
      title="确定要将该模板删除吗？"
      content="删除后，该模板不会出现在门店列表中。"
      icon="icon_popup_question"
      iconColor="#FCB322"
    ></g-del-model>
  </div>
</template>

<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import "@/assets/css/tab.scss";
import { mapActions, mapState } from "vuex";
import { Base64 } from "js-base64";

export default {
  name: "BrandServiceList",
  components: {},
  data() {
    return {
      utils,
      tableLoading: Boolean,
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      // 表格数据请求参数
      params: {
        keyword: "",
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      // 表格数据
      tableData: [],
      delConfirmVisible: false, // 删除模板提示对话框的标识
      currentMoba: "" // 选中的模板
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["saveOperate", "saveCurrentInfo", "productTemplateId"]),
    init() {
      this.getProductList();
    },
    // 获取产品模板列表
    async getProductList() {
      this.tableLoading = true;
      const res = await axios.post("/getProductTemplateByBrandId", {
        ...this.params,
        brandId: this.currentInfo.brandId
      });
      this.tableLoading = false;
      this.tableData = res.productDetailList;
      this.total = res.total;
    },
    toEditServer(productTempId, ignore = false) {
      this.productTemplateId(Number(productTempId));
      // 去往详情页的逻辑
      if (ignore) {
        window.open(
          "#/brand-inner/product-detail/" + Base64.encode(productTempId),
          "_blank"
        );
        return;
      }
      this.$router.push("/brand-inner/product-edit");
    },
    handleSearch(val) {
      this.params.keyword = val;
      this.getProductList();
    },
    // 服务分类切换
    handleSort(val) {},
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.getProductList();
    },
    // 清空条件事件 产品模板先不做筛选
    resetForm() {
      this.params.sortOne = null;
      this.params.sortTwo = null;
      // this.$refs["form"].resetFields();
      this.params.keyword = "";
      // 清空之后获取数据
      this.getProductList();
    },
    // 删除服务模板
    toDelServer(row) {
      this.getTempleteInfo(row.productTempId);
      this.delConfirmVisible = true;
    },
    // 根据id获取模板信息
    getTempleteInfo(id) {
      return axios.post(`/getProductTemplateById/${id}`).then(res => {
        this.currentMoba = res;
        this.currentMoba.productLeveleOneInfo.brandId = this.currentInfo.brandId;
        this.currentMoba.productLeveleTwoInfo.brandId = this.currentInfo.brandId;
        delete this.currentMoba.storeId
      });
    },
    // 确认删除/同恢复
    async confirmDelete(flag) {
      let deleted = flag !== "recovery";
      let text = flag === "recovery" ? "恢复" : "删除";
      const res = await axios.post("/addOrModifyProductTemplate", {
        ...this.currentMoba,
        deleted,
        brandId: this.currentInfo.brandId
      });
      if (!res.success) return this.$message, error(text + "模板失败");
      this.$message.success(text + "模板成功");
      this.delConfirmVisible = false;
      this.handleCurrentChange(this.params.pageNum);
    },
    // 恢复模板
    async toRecovery(id) {
      await this.getTempleteInfo(id);
      this.confirmDelete("recovery");
    }
  },
  watch: {
  }
};
</script>

<style lang="scss">
#gm_service_list {
  .service_list_condition {
    padding: 10px 20px 10px 20px;
    background: #fff;
    border-radius: 10px 10px 5px 5px;
    overflow: hidden;
    min-width: 1100px;
  }

  .service-filters-box {
    display: flex;
    flex-direction: row;

    .left-area {
      flex: auto;
      min-width: 1000px;
    }

    .right-area {
      min-width: 200px;
      border-left: 1px solid #f0f1f4;
      padding-left: 25px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      .clear-filters {
        display: inline-block;
        width: 70px;
        font-size: 14px;
        line-height: 54px;
        color: #999;

        &:hover {
          cursor: pointer;
        }
      }

      .filter-btn {
        background: rgb(88, 201, 243);
        color: #fff;
        width: 70px;
        height: 30px;
        border-radius: 5px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.6s;

        &:hover {
          background: rgba(88, 201, 243, 0.8);
        }
      }
    }
  }

  .el-radio-button__inner {
    margin-bottom: 10px;
  }

  .sort-area {
    display: flex;
    align-items: center;

    /deep/ .el-checkbox__label {
      display: none;
    }

    /deep/ .el-input__inner {
      text-align: center;
    }
  }

  th.is-right > .cell {
    padding-right: 16px;
  }

  .checkbox_area {
    .el-checkbox {
      width: 100px;
      margin-left: 20px;
      margin-bottom: 15px;
      display: block;
    }
  }
}
</style>

<style lang="scss" scoped>
.gm-service-box {
  .top {
    box-sizing: border-box;
    width: 100%;
    padding: 0 20px;
    margin: 20px 0;
    height: 35px;
    display: flex;
    justify-content: space-between;
  }
}

.color_blue {
  color: #409eff;
}

.color_green {
  color: #67c23a;
}

.color_red {
  color: #e22c37;
}

.check_single {
  margin-left: 5px;
}

.service-operation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;

  .manage-buttons {
    flex: 1;

    /deep/ .el-checkbox {
      margin-left: 10px;
      margin-right: 15px;
    }
  }
}

.service-message {
  display: flex;

  .image-box {
    margin-right: 10px;
    width: 64px;
    height: 62px;
    flex-shrink: 0;
    overflow: hidden;

    .image {
      display: block;
      width: 64px;
      height: 62px;
      transition: all 0.3s cubic-bezier(0.61, 0.25, 0.24, 0.85);
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
      }
    }
  }

  .service-info-text {
    flex: auto;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    width: 100%;
    justify-content: space-between;

    .text {
      line-height: 17px;
      cursor: pointer;

      .ser_name {
        color: #333333;
        font-size: 14px;
      }

      .ser_code {
        color: #999999;
      }

      &:hover {
        .ser_name,
        .ser_code {
          color: #58c9f3;
        }
      }
    }

    .tags {
      color: #999999;
      font-size: 12px;
      line-height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 170px;
    }
  }
}

.manage {
  border: 1px solid transparent;
  @media screen and (min-width: 1430px) {
    width: 220px;
  }
  @media screen and (max-width: 1430px) {
    width: 180px;
  }
}

.price {
  color: #ff6d61;
}

.oper_p {
  span {
    font-size: 12px;
    cursor: pointer;
    padding: 2px 10px;
    border-radius: 10px;

    &.oper {
      color: #fff;

      &.up {
        background: #a9d86e;
      }

      &.down {
        background: #ff6d61;
      }

      &.order {
        background: #f52d56;
      }

      &.hidden {
        background: #bec3c6;
      }
    }
  }
}

.long {
  width: 60px;
  text-align: right;
  display: inline-block;
}

.oper_p_button {
  min-width: 100px;
}

.add-button {
  margin-top: 5px;
}
.container-normal-list {
  border-radius: 8px 8px 0 0;
  background: #ffffff;

  .main-con {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    border-radius: 8px 8px 0 0;
    overflow: hidden;

    .table-data-list {
      /deep/ .cell {
        padding: 0 5px;
      }

      /deep/ .el-table__row:nth-child(2n) {
        background: #ffffff;
      }

      /deep/ .el-table__row:nth-child(2n + 1) {
        background: #f4f5f7;
      }

      /deep/ .el-table__body-wrapper.is-scrolling-left {
        overflow-x: hidden;
      }
    }

    .search-default {
      height: calc(100vh - 153px);
    }
  }
}

/deep/ .el-pagination .btn-prev,
/deep/ .el-pagination .btn-next {
  width: 35px;
}
</style>
