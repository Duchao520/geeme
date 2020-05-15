<template>
  <div class="card-main-info-root">
    <h5>基本信息</h5>
    <table class="table-info">
      <tr>
        <td>交易类型：</td>
        <td>{{detail.operateType===0?'开卡':'续期'}}</td>
      </tr>
      <tr>
        <td>订单编号：</td>
        <td>{{detail.orderNo}}</td>
      </tr>
      <tr>
        <td>下单时间：</td>
        <td>{{detail.orderTime}}</td>
      </tr>
      <tr>
        <td>交易来源：</td>
        <td>{{detail.orderSource===0?'门店开单':'线上订单'}}</td>
      </tr>
      <tr>
        <td>下单门店：</td>
        <td>{{currentShopInfo.brandName +" " + detail.storeName }}</td>
      </tr>
      <tr class="shop-remark">
        <td>门店备注：</td>
        <td>
          {{detail.remarks}}
          <g-button
            name="备注"
            type="remark"
            icon="icon_operate_edit"
            style="float:right"
            @click="$emit('remark')"
          ></g-button>
        </td>
      </tr>
      <tr class="customer-info">
        <td>客户信息：</td>
        <td>
          <div class="cus-info-box">
            <img class="img" :src="utils.formatPicImg(detail.customerHeadPortrait,'style',40)" alt>
            <div class="text">
              <p>{{detail.businessName}}</p>
              <p>{{detail.customerPhone}}</p>
            </div>
            <p class="level">{{detail.customerMemberLevel}}</p>
          </div>
          <p class="look" @click="toCustomerInfo">
            <span class="icon iconfont icon-icon_operate_eyes"></span>
            <span>查看客户档案</span>
          </p>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
export default {
  props: {
    detail: Object
  },
  data() {
    return {
      utils: utils
    };
  },
  computed: {
    currentShopInfo() {
      return this.$store.state.manage.currentShopInfo;
    }
  },
  methods:{
    toCustomerInfo() {
      this.toPagesInNewTags(`/shop-inner/customerRecord/${this.detail.customerId}`)
    },
  }
};
</script>
<style lang="scss" scoped>
.card-main-info-root {
  h5 {
    font-size: 14px;
  }
  .table-info {
    margin-top: 10px;
    width: 100%;
    font-size: 12px;
    line-height: 27px;
    color: #666666;
    > tr {
      display: flex;
      > td:nth-child(1) {
        flex: 0 0;
        white-space: nowrap;
      }
      > td:nth-child(2) {
        flex: 1 1 auto;
      }
    }
    .shop-remark {
      padding-bottom: 10px;
      border-bottom: 1px dashed #f0f1f4;
      margin-bottom: 10px;
    }
    .customer-info {
      .cus-info-box {
        display: flex;
        box-sizing: border-box;
        padding: 10px;
        border: 1px solid #f0f1f4;
        border-radius: 4px;
        max-width: 174px;
        position: relative;
        .img {
          width: 40px;
          border-radius: 40px;
          height: 40px;
          display: block;
          margin-right: 15px;
        }
        .text {
          > p:nth-child(1) {
            font-size: 14px;
            line-height: 24px;
          }
          > p:nth-child(2) {
            font-size: 12px;
            line-height: 16px;
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
        font-size: 14px;
        color: #58c9f3;
        cursor: pointer;
      }
    }
  }
}
</style>
