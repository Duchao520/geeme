<template>
  <div id="gm_service_order" class="service_list_condition-con">
    <div class="service_list_condition">
      <div class="condition-left">
        <div class="label_area">
          <div class="head-first-line">
            <el-radio-group
              v-model="channelScope"
              style="margin-bottom:12px;"
              @change="changeChannelScope"
            >
              <el-radio-button label="STORE" style="margin-left:0;">门店开单</el-radio-button>
              <el-radio-button label="ONLINE" style="margin-left:0;">线上订单</el-radio-button>
            </el-radio-group>
            <input-search
              width="280px"
              placeholder="订单号/客户姓名/手机号"
              v-model="orderListsParams.keywords"
              @search="getProductOrderList(true)"
            ></input-search>
          </div>
          <div class="head-second-line">
            <span class="orderTime" v-if="isBrand">所属门店：</span>
            <el-select v-model="pitchStoreId" placeholder="请选择" v-if="isBrand">
              <el-option
                v-for="item in storeOptions"
                :key="item.storeId"
                :label="item.storeName"
                :value="item.storeId"
              ></el-option>
            </el-select>
            <span class="orderTime" style="margin-left: 10px;">下单时间：</span>
            <el-radio-group v-model="timeLimit">
              <el-radio-button
                v-for="(item,index) in [{value:'all',name:'全部'},{value:'threeDay',name:'近3天'},{value:'sevenDay',name:'近7天'}]"
                :key="index"
                :label="item.value"
                style="margin-left:0;"
              >{{item.name}}</el-radio-button>
            </el-radio-group>
            <el-date-picker
              style="margin-left:10px;"
              v-model="timeLimit"
              :clearable="false"
              unlink-panels
              type="datetimerange"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="data-static" v-loading="staticLoad">
      <p class="static-text">统计</p>
      <div class="sort-title">
        <span class="span_1">客户数：</span>
        <span class="span_2">{{staticData.customerCount || 0}}</span>
      </div>
      <div class="sort-title">
        <span class="span_1">订单数：</span>
        <span class="span_2">{{staticData.orderCount || 0}}</span>
      </div>
      <div class="sort-title">
        <span class="span_1">产品数：</span>
        <span class="span_2">{{staticData.goodsCount || 0}}</span>
      </div>
      <div class="sort-title">
        <span class="span_1">订单金额：</span>
        <span class="span_2">{{'￥' + (staticData.totalAmount || '0.00')}}</span>
      </div>
    </div>

    <!-- 列表数据 -->
    <div class="service_container container_normal" v-loading="tableLoading" style="margin-top:10px;">
      <div class="user-defined-tab">
        <el-tabs type="card" v-model="status">
          <el-tab-pane
            v-for="(item, index) in orderStatus[channelScope]"
            :key="index+Math.random()"
            :name="item.code"
            :label="item.value"
            v-model="status"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="table_container">
        <div class="table-wrapper">
          <table cellspacing="0" cellpadding="0" class="table">
            <tr class="thead">
              <th class="align_left">产品项目</th>
              <th>专柜价</th>
              <th>数量</th>
              <th>金额</th>
              <th>实收款</th>
              <th>客户</th>
              <th>销售人</th>
              <th>发货方式</th>
              <th class="status-th">状态</th>
            </tr>
            <tbody v-for="(order, index) in productOrderList" :key="index+Math.random()">
              <tr class="tr-title">
                <td colspan="9" class="td-title align_left">
                  <div style="display:flex;align-items: center">
                    <i class="icon iconfont icon-icon_tag_online icon_top__" v-if="order.channel"></i>
                    <i class="icon iconfont icon-icon_top_store icon_top__" v-if="!order.channel"></i>
                    <span style="margin:0 20px 0 5px;">{{order.channel?'线上订单':'门店开单'}}</span>
                    <span>订单号：{{order.code}}</span>
                    <span style="margin:0 15px;">{{order.createTime}}</span>
                    <span
                      v-if="isBrand"
                    >下单门店：{{currentShopInfo.brandName}}&nbsp;&nbsp;{{order.storeName}}</span>
                  </div>
                  <!-- <span style="float:right" v-if="order.customerNote">客户备注：{{order.customerNote}}</span> -->
                </td>
              </tr>
              <tr class="tr-list">
                <td class="tr-detail">
                  <img
                    :src="utils.formatPicImage(order.cycleImage, 'style', 146, 'someone')"
                    alt="图片"
                  />
                  <div class="img-tag" v-if="order.wholesale">拼</div>
                  <div class="goods-detail">
                    <p class="service-name">{{order.title}}</p>
                    <p class="servicer">{{order.specificationName?order.specificationName:'默认'}}</p>
                  </div>
                </td>
                <td class="border-left-no">
                  <div class="price-detail">
                    <p class="now-price">￥{{order.shopPrice}}</p>
                    <!-- <p class="original-price">￥{{order.shopPrice}}</p> -->
                  </div>
                </td>
                <td class="border-left-no">X{{order.amogetConsumerOrderPerformanceListunt}}</td>
                <td class="border-left-no">￥{{order.amount * order.shopPrice}}</td>
                <td class="border-left-no two-lines">
                  <p class="top-text" style="color:#FF6D61">￥{{order.received}}</p>
                  <p class="bottom-text" style="color:#41CAC0">{{order.payway}}</p>
                </td>
                <td class="border-left-no two-lines">
                  <p class="top-text">{{order.customerName}}</p>
                  <p class="bottom-text">{{order.customerPhone}}</p>
                </td>
                <td class="border-left-no sale-staff-box">
                  <div class="sale-staff" v-if="order.salesMan&&order.salesMan.length>0">
                    <!-- 销售人是数值字符串 无法显示店内编号 -->
                    <p
                      class="sale-staffs"
                      v-for="(name,index) in order.salesMan.length>=3?order.salesMan.slice(0,2):order.salesMan"
                      :key="index"
                    >{{name}}</p>
                    <p
                      class="sale-staffs"
                      style="color:#58C9F3"
                      v-if="order.salesMan&&order.salesMan.length>3"
                      :title="order.salesMan.join(',')"
                    >更多</p>
                  </div>
                  <p class="sale-staff" v-else>无</p>
                </td>
                <td class="border-left-no">
                  <span>{{order.selfPickUp?"门店自提":"物流配送"}}</span>
                </td>
                <td class="border-left-no detail-status">
                  <status-btn :status="order.productOrderStatus"></status-btn>
                  <p class="orderDetail" @click="toDetail(order)">订单详情</p>
                </td>
              </tr>
              <tr class="tr_btns">
                <td colspan="9">
                  <div class="line-btns">
                    <div class="status-time">
                      <status-with-time :detail="order"></status-with-time>
                    </div>
                    <div>
                      <order-btns
                        :detail="order"
                        environment="product"
                        @remark="startRemark(order)"
                        @readComment="readComment(order)"
                        @delete_="delete_"
                        @refuseRefund="refuseRefund(order)"
                        @refund="handleRefund"
                        @afterSale="afterSaleService(order)"
                        @deliver-goods="deliverGoods(order)"
                        @changePrice="changePrice(order)"
                      ></order-btns>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="interval_tr" v-if="index!==productOrderList.length-1"></tr>
            </tbody>
            <tr>
              <td colspan="9">
                <order-default-text
                  v-if="productOrderList&&productOrderList.length===0 || !productOrderList"
                ></order-default-text>
              </td>
            </tr>
          </table>
        </div>

        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="orderListsParams.currentPage"
          :page-size="orderListsParams.pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 备注 -->
    <btn-remark
      ref="btnRemark"
      @confirmRemark="submitDesc"
      :btnReamrkVisible="showRemarkModel"
      @closeRemark="showRemarkModel=false"
    ></btn-remark>
    <!-- 改价弹框 -->
    <btn-change-price
      :visible="showBtnChangePrice"
      :oldPrice="changePriceInfo ? changePriceInfo.oldPrice : 0"
      @close="showBtnChangePrice=false"
      @confirm="confirmChangePrice"
    ></btn-change-price>
    <!-- 拒绝退款 -->
    <refuse-refund
      v-if="refuseRefundModel"
      :visible="refuseRefundModel"
      :id="currentOrderInfo.detail.id"
      @close="refuseRefundModel = false"
      @confirmRefuse="salerRejectRefundOrder"
    ></refuse-refund>
    <!-- 评价详情 -->
    <read-assessment
      ref="readAssessment"
      goodsType="production"
      v-if="readAssessmentVisible"
      @confirm="replyAssessment"
      @open="readAssessmentVisible=true"
      @close="readAssessmentVisible=false"
      :readAssessmentVisible="readAssessmentVisible"
    ></read-assessment>
    <!-- 删除订单 -->
    <del-model
      v-if="deleteModel"
      title="确定删除吗？"
      iconColor="#FF6D61"
      @close="deleteModel=false"
      icon="icon_popup_question"
      @confirm="confirmDeleteModel"
      :delTagDialogVisible="deleteModel"
      content="订单删除后，用户移动端“产品订单”中，不会同步删除。"
    ></del-model>
    <!-- 退款 -->
    <v-refund
      ref="refund"
      v-if="showRefund"
      :visible="showRefund"
      @close="showRefund = false"
      @confirmRefund="confirmRefund"
      :id="currentOrderInfo.detail.id"
      :applyRefundMoney="currentOrderInfo.detail.applyRefundMoney"
    ></v-refund>
    <!-- 售后 -->
    <after-sales-service
      v-if="showAfterSalesServiceModel"
      :afterSaleDetail="afterSaleDetail"
      @handleSalesService="closeModelAndRefresh"
      @close="showAfterSalesServiceModel = false"
      :showAfterSalesServiceModel="showAfterSalesServiceModel"
    ></after-sales-service>
    <!-- 线上订单物流发货 -->
    <deliver-goods-model
      v-bind="currentOrder"
      v-if="deliverGoodsModelVisible"
      :visible="deliverGoodsModelVisible"
      @afterDeliverGoods="afterDeliverGoods"
      @close="deliverGoodsModelVisible = false"
    ></deliver-goods-model>
    <!-- 线下订单物流发货 -->
    <deliver-offline-order-goods
      :id="currentOrder.id"
      v-if="offlineOrderDialogVisible"
      :visible="offlineOrderDialogVisible"
      @sendGoods="handleSendOfflineOrderGoods"
      @close="offlineOrderDialogVisible = false"
    />
  </div>
