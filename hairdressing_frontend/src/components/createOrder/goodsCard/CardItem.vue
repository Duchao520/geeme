<template>
  <li
    class="card-style"
    @click="chooseCard(cardInfo,$event)"
    :style="{
        cursor:allowed(cardInfo)?'not-allowed':'pointer',
        backgroundImage:`url(${utils.formatPicImg(cardInfo.cardCover)})`
    }"
    v-loading="cardLoading"
  >
    <img class="img-background" :src="utils.formatPicImg(cardInfo.cardCover)">
    <div class="name">
      <div
        class="img-logo"
        :style="{backgroundImage:`url(${utils.formatPicImg(currentInfo.brandLogo,'circle',40)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }"
      ></div>
      <p>{{cardInfo.cardName}}</p>
    </div>

    <span class="card-type-tag">
      {{cardInfo.cardType|cardTypeFilter}}
    </span>

    <div class="recharge" v-if="cardInfo.operateType!==1" @click.stop="showCardDetail_">详情</div>
    <div class="recharge" v-if="manageButton && cardInfo.operateType===1">{{manageButton}}</div>
    <div
      class="price"
      v-if="cardInfo.cardType===1 || openGoodsType==='card'"
    >￥{{cardPrice}}
    </div>
    <div class="price days" v-if="cardInfo.cardType===0&&openGoodsType!=='card'&&useful">
      {{getTime(cardInfo)}}
      <span class="span">天</span>
    </div>
    <card-recharge
      :cardRechargeVisible="cardRechargeVisible"
      :cardToSelecteInfo="cardToSelecteInfo"
      :CardRenewalRuleInfo="CardRenewalRuleInfo"
      @close="cardRechargeVisible=false"
      @select-card-renewal-rule="selectCardRenewalRule"
    ></card-recharge>
    <membership-card-detail-model
      ref="membershipCardDetailModel"
      :visible="showCardDetail"
      :cardId="cardInfo.id"
      @close="showCardDetail = false"
    ></membership-card-detail-model>
  </li>
