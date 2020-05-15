<template>
  <div class="seller-create-goods-main" v-loading="loading">
    <seed-header :title="'新增推广商品'" :hasTabs="false"></seed-header>
    <div class="create-goods-main-box scrollbar">
      <div class="create-goods-container">
        <div class="create-goods-body">
          <el-form :model="goodsForm" ref="goodsFormRef" :rules="goodsFormRules" class="query-form">
            <!-- 服务设置 -->
            <div class="form-line">
              <div class="form-title">
                <span class="xing">服务设置</span>
              </div>
              <div class="form-con">
                <div class="header-line">
                  <el-button plain class="plain_blue_btn" @click="visable_service=true">选择服务</el-button>
                  <el-button plain class="plain_green_btn" @click="visable_product=true">选择产品</el-button>
                  <el-button plain class="plain_pink_btn" @click="visable_card=true">选择卡项</el-button>
                </div>
                <div class="table-box">
                  <!-- 服务选中表格 -->
                  <el-table
                    stripe
                    :data="supServiceTable"
                    :header-cell-style="headerRowStyle"
                    empty-text="请选择至少一个商品"
                    v-if="goodsForm.serviceSpecificationList.length > 0"
                  >
                    <el-table-column show-overflow-tooltip prop="goodsName" label="服务名称"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="specificationName" label="规格"></el-table-column>
                    <el-table-column prop="shopPrice" label="门店价">
                      <template slot-scope="scope">￥{{scope.row.shopPrice}}</template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <!-- <g-button
                          :name="'设置'"
                          :type="'detail'"
                          :icon="'info_set'"
                          @click="setGood(scope.row)"
                        ></g-button>-->
                        <g-button
                          :name="'删除'"
                          :type="'cancel'"
                          :icon="'icon_operate_delete'"
                          @click="delSelectedService(scope.$index)"
                        ></g-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @current-change="handleCurrentChangeServe"
                    :current-page="1"
                    :page-size="4"
                    layout="total, prev, pager, next"
                    :total="goodsForm.serviceSpecificationList.length"
                    v-if="goodsForm.serviceSpecificationList.length > 0"
                  ></el-pagination>
                  <!-- 产品选中表格 -->
                  <el-table
                    stripe
                    style="margin-top: 12px;"
                    :header-cell-style="headerRowStyle"
                    :data="supProductTable"
                    empty-text="请选择至少一个商品"
                    v-if="goodsForm.productSpecificationList.length > 0"
                  >
                    <el-table-column show-overflow-tooltip prop="goodsName" label="产品名称"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="specificationName" label="规格"></el-table-column>
                    <el-table-column prop="shopPrice" label="专柜价">
                      <template slot-scope="scope">￥{{scope.row.shopPrice}}</template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <!-- <g-button
                          :name="'设置'"
                          :type="'detail'"
                          :icon="'info_set'"
                          @click="setGood(scope.row)"
                        ></g-button>-->
                        <g-button
                          :name="'删除'"
                          :type="'cancel'"
                          :icon="'icon_operate_delete'"
                          @click="delSelectedProduct(scope.$index)"
                        ></g-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @current-change="handleCurrentChangeProduct"
                    :current-page="1"
                    :page-size="4"
                    layout="total, prev, pager, next"
                    :total="goodsForm.productSpecificationList.length"
                    v-if="goodsForm.productSpecificationList.length > 0"
                  ></el-pagination>
                  <!-- 卡项选中表格 -->
                  <el-table
                    stripe
                    style="margin-top: 12px;"
                    :header-cell-style="headerRowStyle"
                    :data="supCardTable"
                    empty-text="请选择至少一个商品"
                    v-if="goodsForm.cardSpecificationList.length > 0"
                  >
                    <el-table-column show-overflow-tooltip prop="cardName" label="卡项名称"></el-table-column>
                    <el-table-column prop="shopPrice" label="价格">
                      <template
                        slot-scope="scope"
                      >￥{{ scope.row.cardFirstRechargeNum > 0 ? scope.row.cardFirstRechargeNum : scope.row.cardPrice}}</template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <!-- <g-button
                          :name="'设置'"
                          :type="'detail'"
                          :icon="'info_set'"
                          @click="setGood(scope.row)"
                        ></g-button>-->
                        <g-button
                          :name="'删除'"
                          :type="'cancel'"
                          :icon="'icon_operate_delete'"
                          @click="delSelectedCard(scope.$index)"
                        ></g-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @current-change="handleCurrentChangeCard"
                    :current-page="1"
                    :page-size="4"
                    layout="total, prev, pager, next"
                    :total="goodsForm.cardSpecificationList.length"
                    v-if="goodsForm.cardSpecificationList.length > 0"
                  ></el-pagination>
                </div>
              </div>
            </div>
            <!-- 按钮 -->
            <div class="form-line">
              <div class="form-title"></div>
              <div class="form-con">
                <el-button
                  class="normal_blue_btn"
                  @click="createSellGoods"
                  :loading="addGoodLoad"
                >确 定</el-button>
                <el-button plain class="plain_gray_btn" @click="cancal">返 回</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 服务对话框 -->
    <serviceDialog
      v-if="visable_service"
      :visible="visable_service"
      @close="visable_service=false"
      @suberData="getServiceDataFromSuber"
      :superCheckedGoods="selectedServicesIds"
    />
    <!-- 产品对话框 -->
    <productDialog
      v-if="visable_product"
      :visible="visable_product"
      @close="visable_product=false"
      @suberData="getProductDataFromSuber"
      :superCheckedGoods="selectedProductsIds"
    />
    <!-- 卡项对话框 -->
    <cardDialog
      v-if="visable_card"
      :visible="visable_card"
      @close="visable_card=false"
      @suberData="getCardDataFromSuber"
      :superCheckedGoods="selectedCardsIds"
    />
    <!-- 设置对话框 -->
    <!-- <el-dialog title="设置提成与奖励" :visible.sync="setGoodVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setGoodVisible = false">取 消</el-button>
        <el-button type="primary" @click="setGoodVisible = false">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import productDialog from "./components/productsDialog";
