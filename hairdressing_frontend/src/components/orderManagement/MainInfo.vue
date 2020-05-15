<template>
  <div class="main-info">
    <h3>订单信息</h3>
    <p>
      <span>订单编号：</span>
      <span>{{orderInfo.serialCode||'-'}}</span>
    </p>
    <p>
      <span>订单来源：</span>
      <span>{{orderInfo.online?'线上订单':'门店开单'}}</span>
    </p>
    <p>
      <span>付款方式：</span>
      <span>{{payType(orderInfo.payChannel)||'-'}}</span>
    </p>
    <p v-if="isProduct&&orderInfo.logisticsId">
      <span>发货方式：</span>
      <span>{{orderInfo.selfPickUp?"门店自提":"物流配送"}}</span>
    </p>
    <p v-if="isProduct">
      <span>产品来源：</span>
      <span>{{orderOrigin}}</span>
    </p>
    <div class="remark" v-if="orderInfo.customerNote">
      <p class="remark-title">客户备注：</p>
      <div class="remark-right">
        <p>{{orderInfo.customerNote||'-'}}</p>
      </div>
    </div>
    <div class="remark">
      <p class="remark-title">商家备注：</p>
      <div class="remark-right">
        <span class="text">{{orderInfo.frontDeskNote||'-'}}</span>
        <g-button
          type="remark"
          name="备注"
          icon="icon_operate_edit"
          class="remark-button"
          @click="$emit('remarkVisibleToTrue',isProduct?'store':'front',orderInfo.frontDeskNote)"
        ></g-button>
      </div>
    </div>
    <div v-if="!orderInfo.online&&!isProduct">
      <div class="hr-line"></div>
      <p>
        <span>服务单号：</span>
        <span>{{orderInfo.serialCode}}</span>
      </p>
      <p>
        <span>　开单人：</span>
        <span>{{orderInfo.staffName}} {{shopStaffsInfo[orderInfo.staffId] ? `(${shopStaffsInfo[orderInfo.staffId]})` : ''}}</span>
      </p>
    </div>
    <div v-if="showAppointInfo">
      <div class="hr-line" style=""></div>
      <p>
        <span>预约时间：</span>
        <span>{{detail.appointmentInfo&&detail.appointmentInfo.dueTime || '-'}}</span>
      </p>
      <p>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;服务者：</span>
        <span>{{detail.appointmentInfo&&detail.appointmentInfo.staffName || '-'}}</span>
      </p>
    </div>
    <div class="hr-line"></div>
    <div>
      <span>客户信息：</span>
      <div class="info-wrap">
        <div class="info">
          <div class="img">
            <img
              :src="utils.formatPicImage(detail.customerInfo.headPortrait, 'style', 40, detail.customerInfo.sex==='男'?'boy':'girl')"
              alt="头像"
              class="headImage"
            >
            <img src="@/assets/img/male_tip.png" class="grade" v-if="detail.customerInfo.sex==='男'">
            <img src="@/assets/img/female_tip.png" alt class="grade" v-else>
          </div>
          <div class="name">
            <p :title="detail.customerInfo.name">
              {{detail.customerInfo.name}}
              <span v-if="detail.customerInfo.groupLeader" style="color:#F52D56;">(团长)</span>
            </p>
            <p>{{detail.customerInfo.mobile}}</p>
          </div>
          <p class="level">{{detail.customerInfo.memberLevel}}</p>
        </div>
        <!-- 暂时不知道有没有根据门店客户id获取品牌客户id的接口 -->
        <div class="look" @click="toCustomerInfo(detail.customerInfo.id)" v-if="currentEntry !== 'brand'">
          <i class="icon iconfont icon-icon_operate_eyes"></i>
          <span>查看客户档案</span>
        </div>
      </div>
    </div>
    <div class="goods-receiving-information" v-if="isProduct&&!orderInfo.selfPickUp">
      <div class="hr-line"></div>
      <div class="goods-receiving-content">
        <p class="remark-title">收货信息：</p>
        <div class="goods-receiving-content-right">
          <div class="name">
            <h6>{{orderInfo.consignee}}</h6><span>{{orderInfo.consigneePhone}}</span>
          </div>
          <p class="address">{{orderInfo.consigneeAddress}}</p>
        </div>
      </div>
      <div class="hr-line"></div>
      <h3>物流信息</h3>
      <p>
        <span>发货时间：</span>
        <span>{{orderInfo.deliverStart||'-'}}</span>
      </p>
      <p>
        <span>快递公司：</span>
        <span>{{logisticsInfo.logisticsCompany||'-'}}</span>
      </p>
      <p>
        <span>快递单号：</span>
        <span>{{logisticsInfo.trackingNum||'-'}}</span>
      </p>
    </div>
  </div>
