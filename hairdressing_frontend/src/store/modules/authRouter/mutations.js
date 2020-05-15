export default {
  SET_FLAT_AUTHS(state, auths) {
    state.flatAuths = auths
  },
  SET_BTN_AUTHS(state, auths) {
    state.btnAuths = auths
  },
  SET_CURRENT_AUTH(state, auth) {
    state.currentAuth = auth
  },
  SET_CURRENT_ENTRY(state, entry) {
    state.currentEntry = entry
  },
  SET_CURRENT_ENTRY_NAV(state, navs) {
    for (let key in navs) {
      state.currentEntryNav[key] = navs[key]
    }
  },
  // 比对品牌id,用于解决多标签问题,不要随便往这里存!!!
  SET_COMPARISON_BRAND_ID(state, brandId) {
    state.comparisonBrandId = brandId
  }
};