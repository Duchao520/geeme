<template>
  <li
    class="single-card-item card"
    @click="chooseGoodsOrSpecification($event, card)"
    :style="{
        cursor:allowed(card)?'not-allowed':'pointer',
    }"
  >
    <singleOwnedCard :card="card" />
  </li>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import animation from "@/util/animation";
import singleOwnedCard from "./components/singleOwnedCard"; // 卡项样式组件
export default {
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      utils,
      animation: null
    };
  },
  mounted() {},
  methods: {
    ...mapActions([
      "saveSelectedCard",
      "setCompareMemberLevelPrice",
    ]),
    chooseGoodsOrSpecification(event, card) {
      if (this.allowed(card)) return this.$message.warning("已经选择了该卡！");
      this.animation = () =>
        animation.animationEvent(event, 100, 0.4, this.billInfo.carPosition);
      this.saveSpecificationToOrder(0);
    },
    // 将数据存入vuex, 如果当前购物车已经有这个卡项, 则禁止选取这个
    saveSpecificationToOrder(idx) {
      // 存入购物车的数量不得大于20,核销的数量可能超过20 ，所以这里限制大于等于20
      if (this.alreadySelectedListsLen >= 20) return this.$message.error('开单卡项数量不得超过20！')
      let card = JSON.parse(JSON.stringify(this.card));
      // delete card.specificationInfoList // 将规格以外的数据存入，需要格式化的再覆盖
      // delete card.levelIds
      card.cardKindId = card.id; // 这个字段的作用是为了禁止选取重复的会员卡做判断用的
      delete card.id; // 这个会和取单时冲突， 且新增时不需要给后端
      let params = {
        ...card, // 这行不要写在下方[需覆盖]后面
        count: 1, // 商品数量, 卡项数量为1
        goodsType: "card",
        storePreference: null, // 门店优惠
        tempFinalPrice:
          this.card.cardPrice > 0
            ? this.card.cardPrice
            : this.card.cardFirstRechargeNum, // 临时最终价
        deleted: false, // 是否删除
        storeRemark: "", // 门店备注
        paymentStatus: false, // 未支付
        specificationId: this.card.cardKindSnapshotId,
        shopPrice:
          this.card.cardType == 1
            ? this.card.cardFirstRechargeNum
            : this.card.cardPrice,
        snapshotId: this.card.cardKindSnapshotId, // 对应的快照id
        specificationName: this.card.cardName,
        memberPrice:
          this.card.cardType == 1
            ? this.card.cardFirstRechargeNum
            : this.card.cardPrice,
        enableCardDiscount: this.card.enableCardDiscount, // 是否允许卡打折???
        staffId: this.billInfo.billingStaff.staffId, // 作为开单人
        staffName: this.billInfo.billingStaff.name, // 作为开单人
        // assistantOrSalers: [], // 工位2， 销售人?
        cardSellerList: [], // 卡项辅助销售
        operateType: 0, // 开卡先给0
        storeRemarkCardNo: "", // 备注卡号
        chargeMoney:
          this.card.cardType == 1
            ? this.card.cardFirstRechargeNum
            : this.card.cardPrice, // 部分组件使用到这个字段 在这里添加一下
        giftMoney: this.card.cardType == 1 ? this.card.cardGiftNum : null, // 部分组件使用到这个字段 在这里添加一下
        // 卡项信息里面要添加部分字段。。
        storeId: this.currentInfo.shopId,
        customerId: this.billInfo.customerInfo.id,
        // 共用次数的标识字段？ 好像后端不一定需要
        countLimitStatus: this.card.totalCountLimit > 0,
        countLimit: this.card.totalCountLimit
      };
      delete card.operate;
      console.log(params)
      // return
      this.saveSelectedCard(params); // 对象是push进入
      // 将商品用动画抛入购物车
      this.animation();
    },
    // 卡项是否允许选取的标识
    allowed(cardInfo) {
      // 允许取单删除后重新选择该卡项 用deleted实现
      let selectedCard = this.billInfo.selectedCard.filter(i => !i.deleted)
      let ids = selectedCard.map(i => i.cardKindId);
      return ids && ids.length && ids.indexOf(cardInfo.id) !== -1;
    }
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    }),
    alreadySelectedListsLen() {
      let count = 0;
      let list = ['service', 'product'].includes(this.billInfo.currentLeftType) ? this.billInfo.selectedGoods || [] : this.billInfo.selectedCard || []
      list.forEach(item => {
        if (!item.deleted) {
          count++;
        }
      });
      return count;
    },
  },
  components: { singleOwnedCard }
};
</script>
<style lang='scss' scoped>
@import "@/assets/css/order/shadow.scss";
@import "@/assets/css/mixin.scss";
.single-card-item {
  @include goods-shadow-hover;
  @include box-shadow-card();
  border-radius: 6px;
  cursor: pointer;
  margin: 10px 10px;
  position: relative;
  display: flex;
  flex-direction: column;
}
// 图片模式
.single-card-item.card {
  border-radius: 8px;
}

.cards {
  display: flex;
  flex-wrap: wrap;
}
</style>
