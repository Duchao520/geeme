import * as axios from "@/util/axios";

export default {
  // 卡买产品、服务
  setCustomerHasCard: ({commit}, param) => {
    if (!param) {
      commit('SET_CUSTOMER_HAS_VIP_CARD', false);
    } else {
      axios.post("/getStoreValidCustomerCardByUserId/", param).then(res => {
        let listCustomerCardDetail = res.listCustomerCardDetail;
        if (!listCustomerCardDetail || listCustomerCardDetail.length === 0) {
          commit('SET_CUSTOMER_HAS_VIP_CARD', false);
        } else {
          commit('SET_CUSTOMER_HAS_VIP_CARD', true);
        }
      });
    }
  },
  // 卡买卡 是否有储值卡
  setCustomerHasPrepaidCard: ({commit}, param) => {
    if (!param) {
      commit('SET_CUSTOMER_HAS_PREPAID_CARD', false);
    } else {
      axios.post("/checkCustomerHasPrepaidCard", param).then(res => {
        if (res.hasCard) {
          commit('SET_CUSTOMER_HAS_PREPAID_CARD', true);
        } else {
          commit('SET_CUSTOMER_HAS_PREPAID_CARD', false);
        }
      });
    }
  },
  setSelectedVipCardId: ({commit}, param) => {
    commit('SET_SELECTED_VIP_CARD_ID', param);
  },
  setAvailableVipCardList: ({commit}, param) => {
    commit('SET_AVAILABLE_VIP_CARD_LIST', param);
  },
  clearVipCardInfo: ({commit}) => {
    commit('SET_AVAILABLE_VIP_CARD_LIST', []);
    commit('SET_SELECTED_VIP_CARD_ID', null);
  },
};
