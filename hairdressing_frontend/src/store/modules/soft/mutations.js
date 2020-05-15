export default {
  SET_BRAND_SOFT(state, obj) {
    for (let key in obj) {
      state.brandSoft[key] = obj[key]
    }
  },
  SET_SHOP_SOFT(state, obj) {
    for (let key in obj) {
      state.shopSoft[key] = obj[key]
    }
  }
};