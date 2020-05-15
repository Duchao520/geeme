export default {
  saveStaffInfo: ({commit}, param) => {
    commit('SAVE_STAFF_INFO', param)
  },
  saveCustomerInfo: ({commit}, param) => {
    commit('SAVE_CUSTOMER_INFO', param)
  },
  //设置开单的来源（快速开单，从预约开单，从收款台开单，从客户列表开单）
  setBillOrigin: ({commit}, param) => {
    commit('SAVE_BILL_ORIGIN', param)
  },
  setAppointId: ({commit}, param) => {
    commit('SET_APPOINT_ID', param)
  },
  setConsumerOrderId: ({commit}, param) => {
    commit('SET_CONSUMER_ORDER_ID', param)
  },
  saveOnTheWayOrderIds: ({commit}, param) => {
    commit('SAVE_UN_SERVICED_ORDERS', param)
  },
  setServiceTime: ({commit}, param) => {
    commit('SET_SERVICE_TIME', param)
  },
  saveSelectedProduct: ({commit}, param) => {
    commit('SAVE_SELECTED_PRODUCT', param)
  },
  saveSelectedCard: ({commit}, param) => {
    commit('SAVE_SELECTED_CARD', param)
  },
  saveBillInfo: ({commit}, param) => {
    commit('SAVE_BILL_INFO', param)
  },
  setCurrentChooseType: ({commit}, param) => {
    commit('SET_CURRENT_CHOOSE_TYPE', param)
  },
  setGoodsSortOneId: ({commit}, param) => {
    commit('SET_GOODS_SORT_ONE_ID', param)
  },
  setBillId: ({commit}, param) => {
    commit('SET_BILL_ID', param)
  },
  // 设置纸单号
  setPaperId: ({commit}, id) => {
    commit('SET_PAPER_ID', id)
  },
  // 设置服务单号 
  setSerialCode: ({commit}, code) => {
    commit('SET_SERIAL_CODE', code)
  },
  setIsCount: ({commit}, boolean) => {
    commit('SET_IS_COUNT', boolean)
  },
  clearCurrentChooseStatus: ({commit}, param) => {
    commit('CLEAR_CURRENT_CHOOSE_GOODS_ID', param)
  },
  setBillChooseGoodsType: ({commit}, param) => {
    commit('SET_ORIGIN_FROM_SHOP_CONSOLE', param)
  },
  setProtectedGoodsType: ({commit}, param) => {
    commit('SET_PROTECTED_GOODS_TYPE', param)
  },
  setCarPosition: ({commit}, param) => {
    commit('SET_CAR_POSITION', param)
  },
  setGoodsViewWithImg: ({commit}, param) => {
    commit('SET_GOODS_VIEW_WITH_IMG', param)
  },
  onReload: ({commit}, param) => {
    commit('ON_RELOAD', param)
  },
  clearBillInfo: ({commit}, param) => {
    commit('CLEAR_BILL_INFO', param)
  },
  setPayType: ({commit}, param) => {
    commit('SET_PAY_TYPE', param)
  },
  setAdvancesPayType: ({commit}, param) => {
    commit('SET_ADVANCES_PAY_TYPE', param)
  },
  setPaymentModeId: ({commit}, param) => {
    commit('SET_PAYMENT_MODE_ID', param)
  },
  setListOfMemberLevelPrices: ({commit}, param) => {
    commit('SET_LIST_OF_MEMBER_LEVEL_PRICES', param)
  },
  setTheTotalBill:({commit},param)=>{
    commit('SET_THE_TOTAL_BILL', param)
  },
  // 顶部导航栏分类id
  setCurrentTopStatus: ({commit}, info) => {
    commit('SET_CURRENT_TOP_STATUS', info)
  },
  // 左侧导航栏
  setCurrentLeftType: ({commit}, type) => {
    commit('SET_CURRENT_LEFT_TYPE', type)
  },
  // 购物车中的服务、产品, 单个商品push进入的! 取单直接覆盖
  setSelectedGoods: ({commit}, goods) => {
    commit('SET_SELECTED_GOODS', goods)
  },
  // 存放服务、产品 - 会员价（成长会员价）的比对数据; info为空对象时置空数据 
  setCompareMemberLevelPrice: ({commit}, info) => {
    commit('SET_COMPARE_MEMBER_LEVEL_PRICE', info)
  },
  // 删除已选服务、产品(挂单的)
  deleteSelectedGoods: ({commit}, index) => {
    commit('DELETE_SELECTED_GOODS', index)
  },
  // 修改已选服务、产品的属性
  setSelectedGoodsValue: ({commit}, obj) => {
    commit('SET_SELECTED_GOODS_VALUE', obj)
  },
  // 下单时间
  setCreateTime: ({commit}, param) => {
    commit('SET_CREATE_TIME', param)
  },
  // 删除已选卡项(非挂单的)
  deleteSelectedCards: ({commit}, index) => {
    commit('DELETE_SELECTED_CARDS', index)
  },
  // 修改已选卡项的属性 
  setSelectedCardsValue: ({commit}, obj) => {
    commit('SET_SELECTED_CARDS_VALUE', obj)
  },
  // 支付用的储值卡，用组件传递效率太慢
  setSelectedPrepaidCardForPay: ({commit}, card) => {
    commit('SET_SELECTED_PREPAID_CARD_FOR_PAY', card)
  },
  // 支付用的储值卡，用组件传递效率太慢 - 身份卡用统一的组件
  setSelectedIdentityCardForPay: ({commit}, card) => {
    commit('SET_SELECTED_IDENTITY_CARD_FOR_PAY', card)
  },
  // 手牌号
  setUsbReaderCode: ({commit}, code) => {
    commit('SET_USB_READER_CODE', code)
  },
  // 支付方式
  setPaymentWay: ({commit}, ways) => {
    commit('SET_PAYMENT_WAY', ways)
  },
};
