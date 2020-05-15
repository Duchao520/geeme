<template>
  <div class="footer-left">
    <p>
      <span>总金额</span>
      <span>
         <span>¥</span>
         <dynamic-num :number="accountBill.totalMoney"></dynamic-num>
      </span>
    </p>
    <p>
      <span>待付款</span>
      <span class="tobe-paid">
         <span>¥</span>
         <dynamic-num :number="accountBill.moneyToBePaid"></dynamic-num>
      </span>
    </p>
  </div>
</template>
<script>
  import {mapGetters, mapState} from "vuex";

  export default {
    props: {
      goodsList: Array
    },
    data() {
      return {
        computedGoodsList: [], // ?? 尝试处理监听 ??
      }
    },
    computed: {
      ...mapGetters(["identityCardDiscountInfo", "alreadySelectedCard", "alreadySelectedType"]),
      ...mapState({
        listOfMemberLevelPrices: state => state.bill.listOfMemberLevelPrices,
        selectedVipCardInfo: state => state.bill.billCardInfo.selectedVipCardInfo
      }),
      accountBill() {
        let totalMoney = 0;
        let moneyToBePaid = 0;
        this.goodsList.forEach(element => {
          if (!element.deleted) {//前提：未被删除
            /**
             * 条件A1：服务和产品
             * */
            if (["service", "production"].includes(element.goodsType)) {
              // console.log('====>')
              // console.log(element)
              // console.log(element.tempFinalPrice)
              if (element.paymentStatus) {
                // console.log('-1-')
                totalMoney += element.received || element.tempFinalPrice || 0; // 可能都是0 或者没有 ...
              } else if (!element.enableCardDiscount && this.alreadySelectedCard) { // 选了会员卡， 并且使用固定持卡会员价
                // console.log('-2-')
                // console.log(element.tempFinalPrice)
                totalMoney += element.tempFinalPrice;
                moneyToBePaid += element.tempFinalPrice;  
              } else {
                // console.log('-3-')
                let price = this.unitPrice(element);
                totalMoney += price;
                moneyToBePaid += price;
              }
            } else {
              /**
               * 条件A2：卡项
               * */
              let price = element.chargeMoney - (element.storePreference || 0);
              totalMoney += price;
              moneyToBePaid += price;
            }
          }
        });
        return {totalMoney, moneyToBePaid};
      },
    },
    methods: {
      calcMemberPrice(goodsItem) {
        let discountInfo = this.identityCardDiscountInfo.filter(item => {
          let specificationsSnapshotId =
            item.serviceSpecificationsSnapshotId ||
            item.productSpecificationsSnapshotId;
          return (
            item.goodsType === goodsItem.goodsType &&
            specificationsSnapshotId === goodsItem.snapshotId
          );
        })[0];
        if (discountInfo) {
          return (
            (goodsItem.shopPrice * goodsItem.num) * discountInfo.discount - (goodsItem.storePreference || 0)
          );
        } else {
          return (
            goodsItem.memberPrice * goodsItem.num -
            (goodsItem.storePreference || 0)
          );
        }
      },
      queryMemberLevelPriceInfo(detail) {
        let matchedPrice = this.listOfMemberLevelPrices.filter(item => {
          return detail.goodsType === item.goodsType && detail.specificationId === item.specificationId
        })[0];
        if (matchedPrice) {
          return matchedPrice.discountPrice * detail.num - (detail.storePreference || 0)
        } else {
          return detail.memberPrice * detail.num - (detail.storePreference || 0)
        }
      },
      unitPrice(detail) {
        /*选了卡的，返回卡价。未选卡的，返回会员价*/
        if (this.alreadySelectedCard) {
          return this.calcMemberPrice(detail)
        } else {
          return this.queryMemberLevelPriceInfo(detail)
        }
      }
    },
    watch: {
      // goodsList: {
      //   handler: function(v, o) {
      //     console.log()
      //     console.log('总价计算组件_监听') // 卡切换不会进这里...
      //     console.log(v)
      //     // this.computedGoodsList = v
      //   },
      //   deep: true,
      //   immediate: true,
      // },
    }
  }
</script>
<style lang="scss" scoped>
  .footer-left {
    height: 76px;
    font-size: 16px;
    flex: auto;
    padding: 15px 0 20px 20px;
    line-height: 25px;
    box-sizing: border-box;

    .tobe-paid {
      color: #FF6D61;
    }
  }
</style>
