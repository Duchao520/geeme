export default {
  SAVE_STAFF_INFO(state, payload) {
    state.billingStaff.staffId = payload.id;
    state.billingStaff.image = payload.headPortrait;
    state.billingStaff.levelId = payload.levelId;
    state.billingStaff.name = payload.name;
    state.billingStaff.levelName = payload.levelName;
    state.billingStaff.shopNum = payload.shopNum;
  },
  SAVE_CUSTOMER_INFO(state, payload) {
    state.customerInfo = payload
  },
  SAVE_BILL_ORIGIN(state, payload) {
    state.billOrigin = payload
  },
  SET_APPOINT_ID(state, payload) {
    state.appointId = payload
  },
  SET_CONSUMER_ORDER_ID(state, payload) {
    state.consumerOrderId = payload
  },
  SAVE_UN_SERVICED_ORDERS: (state, payload) => {
    state.unServicedOrders = payload
  },
  SET_SERVICE_TIME: (state, payload) => {
    state.serviceTime = payload
  },
  SAVE_SELECTED_PRODUCT: (state, payload) => {
    state.selectedProduct = payload
  },
  // 购物车中的卡项
  SAVE_SELECTED_CARD: (state, cards) => {
    if (!cards) { 
      state.selectedCard = []
    } else if (Array.isArray(cards)) {
      if (cards.length) {
        cards.map(i => {
          state.selectedCard.push(i)
        })
      }
    } else {
      state.selectedCard.push(cards)
    }
  },
  SET_CURRENT_CHOOSE_TYPE: (state, payload) => {
    state.currentChooseTypeAndSortOneId.sortGoodsType = payload
  },
  SET_ORIGIN_FROM_SHOP_CONSOLE: (state, payload) => {
    state.currentChooseTypeAndSortOneId.billGoodsType = payload
  },
  SET_BILL_ID: (state, payload) => {
    state.billId = payload;
  },
  SET_PAPER_ID: (state, id) => {
    state.paperOrderId = id;
  },
  SET_SERIAL_CODE: (state, code) => {
    state.serialCode = code;
  },
  SET_IS_COUNT: (state, payload) => {
    state.isCount = payload
  },
  SAVE_BILL_INFO: (state, payload) => {
    let isServiceOrProduct = payload.consumerGoodsOrderInfoList && payload.consumerGoodsOrderInfoList.length > 0;
    state.consumerServiceOrderInfo = {
      serialCode: payload.serialCode,
      consumerGoodsOrderInfoList: isServiceOrProduct ? payload.consumerGoodsOrderInfoList : payload.listConsumerOrderCardInfo,
      goodsType: isServiceOrProduct ? 'serviceOrProduct' : 'card',
      serviceTime: payload.serviceTime
    }
  },
  ON_RELOAD: (state, payload) => {
    state.onReload = payload
  },
  SET_GOODS_SORT_ONE_ID: (state, payload) => {
    for (let key in payload) {
      state.currentChooseTypeAndSortOneId.sortOneId[key] = payload[key];
    }
  },
  SET_PROTECTED_GOODS_TYPE: (state, payload) => {
    state.protectedGoodsType = payload
  },
  SET_CAR_POSITION: (state, payload) => {
    state.carPosition = payload
  },
  SET_GOODS_VIEW_WITH_IMG: (state, payload) => {
    state.goodsViewWithImg = payload
  },
  CLEAR_CURRENT_CHOOSE_GOODS_ID: (state) => {
    state.currentChooseTypeAndSortOneId.sortOneId = {
      service: null,
      product: null,
      card: null
    }
  },
  CLEAR_BILL_INFO(state) {
    state.billingStaff = {
      staffId: null,
      levelId: null,
      name: null,
      image: null
    };
    state.customerInfo = {
      headPortrait: null,
      name: null,
      sex: null,
      mobile: null,
      memberLevel: null,
      id: null,
    };
    state.billOrigin = null;
    state.appointId = null;
    state.consumerOrderId = null;
    state.unServicedOrders = null;
    state.serviceTime = null;
    state.createTime = null;
    state.serialCode = null;
    state.onReload = false;
    state.consumerServiceOrderInfo = {
      serialCode: null,
      consumerGoodsOrderInfoList: []
    };
    state.listOfMemberLevelPrices = [];
    state.billCardInfo = {
      availableVipCardList: [],
      customerHasVipCard: false,
      customerHasPrepaidCard: false,
      selectedVipCardInfo: {
        countCardId: null,
        identityCardId: null,
        prepaidCardId: null,
        timeCardId: null
      }
    }
    state.carPosition = { // 购物车坐标
      x: 0,
      y: 0
    }
    state.selectedGoods = []
    state.selectedCard = []
    state.paperOrderId = null
    state.billId = null
    state.isCount = true
    state.protectedGoodsType = null
    state.compareMemberLevelPrice = {}
    state.currentLeftType = 'service'
    state.currentTopStatus = {
      service: null, // 服务项目默认激活的id : null => 全部
      product: null, // 产品项目默认激活的id : null => 全部
      card: null, // 卡项项目默认激活的 id=> 0:全部(文档是0 null也可以) 1:储值卡， 2：身份卡，3：次卡，4：时间卡
      renewal_card: null, // 这里后端还没有筛选字段? 前端自己实现以下? cardType = 0: 身份卡, 1: 储值卡, 2:次卡,3:时间卡 // 续目前只有null,0,1;
    }
    state.selectedPrepaidCardForPay = {
      customerCardId: null
    } // 支付用的储值卡，用组件传递效率太慢
    state.selectedIdentityCardForPay = {
      customerCardId: null
    } // 支付用的储值卡，用组件传递效率太慢 - 身份卡用统一的组件
    state.usbReaderCode = ''
  },
  SET_PAY_TYPE: (state, payload) => {
    state.settleAccountsInfo.payTypeNumber = payload
  },
  SET_ADVANCES_PAY_TYPE: (state, payload) => {
    state.settleAccountsInfo.advancesPayType = payload
  },
  SET_PAYMENT_MODE_ID: (state, payload) => {
    state.paymentModeId = payload
  },
  SET_LIST_OF_MEMBER_LEVEL_PRICES: (state, payload) => {
    state.listOfMemberLevelPrices = payload;
  },
  SET_THE_TOTAL_BILL:(state,payload)=>{
    state.numberOfPendingPaymentsForm.numberOfPendingPayments = payload;
  },
  // 顶部导航栏分类id
  SET_CURRENT_TOP_STATUS: (state, info) => {
    for (let key in info) {
      state.currentTopStatus[key] = info[key]
    }
  },
  // 左侧导航栏
  SET_CURRENT_LEFT_TYPE: (state, type) => {
    state.currentLeftType = type
  },
  // 购物车中的服务、产品
  SET_SELECTED_GOODS: (state, goods) => {
    if (!goods) { 
      state.selectedGoods = []
    } else if (Array.isArray(goods)) {
      if (goods.length) {
        goods.map(i => {
          state.selectedGoods.push(i)
        })
      }
    } else {
      state.selectedGoods.push(goods)
    }
  },
  // 存放服务、产品 - 会员价（成长会员价）的比对数据
  SET_COMPARE_MEMBER_LEVEL_PRICE: (state, spInfo) => {
    if (spInfo.goodsTypeScopeEnum) {
      state.compareMemberLevelPrice[`${spInfo.goodsTypeScopeEnum.toLowerCase()}_${spInfo.specificationId}`] = {price: spInfo.discountPrice} // 优化数据
      // eg: service_299: {price: 32}
      // eg: production_312: {goodsTypeScopeEnum: "PRODUCTION", specificationId: 312, discountPrice: 96, priceConstant: false} // 这是最全的数据，优化成上面的
    } else {
      for (let key in state.compareMemberLevelPrice) {
        delete state.compareMemberLevelPrice[key]
      }
    }
  },
  // 删除已选服务、产品(非挂单的)
  DELETE_SELECTED_GOODS: (state, index) => {
    state.selectedGoods.splice(index, 1)
  },
  // 修改已选服务、产品的属性
  SET_SELECTED_GOODS_VALUE: (state, obj) => {
    let index = obj.index
    let newObj = obj
    delete newObj.index
    for (let key in newObj) {
      state.selectedGoods[index][key] = newObj[key]
    }
  },
  SET_CREATE_TIME: (state, payload) => {
    state.createTime = payload
  },
  // 删除已选卡项(非挂单的)
  DELETE_SELECTED_CARDS: (state, index) => {
    state.selectedCard.splice(index, 1)
  },
  // 修改已选卡项的属性
  SET_SELECTED_CARDS_VALUE: (state, obj) => {
    let index = obj.index
    let newObj = obj
    delete newObj.index
    for (let key in newObj) {
      state.selectedCard[index][key] = newObj[key]
    }
  },
  // 支付用的储值卡，用组件传递效率太慢
  SET_SELECTED_PREPAID_CARD_FOR_PAY: (state, card) => {
    state.selectedPrepaidCardForPay = card
  },
  // 支付用的储值卡，用组件传递效率太慢 - 身份卡用统一的组件
  SET_SELECTED_IDENTITY_CARD_FOR_PAY: (state, card) => {
    state.selectedIdentityCardForPay = card
  },
  // 手牌号
  SET_USB_READER_CODE:(state, code) => {
    state.usbReaderCode = code
  },
  // 支付方式
  SET_PAYMENT_WAY: (state, ways) => {
    state.paymentWay = ways
  },
};
