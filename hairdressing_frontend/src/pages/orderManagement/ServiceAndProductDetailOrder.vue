<template>
  <div :loading="loading">
    <details-header title="订单详情" :hasTabs="false"></details-header>
    <div class="main">
      <div class="mainContent">
        <div class="status">
          <order-steps
            class="step"
            timeColor="#999999"
            v-if="detail.processInfo"
            :steps="detail.processInfo.processBeanList"
          ></order-steps>
        </div>
        <div class="detail">
          <div class="left">
            <main-info
              v-if="detail.orderInfo"
              :detail="detail"
              :logisticsInfo="logisticsInfo"
              :isProduct="isProduct"
              @remarkVisibleToTrue="remarkVisibleToTrue"
            ></main-info>
          </div>
          <div class="right">
            <!-- 订单状态 -->
            <order-status-in-order-detail
              v-if="detail.orderInfo"
              :detail="detail"
              :isProduct="isProduct"
              @whthdrawRefund="withdrawModelVisible = true"
            ></order-status-in-order-detail>
            <!-- 协商记录 -->
            <!-- <orderNegotiateHistory 
              v-if="detail.refundReplies && detail.refundReplies.length"
              :negotiateList="detail.refundReplies"
            /> -->
            <!-- 评价记录 -->
            <record-of-comment
              :isProduct="isProduct"
              v-if="showRecordOfComment"
              :assessmentInfo="assessmentInfo"
              @reload="init()"
            ></record-of-comment>
            <!-- 售后评价 -->
            <after-sale-assessment
              :isProduct="isProduct"
              v-if="afterSaleAssessmentInfo"
              :afterSaleAssessmentInfo="afterSaleAssessmentInfo"
              @reload="init()"
            ></after-sale-assessment>
            <refund-record :detail="detail" v-if="showRefundRecord" :isProduct="isProduct" @refresh="init()"></refund-record>
            <after-sale-record :detail="detail" v-if="detail.afterSaleInfo" @refresh="init()"></after-sale-record>
            <order-details
              v-if="detail.orderInfo"
              :orderInfo="detail.orderInfo"
              :isProduct="isProduct"
            ></order-details>
            <!-- 订单流水 -->
            <trade-log
              :detail="detail"
              v-if="detail.transactionStream"
            ></trade-log>
            <refund-trade-log :detail="detail" v-if="detail.refundTransactionStream"></refund-trade-log>
            <div class="order-btns" v-if="detail.orderInfo">
              <g-button
                @click="showBtnChangePrice=true"
                type="remark"
                name="改价"
                icon="icon_operate_edit"
                v-if="detail.orderInfo.online && detail.orderInfo.orderStatus === 'WAITING_PAY' && !detail.orderInfo.wholesale"
              ></g-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 备注弹窗 -->
    <btn-remark
      class="modal"
      ref="btnRemark"
      :btnReamrkVisible="remarkVisible"
      @closeRemark="remarkVisible=false"
      @confirmRemark="confirmRemark"
    ></btn-remark>
    <!-- 拒绝退款弹框 -->
    <v-refuse-refund
      :visible="refuseRefundModel"
      @cancelRefuseRefund="refuseRefundModel = false"
      @confirmRefuse="confirmRefuse"
    ></v-refuse-refund>
    <!-- 同意退款弹窗 -->
    <v-refund
      ref="refundRef"
      :visible="showRefund"
      :money="123"
      @cancelRefund="showRefund=false"
      @confirmRefund="confirmRefund"
    ></v-refund>
    <del-model
      title="确定撤回吗？"
      content="撤回“拒绝”操作后，订单将重新进入“退款中”，需要重新处理。"
      icon="icon_popup_question"
      iconColor="#FF6D61"
      :delTagDialogVisible="withdrawModelVisible"
      @close="withdrawModelVisible=false"
      @confirm="confirmWithdraw"
    ></del-model>
    <!-- 改价弹框 -->
    <btn-change-price
      v-if="detail.orderInfo"
      :visible="showBtnChangePrice"
      :oldPrice="detail.orderInfo.received"
      @close="showBtnChangePrice=false"
      @confirm="confirmChangePrice"
    ></btn-change-price>
  </div>
