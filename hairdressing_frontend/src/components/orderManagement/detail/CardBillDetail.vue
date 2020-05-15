<template>
  <div class="card-bill-detail">
    <h5>订单明细</h5>
    <table class="table">
      <tr class="tr-title">
        <td>卡项名称</td>
        <td v-if="detail.isUpgrade">升级后卡名</td>
        <td>基本权益</td>
        <td>有效期限</td>
        <td>售价/充值</td>
        <td>赠送</td>
        <td>金额</td>
      </tr>
      <tr class="tr-content">
        <td>
          <div class="detail-info">
            <div class="img-box">
              <img class="img" :src="utils.formatPicImg(detail.cardCover,'style',40)" alt>
              <p class="card-type">{{cardType[detail.cardType]}}</p>
            </div>
            <div class="detail-info-text">
              <h6>{{detail.cardName}}</h6>
              <p>{{detail.consumerCardNo}}
              </p>
              <div class="img-tag" v-if="detail.operateType === 1">
                <!-- <span>1</span> -->
                续
              </div>
            </div>
          </div>
        </td>
        <td v-if="detail.isUpgrade">
          {{detail.upgradeCardKindName}}
        </td>
        <td>
          <span v-if="detail.discountInfo">
            <p v-for="(text,index) in detail.discountInfo.split(' ')" :key="index">{{text}}</p>
          </span>
        </td>
        <td>{{detail.validTime}}</td>
        <td>{{detail.chargeNum}}</td>
        <td>{{detail.giftNum}}</td>
        <td>{{detail.chargeNum}}</td>
      </tr>
      <tr v-if="detail.storePreference" class="tr-discounts">
        <td colspan="4"></td>
        <td>门店优惠：</td>
        <td>￥{{detail.storePreference}}</td>
      </tr>
      <tr v-if="detail.received" class="tr-discounts real">
        <td colspan="4"></td>
        <td>实收款：</td>
        <td>{{detail.received}}</td>
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
      utils: utils,
      cardType: {
        0: "身份卡",
        1: "储值卡",
        2: "次卡",
        3: "时间卡"
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.card-bill-detail {
  h5 {
    line-height: 20px;
    font-size: 14px;
    color: #333333;
    margin-bottom: 15px;
  }
  .table {
    border: 1px solid #f0f1f4;
    border-spacing: 0;
    width: 100%;
    text-indent: 15px;
    .tr-title {
      height: 34px;
      background: #dee1e6;
      font-size: 12px;
      color: #5f6368;
      td:not(:first-child){
        text-align: center;
      }
    }
    .tr-content {
      height: 90px;
      font-size: 12px;
      color: #333333;
      vertical-align: middle;
      .detail-info {
        display: flex;
        box-sizing: border-box;
        padding-left: 15px;
        .img-box {
          position: relative;
          .img {
            width: 94px;
            height: 60px;
            border-radius: 5px;
            display: block;
          }
          .card-type {
            position: absolute;
            bottom: 8px;
            right: 7px;
            background: #ffffff;
            height: 22px;
            width: 56px;
            border-radius: 11px;
            text-align: center;
            line-height: 22px;
            font-size: 14px;
            color: #666666;
            white-space: nowrap;
            text-indent: 0;
          }
        }
        .detail-info-text {
          position: relative;
          h6 {
            font-size: 16px;
            line-height: 35px;
          }
          p {
            font-size: 12px;
            color: #999999;
          }
          .img-tag {
            position: absolute;
            display: flex;
            justify-content: center;
            bottom: 10px;
            right: 22px;
            background-color: #58C9F3;
            color: #fff;
            border-radius: 50%;
            font-size: 10px;
            width: 18px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            text-indent: 0; /* need */ 
          }
        }
      }
      td:not(:first-child){
        text-align: center;
      }
      td{
        border-bottom: 1px solid #f0f1f4;
      }
    }

    .tr-discounts{
      td{
        text-align: right;
        color: #AAAAAA;
        font-size: 12px;
        line-height: 30px;
      }
      td:nth-child(2){
        text-align: right;
      }
      td:nth-child(3){
        padding-right: 20px;
      }
    }
    .tr-discounts.real{
      td{
        color: #FF6D61;
        font-size: 14px;
      }
    }
  }
}
</style>
