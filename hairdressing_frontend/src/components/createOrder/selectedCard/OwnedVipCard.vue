<template>
  <div class="identify-card-root">
    <div class="identify-card" :style="{
      backgroundImage:`url(${utils.formatPicImg(cardInfo.cardCover,'style',146)})`
    }"
         :class="{'active-card':active,'disable':!cardInfo.canPay}"
         @click="clickCard(cardInfo)"
    >
      <div class="active-cover" v-if="active">
        <div class="icon-box">
          <i class="icon iconfont icon-icon_order_success"></i>
        </div>
        <p class="right-interests" v-if="origin!=='card'" @click.stop="rightVisible = true">【权益】</p>
      </div>
      <div class="identify-card-content">
        <div class="top-con">
          <div class="top-con-left">
            <img class="image-brand-logo" :src="utils.formatPicImg(currentInfo.brandLogo,'circle',40)" alt="">
            <p>{{cardInfo.cardName}}</p>
          </div>
          <span class="card-type-tag">
            {{cardInfo.giftCard ? '礼品卡' :  cardTypeFilter(cardInfo.type) }}
          </span>
          <!-- <div class="recommend" v-if="index===0">推荐</div> -->
        </div>
        <div class="per-pay-card-bottom-line" v-if="cardInfo.type==='prePaid'">
          <p class="right-interests" v-if="!active && origin!=='card'" @click.stop="rightVisible = true">【权益】</p>
          <i v-else></i>
          <div class="last-money">
            <p><span>余额</span><span>￥{{(cardInfo.rechargeMoney + cardInfo.giftMoney).toFixed(2)}}</span></p>
            <p>(含赠送金：￥{{cardInfo.giftMoney}})</p>
          </div>
        </div>
        <div class="dead-time" v-if="cardInfo.type!=='prePaid'">
          <p class="right-interests" v-if="!active && origin!=='card'" @click.stop="rightVisible = true">【权益】</p>
          <i v-else></i>
          <!-- 身份卡之类的需要展示商品/服务的折扣权益 -->
          <!-- <p v-if="cardInfo.type==='identity'"></p> -->
          <p>{{getTime(cardInfo)}}</p>
        </div>
      </div>
    </div>
    <div class="discount-money" v-if="cardInfo.canPay">折后金额：<span>￥{{ Math.round(cardInfo.finalTotalCharge*100)/100}}</span></div>
    <div class="discount-money error" v-if="!cardInfo.canPay">{{cardInfo.errorMessage}}</div>
    <card-rights :visible="rightVisible" :cardInfo="cardInfo" @close="rightVisible = false"></card-rights>
  </div>
</template>
<script>
  /*
  * 会员卡的类型:  0–身份卡，1–储值卡，2–次卡，3–时间卡
  * */
  import * as utils from "@/assets/js/utils";
  import CardRights from "@/components/createOrder/selectedCard/CardRights";
import { mapState } from 'vuex';
  export default {
    components:{ CardRights},
    props: {
      cardInfo: Object,
      index: Number,
      value: Number,
      origin: {
        type: String
      }
    },
    data() {
      return {
        utils: utils,
        rightVisible:false
      }
    },
    computed: {
      currentInfo() {
        return this.$store.state.manage.currentInfo;
      },
      active() {
        return this.value === this.cardInfo.customerCardId
      },
    },
    methods: {
      clickCard(cardInfo) {
        if (!cardInfo.canPay) {
          return
        }
        if (cardInfo.customerCardId === this.value) {
          this.$emit("input", null);
        } else {
          this.$emit("input", cardInfo.customerCardId);
        }
      },
      getTime(cardInfo) {
        if (!cardInfo.finishTime) {
          return "永久有效"
        }
        let finishTime = new Date(cardInfo.finishTime);
        return utils.formatDate(finishTime)+" 到期";
      },
      cardTypeFilter(type) {
        let map = {
          identity: '身份卡',
          prePaid: '储值卡',
          countCard: '次卡',
          timeCard: '时间卡',
        }
        return map[type]
      }
    },
    filters: {
      
    }
  }
</script>
<style lang="scss" scoped>
  @mixin flex {
    display: flex;
    align-items: center;
  }

  .identify-card-root {
    width: 230px;
    .identify-card {
      width: 230px;
      height: 145px;
      border-radius: 8px;
      background-size: cover;
      background-position: center;
      cursor: pointer;
      position: relative;
      // 卡选中项
      .active-cover {
        position: absolute;
        width: 230px;
        height: 145px;
        background: rgba(0,0,0,.3);
        border-radius: 8px;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon-box {
          color: #58C9F3;
          background: #fff;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          font-size: 46px;
          line-height: 46px;
          .icon {
            font-size: 46px;
          }
        }
        .right-interests {
          position: absolute;
          left: 12px;
          bottom: 11px;
          color: #fff;
        }
      }
      // 卡具体内容
      .identify-card-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        height: 100%;
        padding: 11px 12px;
        color: #fff;
        font-size: 14px;
        position: relative;
        .top-con {
          @include flex;
          justify-content: space-between;
          .top-con-left {
            @include flex;
            .image-brand-logo {
              display: block;
              width: 30px;
              height: 30px;
              border-radius: 15px;
            }
            p {
              line-height: 30px;
              margin-left: 6px;
              font-weight: 600;
              width: 130px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .recommend {
            width: 41px;
            line-height: 23px;
            background: #F52D56;
            border-radius: 2px;
            text-align: center;
            white-space: nowrap;
          }
        }
        .dead-time {
          display: flex;
          justify-content: space-between;
          .right-interests{
            transition: color 0.1s;
            cursor: pointer;
            text-align:baseline;
            &:hover{
              color: rgba(255, 255, 255, 0.8);
            }
          }
        }
        .per-pay-card-bottom-line {
          position: relative;
          .right-interests{
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 1;
            transition: color 0.1s;
            cursor: pointer;
            text-align:baseline;
            &:hover{
              color: rgba(255, 255, 255, 0.8);
            }
          }
        }
        .last-money {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          p:nth-child(1) {
            margin-bottom: 2px;
            span {
              vertical-align: middle;
            }
            span:nth-child(2) {
              font-size: 20px;
            }
          }
        }
      }
      &:before {
        transition: all 0.3s;
        border-radius: 8px;
        content: '';
        width: 100%;
        height: 100%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        border-radius: 8px;
        position: absolute;
        top: 0;
        left: 0;
        border: 2px solid rgba(86, 131, 255, 0);
      }
    }

    // 不显眼, 抛弃
    // .active-card.identify-card {
    //   &:before {
    //     box-shadow: 0px 2px 4px 0px rgba(189, 206, 255, 0.67);
    //     border: 2px solid rgba(86, 131, 255, 1);
    //   }
    // }

    .disable.identify-card {
      cursor: not-allowed;
    }
    .discount-money {
      line-height: 40px;
      font-size: 14px;
      margin-bottom: 10px;
      color: #999999;
      span {
        color: #FF6D61;
        font-weight: 600;
      }
    }
    .discount-money.error {
      color: #F52D56;
      font-size: 12px;
    }
  }
  .card-type-tag {
    position: absolute;
    font-size: 8px;
    padding: 0 3px;
    border: 1px solid #fff;
    border-radius: 8px;
    top: 40px;
    left: 50px;
    color: #fff;
  }
</style>