</template>
<script>
  import * as utils from "@/assets/js/utils";
  import {mapActions, mapState} from "vuex";
  export default {
    props: {
      detail: Object,
      logisticsInfo: Object,
      isProduct: Boolean
    },
    data() {
      return {
        utils: utils,
      };
    },
    computed: {
      ...mapState({
        shopStaffsInfo: state => state.shopStaffsInfo.infoMap, // -员工编号
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
      }),
      orderOrigin() {
        let origin = this.orderInfo.productInfoForOrder.productSource;
        let type = {
          FROM_STORE: "门店自营",
          FROM_BRAND: "总部直供",
          FROM_MARKET: "供应市场"
        };
        return type[origin];
      },
      showAppointInfo() {
        return !this.isProduct
      },
      orderInfo() {
        return this.detail.orderInfo
      }
    },
    methods: {
      toCustomerInfo(id) {
        this.currentEntry == 'brand' ? this.toPagesInNewTags(`/brand-inner/customerRecord/${id}`) : this.toPagesInNewTags(`/shop-inner/customerRecord/${id}`)
      },
      payType(type) {
        if (type === null) {
          return "";
        }
        if (typeof type !== "number") {
          return type;
        }
        let payTypes = {
          0: "微信",
          1: "支付宝",
          2: "现金",
          3: "会员卡"
        };
        return payTypes[type];
      }
    }
  };
</script>
<style lang="scss" scoped>
  @mixin font-style($lh,$fs,$col) {
    line-height: $lh;
    font-size: $fs;
    color: $col;
  }

  .main-info {
    h3 {
      color: #333333;
      font-size: 14px;
      line-height: 40px;
    }

    .remark {
      display: flex;

      .remark-title {
        white-space: nowrap;
      }

      .remark-right {
        flex: auto;
        word-break: break-word;

        .remark-button {
          float: right;
        }
      }
    }

    .info-wrap {
      display: inline-block;
      vertical-align: top;
    }

    .info {
      display: flex;
      width: 174px;
      height: 60px;
      border: 1px solid #f0f1f4;
      border-radius: 3px;
      box-sizing: border-box;
      padding: 10px;
      position: relative;

      .img {
        position: relative;
        width: 40px;
        height: 40px;

        .headImage {
          display: block;
          width: 40px;
          height: 40px;
          border-radius: 20px;
          background: #efefef;
        }

        .grade {
          position: absolute;
          top: 0;
          right: 0;
          width: 15px;
          height: 15px;
          border-radius: 7px;
          display: block;
        }
      }

      .name {
        margin-left: 7px;

        p:nth-child(1) {
          font-size: 14px;
          margin-bottom: -5px;
          margin-top: -2px;
          height: 24px;
          overflow: hidden;
          text-overflow:ellipsis;
          width: 100px;
          white-space: nowrap;
        }
      }

      .level {
        position: absolute;
        top: 0;
        right: 0;
        display: block;
        height: 14px;
        border-radius: 7px 0 0 7px;
        box-sizing: border-box;
        padding: 0 5px;
        font-size: 10px;
        line-height: 14px;
        color: #fff;
        background: linear-gradient(to right, #9DA8CC, #B2BBDC);
      }
    }

    .look {
      cursor: pointer;
      font-size: 14px;
      color: #58c9f3;
    }

    .goods-receiving-information {
      .goods-receiving-content {
        display: flex;

        .remark-title {
          flex: 0 0 auto;
          white-space: nowrap;
        }

        .goods-receiving-content-right {
          flex: auto;
          height: 80px;
          border-radius: 2px;
          border: 1px solid #F0F1F4;
          box-sizing: border-box;
          padding: 10px;
          margin-bottom: 10px;

          .name {
            margin-bottom: 4px;

            h6 {
              @include font-style(20px, 14px, #666666);
              display: inline-block;
            }

            span {
              @include font-style(17px, 12px, #666666);
              margin-left: 4px;
            }
          }

          .address {
            @include font-style(17px, 12px, #999);
          }
        }
      }
    }

    .hr-line {
      width: 100%;
      border-top: 1px dashed #F0F1F4;
      margin-bottom: 10px;
    }
  }

  .get-goods-info {
    width: 260px;
    height: 80px;
    border: 1px solid #f0f1f4;
    box-sizing: border-box;
    padding: 5px 10px 10px 10px;
    border-radius: 4px;
    display: inline-block;
    vertical-align: top;
    font-size: 12px;
    line-height: 20px;
  }
</style>
