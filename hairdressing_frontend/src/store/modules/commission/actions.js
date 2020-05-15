export default {
  setServiceScheme: ({ commit }, schemeInfo) => {
    commit('SET_SERVICE_SCHEME', schemeInfo)
  },
  setProductScheme: ({ commit }, schemeInfo) => {
    commit('SET_PRODUCT_SCHEME', schemeInfo)
  },
  setCardScheme: ({ commit }, schemeInfo) => {
    commit('SET_CARD_SCHEME', schemeInfo)
  },
  setShopScheme: ({ commit }, schemeInfo) => {
    commit('SET_SHOP_SCHEME', schemeInfo)
  },
};