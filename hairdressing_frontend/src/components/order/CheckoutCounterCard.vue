<template>
  <div class="card-item" :class="{'check-time-out': checkTimeOut}">
    <div class="account-paid" v-if="orderData.status == 'Paid'"></div>
    <div class="time-out-flag" v-if="checkTimeOut"></div>
    <div class="staff-info">
      <!-- 此处改为显示客户名称 -->
      <!-- <p :title="orderData.staffName">{{orderData.staffName}}</p> -->
      <p 
        :title="orderData.customerName" 
        class="like-link"
        @click="toPagesInNewTags(`/shop-inner/customerRecord/${orderData.customerId}`)"
      >{{orderData.customerName}}</p>
      <span>{{orderData.serviceTime.substr(0,orderData.serviceTime.length-3)}}</span>
    </div>
    <div class="userInfo">
      <div class="u-top">
        <p>服务单号：</p>
        <span>{{orderData.serviceOrderCode}}</span>
      </div>
      <div class="u-bottom">
        <p>
          <!-- <span>客户：</span> -->
          <span>服务/销售：</span>
        </p>
        <!-- <span
          class="user-info-box"
          :title="orderData.customerName"
        >
          <span class="user-name">{{orderData.customerName}}</span>
          <span class="user-phone" v-if="orderData.mobile">&nbsp;{{orderData.mobile}}</span>
        </span> -->
        <span class="user-info-box" :title="workers">
          {{workers || '-'}}
        </span>
      </div>
    </div>
    <div class="productList">
      <div class="product-title">
        <p>{{(orderData.details&&orderData.details.length===0 || !orderData.details)?'卡项':'服务/产品'}}</p>
        <span>金额</span>
      </div>
      <div class="productItem" v-for="(goods,index) in detailList" :key="index">
        <div>
          <span :title="goods.goodsName">{{goods.goodsName}}</span>
          <span v-if="!goods.isCard">X{{goods.count}}</span>
        </div>
        <span v-if="!goods.isCard">￥{{goods.price * (goods.count || 0)}}</span>
        <span v-else>￥{{goods.price}}</span>
      </div>
    </div>
    <div class="total-price-info">
      <p v-if="orderData.totalPreference">
        <span>优惠</span>
        <span>&nbsp;￥</span>
        <span>{{orderData.totalPreference || 0}}</span>
      </p>&nbsp;&nbsp;
      <p>
        <span>{{orderData.status === 'Paid'?'实收':'应收'}}</span>
        <span>￥</span>
        <span>{{orderData.finalPrice}}</span>
      </p>
    </div>
    <div class="bottom-manage-buttons">
      <div class="abnormal-order-reason" v-if="currentStatus==='recycle' || inBackout">
        <p class="reason-title">{{inBackout ? '撤' : '删'}}单理由:</p>
        <p>{{inBackout ? orderData.rescindReason : orderData.deleteReason}}</p>
      </div>
      <span
      >
        <i
          v-if="!(orderData.status === 'Paid' || currentStatus==='recycle' || currentStatus === 'backout')&&checkHasBtnPermission('shop_cashier_deleteOrder')&&!inBackout"
          class="delete icon iconfont icon-icon_operate_delete"
          :class="{'check-time-out-text': checkTimeOut}"
          @click="$emit('deleteOrder',orderData)"
        ></i>
      </span>
      <time-difference v-if="(orderData.status === 'UnPaid' || orderData.status === 'UnBilling')&&(currentStatus==='cashier')" :time="orderData.orderTime"></time-difference>
      <div class="btns-in-right">
        <g-button
          class="button"
          :name="'撤单'"
          :padding="'6.25px 8px'"
          :type="'cancel'"
          :icon="'icon_ope_revoke'"
          v-if="orderData.status === 'Paid'&&checkHasBtnPermission('shop_cashier_billDetails')"
          @click="prepareRepealOrder(orderData.id)"
        ></g-button>

        <el-button
          type="primary"
          class="detail"
          style="background: #75C74F;"
          @click="getOrderInfo(orderData.id)"
          :loading="orderDetailLoading"
          v-if="(orderData.status === 'Paid'||orderData.status === 'Rescind')&&checkHasBtnPermission('shop_cashier_billDetails')"
        >
          <i class="icon iconfont icon-icon_operate_eyes"></i>
          <span>详情</span>
        </el-button>
        <el-button
          type="primary"
          class="detail"
          style="background:#75C74F"
          v-if="currentStatus==='recycle'&&checkHasBtnPermission('shop_cashier_deleteOrder')"
          @click="restore(orderData.id)"
          :loading="restoreButtonLoading"
        >
          <i class="icon iconfont icon-icon_operate_recover"></i>
          <span>恢复</span>
        </el-button>
        <el-button
          type="primary"
          class="detail"
          style="background:#F52D56"
          @click="takeOrder"
          v-if="(orderData.status === 'UnBilling')&&(currentStatus==='cashier')&&checkHasBtnPermission('shop_cashier_getBill')"
          :loading="takeOrderLoading"
        >
          <i class="icon iconfont icon-icon_operate_bill"></i>
          <span>取单</span>
        </el-button>
        <el-button
          type="primary"
          class="detail"
          style="background:#58C9F3;"
          @click="superToPay"
          v-if="(orderData.status === 'UnPaid')&&(currentStatus==='cashier')&&checkHasBtnPermission('shop_cashier_getBill')"
          :loading="takeOrderLoading"
        >
          <i class="icon iconfont icon-icon_operate_bill"></i>
          <span>支付</span>
        </el-button>
      </div>
    </div>
    <goods-order-detail
      v-if="ShowServiceOrderDetail"
      :infoVisible="ShowServiceOrderDetail"
      @handleClose="ShowServiceOrderDetail=false"
      :detail="cashOrderInfo"
    ></goods-order-detail>
  </div>
