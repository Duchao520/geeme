<template>
  <div class="detail-con" :class="{first:index===0,last:isLast}">
    <div class="service-detail">
      <img
        :src="utils.formatPicImage(transfer(detail.image), 'style', 70, 'someone')"
        alt="图片"
      />
      <div class="detail-text">
        <div class="goods-name">
          <span>{{detail.serviceName}}</span>
          <span>￥{{detail.unitPrice}}</span>
        </div>
        <div class="detail-text-service">
          <p>
            <span style="margin-right:5px; ">{{detail.specificationName || '默认'}}</span>
            <span v-if="detail.serverTime">{{detail.serverTime}}分钟</span>
          </p>
          <span>X{{detail.count}}</span>
        </div>
        <div class="detail-text-service">
          <span>{{servers(detail)}}</span>
        </div>
        <div class="detail-text-service" v-if="detail.note">
          <span style="width:58px;">备注：</span>
          <span :title="detail.note">{{detail.note}}</span>
        </div>
      </div>
    </div>
    <p class="discount-info" v-for="(discount,index) in discounts(detail)" :key="index">
      <span>{{discount.name}}</span>
      <span>￥{{discount.value}}</span>
    </p>
    <!-- 如果是产品 要显示发货方式， 如果是服务不处理 -->
    <p class="payment" :class="{'production': detail.goodsType === 'production'}">
      <span v-if="detail.goodsType === 'production'">
        <span class="send-type-tags">
          {{detail.sendType ? '物流配送' : '门店自提'}}
        </span>
      </span>
      <span>
        <span>
          {{detail.paymentStatus ? '实付款: ' : '应收款: '}}
        </span>
        <span style="color:#F52D56">￥{{finalPrice}}</span>
      </span>
    </p>
    <p class="payment-status">
      <span>{{detail.online ? "线上订单" : "门店开单"}}</span>
      <span> | </span>
      <span>{{detail.paymentStatus ? "已支付" : "未支付"}}</span>
      <span v-if="detail.paymentTypeName">&nbsp;({{payType}})</span>
    </p>
    <p v-if="cardName && detail.paymentTypeName == '储值卡'" class="payment-status">{{cardName}}</p>
    <p class="horizontal-line"></p>
  </div>
