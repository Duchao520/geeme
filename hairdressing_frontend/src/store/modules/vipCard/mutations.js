export default {
    SET_CARD_TYPE(state, payload) {
        state.addNewVipCard.cardType = payload;
    },
    SET_CARD_ID(state, payload) {
        state.addNewVipCard.cardKindId = payload;
    },
    STORE_CARD_INFO(state, payload) {
        state.addNewVipCard.cardKindInfo = payload;
    },
    SET_EDIT_STATUS(state, payload) {
        state.addNewVipCard.onCardEdit = payload;
    },
    SET_EDIT_CARD_ID(state, payload) {
        state.addNewVipCard.editCardId = payload;
    },
    SET_LIST_STATUS(state, payload) {
        state.editVipCard.currentListStatus = payload
    },
    SET_CARD_COVER_TYPE(state,payload){
        state.cardCoverType = payload;
    },
    SET_CARD_COVER_FROM_STORAGE(state,payload){
        state.cardCoverFromStorage = payload;
    },
    SET_CARD_COVER_USER_DEFINED(state,payload){
        state.cardCoverUserDefined = payload;
    }
};
