<template>
  <div class="discount-info" v-loading.fullscreen="loading">
    <div class="preference-list">
      <div class="times-card-discount flex-discount-goods" v-if="Object.values(discountInfos.payByTimesCard).length">
        <div class="left-box card-left-box">
          次卡/时间卡扣减:
        </div>
        <div class="right-items">
          <div 
            class="service-item" 
            v-for="(service, idx) in Object.values(discountInfos.payByTimesCard)"
            :key="`${idx}-${+(new Date())}`"
          >
            <span class="item-name">
              {{service.goodsName}} {{service.spName === '默认' ? '' : service.spName}} 
            </span>
            <span class="item-count">
              ×{{service.count}}
            </span>
            <span class="item-price">
              ￥{{ Number((service.count * service.money).toFixed(2)) }}
            </span>
          </div>
        </div>
      </div>
      <div class="online-paied flex-discount-goods" v-if="Object.values(discountInfos.online).length">
        <div class="left-box">
          商城订单:
        </div>
        <div class="right-items">
          <div 
            class="goods-item" 
            v-for="(goods, idx) in Object.values(discountInfos.online)"
            :key="`${idx}-${+(new Date())}`"
          >
            <span class="item-name">
              {{goods.goodsName}} {{goods.spName === '默认' ? '' : goods.spName}} 
            </span>
            <span class="item-count">
              ×{{goods.count}}
            </span>
            <span class="item-price">
              ￥{{ Number((goods.money).toFixed(2)) }}
            </span>
          </div>
        </div>
      </div>
      <div class="sotre-preference">
        <div class="left-box">
          门店优惠:
        </div>
        <div class="right-items">
          <span class="item-price">
            ￥{{discountInfos.storePreference}}
          </span>
        </div>
      </div>
    </div>
    <!-- 身份卡选择(仅服务/产品) -->
    <div class="identity-card-choose" 
      v-if="hasUsefulIdentityCard"
    >
      <div class="light-font">身份卡:</div>
      <div 
        class="selected-card" 
        @click="getIdentityCardsList"
      >
        <span class="over-flow-box">{{ billInfo.selectedIdentityCardForPay.cardName }}</span>
        <i style="margin-left: 4px;" class="icon iconfont icon-icon_open_on like-link" v-if="!this.billInfo.billId"></i>
      </div>
    </div>
    <div class="need-pay">
      <div class="order-info-line">
        <div></div>
        <span>待付金额</span>
        <div></div>
      </div>
      <div class="need-pay-money">
        ￥{{needPay}}
      </div>
    </div>
    <selectedIdentityCardsDialog
      v-if="showIdentityCardDialog"
      :visible="showIdentityCardDialog"
      v-bind="$attrs"
      @close="showIdentityCardDialog = false"
      :list="list"
    />
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import selectedIdentityCardsDialog from './selectedIdentityCardsDialog.vue'
export default {
  data() {
    return {
      indexObjForIdentityCard: {}, // 身份卡请求部分产品/服务
      serviceIndexObj: {}, // 服务的下标匹配
      productionIndexObj: {}, // 产品的下标匹配
      loading: false,
      showIdentityCardDialog: false,
      list: [], // 可用身份卡
    }
  },
  mounted() {
    
  },
  methods: {
    ...mapActions([
      'setSelectedPrepaidCardForPay',
      'setSelectedIdentityCardForPay',
    ]),
    showIdentityCardsDialog() {
      this.showIdentityCardDialog = true
    },
    getIdentityCardsList() {
      if (this.billInfo.billId) return;
      if (this.$attrs.notInCard) { // 身份卡不能买卡
        let idx = 0
        let obj = {}
        let goodsList = []
        this.$attrs.currentGoodsList.map((goods, index) => {
          // 需要过滤掉线上支付的服务、产品，已经选了次卡、时间卡的服务, 取单后删除的商品
          if (goods.deleted || goods.paymentStatus || goods.timeCardId || goods.countCardId) {
            // 删除的、支付的、选了次卡、选了时间卡的, 这些的价格全部不能重置
          } else {
            goodsList.push(goods)
            obj[index] = idx
            idx++
          }
        })
        if (!goodsList.length) return this.$message.error('全部服务已选择次卡/时间卡支付');
        this.indexObjForIdentityCard = obj
        this.readyToGetCardsBuyGoods(goodsList)
      }
    },
    // 卡买服务\产品
    readyToGetCardsBuyGoods(goodsList) {
      let serviceList = []
      let productList = []
      let serviceObj = {}
      let productObj = {}
      let serviceIdx = 0
      let productIdx = 0
      goodsList.map((goods, index) => {
        if (goods.goodsType === 'service') {
          serviceList.push({
            amount: goods.count,
            serviceSpecificationsId: goods.specificationId,
            serviceSpecificationsSnapshotId: goods.snapshotId,
            storePreference: goods.storePreference || 0,
          })
          serviceObj[index] = serviceIdx
          serviceIdx++
        } else {
          productList.push({
            amount: goods.count,
            productSpecificationsId: goods.specificationId,
            productSpecificationsSnapshotId: goods.snapshotId,
            storePreference: goods.storePreference || 0,
          })
          productObj[index] = productIdx
          productIdx++
        }
      })
      if (!serviceList.length && !productList.length)  return;
      this.serviceIndexObj = serviceObj
      this.productionIndexObj = productObj
      this.loading = true
      axios.post('/getAllCardPayGoodsCountInfo', {
        brandId: this.currentInfo.brandId,
        storeId: this.currentInfo.shopId,
        customerId: this.billInfo.customerInfo.id,
        listCountProductInfo: productList,
        listCountServiceInfo: serviceList,
      }).then(res => {
        if (res.success) {
          this.list = res.listIdentityGoodsCountInfo || [] // 身份卡的
          if (this.list.length) {
            this.showIdentityCardsDialog() // ...临时调整， 以后可能要改需求
          } else {
            this.$message.error('该用户没有身份卡')
          }
          this.loading = false // 其他任何错误，需要用户用其他方式支付
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 根据选择的身份卡重置产品、服务的最终价格
    setGoodsTempFinalPrice(card) {
      if (this.$attrs.notInCard) { 
        if (!!card.customerCardId) {
          // 仅卡买服务、产品会存在打折
          this.$attrs.currentGoodsList.map((goods, index) => {
            // 仅以下情况存在 
            if (goods.deleted || goods.paymentStatus || goods.timeCardId || goods.countCardId) {  
              // 删除的、支付的、选了次卡、选了时间卡的, 这些的价格全部不能重置
            } else {
              let key = this.indexObjForIdentityCard[index]
              if (goods.goodsType === 'service') {
                let goodsArr = card.listServiceCardDiscountInfo
                if (goodsArr && goodsArr.length && goodsArr[this.serviceIndexObj[key]]) {
                  goods.tempFinalPrice = goodsArr[this.serviceIndexObj[key]].finalPrice
                }
              } else {
                let goodsArr = card.listProductCardDiscountInfo
                if (goodsArr && goodsArr.length && goodsArr[this.productionIndexObj[key]]) {
                  goods.tempFinalPrice = goodsArr[this.productionIndexObj[key]].finalPrice
                }
              }

            }
          })
        }
        this.showIdentityCardDialog = false
      } else {
        // 身份卡不能买卡
      } 
    },
    // handleIdentityCardChanged(card) {
    //   this.showIdentityCardDialog = false
    // },
  },
  watch: {
    '$attrs.rootTimeCardChange': {
      handler: function(v, o) {
        if(v) {
          this.setSelectedIdentityCardForPay({customerCardId: null})
          // this.getIdentityCardsList() // 这两个监听器不要删， 以后可能要调整需求
        }
      }
    },
    '$attrs.rootStorePreferenceChang': {
      handler: function(v, o) {
        if(v) {
          this.setSelectedIdentityCardForPay({customerCardId: null})
          // this.getIdentityCardsList() // 这两个监听器不要删， 以后可能要调整需求
        }
      }
    },
    'billInfo.selectedIdentityCardForPay': {
      handler: function(v, o) {
        this.setGoodsTempFinalPrice(v)
      },
      immediate: true,
      deep: true
    },
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    }),
    hasUsefulIdentityCard() {
      // if (this.list.length) {
      //   return true
      // }
      return this.$attrs.notInCard
    },
    discountInfos() {
      let obj = {
        // 线上支付订单
        online: {},
        // 时间卡次卡
        payByTimesCard: {},
        storePreference: 0,
      }
      this.$attrs.currentGoodsList.map((goods, idx) => {
        if (!goods.deleted) {
          if (this.$attrs.notInCard) {
            // 1.1 服务、产品
            // 线上的已经付款的订单, 线上订单未付款的是线上的预约来的
            if (goods.goodsOrderId && goods.paymentStatus) { 
              obj.online[idx] = {
                count: goods.count,
                goodsName: goods.name,
                spName: goods.specificationName,
                money: goods.received, // 这个价格应该是乘上数量的
              }
            }
            // 选了次卡时间卡的服务 - 优惠的价格按门店价
            if (goods.countCardId || goods.timeCardId) {
              obj.payByTimesCard[idx] = {
                count: goods.count,
                goodsName: goods.name,
                spName: goods.specificationName,
                money: goods.shopPrice, // 这个是单价
              }
            }

          } else { 
            // 1.2 卡项 // 仅门店优惠
          }
          obj.storePreference += Number(goods.storePreference || 0)
        }
      })
      return obj
    },
    needPay() {
      let money = 0;
      this.$attrs.currentGoodsList.map(i => {
        if (!i.paymentStatus && !i.deleted) {
          money += i.tempFinalPrice;
        }
      });
      this.money = money = Number(money.toFixed(2));
      return money;
    }
  },
  components: { selectedIdentityCardsDialog }
}
</script>
<style lang='scss' scoped>
@mixin over-flow() {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}

.discount-info {
  min-height: 150px;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  margin: 12px 15px;
  color: #999;
  // border-top: 1px solid #efeff4;
}

.identity-card-choose,
.online-paied-info {
  display: flex;
  justify-content: space-between;
  margin: 3px 0;
  align-items: center;
  line-height: 18px;
}

.light-font { color: #999; }

.selected-card {
  display: flex;
  flex-wrap: nowrap;
  .over-flow-box {
    display: block;
    max-width: 200px;
    @include over-flow;
  }
}
.flex-discount-goods {
  border-bottom: 1px dashed #efeff4;
}
.flex-discount-goods, .sotre-preference {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.left-box {
  width: 100px;
  display: flex;
  align-items: center;
}
.card-left-box {
  width: 110px;
}
.right-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .goods-item , .service-item {
    display: flex;
    justify-content: flex-end;
    @include over-flow;
  }
  span {
    line-height: 24px;
    display: inline-block;
    @include over-flow;
  }
  .item-name {
    max-width: 140px;
    flex: 1;
  }
  .item-count {
    max-width: 48px;
    margin: 0 4px;
  }
  .item-price {
    color: #333;
    max-width: 68px;
  }
}

.need-pay-money {
  color: #F52D56;
  font-size: 20px;
  text-align: center;
  line-height: 46px;
  font-weight: bold;
}

.order-info-line {
  display: flex;
  align-items: center;
  div {
    flex: auto;
    border-top: 1px dashed #efeff4;
  }
  span {
    margin: 0 10px;
    font-size: 12px;
  }
}
</style>
