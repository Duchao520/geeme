<template>
  <el-dialog
    top="10vh"
    width="1080px" 
    append-to-body
    :visible="visible" 
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="container-for-payment" v-loading.fullscreen="loading_middle">
      <!-- 左侧详情 加载在内部写 -->
      <OrderDetailList
        v-loading.fullscreen="loading"
        :active="activePaymentTypeObj"
        :currentGoodsList="currentGoodsList"
        :indexObjForApi="indexObjForApi"
        :usefulCardList="usefulCardList"
        @rootTimeCardChanged="handleLessApiRequest"
        @rootStorePreferenceChanged="handleGoodsSotrePreferenceChanged"
        :notInCard="notInCard"
        :rootTimeCardChange="rootTimeCardChange"
        :rootStorePreferenceChang="rootStorePreferenceChang"
        @saveCardInfoList="saveCardInfoList"
      />
      <!-- 中间 支付类型 加载写到父容器 -->
      <PaymentTypeList 
        :hasCard="hasCard"
        :list="paymentTypes" 
        :active="activePaymentTypeObj"
        @changed="handleChangedPayType"
      />
      <!-- 右侧组件 结算支付-依赖中间加载完成 -->
      <RightDetailMain 
        :hasCard="hasCard"
        :notInCard="notInCard"
        :active="activePaymentTypeObj"
        :currentGoodsList="currentGoodsList"
        :rootTimeCardChange="rootTimeCardChange"
        :rootStorePreferenceChang="rootStorePreferenceChang"
        :cardInfoList="cardInfoList"
      />
    </div>
  </el-dialog>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import OrderDetailList from './_orderDetailList.vue';
