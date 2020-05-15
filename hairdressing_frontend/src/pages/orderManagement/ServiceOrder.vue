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
            <!-- 右侧搜索 -->
            <input-search
              width="280px"
              placeholder="订单号/客户姓名/手机号"
              v-model="orderListsParams.keyword"
              @search="getListOrderList(true)"
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
              <el-radio-button label="all" style="margin-left:0;">全部</el-radio-button>
              <el-radio-button label="threeDay" style="margin-left:0;">近3天</el-radio-button>
              <el-radio-button label="sevenDay" style="margin-left:0;">近7天</el-radio-button>
            </el-radio-group>
            <el-date-picker
              :clearable="false"
              style="margin-left:10px;"
              v-model="timeLimit"
              unlink-panels
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
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
        <span class="span_1">服务项目数：</span>
        <span class="span_2">{{staticData.goodsCount || 0}}</span>
      </div>
      <div class="sort-title">
        <span class="span_1">订单金额：</span>
        <span class="span_2">{{'￥' + (staticData.totalAmount || '0.00')}}</span>
      </div>
    </div>

    <!-- 列表数据 -->
    <div
      class="service_container container_normal"
      v-loading="tableLoading"
      style="margin-top: 10px;"
    >
      <div class="user-defined-tab">
        <el-tabs type="card" v-model="status">
          <el-tab-pane
            v-for="(item, index) in orderStatus[channelScope]"
            :key="index+Math.random()"
            :name="item.code"
            :label="item.value"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="table_container">
        <div class="table-wrapper">
          <table cellspacing="0" cellpadding="0" class="table table-list">
            <tr class="thead">
              <th class="align-left">服务项目</th>
              <th>门店价</th>
              <th>数量</th>
              <th>金额</th>
              <th>实收款</th>
              <th>客户</th>
              <th>服务者</th>
              <th class="th-status">状态</th>
            </tr>
            <tbody v-for="(order, index) in tableData" :key="index+Math.random()" class="tbody">
              <tr class="tr-top-line">
                <td colspan="8" class="td-tltle align-left">
                  <i class="icon iconfont icon-icon_tag_online icon_top__" v-if="order.online"></i>
                  <i class="icon iconfont icon-icon_top_store icon_top__" v-if="!order.online"></i>
                  <span style="margin:0 20px 0 0;">{{order.online?'线上订单':'门店开单'}}</span>
                  <span>订单号：{{order.serialCode}}</span>
                  <span style="margin:0 15px;">{{order.orderTime}}</span>
                  <span
                    v-if="isBrand"
                  >下单门店：{{currentShopInfo.brandName}}&nbsp;&nbsp;{{order.storeName}}</span>
                  <!-- <span class="td_remark over" v-if="order.customerNote">备注：{{order.customerNote}}</span> -->
                </td>
              </tr>
              <tr class="tr-content">
                <td class="tr-detail">
                  <img
                    :src="utils.formatPicImage(order.serviceInfoForOrder.image, 'style', 146, 'someone')"
                    alt="图片"
                  />
                  <div class="img-tag" v-if="order.wholesale">拼</div>
                  <div class="goods-detail">
                    <p class="service-name">{{order.serviceInfoForOrder.serviceName}}</p>
                    <p
                      class="servicer"
                    >{{order.serviceInfoForOrder.specificationName || '默认'}}&nbsp;&nbsp;{{order.serviceInfoForOrder.serverTime}}分钟</p>
                  </div>
                </td>
                <td class="border_left_no">￥{{order.serviceInfoForOrder.storePrice}}</td>
                <td class="border_left_no">X{{order.serviceInfoForOrder.count}}</td>
                <td
                  class="border_left_no"
                >￥{{order.serviceInfoForOrder.storePrice*order.serviceInfoForOrder.count}}</td>
                <td class="border_left_no customer-money">
                  <p style="color:#FF6D61" class="top-text">￥{{order.received}}</p>
                  <p
                    :style="{color:order.receiveType!=='会员卡'?'#41CAC0':'#FCB332'}"
                    class="bottom-text"
                  >{{order.payType}}</p>
                </td>
                <td class="border_left_no customer-money">
                  <p class="top-text">{{order.customerName}}</p>
                  <p class="bottom-text">{{order.mobile}}</p>
                </td>
                <!-- 服务者 -->
                <td class="border_left_no customer-money">
                  <!-- <p class="top-text">{{order.staffName || '未选服务者'}}</p> -->
                  <p>工位1: {{(order.stationOne||[]).map(i=>{return `${i.staffName} ${shopStaffsInfo[i.staffId] ? `(${shopStaffsInfo[i.staffId]})` : ''}`}).join('、') || '--'}}</p>
                  <p>工位2: {{(order.stationTwo||[]).map(i=>{return `${i.staffName} ${shopStaffsInfo[i.staffId] ? `(${shopStaffsInfo[i.staffId]})` : ''}`}).join('、') || '--'}}</p>
                  <p>工位3: {{(order.stationThree||[]).map(i=>{return `${i.staffName} ${shopStaffsInfo[i.staffId] ? `(${shopStaffsInfo[i.staffId]})` : ''}`}).join('、') || '--'}}</p>
                </td>
                <td class="border_left_no order-deatil" style="border-right:1px solid #ebebeb;">
                  <status-btn :status="order.orderStatus"></status-btn>
                  <p @click="goToDetail(order)" class="link">订单详情</p>
                </td>
              </tr>
              <tr class="tr_btns">
                <td colspan="8">
                  <div class="line-btns">
                    <div
                      style="line-height:10px;line-height:30px;color:#999999"
                      class="status_time"
                    >
                      <order-status-span :detail="order"></order-status-span>
                    </div>
                    <div>
                      <order-btns
                        environment="service"
                        :detail="order"
                        @remark="beginRemark(order)"
                        @readComment="readComment(order)"
                        @delete_="delete_(order)"
                        @refuseRefund="refuseRefund(order)"
                        @refund="handleRefund(order)"
                        @afterSale="afterSaleService(order)"
                        @changePrice="changePrice(order)"
                      ></order-btns>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="interval_tr" v-if="index<tableData.length - 1"></tr>
            </tbody>
            <tr>
              <td colspan="8">
                <order-default-text v-if="tableData&&tableData.length===0 || !tableData"></order-default-text>
              </td>
            </tr>
          </table>
        </div>

        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="orderListsParams.currentPage"
          :page-size="orderListsParams.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 备注弹框 -->
    <btn-remark
      ref="btnRemark"
      :btnReamrkVisible="showBtnRemark"
      @closeRemark="showBtnRemark=false"
      @confirmRemark="submitDesc"
    ></btn-remark>
    <!-- 改价弹框 -->
    <btn-change-price
      :visible="showBtnChangePrice"
      :oldPrice="changePriceInfo ? changePriceInfo.oldPrice : 0"
      @close="showBtnChangePrice=false"
      @confirm="confirmChangePrice"
    ></btn-change-price>
    <!-- 取消订单弹框 -->
    <el-dialog title="取消订单" :visible.sync="dialogVisibleCancel" center>
      <el-form :model="cancelForm" ref="cancelForm">
        <el-form-item label="选择取消理由:" label-width="120px">
          <el-select v-model="cancelForm.reason" placeholder="请选择取消理由">
            <el-option label="临时有事来不了" value="临时有事来不了"></el-option>
            <el-option label="不想去了" value="不想去了"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加备注:" label-width="120px">
          <el-input
            type="textarea"
            v-model="cancelForm.desc"
            placeholder="请输入备注内容(不超过150字)"
            maxlength="150"
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleCancel = false">点错了</el-button>
        <el-button type="primary" @click="confirmCancel">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 拒绝退款弹框 -->
    <refuse-refund
      :visible="refuseRefundModel"
      :id="curOrder.orderNo"
      @close="refuseRefundModel = false"
      @confirmRefuse="confirmRefuse"
    ></refuse-refund>
    <!-- 查看评价弹框 -->
    <read-assessment
      ref="readAssessment"
      goodsType="service"
      :readAssessmentVisible="readAssessmentVisible"
      @close="readAssessmentVisible=false"
      @confirm="replyAssessment"
      @open="readAssessmentVisible=true"
    ></read-assessment>
    <del-model
      :delTagDialogVisible="deleteModel"
      @close="deleteModel=false"
      @confirm="confirmDeleteModel"
      icon="icon_popup_question"
      iconColor="#FF6D61"
      title="确定删除吗？"
      content="订单删除后，用户移动端“服务订单”中，不会同步删除。"
    ></del-model>
    <!-- 退款弹窗 -->
    <refund
      ref="refundRef"
      :visible="showRefund"
      :id="curOrder.orderNo"
      :applyRefundMoney="curOrder.applyRefundMoney"
      @close="showRefund = false"
      @confirmRefund="confirmRefund"
    ></refund>
    <!-- 售后处理弹窗 -->
    <after-sales-service
      :showAfterSalesServiceModel="showAfterSalesServiceModel"
      :afterSaleDetail="afterSaleDetail"
      @reply="reply"
      @cancle="showAfterSalesServiceModel = false"
    ></after-sales-service>
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
import ServiceOrderStatusSpan from "@/components/orderManagement/ServiceOrderStatusSpan";
import RefuseRefund from "@/components/orderManagement/RefuseRefund";
import Refund from "@/components/orderManagement/Refund";
import ReadAssessment from "@/components/orderManagement/ReadAssessment";
import AfterSalesService from "@/components/orderManagement/AfterSalesService";
import OrderDefaultText from "@/components/order/OrderDefaultText";
import "@/assets/css/tab.scss";
import { truncate } from "fs";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    "btn-remark": BtnRemark,
    "btn-change-price": BtnChangePrice,
    "status-btn": StatusBtn,
    "order-btns": OrderBtns,
    "refuse-refund": RefuseRefund,
    refund: Refund,
    "after-sales-service": AfterSalesService,
    "order-status-span": ServiceOrderStatusSpan,
    "read-assessment": ReadAssessment,
    "order-default-text": OrderDefaultText
  },
  data() {
    return {
      utils: utils,
      pitchStoreId: null,
      // 门店列表
      storeOptions: [],
      curOrder: {
        orderNo: "", // 当前选中的订单
        frontDeskRemark: "", // 前台备注
        applyRefundMoney: null
      },
      showBtnRemark: false,
      showBtnChangePrice: false,
      dialogVisibleCancel: false,
      deleteModel: false,
      deleteServiceId: null, //要删除的商品的信息
      showRefund: false,
      tableLoading: false,
      cancelForm: {
        // 取消理由
        reason: "",
        desc: ""
      },
      refuseRefundModel: false,
      dialogVisibleUpdate: false,
      showAfterSalesServiceModel: false, //售后处理弹窗
      readAssessmentVisible: false,
      timeLimit: "all",
      timeValue: "", // 结束时间
      shop: "All", // 门店
      totalCount: 0, // 总条数
      orderStatus: {
        ONLINE: [
          { code: "ALL", value: "全部" },
          { code: "WAITING_PAY", value: "待付款" },
          { code: "WAITING_SERVICE", value: "待服务" },
          { code: "WAITING_ASSESSMENT", value: "待评价" },
          { code: "COMPLETED", value: "已完成" },
          { code: "CLOSED", value: "已关闭" },
          { code: "GROUP_BUY_WAIT", value: "待拼单" },
          { code: "REFUNDING_OR_AFTER_SALES", value: "退款" }
        ],
        STORE: [
          { code: "ALL", value: "全部" },
          { code: "WAITING_ASSESSMENT", value: "待评价" },
          { code: "COMPLETED", value: "已完成" }
          // {code: "REFUNDING_OR_AFTER_SALES", value: "售后"}
        ]
      },
      tableData: [],
      orderListsParams: {
        keyword: "",
        currentPage: 1,
        pageSize: 20
      },
      status: "ALL",
      channelScope: "STORE", //  STORE   ONLINE
      remarkIdInfo: null,
      changePriceInfo: null,
      afterSaleDetail: {},
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
      let start, end;
      if (Array.isArray(this.timeLimit)) {
        end = this.timeLimit[1];
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
        keyword: this.orderListsParams.keyword,
        currentPage: this.orderListsParams.currentPage - 1,
        pageSize: this.orderListsParams.pageSize,
        storeId: this.isBrand ? this.pitchStoreId : this.currentInfo.shopId,
        brandId: this.isBrand ? this.currentInfo.brandId : null,
        start,
        end,
        status: this.status,
        online: this.channelScope === "ONLINE"
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
      this.getListOrderList();
    },
    channelScope() {
      this.getListOrderList();
    },
    timeLimit() {
      this.getListOrderList();
      this.getDataStatic()
    },
    pitchStoreId(val) {
      this.getDataStatic()
      this.handleCurrentChange(1);
    }
  },
  mounted() {
    this.getStores();
    this.getDataStatic();
    let code = this.$route.query.shortcut;
    if (code) {
      this.status = code;
      if (code === "REFUNDING_OR_AFTER_SALES") {
        this.channelScope = "ONLINE";
      }
    }
    this.getListOrderList();
    if (!this.isBrand) {
      this.setStaffsInfo();
    }
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
          goodsType: 1,
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
    getListOrderList() {
      this.tableLoading = true;
      axios.post(api.getServiceOrderList.URL, this.params).then(res => {
        this.getListOrderListRes(res);
      });
    },
    getListOrderListRes(data) {
      this.totalCount = data.total;
      this.tableData = data.orderList;
      this.tableLoading = false;
    },
    // 确认取消
    confirmCancel() {
      let params = {
        orderNo: this.curOrder.orderNo,
        cancelReason: this.cancelForm.reason,
        desc: this.cancelForm.desc
      };
      axios.post(api.cancelOrder.URL, params).then(res => {
        this.confirmCancelOrder(res);
      });
    },
    confirmCancelOrder() {
      this.dialogVisibleCancel = false;
    },
    confirmRefuse(data) {
      axios
        .post("/salerRejectServiceRefundOrder", {
          note: data.data.desc,
          refundOrderId: data.id,
          rejectReason: data.data.reason,
          storeId: this.currentInfo.shopId
        })
        .then(res => {
          this.refuseRefundModel = false;
          this.$message({
            type: res.success ? "success" : "warning",
            message: res.message
          });
          this.getListOrderList();
        });
    },
    submitDesc(text) {
      axios
        .post(api.addFrontDeskRemark.URL, {
          ...this.remarkIdInfo,
          frontDeskNote: text
        })
        .then(res => {
          this.addFrontDeskRemarkRes(res);
        });
    },
    confirmChangePrice(newPrice) {
      axios
        .post("/unPaidOrderChangePrice", {
          goodsTypeScope: "service",
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
            this.getListOrderList();
          } else {
            this.$message({
              type: "error",
              message: "改价失败"
            });
          }
        });
    },
    addFrontDeskRemarkRes(res) {
      this.showBtnRemark = false;
      if (res.success) {
        this.getListOrderList();
        this.$message({
          type: "success",
          message: "添加备注成功"
        });
      } else {
        this.$message({
          type: "error",
          message: "添加备注失败"
        });
      }
    },
    handleCurrentChange(val) {
      this.orderListsParams.currentPage = val;
      this.getListOrderList();
    },
    cancelOrder(id) {
      this.dialogVisibleCancel = true;
      this.curOrder.orderNo = id;
    },
    refuseRefund(data) {
      this.refuseRefundModel = true;
      this.curOrder.orderNo = data.refundOrderId;
      axios.get("/salerStartHandleServiceRefundOrder/" + data.refundOrderId);
    },
    readComment(data) {
      this.$refs.readAssessment.getGoodsOrderAssessmentByOrderId(data.id);
      this.$refs.readAssessment.goodsDetail = {
        image: data.serviceInfoForOrder.image,
        goodsName: data.serviceInfoForOrder.serviceName,
        specificationName: data.serviceInfoForOrder.specificationName,
        price: data.serviceInfoForOrder.price
      };
    },
    delete_(data) {
      this.deleteServiceId = data.id;
      this.deleteModel = true;
    },
    confirmDeleteModel() {
      axios
        .post("/deleteServiceOrder", { id: this.deleteServiceId })
        .then(res => {
          this.$message({
            type: res.success ? "success" : "warning",
            message: res.message
          });
          this.deleteModel = false;
        });
    },
    confirmRefund(data) {
      axios.post("/salerAgreeServiceRefundOrder", data).then(res => {
        this.showRefund = false;
        this.$message({
          type: res.success ? "success" : "warning",
          message: res.message
        });
        this.getListOrderList();
        this.$refs.refundRef.resetForm();
      });
    },
    handleRefund(data) {
      axios
        .get("/getServiceAfterSaleContent/" + data.refundOrderId)
        .then(res => {
          this.showRefund = true;
          this.curOrder.orderNo = data.refundOrderId;
          console.log(res);
          this.curOrder.applyRefundMoney = res.refundPrice;
        });
      axios.get("/salerStartHandleServiceRefundOrder/" + data.refundOrderId);
    },
    reply() {
      this.showAfterSalesServiceModel = false;
    },
    afterSaleService(data) {
      axios
        .get("/getServiceAfterSaleContent/" + data.refundOrderId)
        .then(res => {
          this.showAfterSalesServiceModel = true;
          this.afterSaleDetail = res;
          this.afterSaleDetail.id = id;
        });
    },
    beginRemark(data) {
      this.remarkIdInfo = {
        orderId: data.id,
        storeId: this.currentInfo.shopId
      };
      this.$refs.btnRemark.remark = data.frontDeskNote;
      this.showBtnRemark = true;
    },
    changePrice(data) {
      this.changePriceInfo = {
        orderId: data.id,
        oldPrice: data.received
      };
      this.showBtnChangePrice = true;
    },
    changeChannelScope() {
      let typeArr = this.orderStatus[this.channelScope].map(item => {
        return item.code;
      });
      this.status = typeArr[0];
      this.getDataStatic()
    },
    goToDetail(data) {
      let position = this.isBrand ? "brand" : "shop";
      let serviceOrderDetail = this.$router.resolve({
        path: `/${position}-inner/service-order-detail`,
        query: {
          orderDetailType: "service",
          isRefundOrder: this.status === "REFUNDING_OR_AFTER_SALES" || "",
          id:
            this.status === "REFUNDING_OR_AFTER_SALES"
              ? data.refundOrderId
              : data.id
        }
      });
      window.open(serviceOrderDetail.href, "_blank");
    },
    replyAssessment(data) {
      axios.post("/replyAssessment", data).then(res => {
        if (!res.success) {
          this.$message({ type: "warning", message: res.message });
        } else {
          this.$message({ type: "success", message: "回复成功" });
          this.readAssessmentVisible = false;
        }
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

.border_left {
  border-left: 1px solid #ebebeb;
}

.border_right {
  border-right: 1px solid #ebebeb !important;
}

.border_left_no {
  border-left: none !important;
}

.order-deatil.border_left_no {
  text-align: right;
  padding-right: 15px;
  font-size: 12px;
  color: #58c9f3;

  .link {
    cursor: pointer;
    line-height: 1;
    margin-top: -5px;
  }
}

.customer-money.border_left_no {
  .top-text,
  .bottom-text {
    line-height: 22px;
    font-size: 12px;
  }
}

.align-left {
  text-align: left !important;
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

  .table {
    width: 100%;
    color: #333333;

    .thead {
      height: 52px;

      .th-status {
        // text-align: right;
        padding-right: 30px;
      }
    }

    th {
      font-size: 14px;
      font-weight: 400;
    }

    td {
      text-align: center;
      font-size: 14px;
      font-weight: 400;
    }

    .tr-top-line {
      height: 32px;
      background: #dee1e6;
      border: 1px solid #ebebeb;
      color: #666666;

      .td-tltle {
        border: 1px solid #ebebeb;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        font-size: 12px;
        color: #999999;

        .icon-icon_top_store {
          display: inline-block;
          background: #00cf82;
        }
      }

      .td_remark {
        max-width: 400px;
        margin-right: 10px;
        float: right;
        color: #999999;
      }
    }

    .tr-content {
      td {
        border: 1px solid #ebebeb;
        border-top: none;
        border-right: none;
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

          /deep/ .btn {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

.el-pagination {
  box-sizing: border-box;
  padding-right: 20px;
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
  margin-left: 10px;
  border-radius: 3px;
}

.iconfont {
  margin-right: 4px;
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

.status_time {
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



