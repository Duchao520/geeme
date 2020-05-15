const state={
  openId: '',
  token:'',
  avatar:'',      //微信头像
  nickname:'',    //微信昵称
  unionid:'',
  sessionkey:'',
  newShopId:'',  //当前用户跟谁的商家id
  gender:'',
  province:'',
  city:'',
  appVersion:'',
  device:'mini-program',
  curCity:'昆明',
  cityName:'',
  // 后台拿回来的用户信息

  iconImg: '',
  nickCname: '',
  //用户的名称 id
  userId: '',
  userPhone: '',
  joinPer: '',
  //真实的userId  用户id
  userLiId:'',
  //是否是会员
  userRole:'',
  //嗨哟多少天到期
  leftDate:'',
  //总的日期是多少
  totalDate:'',
  // 订单
  // var name,goodsId,selType,price,number,descPrice,freightPrice,imgUrl,shopId，shopName，shoplogo ,;
  name:'',
  goodsId:'',
  selType:'',
  price:'',
  number:'',
  descPrice:'',
  freightPrice:'',
  imgUrl:'',
  goodsType:'',
  // 商家id
  shopId:'',
  goodsItemNO:'',
  singlePrice:'',  //现价
  costPrice:'',
  totalMoney:'',
  spacPaeam:'',
  isBuyLimited:'',
  shopName:'',
  shopLogo:'',

  //再存一个用户是否关注过公众号
  attenAccount:'',
  //最大购买数量
  maxBuyNum:'',
  rechargeSwitch:'',
  // 用户当前位置信息
  lng:'',
  lat:'',
  areaCode:'',
  region:[],

  //在这里维护一下shareCardId  分享卡id  SHAREUSERNAME
  shareCardId:'',
  shareUsername:'',
  //这里维护一下   优惠券的相关参数
  id:'',
  couponNum:'',
  cardCouponActiveId:'',

  isCoupon:'',           //判断是是从优惠券跳转  1是  0否
  isSelectCard:'',    //3判断是否选过卡
  isSvipCard:'',   //判断是否是从共享卡页面分享过来的  1 是  0不是

  // 再来一个保存全局变量的颜色值
  bgColorValue:'',
  shareUserId:'',

  collection:1,//再来一个用来决定他刷新哪张卡  我收藏的卡
  serve_env:1,//再来一个用来决定他刷新哪张卡  我收藏的卡
  orderNum:'', //话呗免费抽来一个订单用来保存
  isIPX:'',
}
export default state
