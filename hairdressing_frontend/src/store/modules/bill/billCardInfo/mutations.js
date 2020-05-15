export default {
  SET_CUSTOMER_HAS_VIP_CARD: (state, payload) => {
    state.customerHasVipCard = payload;
  },
  // 储值卡买卡用 - 是否拥有储值卡
  SET_CUSTOMER_HAS_PREPAID_CARD: (state, payload) => {
    state.customerHasPrepaidCard = payload;
  },

  SET_SELECTED_VIP_CARD_ID: (state, payload) => {
    state.selectedVipCardInfo = {
      identityCardId: null,
      prepaidCardId: null,
      countCardId: null,
      timeCardId: null
    };
    if (!payload) {
      return
    }
    switch (payload.type) {
      case "identity":
        state.selectedVipCardInfo.identityCardId = payload.id;
        break;

      case "prePaid":
        state.selectedVipCardInfo.prepaidCardId = payload.id;
        break;

      case "countCard":
        state.selectedVipCardInfo.countCardId = payload.id;
        break;

      case "timeCard":
        state.selectedVipCardInfo.timeCardId = payload.id;
        break;
    }
  },
  SET_AVAILABLE_VIP_CARD_LIST: (state, payload) => {
    state.availableVipCardList = payload
  }
};
