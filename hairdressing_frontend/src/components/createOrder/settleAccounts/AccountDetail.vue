<template>
  <div class="left-area">
    <img src="@/assets/img/bg_order_top_long.png" class="bgimg">
    <div class="title">
      <h4 style="font-size:18px;margin-right:6px;color:#333333">{{detail.brandName}}</h4>
      <p style="font-size:16px;color:#666666">{{detail.shopName}}</p>
    </div>
    <div class="detail-line">
      <div class="circle cl"></div>
      <div class="circle cr"></div>
      <div class="inline"></div>
      <p>消费明细</p>
      <div class="inline"></div>
    </div>
    <div class="detail-box">
      <div class="datail-container-list" v-if="isServiceOrProduct">
        <goods-detail :goodsList="goodsList"></goods-detail>
      </div>
      <div class="datail-container-list" v-if="!isServiceOrProduct">
        <card-detail :cardList="cardList"></card-detail>
      </div>
    </div>
    <div class="money-info" style="margin-top:10px;">
      <div class="order-info-line">
        <div></div>
        <span>待付金额</span>
        <div></div>
      </div>
      <h3>
        <span class="yang">￥</span>
        <span>{{detail.finalPrice}}</span>
      </h3>
    </div>
    <div class="money-info">
      <div class="order-info-line">
        <div></div>
        <span>服务单信息</span>
        <div></div>
      </div>
      <div class="order-info-d">
        <p>
          <span>下单时间</span>
          <span>{{detail.createTime}}</span>
        </p>
        <p>
          <span>服务时间</span>
          <span>{{detail.serviceTime}}</span>
        </p>
        <p>
          <span>服务单号</span>
          <span>{{detail.serialCode}}</span>
        </p>
        <p>
          <span>客户姓名</span>
          <span>{{detail.customerName}}</span>
        </p>
        <p>
          <span>客户手机号</span>
          <span>{{detail.mobile}}</span>
        </p>
        <p>
          <span>开单人</span>
          <span>{{detail.staffName}}</span>
        </p>
        <p>
          <span>收银员</span>
          <span>{{detail.cashierName}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  // 这个是结算的详情组件
  import * as utils from "@/assets/js/utils";
  import GoodsDetail from "@/components/order/billDetail/GoodsDetail";
  import CardDetail from "@/components/order/billDetail/CardDetail";
  import {mapGetters,mapState} from "vuex";

  export default {
    components: {CardDetail, GoodsDetail},
    props: {
      detail: Object
    },
    data() {
      return {
        utils: utils
      };
    },
    computed: {
      ...mapGetters(["identityCardDiscountInfo"]),
      ...mapState({
        userInfo:state=>state.manage.userInfo // 以前从这里取的收银员
      }),
      isServiceOrProduct() {
        let billList = this.detail.consumerGoodsOrderInfoList || [];
        return billList.length > 0 ? true : false;
      },
      goodsList() {
        return this.detail.consumerGoodsOrderInfoList || []
      },
      cardList() {
        return this.detail.listConsumerOrderCardInfo || []
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/assets/css/scrollbar.scss";

  .left-area {
    width: 343px;
    height: 100%;
    background: white;
    position: relative;

    .bgimg {
      position: absolute;
      width: 102%;
      left: -1%;
    }

    .title {
      box-sizing: border-box;
      padding-left: 16px;
      display: flex;
      line-height: 56px;
    }

    .detail-line {
      position: relative;
      box-sizing: border-box;
      padding: 0 16px;
      display: flex;
      align-items: center;

      .circle {
        position: absolute;
        top: -2px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #f1f2f7;
      }

      .cl {
        left: -10px;
      }

      .cr {
        right: -10px;
      }

      p {
        margin: 0 5px;
        white-space: nowrap;
        color: #999999;
      }

      .inline {
        flex: auto;
        border-top: 1px dashed #efeff4;
      }
    }
  }

  .line {
    border-top: 1px dashed #efeff4;
    width: 100%;
    margin-top: 5px;
  }


  .money-info {
    box-sizing: border-box;
    padding: 0 16px;
    color: #999999;

    .order-info-line {
      display: flex;
      align-items: center;

      div {
        flex: auto;
        border-top: 1px dashed #efeff4;
      }

      span {
        margin: 0 5px;
        white-space: nowrap;
      }
    }

    h3 {
      flex: auto;
      text-align: center;
      font-size: 20px;
      line-height: 60px;
      color: #f52d56;

      .yang {
        font-size: 14px;
        margin-right: -6px;
      }
    }

    .order-info-d {
      margin-top: 10px;

      p {
        display: flex;
        flex: auto;
        justify-content: space-between;
        line-height: 25px;

        span:nth-child(2) {
          color: #333333;
        }
      }
    }
  }

  .datail-container-list {
    box-sizing: border-box;
    padding: 0 16px;

    .payment {
      flex: auto;
      display: flex;
      justify-content: flex-end;
      color: #333333;
      line-height: 25px;
    }

    .sale-discount {
      display: flex;
      justify-content: space-between;
      color: #333333;
      line-height: 25px;
    }

    .pay-type {
      display: flex;
      justify-content: flex-end;

      span {
        margin: 0 4px;
        color: #333333;
      }

      span:nth-last-child(1) {
        margin-right: 0;
      }
    }
  }

  .detail-box {
    max-height: 330px;
    overflow-y: auto;
    overflow-x: hidden;
    @include scroll-bar(4px, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
  }
</style>
