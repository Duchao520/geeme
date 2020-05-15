<template>
  <div class="root">
    <h3>退款记录</h3>
    <div class="table">
      <div class="tabs code" style="border-left: 1px solid #ebecf0;">
        <div class="tab-top">退款编号</div>
        <div class="tab-bottom">{{refundOrderInfo.code || '-'}}</div>
      </div>
      <div class="tabs">
        <div class="tab-top">申请时间</div>
        <div class="tab-bottom">{{refundOrderInfo.createTime || '-'}}</div>
      </div>
      <div class="tabs">
        <div class="tab-top">退款原因</div>
        <div class="tab-bottom">{{refundOrderInfo.refundReason || '-' }}</div>
      </div>
      <div class="tabs">
        <div class="tab-top">申请退款金额</div>
        <div class="tab-bottom">￥{{refundOrderInfo.moneyApply}}</div>
      </div>
      <div class="tabs">
        <div class="tab-top">核准退款金额</div>
        <div class="tab-bottom">{{refundOrderInfo.moneyApprove?"￥"+refundOrderInfo.moneyApprove:"-"}}</div>
      </div>
      <div class="tabs">
        <div class="tab-top">客户诉求</div>
        <div class="tab-bottom">
          <p>
            <span>
              {{cutText(refundOrderInfo.customerAsk,32) || '-'}}
            </span>
            <br>
            <span style="color:#58C9F3;cursor:pointer" @click="dialogVisible=true">查看详情</span>
          </p>
        </div>
      </div>
      <div class="tabs">
        <div class="tab-top">退款处理结果</div>
        <div class="tab-bottom">
          <p>
            <span>
              {{cutText(refundOrderInfo.salerHandle,32) || '-'}}
            </span>
            <br>
            <span style="color:#58C9F3;cursor:pointer" @click="dialogVisible=true">查看详情</span>
          </p>
        </div>
      </div>
      <div class="tabs" style="border-right: 1px solid #ebecf0;">
        <div class="tab-top">核准人</div>
        <div class="tab-bottom">{{refundOrderInfo.staffName || '-'}}</div>
      </div>
    </div>
    <div class="table-bottom-line" v-if="showButtons">
      <el-button class="table-button" style="background:#FCB322" @click="showRefund=true">同意退款</el-button>
      <el-button class="table-button" style="background:#41CAC0" @click="refuseRefundModel=true">拒绝退款</el-button>
    </div>
    <el-dialog
      class="dialog"
      :visible.sync="dialogVisible"
      width="500px"
      @close="dialogVisible=false"
    >
      <span style="font-weight:600;line-height:1" slot="title">查看详情</span>
      <div class="dialog-content">
        <div class="chat-item" v-for="(item,index) in refundOrderInfo.refundReplies" :key="index">
          <p class="chat-item-title">{{item.sendMan==='CUSTOMER'?'客户诉求':'商家回复'}}：</p>
          <div class="chat-item-con">
            <p class="chat-item-time">{{item.createTime}}</p>
            <p class="chat-item-text">{{item.note}}</p>
            <div class="chat-item-images"><img v-for="(img,index) in item.images" :key="index"
                                               :src="utils.formatPicImg(img,'style',70)" alt=""></div>
          </div>
        </div>
      </div>
    </el-dialog>
    <refuse-refund
      :visible="refuseRefundModel"
      @close="refuseRefundModel = false"
      @confirmRefuse="confirmRefuse"
      :id="refundOrderId"
    ></refuse-refund>
    <v-refund
      ref="refundRef"
      :visible="showRefund"
      :applyRefundMoney="refundOrderInfo.moneyApply"
      :id="refundOrderId"
      @close="showRefund = false"
      @confirmRefund="confirmRefund"
    ></v-refund>
  </div>
