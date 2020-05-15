<template>
  <div class="shop-create-group-buy-main" v-loading="loading">
    <seed-header :title="activityTitle" :hasTabs="false"></seed-header>
    <div class="create-group-buy-main-box scrollbar">
      <div class="group-buy-container">
        <div class="group-buy-body">
          <el-form :model="form" ref="form" :rules="rules" class="query-form">
            <!-- 活动名称 -->
            <div class="form-line">
              <div class="form-title">
                <span class="xing">活动名称</span>
              </div>
              <div class="form-con">
                <el-form-item style="width:420px;" prop="activityName">
                  <el-input
                    :disabled="entry === 'detail'"
                    v-model="form.activityName"
                    placeholder="请输入活动名称，不超过16个中文字符"
                    maxlength="16"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
            <!-- 活动时间 -->
            <div class="form-line">
              <div class="form-title">
                <span class="xing">活动时间</span>
              </div>
              <div class="form-con">
                <el-form-item style="width:420px;" :prop="entry === 'add' ? 'activityTime' : ''">
                  <el-date-picker
                    :disabled="entry === 'detail'"
                    clearable
                    unlink-panels
                    v-model="activityTime"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleTimeChange"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </div>
            <!-- 享受客户 -->
            <div class="form-line">
              <div class="form-title">
                <span class="xing">享受客户</span>
              </div>
              <div class="form-con">
                <el-form-item>
                  <el-radio-group v-model="form.activityFor" disabled>
                    <el-radio :label="'all_customer'">
                      <span>所有客户</span>
                    </el-radio>
                    <el-radio :label="'new_customer'">
                      <span>仅限新客户</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <!-- 限购次数 -->
            <div class="form-line">
              <div class="form-title">
                <span class="xing">限制次数</span>
              </div>
              <div class="form-con">
                <el-form-item prop="limitBuyTimes">
                  <div class="time-card-limit-line">
                    <div style="margin-right:10px">同一位客户前</div>
                    <el-input
                      disabled
                      v-model.number="form.limitBuyTimes"
                      maxlength="4"
                      placeholder="数字"
                      class="item-number-input"
                    ></el-input>
                    <div style="margin-left:10px">次消费可享受体验价</div>
                  </div>
                </el-form-item>
              </div>
            </div>
            <!-- 适用场景 -->
            <div class="form-line">
              <div class="form-title">
                <span class="xing">适用场景</span>
              </div>
              <div class="form-con">
                <el-form-item>
                  <el-radio-group v-model="form.activityScope" disabled>
                    <el-radio :label="'only_online'">
                      <span>仅限用线上商城购买</span>
                    </el-radio>
                    <el-radio :label="'all_suit'">
                      <span>线上商城与门店消费均适用</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <!-- 服务设置 -->
            <div class="form-line">
              <div class="form-title">
                <span class="xing">服务设置</span>
              </div>
              <div class="form-con">
                <div class="header-line">
                  <el-button
                    plain
                    class="plain_blue_btn"
                    @click="visable_service=true"
                    :disabled="entry === 'detail'"
                  >选择服务</el-button>
                  <el-button
                    plain
                    class="plain_blue_btn"
                    @click="visable_product=true"
                    :disabled="entry === 'detail'"
                  >选择产品</el-button>
                </div>
                <div class="table-box">
                  <!-- 服务选中表格 -->
                  <el-table
                    stripe
                    :data="supServiceTable"
                    :header-cell-style="headerRowStyle"
                    empty-text="请选择至少一个服务或产品"
                  >
                    <el-table-column show-overflow-tooltip prop="goodsName" label="服务名称"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="specificationName" label="规格"></el-table-column>
                    <el-table-column prop="shopPrice" label="门店价">
                      <template slot-scope="scope">￥{{scope.row.shopPrice}}</template>
                    </el-table-column>
                    <el-table-column label="体验价">
                      <template slot-scope="scope">
                        <el-form-item
                          :prop="'serviceSpecificationList.'+ scope.$index + '.experiencePrice'"
                        >
                          <el-input
                            :disabled="entry === 'detail'"
                            :maxlength="8"
                            step="0.1"
                            type="number"
                            min="0"
                            v-model="supServiceTable[scope.$index].experiencePrice"
                            class="count-input"
                            size="small"
                          >
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" v-if="entry === 'add'">
                      <template slot-scope="scope">
                        <i
                          class="icon iconfont icon-icon_operate_delete"
                          @click="delSelectedService(scope.$index)"
                        ></i>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @current-change="handleCurrentChangeServe"
                    :current-page="serveListPageNum"
                    :page-size="4"
                    layout="total, prev, pager, next"
                    :total="form.serviceSpecificationList.length"
                  ></el-pagination>
                  <!-- 产品选中表格 -->
                  <el-table
                    stripe
                    style="margin-top: 12px;"
                    :header-cell-style="headerRowStyle"
                    :data="supProductTable"
                    empty-text="请选择至少一个服务或产品"
                  >
                    <el-table-column show-overflow-tooltip prop="goodsName" label="产品名称"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="specificationName" label="规格"></el-table-column>
                    <el-table-column prop="shopPrice" label="专柜价">
                      <template slot-scope="scope">￥{{scope.row.shopPrice}}</template>
                    </el-table-column>
                    <el-table-column label="体验价">
                      <template slot-scope="scope">
                        <el-form-item
                          :prop="'productSpecificationList.'+ scope.$index + '.experiencePrice'"
                        >
                          <el-input
                            :disabled="entry === 'detail'"
                            :maxlength="8"
                            step="0.1"
                            type="number"
                            min="0"
                            v-model="supProductTable[scope.$index].experiencePrice"
                            class="count-input"
                            size="small"
                          >
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" v-if="entry === 'add'">
                      <template slot-scope="scope">
                        <i
                          class="icon iconfont icon-icon_operate_delete"
                          @click="delSelectedProduct(scope.$index)"
                        ></i>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @current-change="handleCurrentChangeProduct"
                    :current-page="productListPageNum"
                    :page-size="4"
                    layout="total, prev, pager, next"
                    :total="form.productSpecificationList.length"
                  ></el-pagination>
                </div>
              </div>
            </div>
            <!-- 优惠价格冲突 -->
            <div class="form-line">
              <div class="form-title">
                <span class="xing">优惠同享</span>
              </div>
              <div class="form-con">
                <el-form-item style="margin-bottom: 5px;">
                  <el-checkbox checked disabled>不可与红包同享</el-checkbox>
                </el-form-item>
                <el-form-item>
                  <el-checkbox checked disabled>不可与优惠券同享</el-checkbox>
                </el-form-item>
              </div>
            </div>
            <!-- 活动门店 -->
            <div class="form-line" v-if="currentEntry === 'brand'">
              <div class="form-title">
                <span class="xing">活动门店</span>
              </div>
              <div class="form-con">
                <el-form-item prop="activityStore" :rules="{required: true}">
                  <el-radio v-model="form.activityStore" :label="true">全部门店</el-radio>
                  <el-radio v-model="form.activityStore" :label="false">
                    指定门店&nbsp;
                    <el-button plain class="plain_blue_btn" @click="visable_service=true">选择门店</el-button>
                  </el-radio>
                </el-form-item>
              </div>
            </div>
            <!-- 按钮 -->
            <div class="form-line">
              <div class="form-title"></div>
              <div class="form-con">
                <el-button class="normal_blue_btn" @click="createActivity" v-if="entry === 'add'">确定</el-button>
                <el-button plain class="plain_gray_btn" @click="cancal">返回</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <serviceDialog
      v-if="visable_service"
      :visible="visable_service"
      @close="visable_service=false"
      @suberData="getServiceDataFromSuber"
      :superCheckedGoods="selectedServicesIds"
    />
    <productDialog
      v-if="visable_product"
      :visible="visable_product"
      @close="visable_product=false"
      @suberData="getProductDataFromSuber"
      :superCheckedGoods="selectedProductsIds"
    />
    <!-- 冲突服务对话框 -->
    <el-dialog title="冲突活动、产品信息" :visible.sync="conflictDialogVisible" width="40%">
      <el-table :data="conflict" style="width: 100%">
        <el-table-column label="类型">
          <template slot-scope="scope">
            <p v-if="scope.row.goodsType === 'production'">产品</p>
            <p v-else>服务</p>
          </template>
        </el-table-column>
        <el-table-column prop="specificationName" label="规格"></el-table-column>
        <el-table-column prop="goodsName" label="服务、产品名称"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="conflictDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import productDialog from "./components/productsDialog";
