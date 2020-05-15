export default {
  setCardType: ({commit}, param) => {
    commit('SET_CARD_TYPE', param)
  },
  setCardKindId: ({commit}, param) => {
    commit('SET_CARD_ID', param)
  },
  storeCardKindInfo: ({commit}, param) => {
    commit('STORE_CARD_INFO', param)
  },
  setEditStatus: ({commit}, param) => {
    commit('SET_EDIT_STATUS', param)
  },
  setEditCardId: ({commit}, param) => {
    commit('SET_EDIT_CARD_ID', param)
  },
  setListStatus: ({commit}, param) => {
    commit('SET_LIST_STATUS', param)
  },
  setCardCoverType: ({commit}, param) => {
    commit("SET_CARD_COVER_TYPE", param);
  },
  setCardCoverFromStorage:({commit},param)=>{
    commit("SET_CARD_COVER_FROM_STORAGE", param)
  },
  setCardCoverUserDefined:({commit},param)=>{
    commit("SET_CARD_COVER_USER_DEFINED", param)
  }
};
