export default {
  // 品牌软件
  setBrandSoft: ({ commit }, obj) => {
    commit('SET_BRAND_SOFT', obj)
  },
  // 门店软件
  setShopSoft: ({ commit }, obj) => {
    commit('SET_SHOP_SOFT', obj)
  },
};