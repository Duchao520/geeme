export default {
  saveShareholderMenu: ({
    commit
  }, param) => {
    commit('SAVE_SHAREHOLDER_MENU', param)
  },
  saveShareholderDetail: ({
    commit
  }, param) => {
    commit('SAVE_SHAREHOLDER_DETAIL', param)
  }
};