</template>
<script>
  import * as axios from "@/util/axios";
  import * as utils from "@/assets/js/utils";
  import BtnRemark from "@/components/orderManagement/BtnRemark";
  import OrderDetails from "@/components/orderManagement/OrderDetails";
  import TradeLog from "@/components/orderManagement/TradeLog";
  import RefundTradeLog from "@/components/orderManagement/RefundTradeLog";
  import RefundRecord from "@/components/orderManagement/RefundRecord";
  import AfterSaleRecord from "@/components/orderManagement/AfterSaleRecord";
  import RecordOfComment from "@/components/orderManagement/RecordOfComment";
  import RefuseRefund from "@/components/orderManagement/RefuseRefund";
  import Refund from "@/components/orderManagement/Refund";
  import OrderStatusInOrderDetail from "@/components/orderManagement/OrderStatusInOrderDetail";
  import AfterSaleAssessment from "@/components/orderManagement/AfterSaleAssessment";
  import MainInfo from "@/components/orderManagement/MainInfo";
  import BtnChangePrice from '@/components/orderManagement/BtnChangePrice';

  import orderNegotiateHistory from '@/components/orderManagement/orderNegotiateHistory'; // 退款协商

  export default {
    components: {
      "btn-remark": BtnRemark,
      "order-details": OrderDetails,
      "trade-log": TradeLog,
      "record-of-comment": RecordOfComment,
      "v-refuse-refund": RefuseRefund,
      "v-refund": Refund,
      "order-status-in-order-detail": OrderStatusInOrderDetail,
      "main-info": MainInfo,
      "refund-trade-log": RefundTradeLog,
      "refund-record": RefundRecord,
      "after-sale-record": AfterSaleRecord,
      "after-sale-assessment": AfterSaleAssessment,
      BtnChangePrice,
      orderNegotiateHistory,
    },
    data() {
      return {
        utils: utils,
        remarkVisible: false,
        showInvitation: false,
        refuseRefundModel: false,
        showRefund: false,
        remarkMark: null,
        loading: true,
        assessmentInfo: null,
        afterSaleAssessmentInfo: null,
        detail: {},
        withdrawModelVisible: false,
        logisticsInfo:{},
        showBtnChangePrice:false,
      };
    },
    computed: {
      currentInfo() {
        return this.$store.state.manage.currentInfo;
      },
      processInfo() {
        this.detail.processInfo;
      },
      isProduct() {
        return this.$route.fullPath.includes("product-order-detail");
      },
      showRefundRecord(){
        return this.detail.refundOrderInfo&&!this.isProduct ||
          this.detail.refundInfo&&this.isProduct
      },
      showRecordOfComment(){
        let assessmentInfo = this.assessmentInfo;
        return assessmentInfo&&assessmentInfo.assessmentInfo&&assessmentInfo.serverInfo
      }
    },
    mounted() {
      console.log(this.$route.query)
      this.init();
    },
    methods: {
      init() {
        setTimeout(()=>{
          let query = this.$route.query;
          if (query.orderDetailType === "service") {
            if (!!query.isRefundOrder) {
              this.esRefundServiceOrderDetailsById(Number(query.id));
            } else {
              this.getServiceOrderDetailsById(Number(query.id));
            }
          } else {
            this.getProductOrderDetailsById();
          }
        },200);
      },
      confirmWithdraw() {
        if (this.isProduct) {
          let id = this.detail.refundInfo.id;
          axios.get("/salerRejectRefundOrderRollBack/" + id).then(res => {
            this.$message({type:res.success?"success":"warning",message:res.message});
            this.withdrawModelVisible = false;
            this.getProductOrderDetailsById();
          });
        } else {
          let id_ = this.$route.query.id;
          axios.get("/salerRejectServiceRefundOrderRollBack/" + id_).then(res => {
            this.$message({type:res.success?"success":"warning",message:res.message});
            this.esRefundServiceOrderDetailsById(id_);
          });
        }
      },
      getServiceOrderDetailsById(id) {
        axios.get("/getServiceOrderDetailsById/" + id).then(res => {
          this.handleServiceOrderDetail(res)
        });
      },
      handleServiceOrderDetail(res) {
        this.withdrawModelVisible = false;
        this.detail = res;
        let transactionStream;
        if (res.payRecordInfo) {
          transactionStream = {
            payNo: res.payRecordInfo.payNo,
            paySource: res.payRecordInfo.paySource,
            payType: res.payRecordInfo.payType,
            received: res.payRecordInfo.received + "",
            transactionNo: res.payRecordInfo.transactionNo
          };
          this.detail.transactionStream = transactionStream;
        }
        if (res.orderInfo.orderStatus === "COMPLETED") {
          this.getGoodsOrderAssessmentByOrderId(res.orderInfo.id, 'service');
        }
      },
      esRefundServiceOrderDetailsById(id) {
        axios.get("/esRefundServiceOrderDetailsById/" + id).then(res => {
          this.handleServiceOrderDetail(res)
        })
      },
      getProductOrderDetailsById() {
        let query = this.$route.query;
        setTimeout(()=>{
          axios.post("/getProductOrderDetailsById", {
            online:Boolean(query.online),
            orderId:Number(query.orderId),
            productOrderType:query.productOrderType
          }).then(res => {
            this.detail = res;
            if (res.orderInfo.orderStatus === "COMPLETED") {
              this.getGoodsOrderAssessmentByOrderId(res.orderInfo.id, 'production');
            } else if (res.orderInfo.orderStatus === "AFTER_SALES_CLOSE") {
              this.getOrderAfterSaleAssessmentInfo(res.afterSaleInfo.id);
            } else {
              this.loading = false;
            }
            if(res.orderInfo.logisticsId){
              axios.get("/productOrderLogisticsPcGet/" + res.orderInfo.logisticsId).then(res=>{
                this.logisticsInfo = res
              })
            }
          });
        },300);
      },
      getGoodsOrderAssessmentByOrderId(id, type) {
        axios.post("/getGoodsOrderAssessmentByOrderId", {orderId: id, goodsType: type}).then(res => {
          this.assessmentInfo = res;
        });
      },
      getOrderAfterSaleAssessmentInfo(id) {
        axios.get("/getOrderAfterSaleAssessmentInfo/" + id, {}).then(res => {
          this.afterSaleAssessmentInfo = res;
        });
      },
      remarkVisibleToTrue(val, remark) {
        this.remarkVisible = true;
        this.remarkMark = val;
        this.$refs.btnRemark.remark = remark;
      },
      confirmRemark(text) {
        switch (this.remarkMark) {
          case "front":
            this.addFrontDeskRemark(text);
            break;
          case "store":
            this.salerModifyProductOrderNote(text);
            break;
        }
      },
      addFrontDeskRemark(text) {
        axios
          .post("/addFrontDeskRemark", {
            orderId: this.detail.orderInfo.id,
            storeId: this.currentInfo.shopId,
            frontDeskNote: text
          })
          .then(res => {
            this.modFontDeskRemark(res);
          });
      },
      salerModifyProductOrderNote(text) {
        axios
          .post("/salerModifyProductOrderNote", {
            orderId: this.detail.orderInfo.id,
            note: text
          })
          .then(res => {
            this.init();
            this.$message({type: res.success ? "success" : "warning", message: res.message});
            this.remarkVisible = false
          });
      },
      modFontDeskRemark(res) {
        this.remarkVisible = false;
        if (res.success) {
          this.$message({
            type: "success",
            message: "添加备注成功"
          });
        } else {
          this.$message({
            type: "warning",
            message: res.message
          });
        }
        this.init();
      },
      confirmRefuse() {
        this.refuseRefundModel = false;
        this.$message({type: "success", message: "拒绝退款成功"});
      },
      confirmRefund() {
        this.showRefund = false;
        this.init();
        this.$refs.refundRef.resetForm()
      },
      confirmChangePrice(newPrice){
        const query = this.$route.query
        const orderId = query.orderId || query.id
        const type = query.orderDetailType === 'service' ? 'service' : 'production'
        axios.post('/unPaidOrderChangePrice', {
          goodsTypeScope:type,
          newPayMoney:newPrice,
          orderId,
        }).then( res => {
          this.showBtnChangePrice = false
          if(res.success){
            this.$message({
              type: 'success',
              message: '改价成功'
            })
            if(type === 'service'){
              this.getServiceOrderDetailsById(orderId)
            }else{
              this.getProductOrderDetailsById()
            }
          }else {
            this.$message({
              type: 'error',
              message: '改价失败'
            })
          }
        })
      },
    }
  };
</script>
<style lang="scss" scoped>
  .main {
    margin-top: 80px;
    box-sizing: border-box;
    padding: 0 20px;
    margin-bottom: 20px;
    .mainContent {
      max-width: 1440px;
      box-sizing: border-box;
      margin: 0 auto;
      background: white;
      min-height: calc(100vh - 100px);
      box-sizing: border-box;
      padding: 15px 20px;
      box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
      border-radius: 3px;

      .status {
        border: 1px solid #f0f1f4;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 10px 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
      }

      .detail {
        border: 1px solid #f0f1f4;
        border-radius: 5px;
        display: flex;
        min-height: 620px;

        .left {
          width: 26.5%;
          min-width: 280px;
          box-sizing: border-box;
          border-right: 1px solid #f0f1f4;
          color: #666666;
          padding: 10px 20px;
          font-size: 12px;
          line-height: 27px;
        }

        .right {
          flex: auto;
          min-width: 800px;
          box-sizing: border-box;
          padding: 17px 20px 15px;
          color: #333333;
        }
      }
    }
  }

  .modal {
    width: 500px;
  }

  .order-btns{
    text-align: right;
    margin-top: 10px;

    .btn:last-child{
      margin-right: 0;
    }
  }
</style>
