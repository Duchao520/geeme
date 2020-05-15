export default {
  SAVE_SELLER_GROUP(state, payload) {
      state.sellerGroup = payload;
  },
  SAVE_SELLER_MENU(state, payload) {
      state.menuStatus = payload;
  },
  SAVE_SELLER_FLAG(state, payload) {
      state.clientFlag = payload;
  }
};