</template>
<script>
  import * as utils from '@/assets/js/utils';
  import RefuseRefund from "@/components/orderManagement/RefuseRefund";
  import Refund from "@/components/orderManagement/Refund";
  import * as api from '@/assets/js/interface';
  import * as axios from "@/util/axios";

  export default {
    components: {
      "refuse-refund": RefuseRefund,
      "v-refund": Refund,
    },
    props: {
      detail: Object,
      isProduct: Boolean
    },
    data() {
      return {
        utils: utils,
        dialogVisible: false,
        refuseRefundModel: false,
        showRefund: false
      };
    },
    computed: {
      currentInfo() {
        return this.$store.state.manage.currentInfo;
      },
      refundOrderInfo() {
        if (this.isProduct) {
          return this.detail.refundInfo
        } else {
          return this.detail.refundOrderInfo
        }
      },
      refundOrderId() {
        if (this.isProduct) {
          return this.detail.refundInfo.id
        } else {
          return Number(this.$route.query.id);
        }
      },
      showButtons() {
        let status = this.detail.orderInfo.orderStatus;
        let statuses = ["REFUND_AFTER_SALES_REJECT","REFUND_AFTER_SALES_CANCEL","REFUNDED","REFUND_REJECTED","REFUND_CANCELED"];
        return !statuses.includes(status);
      }
    },
    methods: {
      cutText(text, len) {
        return (text && text.length > len) ? text.substring(0, len) + "..." : `${text}`;
      },
      confirmRefuse(data) {
        if (this.isProduct) {
          axios.post(
            "/salerRejectRefundOrder",
            {
              note: data.data.desc,
              refundOrderId: data.id,
              rejectReason: data.data.reason,
              storeId: this.currentInfo.shopId
            }
          ).then(res => {
            this.refuseRefundModel = false;
            this.$message({type: res.success ? 'success' : 'warning', message: res.success ? '拒绝退款成功' : res.message});
            this.$emit("refresh")
          })
        } else {
          axios.post(
            "/salerRejectServiceRefundOrder",
            {
              note: data.data.desc,
              refundOrderId: data.id,
              rejectReason: data.data.reason,
              storeId: this.currentInfo.shopId
            }
          ).then(res => {
            this.refuseRefundModel = false;
            this.$message({type: res.success ? 'success' : 'warning', message: res.success ? '拒绝退款成功' : res.message});
            this.$emit("refresh")
          })
        }

      },
      confirmRefund(data) {
        if (this.isProduct) {
          axios.post(
            "/salerAgreeRefundOrder", data
          ).then(res => {
            this.showRefund = false;
            this.$emit("refresh");
            this.$message({type: res.success ? 'success' : 'warning', message: res.success ? '退款成功' : res.message})
            this.$refs.refundRef.resetForm()
          })
        } else {
          axios.post("/salerAgreeServiceRefundOrder", data).then(res => {
            this.showRefund = false;
            this.$emit("refresh");
            this.$message({type: res.success ? 'success' : 'warning', message: res.success ? '退款成功' : res.message})
            this.$refs.refundRef.resetForm()
          })
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .root {
    overflow: hidden;
  }

  h3 {
    font-size: 14px;
    margin: 12px 0;
  }

  .table {
    min-width: 760px;
    display: flex;

    .tabs {
      flex: auto;
      border: 1px solid #ebecf0;
      max-width: 30%;
      min-width: 11%;
      border-right: 0;
      border-left: 0;

      .tab-top {
        height: 34px;
        line-height: 34px;
        font-size: 12px;
        color: #5f6368;
        //   text-align: center;
        box-sizing: border-box;
        padding-left: 15px;
      }

      .tab-bottom {
        height: 70px;
        font-size: 12px;
        color: #333333;
        border-top: 1px solid #ebecf0;
        padding-left: 15px;
        display: flex;
        align-items: center;
      }
    }

    .tabs.code {
      min-width: 140px;
    }
  }

  .table-bottom-line, .table {
    /deep/ .el-button {
      width: 62px;
      height: 28px;
      padding: 0;
      margin: 10px 0;
      float: right;
      font-size: 12px;
    }
  }

  .table-bottom-line {
    border: 1px solid #ebecf0;
    border-top: 0;
    overflow: hidden;
    padding-right: 5px;

    .table-button {
      margin: 5px 10px 5px 5px;
      color: white;
      border: none;
      transition: 0.6s;

      &:hover {
        filter: brightness(90%)
      }
    }
  }


  .dialog {
    /deep/ .el-dialog__body {
      padding: 10px 0 0 0;

      .dialog-content {
        border-top: 1px solid #f0f1f4;
        padding: 25px;
        font-size: 12px;
        color: #666666;

        .chat-item {
          display: flex;

          .chat-item-title {
            flex: 0 0 65px;
            text-align: right;
          }

          .chat-item-con {
            .chat-item-time {
              color: #999999;
              line-height: 20px;
            }

            .chat-item-text {
              line-height: 16px;
            }

            .chat-item-images {
              display: flex;
              flex-wrap: wrap;

              img {
                width: 90px;
                height: 90px;
                margin: 10px 10px 10px 0;
              }
            }
          }
        }
      }
    }
  }
</style>
