export default {
  SAVE_SHAREHOLDER_MENU(state, payload) {
      state.menuStatus = payload;
  },
  SAVE_SHAREHOLDER_DETAIL(state, payload) {
      state.shareholderDetail = payload;
  },
};
