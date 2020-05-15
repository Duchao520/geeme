<template>
  <div class="cards">
    <div class="img" @click="chooseCard(item)" v-for="(item,index) in cards" :key="index">
      <!-- <img :src="utils.formatPicImg(item.fileKey,'style',146)" :alt="item.cardTypeName"> -->
      <h6>{{item.cardTypeName}}</h6>
      <p v-html="item.tip"></p>
      <span class="reminder-info" v-if="currentEntry === 'shop' && index < 2">
        请前往总部管理台
      </span>
      <span class="reminder-info" v-if="currentEntry === 'brand' && index > 1">
        请前往门店管理台
      </span>
    </div>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      utils: utils,
      cards: [
        {
          fileKey: "ddde2607f54149ed87abb36ce749e1c3",
          cardTypeName: "身份卡",
          cardType: 0,
          tip: '凭此身份卡可以享受一系列会员权益<br/>此卡不可储值',
        },
        {
          fileKey: "4559165fe5ac4c219253fa762e944c42",
          cardTypeName: "储值卡",
          cardType: 1,
          tip: "此卡支持设置会员折扣、赠送金等权益<br/>卡金支持线上支付",
        },
        {
          fileKey: "73d2dd18b04b4277a5aa9996241eef7c",
          cardTypeName: "次卡",
          cardType: 2,
          tip: "此卡支持设置多项目组合固定次数套餐<br/>可用于线上支付",
        },
        {
          fileKey: "da2b214f2aab4a1a91f0b3cd1d0cff69",
          cardTypeName: "时间卡",
          cardType: 3,
          tip: "此卡支持设置多项目组合固定时间套餐<br/>可用于线上支付",
        }
      ]
    };
  },
  methods: {
    ...mapActions(["setCardType"]),
    chooseCard(card) {
      this.setCardType({ type: card.cardType, label: card.cardTypeName });
      if (this.currentEntry === 'shop' && card.cardType < 2) {
        this.$message({ message: "请前往总部管理台", type: "warning" });
        return;
      }
      if (this.currentEntry === 'brand' && card.cardType > 1) {
        this.$message({ message: "请前往门店管理台", type: "warning" });
        return;
      }
      // if (card.cardType === 3) {
      //   this.$message({ message: "开发中, 敬请期待", type: "warning" });
      //   return;
      // }
      let firstUseFlag = false
      if(card.cardType < 2) {
        firstUseFlag = true
      }
      this.$emit('vipCardStep', {
        data:'write-card-info',
        firstUseFlag
      })
    }
  },
  computed: {
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    })
  }
};
</script>
<style lang="scss" scoped>
.cards {
  display: flex;
  justify-content: space-around;
  width: 100%;
  box-sizing: border-box;
  padding: 40px 200px;
  position: relative;
  p {
    font-family: 'PingFangSC-Regular';
  }
  .img {
    position: relative;
    cursor: pointer;
    margin-right: 20px;
    width: 230px;
    height: 146px;
    &:nth-child(1) {
      background: url('../../../assets/images/vipCard/vipCard1.png') no-repeat;
      background-size: 100%;
    }
    &:nth-child(2) {
      background: url('../../../assets/images/vipCard/vipCard2.png') no-repeat;
      background-size: 100%;
    }
    &:nth-child(3) {
      background: url('../../../assets/images/vipCard/vipCard3.png') no-repeat;
      background-size: 100%;
    }
    &:nth-child(4) {
      background: url('../../../assets/images/vipCard/vipCard4.png') no-repeat;
      background-size: 100%;
    }
    img {
      width: 230px;
      height: 146px;
      display: block;
      margin: 0;
      padding: 0;
    }
    border-radius: 8px;
    color: white;
    h6 {
      position: absolute;
      left: 11px;
      top: 11px;
      font-size: 18px;
      font-weight: 300;
    }
    p {
      position: absolute;
      left: 11px;
      top: 42px;
      font-size: 10px;
      line-height: 15px;
    }
  }
  .reminder-info {
    font-size: 12px;
    color: #999;
    position: absolute;
    bottom: -20px;
    left: 0;
  }
}
</style>