</template>
<script>
  import * as utils from "@/assets/js/utils";
  import ServiceOrderDetail from "@/components/order/billDetail/ServiceOrderDetail.vue";
  import * as api from "@/assets/js/interface";
  import * as axios from "@/util/axios";
  import {mapActions} from "vuex";
  export default {
    name: 'order-cards-item',
    components: {
      "goods-order-detail": ServiceOrderDetail, // 这个是收款台的详情组件
    },
    props: {
      orderData: Object,
      currentStatus: String,
      inBackout: Boolean, 
    },
    data() {
      return {
        utils: utils,
        takeOrderLoading: false,
        ShowServiceOrderDetail: false,
        orderDetailLoading: false,
        restoreButtonLoading: false,
        cashOrderInfo: null
      };
    },
    mounted() {
    },
    computed: {
      detailList() {
        if (this.orderData.details && this.orderData.details.length > 0) {
          return this.orderData.details;
        } else {
          return this.orderData.consumerOrderCardInfo.map(item => {
            return {
              goodsName: item.cardName,
              isCard: true,
              price: item.chargeMoney
            };
          });
        }
      },
      checkTimeOut() {
        return (this.orderData.status === 'UnPaid' || this.orderData.status === 'UnBilling') && (this.currentStatus==='cashier') && (new Date() - new Date(this.orderData.orderTime) >= 18000000)
      },
      workers() {
        if (this.orderData.details && this.orderData.details.length) {
          // console.log(this.orderData)
          // 可能存在都是销售，且无销售人, 统一在输出后作处理
          return [...new Set(this.orderData.details.map(order => {
            return order.servers.map(i => i.staffName)
          }).flat(2))].slice(0, 3).join('; ')
        }
        if (this.orderData.consumerOrderCardInfo && this.orderData.consumerOrderCardInfo.length) {
          return [...new Set(this.orderData.consumerOrderCardInfo.map(order => {
            return order.cardSellerList.map(i => i.staffName)
          }).flat(2))].slice(0, 3).join('; ')
        }
        // 可能是空单挂单, 统一在输出后作处理
      },
    },
    methods: {
      ...mapActions([
        "setBillId",
        "setPaperId",
      ]),
      takeOrder() {
        this.$emit("takeOrder", this.orderData);
        this.takeOrderLoading = true;
      },
      getOrderInfo(id) {
        this.orderDetailLoading = true;
        axios.get("/getConsumerOrderInfoById/" + id).then(res => {
          this.cashOrderInfo = res;
          this.setBillId(res.billId) // 新的统一处理账单id
          this.setPaperId(res.paperOrderId); // - 纸单
          this.ShowServiceOrderDetail = true;
          this.orderDetailLoading = false;
        });
      },
      restore(id) {
        this.restoreButtonLoading = true;
        axios.post(api.renewConsumerOrder.url, {id: id}).then(res => {
          this.$message({
            type: res.success ? "success" : "warning",
            message: res.message
          });
          this.restoreButtonLoading = false;
          this.$emit("afterRestore");
        });
      },
      // 预撤单
      async prepareRepealOrder(id) {
        let res = await axios.get(`/rescindConsumerOrderCheck/${id}`)
        this.$emit('checkCanBackout', {id: id, success: res.success, message: res.message})
      },
      superToPay() {
        this.$emit('superToPay', this.orderData)
      }
    }
  };
