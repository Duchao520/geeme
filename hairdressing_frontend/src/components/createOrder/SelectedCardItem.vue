<template>
  <div class="card-item-root">
    <!-- 新购时的身份卡和储值卡的显示 -->
    <div class="card-table-box" v-if="showInfo(0,[0,1])">
      <div class="box-item name">
        <p class="box-item-top">卡项名称</p>
        <div class="box-item-bottom">
          <p class="card-name" :title="cardInfo.cardName">{{cardInfo.cardName}}</p>
        </div>
      </div>
      <div class="box-item price">
        <p class="box-item-top">售价</p>
        <p class="box-item-bottom" style="color:#FF6D61">￥{{cardInfo.chargeMoney}}</p>
      </div>
      <div class="box-item add" v-if="cardInfo.cardType===1">
        <p class="box-item-top">充值金</p>
        <!--cardFirstRechargeNum：新购时的价格  -->
        <p class="box-item-bottom">{{cardInfo.chargeMoney}}</p>
      </div>
      <div class="box-item give" v-if="cardInfo.cardType===1">
        <p class="box-item-top">赠送金</p>
        <p class="box-item-bottom">{{cardInfo.giftMoney}}</p>
      </div>
      <div class="box-item" v-if="cardInfo.cardType===0">
        <p class="box-item-top">有效期限</p>
        <p class="box-item-bottom">
          <span v-if="cardInfo.validPermanent || cardInfo.validNum===-1">永久有效</span>
          <span
            v-else
          >{{cardInfo.validNum}}{{cardInfo.validUnit==='month'?'个月':(cardInfo.validUnit==='year'?'年':'天')}}</span>
        </p>
      </div>
      <div class="box-item del">
        <p class="box-item-top">
          <i @click="deleteGoods(cardInfo,index)" class="icon iconfont icon-icon_operate_delete"></i>
        </p>
        <p class="box-item-bottom"></p>
      </div>
    </div>
    <!-- 续卡时的身份卡和储值卡的显示 -->
    <div class="card-table-box" v-if="showInfo(1,[0,1])">
      <div class="box-item name">
        <p class="box-item-top">卡项名称</p>
        <div class="box-item-bottom">
          <p class="card-name" :title="cardInfo.cardName">{{cardInfo.cardName}}</p>
        </div>
      </div>
      <div class="box-item add" v-if="cardInfo.cardType===1">
        <p class="box-item-top">充值金</p>
        <p class="box-item-bottom">{{cardInfo.chargeMoney}}</p>
      </div>
      <div class="box-item give" v-if="cardInfo.cardType===1">
        <p class="box-item-top">赠送金</p>
        <p class="box-item-bottom">{{cardInfo.giftMoney}}</p>
      </div>
      <div class="box-item add">
        <p class="box-item-top">期限延长</p>
        <p class="box-item-bottom">{{cardInfo.validPermanent?'永久有效': cardInfo.extendTime}}</p>
      </div>
      <div class="box-item add" v-if="cardInfo.cardType===0">
        <p class="box-item-top">续卡费用</p>
        <p class="box-item-bottom">{{cardInfo.chargeMoney}}</p>
      </div>
      <div class="box-item del">
        <p class="box-item-top">
          <i @click="deleteGoods(cardInfo,index)" class="icon iconfont icon-icon_operate_delete"></i>
        </p>
        <p class="box-item-bottom"></p>
      </div>
    </div>
    <!-- 新购的时候时间卡的显示 -->
    <div class="card-table-box" v-if="showInfo(0,[3])">
      <div class="box-item name">
        <p class="box-item-top">卡项名称</p>
        <div class="box-item-bottom">
          <p class="card-name" :title="cardInfo.cardName">{{cardInfo.cardName}}</p>
        </div>
      </div>
      <div class="box-item price">
        <p class="box-item-top">售价</p>
        <p class="box-item-bottom" style="color:#FF6D61">￥{{cardInfo.cardPrice || cardInfo.chargeMoney}}</p>
      </div>
      <div class="box-item">
        <p class="box-item-top">有效期限</p>
        <p class="box-item-bottom">
          <span v-if="cardInfo.validPermanent">永久有效</span>
          <span
            v-else
          >{{cardInfo.validNum}}{{cardInfo.validUnit==='month'?'个月':(cardInfo.validUnit==='year'?'年':'天')}}</span>
        </p>
      </div>
      <div class="box-item del">
        <p class="box-item-top">
          <i @click="deleteGoods(cardInfo,index)" class="icon iconfont icon-icon_operate_delete"></i>
        </p>
        <p class="box-item-bottom"></p>
      </div>
    </div>
    <!-- 新购的时候次卡的显示 -->
    <div class="card-table-box" v-if="showInfo(0,[2])">
      <div class="box-item name">
        <p class="box-item-top">卡项名称</p>
        <div class="box-item-bottom">
          <p class="card-name" :title="cardInfo.cardName">{{cardInfo.cardName}}</p>
        </div>
      </div>
      <div class="box-item price">
        <p class="box-item-top">售价</p>
        <p class="box-item-bottom" style="color:#FF6D61">￥{{cardInfo.cardPrice || cardInfo.chargeMoney}}</p>
      </div>
      <div class="box-item">
        <p class="box-item-top">次数</p>
        <p class="box-item-bottom">{{countLimit}}次</p>
      </div>
      <div class="box-item del">
        <p class="box-item-top">
          <i @click="deleteGoods(cardInfo,index)" class="icon iconfont icon-icon_operate_delete"></i>
        </p>
        <p class="box-item-bottom"></p>
      </div>
    </div>
  </div>
</template>
<script>
  /**
   * 会员卡的类型:      0–身份卡，1–储值卡，2–次卡，3–时间卡
   * operateType:      0-开卡，1-续期
   */
  import {mapState} from "vuex";

  export default {
    props: {
      cardInfo: Object,
      index: Number
    },
    computed: {
      ...mapState({
        openGoodsType: state => state.bill.currentChooseTypeAndSortOneId.sortGoodsType,
      }),
      countLimit() {
        let totalCountLimit = this.cardInfo.totalCountLimit;
        if (totalCountLimit > 0) {
          return totalCountLimit
        }
        let list = this.cardInfo.listServiceCountInfo;
        if (!list || list.length === 0) {
          return 0;
        }
        return list.map(item => item.countLimit).reduce((f, n) => f + n);
      }
    },
    methods: {
      deleteGoods(detail, index) {
        this.$emit("deleteGoods", detail, index);
      },
      showInfo(operateType, cardType) {
        let cardInfo = this.cardInfo;
        return cardType.includes(cardInfo.cardType) && operateType === cardInfo.operateType
      }
    }
  };
</script>
<style lang="scss" scoped>
  .card-item-root {
    .card-table-box {
      width: 100%;
      display: flex;

      .box-item {
        flex: auto;

        .box-item-top {
          line-height: 30px;
          font-size: 12px;
          color: #999999;
          box-sizing: border-box;
          padding: 0 10px;
        }

        .box-item-bottom {
          font-size: 13px;
          min-height: 50px;
          box-sizing: border-box;
          padding: 10px;
          color: #333333;
          display: flex;
          align-items: center;
          border-top: 1px solid #f0f1f4;

          .card-name {
            white-space: nowrap;
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }

      .box-item.name {
        width: 25%;
      }

      .box-item.price {
        flex: 0 1 25%;
      }

      .del {
        flex: 0 0 30px;

        i {
          cursor: pointer;
          transition: all 0.6s;
          line-height: 1;

          &:hover {
            color: #787878;
          }
        }
      }
    }
  }
</style>