import serviceDialog from "./components/serviceDialog";
import cardDialog from "./components/cardDialog";
import { reg, checkReg } from "@/assets/js/RegExp";
import * as utils from "@/assets/js/utils";
export default {
  data() {
    return {
      loading: false,
      headerRowStyle: { background: "#f4f5f7" }, // 产品/服务表头样式
      goodsForm: {
        sellGoodsInfoList: [],
        serviceSpecificationList: [],
        productSpecificationList: [],
        cardSpecificationList: []
      },
      goodsFormRules: {},
      // 服务本页
      supServiceTable: [],
      // 产品本页
      supProductTable: [],
      // 卡项本页
      supCardTable: [],
      activityTime: null,
      // 子组件
      /* 服务选项及选中项 start */
      visable_service: false,
      subServiceTable: [],
      selectedServices: [],
      selectedServicesIds: new Set(),
      selectedServicesObj: {},
      // 服务列表当前页码
      serveListPageNum: 1,
      /* 服务选项及选中项 end */
      /* 产品选项及选中项 start */
      visable_product: false,
      subProductTable: [],
      selectedProducts: [],
      selectedProductsIds: new Set(),
      selectedProductsObj: {},
      // 产品列表当前页码
      productListPageNum: 1,
      /* 产品选项及选中项 end */
      /* 会员卡选项及选中项 start */
      visable_card: false,
      subCardTable: [],
      selectedCards: [],
      selectedCardsIds: new Set(),
      selectedCardsObj: {},
      // 会员卡列表当前页码
      cardListPageNum: 1,
      /* 会员卡选项及选中项 end */
      // 设置对话框
      setGoodVisible: false,
      // 选中的服务或产品
      currentGood: null,
      // 分组信息
      sellerGroup: [],
      addGoodLoad: false
    };
  },
  created() {
    this.sellerGroup = this.$store.state.seller.sellerGroup;
  },
  methods: {
    // ------------------------------- 校验 ------------------------------

    // ------------------------------- 校验 ------------------------------
    // 服务/产品分页事件堆
    handleCurrentChangeServe(index) {
      this.serveListPageNum = index;
      this.supServiceTable = this.showServeNum(
        this.goodsForm.serviceSpecificationList,
        this.supServiceTable,
        index - 1
      );
    },
    handleCurrentChangeProduct(index) {
      this.productListPageNum = index;
      this.supProductTable = this.showServeNum(
        this.goodsForm.productSpecificationList,
        this.supProductTable,
        index - 1
      );
    },
    handleCurrentChangeCard(index) {
      this.cardListPageNum = index;
      this.supCardTable = this.showServeNum(
        this.goodsForm.cardSpecificationList,
        this.supCardTable,
        index - 1
      );
    },
    // - 保存服务
    getServiceDataFromSuber(obj) {
      obj.yes.map(i => {
        if (!this.selectedServicesIds.has(i.specificationId)) {
          this.selectedServicesIds.add(i.specificationId);
          this.selectedServicesObj[i.specificationId] = {
            activityId: null,
            expBuyLimitNum: null,
            groupPrice: null,
            cashReward: null,
            ...i
          };
        }
      });
      obj.no.map(i => {
        if (this.selectedServicesIds.has(i.specificationId)) {
          this.selectedServicesIds.delete(i.specificationId);
          delete this.selectedServicesObj[i.specificationId];
        }
      });
      this.goodsForm.serviceSpecificationList = Object.values(
        this.selectedServicesObj
      );
      // this.supServiceTable = Object.values(this.selectedServicesObj);
      this.supServiceTable = this.showServeNum(
        this.goodsForm.serviceSpecificationList,
        this.supServiceTable,
        0
      );
    },
    // 每页显示的服务或者产品数量
    showServeNum(father = [], son = [], num = Number) {
      son = father.slice(4 * num, 4 * (num - 1 + 2));
      return son;
    },
    // - 删除服务
    delSelectedService(idx) {
      // 注意此idx要结合页码
      idx = idx + 4 * (this.serveListPageNum - 1);
      let id = this.goodsForm.serviceSpecificationList[idx].specificationId;
      this.selectedServicesIds.delete(id);
      delete this.selectedServicesObj[id];
      this.goodsForm.serviceSpecificationList.splice(idx, 1);
      // 删除后表格刷新
      if (this.supServiceTable.length === 1) {
        this.handleCurrentChangeServe(this.serveListPageNum - 1);
      } else {
        this.handleCurrentChangeServe(this.serveListPageNum);
      }
    },
    // - 保存产品
    getProductDataFromSuber(obj) {
      obj.yes.map(i => {
        if (!this.selectedProductsIds.has(i.specificationId)) {
          this.selectedProductsIds.add(i.specificationId);
          this.selectedProductsObj[i.specificationId] = {
            activityId: null,
            expBuyLimitNum: null,
            groupPrice: null,
            cashReward: null,
            ...i
          };
        }
      });
      obj.no.map(i => {
        if (this.selectedProductsIds.has(i.specificationId)) {
          this.selectedProductsIds.delete(i.specificationId);
          delete this.selectedProductsObj[i.specificationId];
        }
      });
      this.goodsForm.productSpecificationList = Object.values(
        this.selectedProductsObj
      );
      this.supProductTable = this.showServeNum(
        this.goodsForm.productSpecificationList,
        this.supProductTable,
        0
      );
    },
    // - 删除产品
    delSelectedProduct(idx) {
      // 注意此idx要结合页码
      idx = idx + 4 * (this.productListPageNum - 1);
      let id = this.goodsForm.productSpecificationList[idx].specificationId;
      this.selectedProductsIds.delete(id);
      delete this.selectedProductsObj[id];
      this.goodsForm.productSpecificationList.splice(idx, 1);
      // 删除后表格刷新
      if (this.supProductTable.length === 1) {
        this.handleCurrentChangeProduct(this.productListPageNum - 1);
      } else {
        this.handleCurrentChangeProduct(this.productListPageNum);
      }
    },
    // - 保存卡项
    getCardDataFromSuber(obj) {
      obj.yes.map(i => {
        if (!this.selectedCardsIds.has(i.specificationId)) {
          this.selectedCardsIds.add(i.specificationId);
          this.selectedCardsObj[i.specificationId] = {
            activityId: null,
            expBuyLimitNum: null,
            groupPrice: null,
            cashReward: null,
            ...i
          };
        }
      });
      obj.no.map(i => {
        if (this.selectedCardsIds.has(i.specificationId)) {
          this.selectedCardsIds.delete(i.specificationId);
          delete this.selectedCardsObj[i.specificationId];
        }
      });
      this.goodsForm.cardSpecificationList = Object.values(
        this.selectedCardsObj
      );
      this.supCardTable = this.showServeNum(
        this.goodsForm.cardSpecificationList,
        this.supCardTable,
        0
      );
    },
    // - 删除卡项
    delSelectedCard(idx) {
      // 注意此idx要结合页码
      idx = idx + 4 * (this.cardListPageNum - 1);
      console.log(this.goodsForm.cardSpecificationList);
      let id = this.goodsForm.cardSpecificationList[idx].specificationId;
      this.selectedCardsIds.delete(id);
      delete this.selectedCardsObj[id];
      this.goodsForm.cardSpecificationList.splice(idx, 1);
      // 删除后表格刷新
      if (this.supCardTable.length === 1) {
        this.handleCurrentChangeCard(this.cardListPageNum - 1);
      } else {
        this.handleCurrentChangeCard(this.cardListPageNum);
      }
    },
    // 设置服务/产品
    setGood(row) {
      this.currentGood = row;
      this.setGoodVisible = true;
    },
    // 确认新增商品
    async createSellGoods() {
      // 做参数
      this.goodsForm.newCardSpecificationList = [];
      this.goodsForm.cardSpecificationList.forEach((item, index) => {
        this.goodsForm.newCardSpecificationList.push({
          goodsName: item.cardName,
          specificationId: item.specificationId,
          goodsType: "card",
          goodsId: item.specificationId,
          shopPrice:
            item.cardFirstRechargeNum > 0
              ? item.cardFirstRechargeNum
              : item.cardPrice
        });
      });
      this.goodsForm.sellGoodsInfoList = [
        ...JSON.parse(JSON.stringify(this.goodsForm.serviceSpecificationList)),
        ...JSON.parse(JSON.stringify(this.goodsForm.productSpecificationList)),
        ...JSON.parse(JSON.stringify(this.goodsForm.newCardSpecificationList))
      ];
      this.goodsForm.sellGoodsInfoList.forEach(item => {
        item.brandId = this.currentInfo.brandId;
        item.storeId = this.currentInfo.shopId;
        item.goodsSpecificationId = item.specificationId;
        item.goodsType =
          item.goodsType === "production"
            ? 1
            : item.goodsType === "card"
            ? 3
            : 2;
        item.price = item.shopPrice;
        delete item.activityId;
        delete item.expBuyLimitNum;
        delete item.groupPrice;
        delete item.cashReward;
        delete item.specificationId;
        delete item.cost;
        delete item.shopPrice;
        delete item.minMemberPrice;
        delete item.maxMemberPrice;
        delete item.stock;
        delete item.serviceId;
        delete item.sortLevelOne;
        delete item.sortLevelTwo;
        delete item.productCostId;
        delete item.serverCostId;
        delete item.performanceCost;
        delete item.performanceServer;
        delete item.performanceAssistant;
        delete item.serviceName;
      });
      // 完成
      if (this.goodsForm.sellGoodsInfoList.length === 0)
        return this.$message.error("请至少选择一样产品/服务/卡项");
      this.addGoodLoad = true;
      axios
        .post("/batchCreateSellerGoods", {
          sellGoodsInfoList: this.goodsForm.sellGoodsInfoList
        })
        .then(res => {
          if (!res.success) {
            this.$message.error("添加商品失败");
            this.addGoodLoad = false;
          } else {
            this.$message.success(
              "添加商品成功，请注意完善小组提成与奖励方案！"
            );
            // 返回
            this.cancal();
          }
        })
        .catch(() => {
          this.addGoodLoad = false;
        });
    },
    // 返回推广商品页
    cancal() {
      // 保留导航信息
      this.$router.push({
        name: "/shop-inner/market/market-list/promotion-commission",
        params: { tab: "PromotionGoods" }
      });
    }
  },
  watch: {},
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  components: { productDialog, serviceDialog, cardDialog }
};
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
.seller-create-goods-main {
  display: flex;
  justify-content: center;
  .create-goods-main-box {
    width: calc(100vw - 40px);
    height: calc(100vh - 105px);
    padding: 0 20px 20px;
    margin-top: 85px;
    overflow-y: auto;
  }
  .create-goods-container {
    min-height: calc(100vh - 105px);
  }
  .create-goods-body {
    max-width: 1440px;
    box-sizing: border-box;
    padding: 36px 72px 85px 20px;
    margin: 0 auto;
    background: #fff;
    border-radius: 6px;
    /* ==== */
    min-height: calc(100vh - 105px);
  }
}