import serviceDialog from "./components/serviceDialog";
import { reg, checkReg } from "@/assets/js/RegExp";
import * as utils from "@/assets/js/utils";
export default {
  data() {
    return {
      // 冲突活动对话框标识
      conflictDialogVisible: false,
      // 冲突信息数据
      conflict: [],
      // 来自
      entry: null,
      headerRowStyle: { background: "#f4f5f7" }, // 表头样式
      activityTime: null, //活动时间
      // 服务列表当前页码
      serveListPageNum: 1,
      // 产品列表当前页码
      productListPageNum: 1,
      form: {
        id: null, // 编辑或修改时的活动id
        activityName: "", // 活动名称
        activityFor: "new_customer", // 活动针对客户群体
        activityScope: "only_online", // 适用场景 线上线下
        limitBuyTimes: 1, // 客户前X次消费可享受体验价
        activityStore: true, // 活动门店 全部门店
        activityFrom: "", //活动开始时间
        activityTo: "", // 活动结束时间
        serviceSpecificationList: [], // 活动服务信息
        productSpecificationList: [] // 活动产品信息
      },
      supServiceTable: [], // 本页
      supProductTable: [], // 本页
      loading: false,
      // 子组件
      /* 服务选项及选中项 start */
      visable_service: false,
      subServiceTable: [],
      selectedServices: [],
      selectedServicesIds: new Set(),
      selectedServicesObj: {},
      /* 服务选项及选中项 end */
      /* 产品选项及选中项 start */
      visable_product: false,
      subProductTable: [],
      selectedProducts: [],
      selectedProductsIds: new Set(),
      selectedProductsObj: {},
      /* 产品选项及选中项 end */
      // 表单校验规则
      rules: {
        activityName: [
          { validator: this.validateActivityName, trigger: "blur" }
        ],
        activityTime: [
          { validator: this.validateActivityTime, trigger: "change" }
        ],
        limitBuyTimes: [
          { validator: this.validateLimitBuyTimes, trigger: "blur" }
        ],
        experiencePrice: [
          { validator: this.validateLimitBuyTimes, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.entry = this.$route.path.substr(27);
    this.form.id = this.$route.query.id ? this.$route.query.id : null;
    if (this.entry === "detail") {
      this.getactivityDetail();
    }
  },
  methods: {
    // ------------------------------- 校验 ------------------------------
    // 校验活动名称
    validateActivityName(rule, value, callback) {
      if (value == "") {
        return callback(new Error("活动名称不能为空"));
      } else if (value.length > 16) {
        return callback(new Error("活动名称不能大于16位"));
      } else {
        callback();
      }
    },
    // 校验活动时间
    validateActivityTime(rule, value, callback) {
      if (!this.form.activityFrom || !this.form.activityTo) {
        return callback(new Error("请选择活动时间范围"));
      } else {
        callback();
      }
    },
    // 校验限购次数
    validateLimitBuyTimes(rule, value, callback) {
      if (!value) {
        return callback(new Error("请选择活动限制次数"));
      } else {
        callback();
      }
    },
    // 服务/产品体验价校验规则 在create事件中与表单预校验区分
    // validateExperiencePrice(rule, value, callback) {
    //   if (!value) {
    //     return callback(new Error("请输入体验价"));
    //   } else {
    //     callback();
    //   }
    // },
    // ------------------------------- 校验 ------------------------------
    // 活动时间选择事件
    handleTimeChange(val) {
      if (val) {
        this.form.activityFrom = val[0];
        this.form.activityTo = val[1];
      } else {
        this.form.activityFrom = "";
        this.form.activityTo = "";
      }
    },
    // 服务/产品分页事件堆
    handleCurrentChangeServe(index) {
      index = index <= 0 ? 1 : index;
      this.serveListPageNum = index;
      this.supServiceTable = this.showServeNum(
        this.form.serviceSpecificationList,
        this.supServiceTable,
        index - 1
      );
    },
    handleCurrentChangeProduct(index) {
      index = index <= 0 ? 1 : index;
      this.productListPageNum = index;
      this.supProductTable = this.showServeNum(
        this.form.productSpecificationList,
        this.supProductTable,
        index - 1
      );
    },
    // 确定添加活动事件
    createActivity() {
      // 做参数
      this.form.activityStatus = null;
      this.form.orderCount = null;
      this.form.storeId = this.currentInfo.shopId;
      this.form.storeName = this.currentInfo.shopName;
      // 门店端体验价暂时删除 activityStore
      delete this.form["activityStore"];
      this.form.serviceSpecificationList.forEach(item => {
        item.goodsType = "service";
        if (item.serviceId) {
          item.goodsId = item.serviceId;
          delete item["serviceId"];
        }
        if (item.specificationId) {
          item.goodsSpecificationId = item.specificationId;
          // specificationId 不能进行删除
        }
        delete item["groupPrice"];
        delete item["cashReward"];
        delete item["cost"];
        delete item["minMemberPrice"];
        delete item["maxMemberPrice"];
        delete item["stock"];
        delete item["serviceName"];
        delete item["sortLevelOne"];
        delete item["sortLevelTwo"];
        delete item["productCostId"];
        delete item["serverCostId"];
        delete item["performanceCost"];
        delete item["performanceServer"];
        delete item["performanceAssistant"];
      });
      this.form.productSpecificationList.forEach(item => {
        if (item.specificationId) {
          item.goodsSpecificationId = item.specificationId;
        }
        delete item["groupPrice"];
        delete item["cashReward"];
        delete item["cost"];
        delete item["minMemberPrice"];
        delete item["maxMemberPrice"];
        delete item["stock"];
      });
      // 完成！
      // 表单预校验
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        // 服务产品校验
        if (
          !this.form.serviceSpecificationList.length &&
          !this.form.productSpecificationList.length
        ) {
          return this.$message.error("请选择至少一个服务或产品");
        }
        // 验证所选服务产品的体验价
        let serveExpFlag = this.form.serviceSpecificationList.every(item => {
          return item.experiencePrice;
        });
        let productExpFlag = this.form.productSpecificationList.every(item => {
          return item.experiencePrice;
        });
        if (!(serveExpFlag && productExpFlag)) {
          return this.$message.error("请填写所有产品或服务的体验价");
        }
        // 先验证指定的时间内是否有已经重复的服务或产品活动
        const resValid = await axios.post(`/validateActivityTime`, {
          activityFrom: this.form.activityFrom,
          activityTo: this.form.activityTo,
          storeId: this.form.storeId,
          productGoodsSpecificationList: this.form.productSpecificationList,
          serviceGoodsSpecificationList: this.form.serviceSpecificationList
        });
        if (!resValid.available) {
          // 打开冲突信息对话框
          this.conflictDialogVisible = true;
          this.conflict = resValid.conflictActivityInfoList;
          return this.$message.error(`该时间段有服务或产品已经参与活动了`);
        }
        // 发送添加活动请求
        const res = await axios.post("/saveExperienceActivity", this.form);
        if (res.success) this.$message.success("创建新体验价活动成功");
        // 页面回跳 // 模拟返回
        this.cancal();
      });
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
      this.form.serviceSpecificationList = Object.values(
        this.selectedServicesObj
      );
      // this.supServiceTable = Object.values(this.selectedServicesObj);
      this.handleCurrentChangeServe(1)
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
      let id = this.form.serviceSpecificationList[idx].specificationId;
      this.selectedServicesIds.delete(id);
      delete this.selectedServicesObj[id];
      this.form.serviceSpecificationList.splice(idx, 1);
      // 删除后表格刷新
      if (this.supServiceTable.length === 1) {
        this.handleCurrentChangeServe(this.serveListPageNum - 1);
      } else {
        this.handleCurrentChangeServe(this.serveListPageNum);
      }
      console.log(this.selectedServicesObj)
      console.log(this.selectedServicesIds)
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
      this.form.productSpecificationList = Object.values(
        this.selectedProductsObj
      );
      // this.supServiceTable = Object.values(this.selectedProductsObj);
      this.handleCurrentChangeProduct(1)
    },
    // - 删除产品
    delSelectedProduct(idx) {
      // 注意此idx要结合页码
      idx = idx + 4 * (this.productListPageNum - 1);
      let id = this.form.productSpecificationList[idx].specificationId;
      this.selectedProductsIds.delete(id);
      delete this.selectedProductsObj[id];
      this.form.productSpecificationList.splice(idx, 1);
      // 删除后表格刷新
      if (this.supProductTable.length === 1) {
        this.handleCurrentChangeProduct(this.productListPageNum - 1);
      } else {
        this.handleCurrentChangeProduct(this.productListPageNum);
      }
    },
    cancal() {
      this.$router.go(-1);
    },
    // 获取活动详情 -- 点击详情进入时调用
    async getactivityDetail() {
      const res = await axios.get(
        `/getExperienceActivityDetail/${this.form.id}`
      );
      // 赋值详情信息
      this.form.activityName = res.activityName;
      this.activityTime = [res.activityFrom, res.activityTo];
      this.form.productSpecificationList = res.productSpecificationList;
      this.form.serviceSpecificationList = res.serviceSpecificationList;
      this.supProductTable = this.showServeNum(
        this.form.productSpecificationList,
        this.supProductTable,
        0
      );
      this.supServiceTable = this.showServeNum(
        this.form.serviceSpecificationList,
        this.supServiceTable,
        0
      );
    }
  },
  watch: {},
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    // 活动页面title
    activityTitle() {
      switch (this.entry) {
        case "add":
          return "新增体验价";
        case "edit":
          return "体验价编辑";
        default:
          return "体验价详情";
      }
    }
  },
  components: { productDialog, serviceDialog }
};
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
.shop-create-group-buy-main {
  display: flex;
  justify-content: center;
  .create-group-buy-main-box {
    width: calc(100vw - 40px);
    height: calc(100vh - 105px);
    padding: 0 20px 20px;
    margin-top: 85px;
    overflow-y: auto;
  }
  .group-buy-container {
    min-height: calc(100vh - 105px);
  }
  .group-buy-body {
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

.plain_blue_btn {
  padding: 9px;
}
.normal_blue_btn {
  padding: 12px 37px;
}
.table-box {
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

.time-card-limit-line {
  display: flex;
}

.count-input {
  width: 120px;
  .el-input__inner {
    transform: translateY(20px);
  }
}

.el-pagination {
  margin-top: 10px;
}
</style>