</script>
<style lang="scss" scoped>
  .card-item {
    width: 227px;
    height: 305px;
    position: relative;
    box-sizing: border-box;
    padding: 21px 15px 7px 15px;
    background-color: white;
    margin: 0 20px 30px 0;

    &::before {
      content: "";
      width: 104%;
      height: 12px;
      background: url("../../assets/img/bg_order_top.png");
      background-size: 100% 100%;
      position: absolute;
      top: -4px;
      left: -2%;
    }

    &::after {
      content: "";
      width: 227px;
      height: 13px;
      background: url("../../assets/img/bg_order_bottom.png") no-repeat center center/100% auto;
      position: absolute;
      bottom: -13px;
      right: 0;
      left: 0;
    }

    .account-paid {
      width: 90px;
      height: 90px;
      background: url("../../assets/img/icon_seal.png") no-repeat center center/100% auto;
      background-size: 70px 70px;
      position: absolute;
      bottom: 20px;
      left: 4px;
    }

    .staff-info {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      margin-bottom: 2px;
      line-height: 22px;
      .like-link:hover {
        cursor: pointer;
        color: rgb(88, 201, 243);
      }
      p {
        color: #4c495b;
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      span {
        flex: auto;
        color: #9eabbe;
        font-size: 12px;
        white-space: nowrap;
        text-align: right;
      }
    }

    .userInfo {
      width: 100%;
      height: auto;
      padding: 8px 0 9px 0;
      border-top: 1px dashed #f0f1f4;
      border-bottom: 1px dashed #f0f1f4;

      div {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
      }

      .u-top {
        margin-bottom: 7px;

        p {
          width: 60px;
          color: #4c495b;
          font-size: 12px;
        }

        span {
          color: #9eabbe;
          font-size: 12px;
          padding-top: 2px;
        }
      }

      .u-bottom {
        p {
          width: 60px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;

          span {
            color: #4c495b;
          }
        }

        span {
          color: #9eabbe;
          font-size: 12px;
          white-space: nowrap;
          &.user-info-box {
            display: inline-block;
            // flex-wrap: nowrap;
            // align-items: center;
            width: 140px;

            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;

            // width: 164px;
            // &:hover span{
            //   color: #58C9F3;
            //   cursor: pointer;
            // }

            // .user-phone {
            //   max-width: 78px;
            // }
            // .user-name {
            //   overflow: hidden;
            //   text-overflow:ellipsis;
            //   white-space: nowrap;
            //   // flex: 1;
            // }

          }
        }
      }
    }

    .productList {
      width: 100%;
      height: 118px;
      padding-top: 11px;
      padding-right: 5px;
      overflow-y: auto;
      overflow-x: hidden;
      border-bottom: 1px dashed #f0f1f4;

      .product-title {
        width: 100%;
        line-height: 17px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        font-size: 12px;
        color: #333333;
        font-weight: 600;
      }

      .productItem {
        width: 100%;
        line-height: 17px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        color: #333333;
        font-size: 12px;
        margin-top: 10px;

        div {
          width: 70%;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;

          span {
            max-width: 104px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }

          i {
            color: #9eabbe;
            font-style: normal;
          }
        }
      }
    }

    .productList::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    .productList::-webkit-scrollbar-thumb {
      border-radius: 5px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }

    .productList::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }

    .total-price-info {
      width: 100%;
      height: 19px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-end;
      align-items: center;
      margin: 10px 0;

      p {
        color: #999999;
        font-size: 12px;

        span:nth-child(2) {
          color: #ff671a;
          font-size: 10px;
          margin: 0 -3px;
        }

        span:nth-child(3) {
          color: #ff671a;
          font-size: 14px;
          font-weight: 600;
        }
      }

      p:nth-child(1) {
        span:nth-child(3) {
          font-size: 12px;
        }
      }
    }

    .bottom-manage-buttons {
      width: 100%;
      height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1; // 避免已付款遮挡撤单按钮
      .delete {
        color: #e6e7e9;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.6s;

        &:hover {
          color: #999999;
        }
      }
      .detail {
        width: 62px;
        color: white;
        font-size: 12px;
        text-align: center;
        display: flex;
        padding: 0;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        border: none;
        transition: all 0.6s;
        height: 32px;
        &:hover {
          filter: brightness(90%);
        }
      }
    }
  }

  .check-time-out {
    background: #FFE0E7;
    &::before {
      background-image: url("../../assets/img/bg_order_topred.png");
    }

    &::after {
      background-image: url("../../assets/img/bg_order_bottomred.png");
    }
    .time-out-flag {
      width: 60px;
      height: 45px;
      background: url('../../assets/img/bg_order_tagred.png');
      background-size: 100% 100%;
      position: absolute;
      z-index: 10;
      bottom: 40px;
      left: 16px;
    }
    .userInfo , .productList {
      border-color: #fff;
    }
  }
  .check-time-out-text  {
    color: #fff !important;
    // opacity: .9;
    &:hover {
      color: #41CAC0 !important;
    }
  }

  .btns-in-right {
    display: flex;
    flex-wrap: nowrap;
  }

  .abnormal-order-reason {
    p {
      font-size: 12px;
    }
    .reason-title {
      color: #9EABBE;
    }
  }
</style>
