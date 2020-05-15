<template>
  <div style="position: relative;">
    <div class="single-card">
      <!-- 动画默认抛第一个img标签， 所以在这里放一个标签-->
      <img class="img-background" :src="utils.formatPicImg(card.cardCover)" />
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
        <div class="card-rights">
          <!-- <div class="shadow" @click.stop="showCardDetail">详情</div> -->
        </div>
        <!-- 这里只需显示卡的售价 -->
        <div class="last-money">
          <p>￥{{card.cardType == 1 ? card.cardFirstRechargeNum : card.cardPrice}}</p>
        </div>
      </div>
    </div>
    <div class="goods-name">
      <p>{{goodsName}}</p>
      <p>{{goodsSpecification}}</p>
    </div>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import MembershipCardDetailModel from "@/components/createOrder/goodsCard/MembershipCardDetailModel";

export default {
  components: { MembershipCardDetailModel },
  props: {
    card: {
      type: Object,
      required: true
    },
    value: {
      type: Object
    }
  },
  data() {
    return {
      utils,
      showCardDetailVisible: false
    };
  },
  methods: {
    clickCard() {
      // console.log(this.card);
    },
    cardTypeFilter(type) {
      let map = {
        0: "身份卡",
        1: "储值卡",
        2: "次卡",
        3: "时间卡"
      };
      return map[type];
    }
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    billInfo() {
      return this.$store.state.bill;
    },
    goodsName() {
      return this.billInfo.selectedGoods[this.card.index].name;
    },
    goodsSpecification() {
      return this.billInfo.selectedGoods[this.card.index].specificationName;
    }
  },
  filters: {}
};
</script>
<style lang='scss' scoped>
@mixin flex {
  display: flex;
  align-items: center;
}

.goods-name {
  position: absolute;
  top: 30px;
  left: 150px;
  z-index: 500;
  p {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}
.single-card {
  margin-bottom: -20px;
  margin-left: -20px;
  // margin-top: 10px;
  width: 180px;
  height: 110px;
  border-radius: 8px;
  transform: scale(0.7);
  // cursor: pointer;
  // overflow: hidden;
  position: relative;
  &.disabled {
    cursor: not-allowed;
  }
  .top-con {
    @include flex;
    // margin: 10px 0 0 10px;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
    justify-content: space-between;
    .top-con-left {
      @include flex;
      position: relative;
      z-index: 100;
      .image-brand-logo {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 15px;
      }
      p {
        line-height: 30px;
        margin-left: 6px;
        font-size: 15px;
        font-weight: 400;
        width: 130px;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.card-rights {
  color: #fff;
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 10;
  .shadow {
    line-height: 22px;
    background: rgba(0, 0, 0, 0.5);
    font-size: 12px;
    padding: 0 6px;
    border-radius: 4px;
    cursor: pointer;
  }
}

.card-type-tag {
  position: absolute;
  font-size: 8px;
  padding: 0 3px;
  border: 1px solid #fff;
  border-radius: 8px;
  top: 30px;
  left: 36px;
  color: #fff;
}

.per-pay-card-bottom-line {
  display: flex;
  align-items: center;
  .last-money {
    position: absolute;
    z-index: 10;
    bottom: 10px;
    right: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    color: #fff;
    p {
      height: 22px;
      margin-bottom: 0px;
      line-height: 24px;
    }
  }
}

.img-background {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
</style>