</template>

<script>
import "@/assets/css/base.scss";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import BtnRemark from "@/components/orderManagement/BtnRemark";
import BtnChangePrice from "@/components/orderManagement/BtnChangePrice";
import StatusBtn from "@/components/orderManagement/StatusBtn";
import OrderBtns from "@/components/orderManagement/OrderBtns";
import RefuseRefund from "@/components/orderManagement/RefuseRefund";
import Refund from "@/components/orderManagement/Refund";
import AfterSalesService from "@/components/orderManagement/AfterSalesService";
import StatusWithTime from "@/components/orderManagement/StatusWithTime";
import ReadAssessment from "@/components/orderManagement/ReadAssessment";
import OrderDefaultText from "@/components/order/OrderDefaultText";
import DeliverGoodsModel from "@/components/orderManagement/DeliverGoodsModel";
import DeliverOfflineOrderGoods from "@/components/orderManagement/DeliverOfflineOrderGoods";
import "@/assets/css/tab.scss";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    BtnChangePrice,
    BtnRemark,
    StatusBtn,
    OrderBtns,
    RefuseRefund,
    "v-refund": Refund,
    AfterSalesService,
    StatusWithTime,
    ReadAssessment,
    OrderDefaultText,
    DeliverGoodsModel,
    DeliverOfflineOrderGoods
  },
  data() {
    return {
      utils,
      pitchStoreId: null,
      // 门店列表
      storeOptions: [],
      showRemarkModel: false,
      deleteModel: false,
      showRefund: false,
      showBtnChangePrice: false,
      deliverGoodsModelVisible: false,
      refuseRefundModel: false,
      showAfterSalesServiceModel: false,
      readAssessmentVisible: false,
      tableLoading: false,
      currentOrderInfo: {
        id: null,
        frontDeskRemark: "",
        detail: {}
      },
      currentOrder: {},
      timeLimit: "all",
      shop: "All",
      afterSaleDetail: {
        refund: false,
        refundNotes: [],
        refundPrice: null,
        refundReason: null,
        id: null
      },
      totalCount: 0,
      orderStatus: {
        ONLINE: [
          { code: "ALL", value: "全部" },
          { code: "WAITING_PAY", value: "待付款" },
          { code: "WAITING_DELIVER", value: "待发货" },
          { code: "WAITING_CONFIRM", value: "待收货" },
          { code: "WAITING_ASSESSMENT", value: "待评价" },
          { code: "COMPLETED", value: "已完成" },
          { code: "CLOSED", value: "已关闭" },
          { code: "GROUP_BUY_WAIT", value: "待拼单" },
          { code: "REFUNDING_OR_AFTER_SALES", value: "退款/售后" }
        ],
        STORE: [
          { code: "ALL", value: "全部" },
          { code: "WAITING_ASSESSMENT", value: "待评价" },
          { code: "COMPLETED", value: "已完成" },
          { code: "REFUNDING_OR_AFTER_SALES", value: "售后" }
        ]
      },
      productOrderList: [],
      orderListsParams: {
        keywords: "",
        currentPage: 1,
        pageSize: 20
      },
      status: "ALL",
      channelScope: "STORE", // STORE ,  ONLINE
      offlineOrderDialogVisible: false, // 线下订单物流发送对话框
      changePriceInfo: null, // 改价信息
      staticData: {},
      staticLoad: false
    };
  },
  computed: {
    ...mapState({
      shopStaffsInfo: state => state.shopStaffsInfo.infoMap // -员工编号
    }),
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    params() {
      let param = this.orderListsParams;
      let start, end;
      if (Array.isArray(this.timeLimit)) {
        end = start = this.timeLimit[1];
        start = this.timeLimit[0];
      } else {
        end = utils.getZeroTime(1);
        switch (this.timeLimit) {
          case "threeDay":
            start = utils.getZeroTime(-2);
            break;
          case "sevenDay":
            start = utils.getZeroTime(-6);
            break;
          case "all":
            start = "2019-01-01 00:00:00";
            break;
          case null:
            start = "2019-01-01 00:00:00";
            break;
        }
      }
      return {
        ...param,
        currentPage: this.orderListsParams.currentPage - 1,
        storeId: this.isBrand ? this.pitchStoreId : this.currentInfo.shopId,
        brandId: this.isBrand ? this.currentInfo.brandId : null,
        start,
        end,
        online: this.channelScope === "ONLINE",
        status: this.status
      };
    },
    // 品牌标识
    isBrand() {
      return this.$route.path.indexOf("brand") !== -1;
    },
    currentShopInfo() {
      return this.$store.state.manage.currentShopInfo;
    }
  },
  watch: {
    status() {
      this.getProductOrderList();
    },
    channelScope() {
      this.getProductOrderList();
    },
    timeLimit() {
      this.getProductOrderList();
      this.getDataStatic()
    },
    pitchStoreId(val) {
      this.getDataStatic();
      this.handleCurrentChange(1);
    }
  },
  mounted() {
    this.getDataStatic()
    this.getStores();
    let code = this.$route.query.shortcut;
    if (code) {
      this.status = code;
      if (code === "WAITING_DELIVER") {
        this.channelScope = "ONLINE";
      }
    }
    this.getProductOrderList();
  },
  methods: {
    ...mapActions([
      "setStaffsInfo" // - 员工的店内编号
    ]),
    // 获取门店列表
    getStores() {
      axios
        .get(`/getStoreListByBrandId/${this.currentInfo.brandId}`)
        .then(res => {
          this.storeOptions = res.storeBasicInfoList || [];
          this.storeOptions.unshift({
            storeId: null,
            storeName: "全部"
          });
        });
    },
    // 获取统计数据
    async getDataStatic() {
      this.staticLoad = true
      try {
        let params = {
          beginDay: this.params.start,
          brandId: this.currentInfo.brandId,
          goodsType: 2,
          cardType: -1,
          endDay: this.params.end,
          orderSource: this.params.online ? 1 : 0,
          storeId: this.params.storeId
        };
        const res = await axios.post("/getOrderSumInfo", params);
        this.staticData = res;
      } finally {
      this.staticLoad = false
      }
    },
    startRemark(data) {
      this.showRemarkModel = true;
      this.currentOrderInfo.id = data.id;
      this.$refs.btnRemark.remark = data.salerNote;
    },
    handleRefund(data) {
      this.showRefund = true;
      this.currentOrderInfo.id = data.id;
      this.currentOrderInfo.detail = data;
      axios.get("/salerStartHandleRefundOrder/" + data.id);
    },
    getProductOrderList() {
      this.tableLoading = true;
      setTimeout(() => {
        axios.post("/getProductOrderByMultiParam", this.params).then(res => {
          this.getProductOrderListRes(res);
        });
      }, 300);
    },
    getProductOrderListRes(res) {
      this.totalCount = res.totalElements;
      this.productOrderList = res.productOrderESInfoList;
      this.tableLoading = false;
    },
    changeChannelScope() {
      this.status = this.orderStatus[this.channelScope].map(item => {
        return item.code;
      })[0];
      this.getDataStatic();
    },
    submitDesc(note) {
      axios
        .post(api.salerModifyProductOrderNote.URL, {
          orderId: this.currentOrderInfo.id,
          note: note
        })
        .then(res => {
          this.getProductOrderList();
          this.showRemarkModel = false;
          this.$message({
            type: res.success ? "success" : "warning",
            message: res.message
          });
        });
    },
    handleCurrentChange(val) {
      this.orderListsParams.currentPage = val;
      this.getProductOrderList();
    },
    refuseRefund(data) {
      this.refuseRefundModel = true;
      this.currentOrderInfo.detail = data;
      axios.get("/salerStartHandleRefundOrder/" + data.id);
    },
    readComment(data) {
      this.$refs.readAssessment.getGoodsOrderAssessmentByOrderId(data.id);
      this.$refs.readAssessment.goodsDetail = {
        image: data.cycleImage,
        goodsName: data.title,
        specificationName: data.specificationName,
        price: data.unitPrice
      };
    },
    delete_(id) {
      this.deleteModel = true;
      this.currentOrderInfo.id = id;
    },
    confirmDeleteModel() {
      axios
        .post("/salerDeleteProductOrder/" + this.currentOrderInfo.id)
        .then(res => {
          this.$message({
            type: res.success ? "success" : "warning",
            message: res.message
          });
          this.deleteModel = false;
        });
    },
    changePrice(data) {
      this.changePriceInfo = {
        orderId: data.id,
        oldPrice: data.received
      };
      this.showBtnChangePrice = true;
    },
    confirmChangePrice(newPrice) {
      axios
        .post("/unPaidOrderChangePrice", {
          goodsTypeScope: "production",
          newPayMoney: newPrice,
          orderId: this.changePriceInfo.orderId
        })
        .then(res => {
          this.changePriceInfo = null;
          this.showBtnChangePrice = false;
          if (res.success) {
            this.$message({
              type: "success",
              message: "改价成功"
            });
            this.getProductOrderList();
          } else {
            this.$message({
              type: "error",
              message: "改价失败"
            });
          }
        });
    },
    confirmRefund(data) {
      axios.post("/salerAgreeRefundOrder", data).then(res => {
        this.showRefund = false;
        this.$message({
          type: res.success ? "success" : "warning",
          message: res.success ? "退款成功" : res.message
        });
        this.getProductOrderList();
        this.$refs.refund.resetForm();
      });
    },
    afterSaleService(data) {
      axios.get("/salerStartHandleRefundOrder/" + data.id);
      axios.get("/getAfterSaleContent/" + data.id).then(res => {
        this.afterSaleDetail = res;
        this.afterSaleDetail.id = data.id;
        this.showAfterSalesServiceModel = true;
      });
    },
    toDetail(data) {
      let position = this.isBrand ? "brand" : "shop";
      let productOrderDetail = this.$router.resolve({
        path: `/${position}-inner/product-order-detail`,
        query: {
          orderDetailType: "product",
          online: data.channel || "", //由于query值会变成字符串（""为false）
          orderId: data.id,
          productOrderType: data.productOrderType
        }
      });
      window.open(productOrderDetail.href, "_blank");
    },
    salerRejectRefundOrder(data) {
      axios
        .post(api.salerRejectRefundOrder.URL, {
          note: data.data.desc,
          refundOrderId: data.id,
          rejectReason: data.data.reason,
          storeId: this.currentInfo.shopId
        })
        .then(res => {
          this.refuseRefundModel = false;
          this.$message({
            type: res.success ? "success" : "warning",
            message: res.success ? "拒绝退款成功" : res.message
          });
          this.getProductOrderList();
        });
    },
    replyAssessment(data) {
      axios.post("/replyAssessment", data).then(res => {
        this.readAssessmentVisible = false;
        this.$message({
          type: res.success ? "success" : "warning",
          message: res.message
        });
      });
    },
    closeModelAndRefresh() {
      this.getProductOrderList();
      this.showAfterSalesServiceModel = false;
    },
    // - 发货
    deliverGoods(data) {
      this.currentOrder = data;
      if (this.channelScope === "ONLINE") {
        // 线上订单-发货
        this.deliverGoodsModelVisible = true;
      } else {
        // 线下订单-发货
        this.offlineOrderDialogVisible = true;
      }
    },
    // 线上订单物流发送
    afterDeliverGoods() {
      this.deliverGoodsModelVisible = false;
      this.getProductOrderList();
    },
    // 线下订单物流发送
    handleSendOfflineOrderGoods(data) {
      axios.post("/productOrderStartDeliverOffLine", data).then(res => {
        this.$message({
          type: res.success ? "success" : "warning",
          message: res.message
        });
        this.offlineOrderDialogVisible = false;
        this.getProductOrderList();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.flex_row {
  display: flex;
  flex-direction: row;
}

.flex_column {
  display: flex;
  flex-direction: column;
}

.flex_column_center {
  @extend .flex_column;
  justify-content: center;
  align-items: center;
}

.flex_row_center {
  @extend .flex_row;
  justify-content: center;
  align-items: center;
}

.service_list_condition-con {
  box-sizing: border-box;
  padding: 20px;
}

.service_list_condition {
  background: white;
  box-sizing: border-box;
  padding: 15px;
  padding-bottom: 5px;
  border-radius: 5px;

  label {
    font-size: 14px;
  }

  .condition-left {
    flex: 1;

    /deep/ .el-radio-button__inner {
      padding: 10px 20px;
    }
  }
}

.service_container {
  border-radius: 8px;
}

.search-default {
  background: #fff;
  display: flex;
  justify-content: center;
  height: calc(100vh - 260px);
}

.border_left {
  border-left: 1px solid #ebebeb;
}

.border_right {
  border-right: 1px solid #ebebeb !important;
}

.border-left-no {
  border-left: none !important;
}

.detail-status.border-left-no {
  text-align: right;
  padding-right: 15px;
}

.two-lines.border-left-no {
  .top-text,
  .bottom-text {
    line-height: 22px;
  }
}

.price-detail {
  font-size: 12px;

  .now-price,
  .original-price {
    line-height: 22px;
  }

  .original-price {
    color: #999999;
    text-decoration: line-through;
  }
}

.align_left {
  text-align: left !important;
}

.top15 {
  margin-top: 15px;
}

.color_yellow {
  color: #e6a23c;
}

.color_green {
  color: #67c23a;
}

.color_grey {
  color: #9b9b9b;
}

.color_blue {
  color: #409eff;
}

.cursor {
  cursor: pointer;
}

.table_container {
  .interval_tr {
    height: 20px;
  }

  margin: 0 20px;

  table {
    width: 100%;
    color: #333333;
    border-collapse: separate;

    .thead {
      height: 52px;
      border-top-left-radius: 15px;
      border-radius: 15px;

      .status-th {
        padding-right: 30px;
        text-align: right;
      }
    }

    th {
      font-size: 14px;
      font-weight: 400;
    }

    td {
      text-align: center;
      font-size: 12px;
      font-weight: 400;
    }

    .tr-title {
      height: 32px;
      background: #dee1e6;
      border: 1px solid #ebebeb;
      color: #9b9b9b;

      .time {
        margin-left: 17px;
        margin-right: 50px;
      }

      .td-title {
        border: 1px solid #ebebeb;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        font-size: 12px;
        padding: 0 15px;

        .icon-icon_top_store {
          display: inline-block;
          background: #00cf82;
        }
      }
    }

    .tr-list {
      td {
        border: 1px solid #ebebeb;
        border-top: none;
        border-right: none;
      }

      td:last-child {
        border-right: 1px solid #ebebeb;
      }

      .tr-detail {
        text-align: left;
        box-sizing: border-box;
        padding: 10px 10px 10px 15px;
        display: flex;
        position: relative;
        img {
          width: 70px;
          height: 70px;
          margin-right: 10px;
        }
        .img-tag {
          position: absolute;
          top: 5px;
          left: 70px;
          background: red;
          color: #fff;
          border-radius: 50%;
          font-size: 12px;
          width: 18px;
          height: 18px;
          line-height: 18px;
          text-align: center;
        }
        .goods-detail {
          max-width: 240px;
          font-size: 12px;

          .service-name {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          .servicer {
            color: #999999;
            font-size: 12px;
            line-height: 24px;
          }
        }
      }
    }

    .tr_btns {
      height: 48px;

      td {
        border: 1px solid #ebebeb;
        border-top: none;

        .line-btns {
          width: 100%;
          display: flex;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 0 10px;

          div {
            display: flex;
          }
        }

        .el-button {
          width: 62px;
          height: 28px;
          line-height: 28px;
          padding: 0;
          font-size: 12px;
        }
      }
    }
  }

  .red_tip {
    position: relative;

    img {
      position: absolute;
      width: 8px;
      height: 8px;
      margin-left: -4px;
    }
  }
}

.el-pagination {
  padding-right: 20px;
  box-sizing: border-box;
  margin: 20px 0;
}

.orderTime {
  font-size: 14px;
  color: rgb(51, 51, 51);
}

.head-first-line {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.head-second-line {
  display: flex;
  align-items: center;

  /deep/ .el-input__icon,
  /deep/ .el-input__inner {
    height: 36px;
    line-height: 36px;

    .el-range-separator {
      line-height: 28px;
    }
  }
}

.icon_top__ {
  color: white;
  background: #58c9f3;
  display: inline-block;
  box-sizing: border-box;
  padding: 2px;
  width: 17px;
  height: 17px;
  font-size: 8px;
  border-radius: 3px;
}

.sale-staff {
  line-height: 1;
  margin: 10px 0;
}

.sale-staffs {
  display: block;
  line-height: 22px;
}

.orderDetail {
  line-height: 12px;
  color: #58c9f3;
  cursor: pointer;
}

.invitationModel {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  .invitation {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.status-time {
  line-height: 10px;
  line-height: 30px;
  color: #999999;

  span {
    margin-right: 10px;
  }
}

.data-static {
  margin-top: 10px;
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background-color: #fff;
  .static-text {
    padding: 5px 14px;
    background-color: #58c9f3;
    color: #fff;
    border-radius: 3px;
    font-size: 13px;
    text-align: center;
    line-height: 15px;
    margin-right: 20px;
  }
  .sort-title {
    font-size: 14px;
    margin-right: 20px;
    .span_1 {
      color: #B2B2B2;
    }
    .span_2 {
      color: #353535;
    }
  }
}
</style>
