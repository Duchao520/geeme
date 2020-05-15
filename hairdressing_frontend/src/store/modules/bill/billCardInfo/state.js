export default {
    customerHasVipCard: false, // 各种卡的支付产品、服务用
    customerHasPrepaidCard: false, // 是否含该门店可以用的储值卡： 卡买卡用
    /*
     * 为什么不是用id和type来保存？是为了未来可能存在的情况：一次选了多种不同的卡项
     * */
    selectedVipCardInfo: {
        identityCardId: null,
        prepaidCardId: null,
        countCardId:null,
        timeCardId:null
    },
    availableVipCardList: [],
}
