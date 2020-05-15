import * as types from './mutation-types'
const matations={
  /**
   * state:当前状态树
   * v: 提交matations时传的参数
   */
  [types.SET_OPEN_ID] (state, v) {
    state.openId = v;
  },
  [types.TOKEN](state,v){
    state.token = v;
  },
  [types.AVATAR](state,v){
    state.avatar = v;
  },
  [types.NICKNAME](state,v){
    state.nickname = v;
  },
  [types.UNIONID](state,v){
    state.unionid = v;
  },
  [types.GENDER](state,v){
    state.gender = v;
  },
  [types.PROVINCE](state,v){
    state.province = v;
  },
  [types.CITY](state,v){
    state.city = v;
  },
  [types.APPVERSION](state,v){
    state.appVersion = v;
  },
  [types.CURCITY](state,v){
    state.curCity = v;
  },
  // var name,goodsId,selType,price,number,descPrice,freightPrice,imgUrl;
  [types.NAME](state,v){
    state.name = v;
  },
  [types.GOODSID](state,v){
    state.goodsId = v;
  },
  [types.SELTYPE](state,v){
    state.selType = v;
  },
  [types.PRICE](state,v){
    state.price = v;
  },
  [types.NUMBER](state,v){
    state.number = v;
  },
  [types.DESCPRICE](state,v){
    state.descPrice = v;
  },
  [types.FREIGHTPRICE](state,v){
    state.freightPrice = v;
  },
  [types.IMGURL](state,v){
    state.imgUrl = v;
  },
  [types.SHOPID](state,v){
    state.shopId = v;
  },
  [types.GOODSITEMNO](state,v){
    state.goodsItemNO = v;
  },
  [types.SINGLEPRICE](state,v){
    state.singlePrice = v;
  },
  [types.COSTPRICE](state,v){
    state.costPrice = v;
  },
  [types.TOTALMONEY](state,v){
    state.totalMoney = v;
  },
  [types.SPACPAEAM](state,v){
    state.spacPaeam = v;
  },
  [types.ISBUYLIMITED](state,v){
    state.isBuyLimited = v;
  },
  [types.ICONIMG](state,v){
    state.iconImg = v;
  },
  [types.NICKCNAME](state,v){
    state.nickCname = v;
  },
  [types.USERID](state,v){
    state.userId = v;
  },
  [types.USERPHONE](state,v){
    state.userPhone = v;
  },
  [types.JOINPER](state,v){
    state.joinPer = v;
  },
  [types.USERROLE](state,v){
    state.userRole = v;
  },
  [types.LEFTDATE](state,v){
    state.leftDate = v;
  },
  [types.TOTALDATE](state,v){
    state.totalDate = v;
  },
  [types.USERLIID](state,v){
    state.userLiId = v;
  },
  [types.ATTENACCOUNT](state,v){
    state.attenAccount = v;
  },
  [types.MAXBUYNUM](state,v){
    state.maxBuyNum = v;
  },
  [types.RECHARGESWITCH](state,v){
    state.rechargeSwitch = v;
  },
  [types.CITYNAME](state,v){
    state.cityName = v;
  },
  [types.LNG](state,v){
    state.lng = v;
  },
  [types.LAT](state,v){
    state.lat = v;
  },
  [types.AREACODE](state,v){
    state.areaCode = v;
  },
  [types.REGION](state,v){
    state.region = v;
  },
  // sessionkey
  [types.SESSIONKEY](state,v){
    state.sessionkey = v;
  },
  [types.SHARECARDID](state,v){
    state.shareCardId = v;
  },
  [types.ID](state,v){
    state.id = v;
  },
  [types.COUPONNUM](state,v){
    state.couponNum = v;
  },
  [types.CARDCOUPONACTIVEID](state,v){
    state.cardCouponActiveId = v;
  },
  [types.ISCOUPON](state,v){
    state.isCoupon = v;
  },
  [types.ISSELECTCARD](state,v){
    state.isSelectCard = v;
  },
  [types.ISSVIPCARD](state,v){
    state.isSvipCard = v;
  },
  [types.BGCOLORVALUE](state,v){
    state.bgColorValue = v;
  },
  [types.SHAREUSERID](state,v){
    state.shareUserId = v;
  },
  [types.NEWSHOPID](state,v){
    state.newShopId = v;
  },
  [types.COLLECTION](state,v){
    state.collection = v;
  },
  [types.SHOPLOGO](state,v){
    state.shopLogo = v;
  },
  [types.SHOPNAME](state,v){
    state.shopName = v;
  },
  [types.SERVE_ENV](state,v){
    state.serve_env = v;
  },
  [types.GOODSTYPE](state,v){
    state.goodsType = v;
  },
  [types.ORDERNUM](state,v){
    state.orderNum = v;
  },
  [types.SHAREUSERNAME](state,v){
    state.shareUsername = v;
  },
  [types.ISIPX](state,v){
    state.isIpx = v;
  },
}

export default matations