</template>
<script>
  import * as utils from "@/assets/js/utils";
  import {mapGetters} from "vuex";

  export default {
    props: {
      detail: Object,
      index: Number,
      isLast: Boolean,
      cardName: String,
    },
    data() {
      return {
        utils: utils
      };
    },
    computed: {
      ...mapGetters(["identityCardDiscountInfo"]),
      discountInfo() {
        let discountInfo = this.identityCardDiscountInfo.filter(item => {
          let specificationsSnapshotId = item.serviceSpecificationsSnapshotId || item.productSpecificationsSnapshotId;
          return item.goodsType === this.detail.goodsType && specificationsSnapshotId === this.detail.snapshotId
        })[0];
        return discountInfo
      },
      finalPrice() {
        return this.discountInfo && this.discountInfo.finalPrice || this.detail.unitFinalPrice
      },
      payType() {
        switch (this.detail.paymentTypeName) {
          case '储值卡' :
            if (this.detail.online) {
              return this.detail.paymentTypeName
            } else {
              let chargeMoneyCost = this.detail.chargeMoneyCost ? `储值金￥${this.detail.chargeMoneyCost}` : ''
              let giftMoneyCost = this.detail.giftMoneyCost ? `赠送金￥${this.detail.giftMoneyCost}` : ''
              return `${chargeMoneyCost} ${giftMoneyCost}`
            }
          default:
            return this.detail.paymentTypeName
        }
      }
    },
    methods: {
      transfer(img) {
        if (!img) {
          return "";
        } else {
          return img.replace(/[\[,\]]/g, "").split(" ")[0];
        }
      },
      servers(data) {
        var arr = (data.assistantOrSalers || []).map(item => item.staffName);
        if (data.goodsType === 'service') {
          // return `服务者: ${data.server};　辅助工位: ${arr.join(' / ')}` // v1
          let workStations1 = data.stationOne.length ? `工位1: ${data.stationOne.map(i=> {return i.staffName || i.name}).join(" 、 ")}; ` : ``
          let workStations2 = data.assistantOrSalers.length ? `工位2: ${data.assistantOrSalers.map(i=> {return i.staffName || i.name}).join(" 、 ")}; ` : ``
          let workStations3 = data.stationThree.length ? `工位3: ${data.stationThree.map(i=> {return i.staffName || i.name}).join(" 、 ")}; ` : ``
          return `${workStations1}${workStations2}${workStations3}`
         } else {
          return `销售人: ${arr.join(' / ')}`
        }
      },
      discounts(data) {
        var discounts = data.preferentialInfo;
        let discountArr = [];
        if (discounts) {
          let discountsName = {
            storePreference: "门店优惠", //以后有什么优惠内容，直接在此配置即可
            identityCardPreference: "身份卡优惠",
            prepaidCardPreference: "储值卡优惠",
            // memberPreference: "会员身份优惠",
            memberPreference: `${discounts.levelName}${discounts.isBirthday ? '生日' : ''}优惠`,
            redPacketPreference: "红包优惠",
            timeCardPreference: '次卡优惠',
            countCardPreference: '时间卡优惠',
            couponPreference: '优惠券优惠',
            pointsDeductMoney: `积分优惠(${discounts.usePointsNum}积分)`,
            /*
              countCardPreference: null
              identityCardPreference: null
              isBirthday: '生日优惠',
              isBirthday: null
              levelName: "帝王级别会员"
              memberPreference: 66
              prepaidCardPreference: null
              redPacketPreference: null
              storePreference: 0
              timeCardPreference: null
            */
          };
          for (let i in discounts) {
            if (discounts[i] && discountsName[i]) {
              discountArr.push({
                name: discountsName[i],
                value: discounts[i]
              })
            }
          }
          // 这种方法可能出现多种优惠？ 理由借口实际打折的字段来显示优惠
          if (discountArr.length > 1) {
            // discountArr.filter(i => i.name).indexOf()
            discountArr =  discountArr.filter(i => i.name.indexOf(data.paymentTypeName) != -1)
          }
        }
        return discountArr;
      }
    }
  }
</script>
<style lang="scss" scoped>
  .detail-con {
    box-sizing: border-box;

    .service-detail {
      display: flex;
      box-sizing: border-box;

      img {
        display: block;
        width: 60px;
        height: 60px;
        border-radius: 5px;
      }

      .detail-text {
        // flex: 1 0 auto;
        flex: 1;
        box-sizing: border-box;
        padding: 0 7px;
        line-height: 20px;

        .detail-text-service, .goods-name {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          line-height: 20px;
        }

        .goods-name {
          color: #333333;
          font-size: 14px;
          margin-bottom: 3px;
        }
      }
    }

    .payment, .payment-status {
      justify-content: flex-end;
      line-height: 25px;
      font-size: 12px;
      display: flex;
      color: #333333;
    }
    .payment.production {
      justify-content: space-between;
    }
    .send-type-tags {
      border-radius: 12px;
      padding: 2px 4px;
      font-size: 12px;
      border: 1px solid rgba(193, 192, 201, 1);
      color: #C1C0C9;
    }
    .discount-info {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      line-height: 30px;
    }


    .payment-status {
      span:nth-child(2) {
        margin: 0 5px;
      }
    }

    .horizontal-line {
      width: 100%;
      border-top: 1px dashed #EFEFF4;
      margin: 10px 0;
    }
  }

  .detail-con.first {
    margin-top: 5px;
  }

  .detail-con.last {
    .horizontal-line {
      display: none;
    }
  }
</style>
