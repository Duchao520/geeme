<template>
  <div class="root">
    <h3>售后记录</h3>
    <div class="table">
      <div class="tabs" style="border-left: 1px solid #ebecf0;">
        <div class="tab-top">售后编号</div>
        <div class="tab-bottom">{{afterSaleInfo.code || '-'}}</div>
      </div>
      <div class="tabs">
        <div class="tab-top">申请时间</div>
        <div class="tab-bottom">{{afterSaleInfo.createTime || '-'}}</div>
      </div>
      <div class="tabs">
        <div class="tab-top">售后类型</div>
        <div class="tab-bottom">{{afterSaleInfo.refundReason || '-' }}</div>
      </div>
      <div class="tabs" v-if="afterSaleInfo.moneyApply!==null">
        <div class="tab-top">申请退款金额</div>
        <div class="tab-bottom">{{afterSaleInfo.moneyApply}}</div>
      </div>
      <div class="tabs" v-if="afterSaleInfo.moneyApprove!==null">
        <div class="tab-top">核准退款金额</div>
        <div class="tab-bottom">{{afterSaleInfo.moneyApprove}}</div>
      </div>
      <div class="tabs">
        <div class="tab-top">客户诉求</div>
        <div class="tab-bottom">
          <p>
            {{cutText(afterSaleInfo.customerAsk,32) || '-'}}
            <span
              style="color:#58C9F3;cursor:pointer"
              @click="dialogVisible=true"
              v-if="cutText(afterSaleInfo.customerAsk,32)"
            >查看详情</span>
          </p>
        </div>
      </div>
      <div class="tabs">
        <div class="tab-top">退款处理结果</div>
        <div class="tab-bottom">
          <p>
            {{cutText(afterSaleInfo.salerHandle,32) || '-'}}
            <span
              style="color:#58C9F3;cursor:pointer"
              @click="dialogVisible=true"
              v-if="cutText(afterSaleInfo.salerHandle,32)"
            >查看详情</span>
          </p>
        </div>
      </div>
      <div class="tabs" style="border-right: 1px solid #ebecf0;">
        <div class="tab-top">处理人</div>
        <div class="tab-bottom">{{afterSaleInfo.staffName || '-'}}</div>
      </div>
    </div>
    <div class="table-bottom-line" v-if="showHandleButton">
      <g-button style="float: right;margin-top: 5px;" name="售后处理" @click="afterSaleService"
                type="orange-yellow"></g-button>
    </div>
    <el-dialog
      class="dialog"
      :visible.sync="dialogVisible"
      width="500px"
      @close="dialogVisible=false"
    >
      <span style="font-weight:600;line-height:1" slot="title">查看详情</span>
      <div class="dialog-content">
        <div class="chat-item" v-for="(item,index) in afterSaleInfo.afterSaleReplies" :key="index">
          <p class="chat-item-title">{{item.sendMan==='CUSTOMER'?'客户诉求':'商家回复'}}：</p>
          <div class="chat-item-con">
            <p class="chat-item-time">{{item.createTime}}</p>
            <p class="chat-item-text">{{item.note}}</p>
            <div class="chat-item-images">
              <img
                v-for="(img,index) in item.images"
                :key="index"
                :src="utils.formatPicImg(img,'style',70)"
              >
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <after-sales-service
      :showAfterSalesServiceModel="showAfterSalesServiceModel"
      :afterSaleDetail="afterSaleDetail"
      @close="showAfterSalesServiceModel = false"
      @handleSalesService="closeModelAndRefresh"
    ></after-sales-service>
  </div>
</template>
<script>
  import * as utils from "@/assets/js/utils";
  import * as axios from "@/util/axios";
  import AfterSalesService from "@/components/orderManagement/AfterSalesService";

  export default {
    components: {AfterSalesService},
    props: {
      detail: Object
    },
    data() {
      return {
        utils: utils,
        dialogVisible: false,
        showAfterSalesServiceModel:false,
        afterSaleDetail:{}
      };
    },
    computed: {
      currentInfo() {
        return this.$store.state.manage.currentInfo;
      },
      afterSaleInfo() {
        return this.detail.afterSaleInfo
      },
      showHandleButton(){
        let status = this.detail.orderInfo.orderStatus;
        let statuses = ["REFUND_AFTER_SALES_CANCEL","AFTER_SALES_CLOSE"];
        return !statuses.includes(status)
      }
    },
    methods: {
      cutText(text, len) {
        return text ? text.substring(0, len) + "..." : "";
      },
      afterSaleService() {
        let id = this.detail.afterSaleInfo.id;
        axios.get("/salerStartHandleRefundOrder/" + id);
        axios.get("/getAfterSaleContent/" + id).then(res => {
          this.afterSaleDetail = res;
          this.afterSaleDetail.id = id;
          this.showAfterSalesServiceModel = true;
        });
      },
      closeModelAndRefresh(){
        this.showAfterSalesServiceModel = false;
        setTimeout(()=>{
          this.$emit("refresh");
        },200)
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
  }

  .table-bottom-line,
  .table {
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
        filter: brightness(90%);
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
