export default {
  setFlatAuths: ({ commit }, auths) => {
      commit('SET_FLAT_AUTHS', auths)
  },
  setBtnAuths: ({ commit }, auths) => {
      commit('SET_BTN_AUTHS', auths)
  },
  setCurrentAuth: ({ commit }, auth) => {
      commit('SET_CURRENT_AUTH', auth)
  },
  setCurrentEntry: ({ commit }, entry) => {
      commit('SET_CURRENT_ENTRY', entry)
  },
  setCurrentEntryNav: ({ commit }, navbar) => {
      commit('SET_CURRENT_ENTRY_NAV', navbar)
  },
  // 比对品牌id,用于解决多标签问题,不要随便往这里存!!!
  setComparisonBrandId: ({ commit}, brandId) => {
      commit('SET_COMPARISON_BRAND_ID', brandId)
  }
};