import PaymentTypeList from './_paymentTypeList.vue';
import RightDetailMain from './_rightDetailMain.vue';
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      loading_middle: false,
      paymentTypes: [], // 可用的支付方式(按商品类型做了过滤)
      activePaymentTypeObj: {}, // 激活的支付方式, 字段要传给左，中，右3个组件
      hasCard: false,

      // 左侧数据专用
      currentGoodsList: [], // 当前商品（包含挂单删除的，已支付的）
      indexObjForApi: {}, // 下标用 - 处理【服务】次卡、时间卡的可用卡下标
      usefulCardList: [], // 数据用
      loading: false, // 处理卡的接口加载

      rootTimeCardChange: 0, // 监听用的 阻止身份卡\储值卡在次卡、时间卡计算前请求
      rootStorePreferenceChang: 0, // 监听用的 阻止身份卡\储值卡在次卡、时间卡计算前请求
      cardInfoList:[], // 左边选中的次卡/时间卡传给右边
    }
  },
  mounted() {
    this.getPaymentTypeList()
    this.checkCustomerHasCard() // 只有检查储值卡的接口，查看是否可以用储值卡支付
    this.init()
  },
  methods: {
    ...mapActions([
      'setSelectedPrepaidCardForPay',
      'setPaymentWay',
    ]),
    init() {
      if (['service', 'product'].includes(this.billInfo.currentLeftType)) {
        // 格式化部分数据
        let selectedGoods = this.billInfo.selectedGoods.map(i => {
          if (i.deleted && i.paymentStatus) {
            return i
          } else {
            let compareObj = this.billInfo.compareMemberLevelPrice[`${i.goodsType}_${i.specificationId}`]
            let price = compareObj && compareObj.price
            return {
              ...i,
              memberPrice: price >= 0 ? price : i.memberPrice, // 主要处理undefined
              tempFinalPrice: price >= 0 ? Number((price * i.count).toFixed(2)) : Number((i.memberPrice * i.count).toFixed(2))
            }
          }
        })
        this.currentGoodsList = JSON.parse(JSON.stringify(selectedGoods))
        this.getServiceCanPayByTimesCard()
      } else {
        this.currentGoodsList = JSON.parse(JSON.stringify(this.billInfo.selectedCard))
      }
    },
    // 左侧消费账单用 - 服务 - 次卡\时间卡
    getServiceCanPayByTimesCard() {
      // 处理该服务是否可以用时间卡、次卡支付的下标
      let list = []
      let idx = 0
      this.currentGoodsList.map((goods, index) => {
        if (goods.goodsType === 'service' && !goods.deleted && !goods.paymentStatus) { // 当前条件的服务需要请求接口查询是否有卡
          list.push({
            amount: goods.count, // 商品数量
            serviceId: goods.serviceId, // 服务id
            serviceSpecificationsId: goods.specificationId, // 服务规格ID
            serviceSpecificationsSnapshotId: goods.snapshotId, // 服务快照规格ID
            sortId: idx, // 排序ID
          })
          this.indexObjForApi[index] = idx
          idx++
        }
      })
      if (!list.length) return; // 没有符合的服务就不要请求
      // 查询是否有可用的时间卡、次卡
      this.loading = true
      axios.post('/getMixBillingInfo', {
        listServiceBillInfo: list,
        storeId: this.currentInfo.shopId,
        brandId: this.currentInfo.brandId,
        storeCustomerId: this.billInfo.customerInfo.id,
      }).then(res => {
        if (res.success) {
          // this.usefulCardList = res.listServiceBillInfo || []
          let preCardsArr = res.listServiceBillInfo || []
          if (preCardsArr.length) {
            // this.usefulCardList = this.computeSuggestTimeCards(preCardsArr) // old
            // 测试自动选择次卡...可能有bug... 
            console.time('computed_time')
            this.computeSuggestTimeCards(preCardsArr) // new 
          }
        }
      }).then(() => {
        this.loading = false
      })
    },
    computeSuggestTimeCards(serviceArrFromApi) {
      let arr = JSON.parse(JSON.stringify(serviceArrFromApi)) // 包含了服务可能存在什么次卡时间卡都没有的情况
      let nextCountCardArrIndexs = [] // 存储第一轮暂未设置次卡的服务下标(含次卡不含时间卡的服务)
      // 1.1 先处理时间卡推荐选择
      arr = arr.map((service, index) => {
        let suggestCard = {}
        // 时间卡次卡的数组，后端有时候是null, 有时候是[]......
        if (service.listCustomerTimeCardDetail && service.listCustomerTimeCardDetail.length) { 
          suggestCard = service.listCustomerTimeCardDetail[0]
        } else if (service.listCustomerCountCardDetail && service.listCustomerCountCardDetail.length) { // 过滤出仅含次卡的服务下标
          nextCountCardArrIndexs.push(index) // 注意这里可能是不连续的， 且非0起始的下标数组
        }
        return {
          ...service,
          countCardSelectedStatus: {
            countCardId: null,
            count: service.amount,
            spid: service.serviceSpecificationsId,
          },
          suggestCardForService: suggestCard
        }
      })
      // 1.2 计算未选择卡项的服务， 看看是否能推荐次卡
      // 注意这里可能是不连续的， 且非0起始的下标数组: nextCountCardArrIndexs
      let restServiceArr = nextCountCardArrIndexs.map(idx => arr[idx]) // 记录选择了时间卡以外的其他服务，待选次卡
      restServiceArr.length && nextCountCardArrIndexs.map((goods, idx) => {
        // 注意这个idx是nextCountCardArrIndexs中的连续下标，不是值
        // 这个可能是个null
        if (restServiceArr[idx].listCustomerCountCardDetail && restServiceArr[idx].listCustomerCountCardDetail.length) {
          this.computeSuggestCountCards(restServiceArr, idx, nextCountCardArrIndexs) 
        }
      })
      this.usefulCardList = arr
      console.timeEnd('computed_time')
    },
    // 遍历当前计算的服务能否使用某张次卡
    computeSuggestCountCards(restServiceArr, currentStatusIdx, nextCountCardArrIndexs) {
      /*
        最终结果是返回一个当前服务要选择次卡的结果
        countCardSelectedStatus: {
          countCardId: null,
          count: service.amount,
          spid: service.serviceSpecificationsId,
        },
      */ 
      let realIndexInRestGoods = nextCountCardArrIndexs[currentStatusIdx]
      let currentCountCardSelectedStatus = restServiceArr[currentStatusIdx].countCardSelectedStatus // 当前服务 计算是否可以用次卡的一些数据
      let currentServiceUsefulCountCards = restServiceArr[currentStatusIdx].listCustomerCountCardDetail // 当前服务 后端返回可以用的次卡数组
      
      // 遍历该服务下的可用的每个次卡，是否在所有的剩余的服务中是否
      if (currentServiceUsefulCountCards.length) { 
        // 遍历所有的卡
        for(let i = 0; i < currentServiceUsefulCountCards.length; i++) {
          // 当前服务的规格id:  currentCountCardSelectedStatus.spid
          // 当前服务的规格数量:  currentCountCardSelectedStatus.count
          let limit = 0
          let total = 0
          let checkAllSpidArr = [] // 存储通用次数的次卡的通用服务规格id, 所有的列表服务在此数组中的已经选了此次卡的次数都要校验
          let card = currentServiceUsefulCountCards[i]
          let checkAll = !!(card.totalCountLimit >= 0) // totalCountLimit >= 0 时需要累加, 0是后端预减了本规格的数量后的最小值
          if (checkAll) {
            limit = card.totalCountLimit
            card.listServiceCountInfo.map(i => {
              checkAllSpidArr.push(i.serviceSpecificationId)
            })
          } else {
            limit = card.listServiceCountInfo.filter(i => i.serviceSpecificationId === currentCountCardSelectedStatus.spid)[0].countLimit
          }
          // 遍历其他的服务,看看是否超限 - !!!过滤掉已经选了次卡的服务!!!
          for(let j = 0; j < restServiceArr.length; j++) {
            let goods = restServiceArr[j]
            // 不计自己, 如果是已经选了次卡的，此规格的数量也不去限制别的, !!!不能用规格id，因为可以重复选择购买
            if (j === realIndexInRestGoods || goods.countCardSelectedStatus.countCardId) { 
              continue
            }
            // 这个情况得遍历完
            if (checkAll && checkAllSpidArr.includes(goods.spid)) {
              total += goods.count
            }
            // 这个情况只要找到就行
            if (!checkAll && goods.spid === currentCountCardSelectedStatus.spid) {
              total += goods.count
              break
            }
          }
          // 此卡可用,修改 currentCountCardSelectedStatus 的 countCardId; 后端有预减，得加上当前规格数量再对比
          if (limit + currentCountCardSelectedStatus.count >= currentCountCardSelectedStatus.count + total) {
            restServiceArr[currentStatusIdx].suggestCardForService = card
            restServiceArr[currentStatusIdx].countCardSelectedStatus.countCardId = card.id
            break
          }
        }
      }
    },
    handleClose() {
      this.$emit('close')
    },
    checkCustomerHasCard() {
      axios.post('/checkCustomerHasPrepaidCard', 
        {storeId: this.currentInfo.shopId, customerId: this.billInfo.customerInfo.id}
      ).then(res => {
        if (res.success && res.hasCard) {
          this.hasCard = true
        }
      })
    },
    // 获取品牌的支付方式， 门店的支付方式依赖品牌开启???
    getPaymentTypeList() {
      this.loading_middle = true
      axios.post('/getEnabledBrandBillTypeInfos', {brandId: this.currentInfo.brandId}).then(res => {
        // 将支付方式存入vuex
        this.setPaymentWay(res.listBillTypeInfos)
        let allUsefulTypes = res.listBillTypeInfos.filter(i => i.openAccount)
        if (this.notInCard) {
          // 服务、产品可以用所有的支付方式
          this.paymentTypes = allUsefulTypes
        } else {
          // 卡项, 如果有储值卡，肯定不能用储值卡支付
          let hasPrepaidCard = this.billInfo.selectedCard.some(i => i.cardType === 1) // 储值卡
          if (hasPrepaidCard) {
            this.paymentTypes = allUsefulTypes.filter(i => i.billType !== 3) // 再过滤掉储值卡支付
          } else {
            this.paymentTypes = allUsefulTypes
          }
        }
        // 新结算默认是现金支付，收款台未支付结算取记录的支付方式
        this.activePaymentTypeObj = this.paymentTypes.filter(i => i.billType === 2)[0]
      }).then(() => {
        this.loading_middle = false
      })
    },
    // 支付方式切换, 后续还要完善功能...
    handleChangedPayType(type) {
      this.activePaymentTypeObj = type
      if (type.billType !== 3) { // 清除储值卡的选择, 不清的话可能会影响价格(储值卡可能打折服务、产品)
        this.setSelectedPrepaidCardForPay({customerCardId: null})
      }
    },
    // 次卡、时间卡切换选择， 重新计算身份卡、储值卡支付的商品待支付价格
    handleLessApiRequest: utils.debounce(function() {
      this.rootTimeCardChange++
    }, 100), // 用户切换次卡、时间卡耗时较长，尽量给计算多商品一些时间, 做次卡排斥时再视情况调整
    // 门店优惠价修改， 重新计算储值卡是否可用，及待支付价格
    handleGoodsSotrePreferenceChanged: utils.debounce(function() {
      this.rootStorePreferenceChang++
    }, 40), // 门店优惠输入较快
    // 恢复商品的待支付价格
    resetGoodsDefaultMoney() {
      if (!this.notInCard) return; // 卡的改变不了价格
      this.currentGoodsList.map((goods, index) => {
        if (goods.deleted || goods.paymentStatus || goods.timeCardId || goods.countCardId) {
          // 删除的、支付的、选了次卡、选了时间卡的, 这些的价格全部不能重置
        } else {
          goods.tempFinalPrice = Number((goods.memberPrice * goods.count - goods.storePreference).toFixed(2))
        }
      })
    },
    saveCardInfoList(cardInfoList) {
      console.log(cardInfoList)
      this.cardInfoList = cardInfoList
    }
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    }),
    notInCard() {
      return ['service', 'product'].includes(this.billInfo.currentLeftType)
    },
  },
  watch: {
    'billInfo.selectedPrepaidCardForPay': {
      handler: function(v, o) {
        if (v && v.customerCardId) {
          // 储值卡切换时, 在自己内部处理
        } else {
          // 可能是切换支付方式或者切换身份卡导致的
          !this.billInfo.selectedIdentityCardForPay.customerCardId && this.resetGoodsDefaultMoney()
        }
      },
      immediate: true,
      deep: true,
    },
    'billInfo.selectedIdentityCardForPay': {
      handler: function(v, o) {
        if (v && v.customerCardId) {
          // 储值卡切换时, 在自己内部处理
        } else {
          // 可能是切换支付方式或者切换身份卡导致的
          !this.billInfo.selectedPrepaidCardForPay.customerCardId && this.resetGoodsDefaultMoney()
        }
      },
      immediate: true,
      deep: true,
    },
  },
  components: { OrderDetailList, PaymentTypeList, RightDetailMain }
}
</script>
<style lang='scss' scoped>
/deep/ .el-dialog {
  border-radius: 5px;
  overflow: hidden;
  .el-dialog__body {
    padding: 0;
    max-width: 1080px;
    background: #f1f2f7;
  }
}
.container-for-payment {
  height: calc(100vh - 239px);
  min-height: 730px;
  display: flex;
  justify-content: space-between;
  margin-top: -30px;
  box-sizing: border-box;
  border-radius: 5px;
  color: #999999;
  font-size: 12px;
}
</style>
