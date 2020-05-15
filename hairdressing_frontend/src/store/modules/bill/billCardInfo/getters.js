import * as utils from "@/assets/js/utils";

export default {
  /*
   * 已选择的身份卡的信息，条件有二：
   *   1、请求到了身份卡对于商品的优惠
   *   2、选择了一张身份卡
   * */
  selectedVipCardDiscountInfo: state => {
    if (state.availableVipCardList.length === 0) {
      return {}
    } else {
      let cardId = state.selectedVipCardInfo.identityCardId || state.selectedVipCardInfo.prepaidCardId || state.selectedVipCardInfo.countCardId || state.selectedVipCardInfo.timeCardId;
      return state.availableVipCardList.filter(item => item.customerCardId === cardId)[0] || {}
    }
  },
  /*
   * 已经选择的身份卡所包含的优惠信息（其对应了每一个服务和产品）
   * */
  identityCardDiscountInfo: (state, getters) => {
    if (utils.isEmptyObject(getters.selectedVipCardDiscountInfo)) {
      return []
    } else {
      let selectedIdentityCard = getters.selectedVipCardDiscountInfo;
      let arr = (selectedIdentityCard.listServiceCardDiscountInfo || []).map(item => {
        return {
          ...item,
          goodsType: "service"
        }
      }).concat((selectedIdentityCard.listProductCardDiscountInfo || []).map(item => {
        return {
          ...item,
          goodsType: "production"
        }
      }));
      return arr
    }
  },
  alreadySelectedCard: (state) => {
    /*
     * 别问我为什么不是写了两个连等号，因为后面可能会有更多的卡类型
     * */
    let bool = false;
    let idInfo = state.selectedVipCardInfo;
    for (let i in idInfo) {
      if (idInfo[i]) {
        bool = true;
        break;
      }
    }
    return bool;
  },
  alreadySelectedType: (state) => {
    /*
     * 别问我为什么不是写了两个连等号，因为后面可能会有更多的卡类型
     * */
    let type = "";
    let idInfo = state.selectedVipCardInfo;
    for (let i in idInfo) {
      if (idInfo[i]) {
        type = i;
        break;
      }
    }
    switch (type) {
      case "identityCardId":
        return "identity";
      case "prepaidCardId":
        return "prepaid";
      case "countCardId":
        return "countCard";
      case "timeCardId":
        return "timeCard";
    }
  }
}