.plain_blue_btn,
.plain_pink_btn,
.plain_green_btn {
  padding: 9px;
}
.normal_blue_btn {
  padding: 12px 37px;
}
.table-box {
  width: 800px;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  margin: 20px 0;
  /deep/ .el-radio,
  /deep/ .el-form-item {
    margin: 0;
  }
  /deep/ .el-input-group__append {
    padding: 0 12px;
  }
}

.xing {
  &::before {
    content: "* ";
    color: #ff6d61;
  }
}

.form-line {
  display: flex;
  line-height: 40px;
  min-height: 60px;

  .form-title {
    width: 140px;
    text-align: right;
    box-sizing: border-box;
    padding-right: 20px;
    color: #666666;
    font-size: 14px;
  }

  .form-con {
    flex: auto;
    font-size: 14px;
    color: #333333;

    .button {
      width: 74px;
      margin-right: 56px;
      height: 30 xp;
      box-sizing: border-box;
      padding: 0;
      line-height: 28px;
      border: 1px solid #58c9f3;
      color: #58c9f3;
      border-radius: 5px;
    }

    i {
      color: #58c9f3;
      cursor: pointer;
    }
  }

  .item-number-input {
    width: 70px;
    /deep/ .el-input__inner {
      border-radius: 4px 0 0 4px;
    }
  }
}

.el-pagination {
  margin-top: 10px;
}
</style>
