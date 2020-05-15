export default {
  // 编辑服务提成方案的数据 id等
  SET_SERVICE_SCHEME(state, schemeInfo) {
    for (let key in schemeInfo) {
      state.serviceScheme[key] = schemeInfo[key]
    }
  },
  // 编辑产品提成方案的数据 id等
  SET_PRODUCT_SCHEME(state, schemeInfo) {
    for (let key in schemeInfo) {
      state.productScheme[key] = schemeInfo[key]
    }
  },
  // 编辑卡项提成方案的数据 id等
  SET_CARD_SCHEME(state, schemeInfo) {
    for (let key in schemeInfo) {
      state.cardScheme[key] = schemeInfo[key]
    }
  },
  // 编辑门店提成方案的数据 id等
  SET_SHOP_SCHEME(state, schemeInfo) {
    for (let key in schemeInfo) {
      state.shopScheme[key] = schemeInfo[key]
    }
  },
};