</template>
<script>
  import * as utils from "@/assets/js/utils";
  import * as axios from "@/util/axios";
  import * as api from "@/assets/js/interface";
  import CardRecharge from "@/components/createOrder/CardRecharge";
  import MembershipCardDetailModel from "@/components/createOrder/goodsCard/MembershipCardDetailModel";

  export default {
    components: {CardRecharge, MembershipCardDetailModel},
    props: {
      cardInfo: Object,
      selectedCardIds: Array,
      type: {
        type: String,
        default: "newBuy" // newBuy || cardAdd
      },
      useful: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        utils: utils,
        cardRechargeVisible: false,
        cardToSelecteInfo: {},
        event: null,
        CardRenewalRuleInfo: {},
        cardLoading: false,
        showCardDetail: false
      };
    },
    computed: {
      currentInfo() {
        return this.$store.state.manage.currentInfo;
      },
      billInfo() {
        return this.$store.state.bill;
      },
      openGoodsType() {
        return this.billInfo.currentChooseTypeAndSortOneId.sortGoodsType;
      },
      manageButton() {
        let cardInfo = this.cardInfo;
        //续卡
        if (cardInfo.operateType) { // 0 开卡， 1 续卡， 2自由卡
          switch (cardInfo.cardType) {
            case 0:
              return "续期";
            case 1:
              return "续卡升级";
            default:
              return false
          }
        }
        return false
      },
      cardPrice() {
        let card = this.cardInfo;
        if (card.remainingSum) {
          return card.remainingSum;
        }
        switch (card.cardType) {
          case 1:
            return card.cardFirstRechargeNum;
            break;
          default:
            return card.cardPrice;
            break;
        }
      },
    },
    methods: {
      getTime(cardInfo) {
        let finishTime = new Date(cardInfo.finishTime);
        let currentTime = new Date();
        let differDays = Math.floor(
          (finishTime.getTime() - currentTime.getTime()) / 24 / 3600 / 1000
        );
        return differDays;
      },
      /**
       * 会员卡的类型:0–身份卡，1–储值卡，2–次卡，3–时间卡
       */
      // 续卡
      cardInfoAddConvert(data) {
        return {
          cardKindId: data.cardKindId,
          cardKindSnapshotId: data.cardKindSnapshotId,
          cardSellerList: [],
          paymentStatus: false,
          chargeMoney: null,
          giftMoney: data.giftMoney,
          operateType: 1,
          remarks: null,
          remainingSum: data.remainingSum,
          cardType: data.cardType,
          cardName: data.cardName,
          cardCover: data.cardCover,
          deleted: false,
          validPermanent: data.validPermanent,
          extendTime: null,
          finishTime: data.finishTime,
          customerCardId: data.customerCardId,
          storeRemarkCardNo: data.storeRemarkCardNo || ''
        };
      },
      cardInfoConvert(data) {
        return {
          ...data,
          cardKindId: data.cardKindId,
          cardKindSnapshotId: data.cardKindSnapshotId,
          cardSellerList: [],
          paymentStatus: false,
          chargeMoney:
            [0, 2, 3].includes(data.cardType) ? data.cardPrice : data.cardFirstRechargeNum,
          giftMoney: data.cardGiftNum,
          operateType: data.operateType,
          remarks: null,
          remainingSum: null,
          cardType: data.cardType,
          cardName: data.cardName,
          cardCover: data.cardCover,
          deleted: false,
          validNum: data.validNum,
          validUsedNum: data.validUsedNum,
          validUnit: data.validUnit,
          validPermanent: data.validPermanent,
          extendTime: null,
          customerCardId: null,
          storeRemarkCardNo: data.storeRemarkCardNo || ''
        };
      },
      chooseCard(cardInfo, event) {
        if (!this.useful) {
          return;
        }
        if (this.type === "newBuy") {
          /**
           * 卡项的新购
           */
          var cardInfo = this.cardInfoConvert(cardInfo);
          // console.log({cardInfo});
          let bool =
            this.selectedCardIds &&
            this.selectedCardIds.indexOf(cardInfo.cardKindId) !== -1;
          if (bool) {
            return;
          }
          this.$emit("chooseCard", cardInfo, event, bool);
        } else {
          /**
           * 卡项的续卡
           */
          this.cardLoading = true;
          var cardInfo = this.cardInfoAddConvert(cardInfo);
          axios
            // 获取开项的续卡规则信息 
            .post('/getCardRenewalUpgradeInfos', {cardKindId: cardInfo.cardKindId, storeId: this.currentInfo.shopId})
            .then(res => {
              // console.log(res);
              this.CardRenewalRuleInfo = res;
              this.cardToSelecteInfo = cardInfo;
              this.cardRechargeVisible = true;
              this.event = event;
              this.cardLoading = false;
            });
        }
      },
      selectCardRenewalRule(cardToSelecteInfo) {
        console.log(cardToSelecteInfo)
        let event = this.event;
        this.$emit("chooseCard", cardToSelecteInfo, event, false);
        this.cardRechargeVisible = false;
      },
      allowed(cardInfo) {
        return (this.selectedCardIds &&
          this.selectedCardIds.length > 0 &&
          this.selectedCardIds.indexOf(cardInfo.cardKindId) !== -1) ||
          !this.useful
      },
      showCardDetail_() {
        this.showCardDetail = true;
        this.$refs.membershipCardDetailModel.getCardDetail();
      }
    },
    filters: {
      cardTypeFilter(type) {
        let map = {
          0: '身份卡',
          1: '储值卡',
          2: '次  卡',
          3: '时间卡',
        }
        return map[type]
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/assets/css/order/shadow.scss";

  .card-style {
    width: 230px;
    height: 145px;
    border-radius: 8px;
    overflow: hidden;
    margin: 0 30px 20px 0;
    color: white;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    border: 1px solid #efefef;
    background-position: center;
    background-size: cover;
    @include goods-shadow-hover();

    .img-background {
      display: none;
      width: 100%;
      height: 100%;
    }

    .name {
      line-height: 1;
      font-size: 14px;
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      align-items: center;

      .img-logo {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 7px;
      }
    }

    .price {
      position: absolute;
      right: 10px;
      bottom: 10px;
      line-height: 1;
      font-size: 16px;
    }

    .days {
      display: flex;
      align-items: center;

      .span {
        font-size: 14px;
      }
    }

    .recharge {
      position: absolute;
      left: 10px;
      bottom: 10px;
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
    top: 40px;
    left: 50px;
  }
</style>
