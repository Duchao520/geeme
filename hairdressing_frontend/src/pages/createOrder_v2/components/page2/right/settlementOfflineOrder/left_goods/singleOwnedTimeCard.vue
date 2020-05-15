<template>
  <div
      class="single-card"
      :class="{
        active: value && value.id === card.id,
        disabled: disabled,
      }"
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
        <span class="card-type-tag">{{card.giftCard ? '礼品卡' : cardTypeFilter(card.cardType) }}</span>
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
      <!-- 卡项权益 -->
    <card-rights :visible="rightVisible" :cardInfo="card" @close="rightVisible = false"></card-rights>
    </div>
</template>
<script>
// 此组件仅供次卡、时间卡使用!!!!
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import CardRights from "@/components/createOrder/selectedCard/CardRights";
export default {
  components:{ CardRights},
  props: { // 此组件仅供次卡、时间卡使用!!!!
    card: {
      type: Object,
      required: true
    },
    value: {
      type: Object,
    },
  },
  data() { // 此组件仅供次卡、时间卡使用!!!!
    return {
      utils,
      rightVisible: false
    }
  },
  methods: { // 此组件仅供次卡、时间卡使用!!!!
    clickCard() {
      if (this.value && this.value.id === this.card.id) {
        this.$emit('input', {})
      } else {
        if(this.disabled) return;
        this.$emit('input', this.card)
      }
    },
    cardTypeFilter(type) {
      let map = {
        0: '身份卡',
        1: '储值卡',
        2: '次卡',
        3: '时间卡',
      }
      return map[type]
    },
    getTime(cardInfo) {
      if (!cardInfo.finishTime) {
        return "永久有效"
      }
      let finishTime = new Date(cardInfo.finishTime);
      return utils.formatDate(finishTime) + " 到期";
    },
    showCardRights() {
      this.rightVisible = true
    },
  },
  computed: { // 此组件仅供次卡、时间卡使用!!!!
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    }),
    // 此组件仅供次卡、时间卡使用!!!!
    countCardSelectedStatus() {
      let obj = {}
      this.$attrs.usefulCardList.map((goods, idx) => {
        obj[idx] = goods.countCardSelectedStatus
      })
      return obj
    },
    disabled() {
      if (this.card.cardType === 2) {
        // 禁用计算逻辑：
        // 如果是通用次数的卡：
        // 则将所有该卡的可用服务规格与所有的待支付服务匹配比较， 累加其数量，不超限的可以用
        // 如果是单独限制次数的卡：
        // 仅记录该规格的累计次数，计算是否超限
        let count = null
        let total = 0
        let limit = 0
        let checkAll = false // totalCountLimit > 0 时需要累加
        let checkAllSpidArr = [] // totalCountLimit > 0 时需要累加
        if (this.card.totalCountLimit < 0) {
          limit = this.card.listServiceCountInfo.filter(i => i.serviceSpecificationId === this.$attrs.detail.specificationId)[0].countLimit
        } else {
          checkAll = true
          limit = this.card.totalCountLimit
          this.card.listServiceCountInfo.map(i => {
            checkAllSpidArr.push(i.serviceSpecificationId)
          })
        }

        for(let key in this.countCardSelectedStatus) {
          let service = this.countCardSelectedStatus[key]
          if (Number(key) === this.$attrs.goodsIndex) {
            count = service.count
          } else {
            if (checkAll && checkAllSpidArr.includes(service.spid)) {
              total += service.countCardId === this.card.id ? service.count : 0
            }
            if (!checkAll && service.spid === this.$attrs.detail.specificationId) {
              total += service.countCardId === this.card.id ? service.count : 0
            }
          }
        }
        return limit < count + total - 1 // 被后端预减1了
      } else {
        return false
      }
    },
  },
  watch: {
    '$attrs.usefulCardList': {
      handler: function(v, o) {
        // 给计算属性用的监听
      },
      deep: true,
      immediate: true,
    },
  },
  filters: {
    
  },
}
</script>
<style lang='scss' scoped>

@mixin flex {
  display: flex;
  align-items: center;
}

.single-card {
  width: 230px;
  height: 145px;
  margin: 8px 0;
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
  background: rgba(0, 0, 0, .3);
}
.icon-icon_order_success {
  font-size: 46px;
  color: #58C9F3;
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
