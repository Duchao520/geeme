<template>
  <div style="margin-bottom: 10px;">
    <div
      class="single-card"
      :class="{active: value.customerCardId === card.customerCardId, disabled: !card.canPay}"
      @click="clickCard"
      :style="{'background-image': `url(${utils.formatPicImg(card.cardCover)})`}"
    >
      <div class="top-con">
        <div class="top-con-left">
          <img
            class="image-brand-logo"
            :src="utils.formatPicImg(currentInfo.brandLogo,'circle',40)"
            alt
          />
          <p>{{card.cardName}}</p>
        </div>
        <span class="card-type-tag">{{card.giftCard ? '礼品卡' : cardTypeFilter(cardType)}}</span>
        <!-- <span class="card-type-tag">{{card.giftCard ? '礼品卡' : cardTypeFilter(card.cardType)}}</span> -->
      </div>
      <div class="per-pay-card-bottom-line">
        <div class="card-rights" @click.stop="showCardRights">【权益】</div>
        <div class="last-money" v-if="card.cardType == 1">
          <p>
            <span>余额</span>
            <span>￥{{Number(card.rechargeMoney + card.giftMoney).toFixed(2)}}</span>
          </p>
          <p>(含赠送金：￥{{card.giftMoney}})</p>
        </div>
        <div class="last-money" v-if="card.cardType !== 1">
          <p style="margin-bottom: 0px;">{{getTime(card)}}</p>
        </div>
      </div>
      <div class="active-cover">
        <div class="icon-box">
          <div class="back">
            <i class="icon iconfont icon-icon_order_success"></i>
          </div>
        </div>
      </div>
    </div>
    <div  class="total-pay-money" v-if="card.canPay">
      此卡折后金额: ￥{{Number((card.finalTotalCharge).toFixed(2))}}
    </div>
    <div class="cant-use-info" v-if="!card.canPay">{{card.errorMessage}}</div>
    <!-- 卡项权益 -->
    <card-rights :visible="rightVisible" :cardInfo="{...card, cardType: cardType}" @close="rightVisible = false"></card-rights>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import CardRights from "@/components/createOrder/selectedCard/CardRights";
export default {
  components:{ CardRights },
  props: {
    card: {
      type: Object,
      required: true
    },
    value: {
      type: Object
    },
    cardType: {
      type: Number,
      default: 1,
      // 0: '身份卡',
      // 1: '储值卡',
      // 2: '次卡',
      // 3: '时间卡',
    },
  },
  data() {
    return {
      utils,
      rightVisible: false
    };
  },
  methods: {
    ...mapActions([
      'setSelectedPrepaidCardForPay',
      'setSelectedIdentityCardForPay',
    ]),
    clickCard() {
      if (this.value.customerCardId === this.card.customerCardId) {
        this.$emit('input', {customerCardId: null})
      } else {
        this.$emit('input', this.card)
      }
    },
    showCardRights() {
      this.rightVisible = true
    },
    cardTypeFilter(type) {
      let map = {
        0: "身份卡",
        1: "储值卡",
        2: "次卡",
        3: "时间卡"
      };
      return map[type];
    },
    getTime(cardInfo) {
      if (!cardInfo.finishTime) {
        return "永久有效"
      }
      let finishTime = new Date(cardInfo.finishTime);
      return utils.formatDate(finishTime) + " 到期";
    },
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    }),
  },
  filters: {}
};
</script>
<style lang='scss' scoped>
@mixin flex {
  display: flex;
  align-items: center;
}

.single-card {
  width: 230px;
  height: 145px;
  // margin: 8px 0;
  border-radius: 8px;
  margin-right: 12px;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  overflow: hidden;
  &.disabled {
    cursor: not-allowed;
  }

  .top-con {
    @include flex;
    margin: 10px 0 0 10px;
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
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
.active-cover {
  display: none;
  position: absolute;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
}
.icon-icon_order_success {
  font-size: 46px;
  color: #58c9f3;
}
.single-card.active {
  .active-cover {
    display: block;
    .icon-box {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .back {
      width: 44px;
      height: 44px;
      background: #fff;
      line-height: 46px;
      border-radius: 50%;
    }
  }
}

.total-pay-money {
  height: 38px;
  line-height: 38px;
  font-size: 12px;
  color: #666;
}
.cant-use-info {
  height: 38px;
  line-height: 38px;
  font-size: 12px;
  color: #f52d56;
  cursor: not-allowed;
}
.money-inputs {
  display: flex;
  flex-wrap: nowrap;
  height: 32px;
  line-height: 32px;
}
.small-input {
  width: 65px;
  height: 32px;
  margin: 0 4px;
  /deep/ .el-input__inner {
    padding: 0;
    height: 32px;
    line-height: 32px;
    text-indent: 8px;
  }
}

.card-name {
  color: #fff;
}

.card-rights {
  color: #fff;
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 10;
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

.per-pay-card-bottom-line {
  display: flex;
  align-items: center;
  .last-money {
    position: absolute;
    bottom: 10px;
    right: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    color: #fff;
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
</style>
