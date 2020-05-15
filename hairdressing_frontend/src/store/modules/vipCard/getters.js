export default {
  currentCardCover(state){
    if(state.cardCoverType === 1){
      return state.cardCoverFromStorage;
    }else{
      return state.cardCoverUserDefined;
    }
  }
}
