/**
 * http请求
 */
//封装httpApi
import request from './httpUtil'
import store from '../store/index'
import {encodeSearchParams , json2Form} from '@/common/js/comm';

/**
 * 测试环境
 * host  正式域名配置
 * svipPay_host  svip分享卡支付域名接口
 * */
// const host = "http://zst-test.tenzhao.com:10087/api/voip";
// const svipPay_host = "http://zst-test.tenzhao.com:10087";

// var host = "https://zst.tenzhao.com/api/voip";
// var svipPay_host = "https://shopapi.tenzhao.com";
// var syhost = "https://sy.tenzhao.com/checkstand/api/pubSigPay";

var  host = "https://zst-test.tenzhao.com:8443/api/voip";
var  svipPay_host = "https://zst-test.tenzhao.com:8443";
var  syhost = "https://zst-test.tenzhao.com:8443/checkstand/api/pubSigPay";

export const ENV_COLLECT = (status) => {
  if(status){
    host = "https://zst.tenzhao.com/api/voip";
    svipPay_host = "https://shopapi.tenzhao.com";
    syhost = "https://sy.tenzhao.com/checkstand/api/pubSigPay";
  }else{
    host = "https://zst-test.tenzhao.com:8443/api/voip";
    svipPay_host = "https://zst-test.tenzhao.com:8443";
    syhost = "https://zst-test.tenzhao.com:8443/checkstand/api/pubSigPay";
  }
}

/**
 * 正式环境
 * host  正式域名配置
 * svipPay_host  svip分享卡支付域名接口
 * */



// const svipPay_host = "https://shopapi.tenzhao.com";
// const host = "https://zst.tenzhao.com/api/voip";
// const syhost = "https://sy.tenzhao.com/checkstand/api/pubSigPay"

const token = store.state.token;

const api = {
  /**
   *  作用：获取 unionid   openid  sessionkey
   **/
  getToken: (code) => request.get(`${host}/zst/mini/openid?js_code=${code}`),

  sendminimsg: (data,sec) => request.get(`${host}/test/sendminimsg`,data,{sec:sec}),
  unifiedpay: (data,sec) => request.post(`${svipPay_host}/sapi/voip/unifiedpay`,json2Form(data),{sec: sec}),
  /**
   *  作用：获取token
   **/
  postLogin: (par) => request.post(`${host}/login?`, json2Form(par)),
  /*
  * 作用：1.获取首页banner图
  *      2.获取线上商场图片  列表
  *      3.获取中间模块 svip  vip卡片跳转
  *      4.获取商品类别
  *      5.获取商品图片
  *      6.获取商品详情
  * */
  getbanner: (data, sec) => request.get(`${host}/advert/v2`, data, {sec: sec}),

  getAdv: (data, sec) => request.get(`${host}/index/icos`, data, {sec: sec}),

  getMoudle: (data, sec) => request.get(`${host}/index/modules`, data, {sec: sec}),

  getShopType: (data, sec) => request.get(`${host}/goods/allianceplat/type`, data, {sec: sec}),

  getShopP: (data, sec) => request.get(`${host}/goods/index`, data, {sec: sec}),

  getDetail: (data, sec) => request.get(`${host}/zst/good/detail`, data, {sec: sec}),
  /*
  * 作用：1.获取商品规格  /zst/goodinventory/detail
  *      2.获取地址   /api/voip/user/receiptAddress
  *      3.提交地址信息
  *      4.查询这个人的话呗信息 /voip/user/balance
  *      5.提交订单信息 /zst/good/onlineorder/ordernum
  *      6.获取全部订单信息
  * */
  getgoods: (data, sec) => request.get(`${host}/zst/goodinventory/detail`, data, {sec: sec}),

  getaddress: (data, sec) => request.get(`${host}/user/receiptAddress/get`, data, {sec: sec}),

  postAddress: (data, sec) => request.post(`${host}/user/receiptAddress/edit`, json2Form(data), {sec: sec}),

  getBalance: (data, sec) => request.post(`${host}/user/balance`, json2Form(data), {sec: sec}),

  postOrder: (data, sec) => request.post(`${host}/qr/good/onlineorder/ordernum`, data, {sec: sec}),

  postNewOrder: (data,sec) => request.post(`${host}/qr/good/onlineorder/ordernum`, json2Form(data), {sec: sec}),

  getOrder: (data, sec) => request.get(`${host}/zst/onlineorder/list`, data, {sec: sec}),

  getCity: (data, sec) => request.get(`${host}/find/cityCode/`, data, {sec: sec}),
  /**
   * 1.获取个人中心 /zst/distribution/center/v3
   * 2.获取我的团队信息 /user/myteam/members
   * 3.提交推荐人信息  /user/bind/inviter
   * 4.获取收益信息  /user/cashAccount   参数  token
   * 5.获取预收入信息  /user/preincomeamounts/log/v3  (预收入)
   * 6.获取预收益信息  /user/zstamounts/log/v3(已结算)
   * **/
  getPerMes: (data, sec) => request.get(`${host}/zst/distribution/center/v3`, data, {sec: sec}),
  getMyteam: (data, sec) => request.get(`${host}/user/myteam/members`, data, {sec: sec}),
  postInvite: (data, sec) => request.post(`${host}/user/bind/inviter?token=${data.token}&userName=${data.userName}`, data, {sec: sec}),
  getAccount: (data, sec) => request.get(`${host}/user/cashAccount`, data, {sec: sec}),
  getPreincome: (data, sec) => request.get(`${host}/user/preincomeamounts/log/v3`, data, {sec: sec}),
  getZsta: (data, sec) => request.get(`${host}/user/zstamounts/log/v3`, data, {sec: sec}),
  /**
   * 1.收藏页面接口
   * 2.取消收藏页面接口
   * 3.获取话呗消费明细
   * 4.获取个人收藏  /goods/collection/listPage
   * 5.删除订单 /onlineorder/update/state
   * 6.获取订单详情 /get/order/detail
   * **/
  addCollect: (data, sec) => request.post(`${host}/goods/collection/add`, json2Form(data), {sec: sec}),
  cancalCollect: (data, sec) => request.post(`${host}/goods/collection/cancel`, json2Form(data), {sec: sec}),
  getPurHis: (data, sec) => request.get(`${host}/recharge/query/all`, data, {sec: sec}),
  getColLi: (data, sec) => request.post(`${host}/goods/collection/listPage`, json2Form(data), {sec: sec}),
  deleOrder: (data, sec) => request.post(`${host}/zst/onlineorder/update/state`, json2Form(data), {sec: sec}),
  getOrderDetail: (data, sec) => request.get(`${host}/get/order/detail`, data, {sec: sec}),
  decodeWxData: (data,sec) => request.post(`${svipPay_host}/sapi/decrypt/wx/encryptedData`,json2Form(data),{sec:sec}),
  /**
   * 1.提交退款  /zst/onlineorder/applyrefund
   * 2.获取会员套餐信息 /user/vip/center/setMeal
   * 3.获取已结算信息  /zstamounts/log/v3
   * 4.获取收件类型 /api/voip/zst/couriercompany/list
   * 5.立即付款订饭支付  /zst/get/ordernum/later
   * 6.获取团队里面详细邀请人资料  /user/fullinfo
   * 7.
   * **/
  postApply: (data, sec) => request.post(`${host}/zst/onlineorder/applyrefund`, json2Form(data), {sec: sec}),
  getVipMes: (data, sec) => request.get(`${host}/user/vip/center/setMeal`, data, {sec: sec}),
  postVipMes: (data, sec) => request.post(`${host}/qr/recharge/ordernum/usermemberpackage?token=${data.token}`, data.data, {sec: sec}),
  getPreAll: (data, sec) => request.get(`${host}/user/zstamounts/log/v3`, data, {sec: sec}),
  getTypeMes: (data, sec) => request.get(`${host}/zst/couriercompany/list`, data, {sec: sec}),
  postOrderLater: (data, sec) => request.post(`${host}/qr/good/ordernum/later`, json2Form(data), {sec: sec}),
  getinDetail: (data, sec) => request.get(`${host}/im/userprofile/query`, data, {sec: sec}),
  /**
   * 站外扫码支付  https://sy.tenzhao.com/checkstand/api/pubSigPay
   * 删除地址接口
   * 设置为，默认地址的接口
   * 设置为，默认地址的接口
   * 获取用户最近信息
   * 获取短信验证码
   * 更改绑定手机号
   * **/
  scanPay: (data, sec) => request.post(`${syhost}`, json2Form(data), ''),
  deleteAdd: (data, sec) => request.post(`${host}/user/receiptAddress/remove`, json2Form(data), {sec: sec}),
  setDeAdd: (data, sec) => request.post(`${host}/user/default/receiptAddress/edit`, json2Form(data), {sec: sec}),
  getNewMes: (data, sec) => request.post(`${host}/user/fullinfo`, json2Form(data), {sec: sec}),
  getVid: (data, sec) => request.post(`${host}/v2/smsSecurityCode`, json2Form(data), {sec: sec}),
  reBindphone: (data, sec) => request.post(`${host}/user/reBindphone`, json2Form(data), {sec: sec}),
  bindPhone: (data,sec) => request.post(`${host}/user/phone/edit`,json2Form(data),{sec: sec}),
  /**
   * 获取卡主信息
   * 以及会员卡信息
   * 获取卡详情
   * 获取消费历史信息  /user/svip/mian/consume/records
   * 获取卡主信息
   * 获取飞猪卡信息  /user/svip/share/detail
   * */
  getCarder: (data, sec) => request.post(`${host}/user/svip/main/consume/shop/info`, json2Form(data), {sec: sec}),
  getCardBag: (data, sec) => request.post(`${host}/user/svip/mian/myCards`, json2Form(data), {sec: sec}),
  getCardDetail: (data, sec) => request.post(`${host}/user/svip/mian/cardInfo`, json2Form(data), {sec: sec}),
  getRecords: (data, sec) => request.post(`${host}/user/svip/mian/consume/records`, json2Form(data), {sec: sec}),
  getMajorCard: (data, sec) => request.post(`${host}/user/svip/mian/cardInfo`, json2Form(data), {sec: sec}),
  getnoCard: (data, sec) => request.post(`${host}/user/svip/share/detail`, json2Form(data), {sec: sec}),
  /**
   * 提交折扣 /user/svip/share/save
   * 获取分享卡  /user/svip/share/list
   * 发布状态的改变      /user/svip/share/cancel
   * 删除分享卡      /user/svip/share/remove
   * 累积收益野蛮   /user/svip/mian/profit/records
   * 获取详请      /user/svip/share/consume/detail
   * */
  postDisCount: (data, sec) => request.post(`${host}/user/svip/share/save?`, json2Form(data), {sec: sec}),
  getShaCard: (data, sec) => request.post(`${host}/user/svip/share/list?`, json2Form(data), {sec: sec}),
  getCancel: (data, sec) => request.post(`${host}/user/svip/share/cancel?`, json2Form(data), {sec: sec}),
  deleteCancel: (data, sec) => request.post(`${host}/user/svip/share/remove?`, json2Form(data), {sec: sec}),
  getProfit: (data, sec) => request.post(`${host}/user/svip/mian/profit/records?`, json2Form(data), {sec: sec}),
  getProfitDetail: (data, sec) => request.post(`${host}/user/svip/share/consume/detail?`, json2Form(data), {sec: sec}),
  /**
   * 获取卡详情  /user/svip/store/share/detail
   * 搜藏页面 collectionPag   /user/svip/store/shareCard/collection
   * 支付借口   https://shopapi.tenzhao.com/api/qr/svip/{storeId}/{no}
   * 卡主付款的接口   /user/svip/mian/balance/pay
   * 微信支付接口  /sapi/svip/pubSigPay
   * 推荐商家轮播 /katao/carouselfigure?
   * */
  getShDetail: (data, sec) => request.post(`${host}/user/svip/store/share/detail`, json2Form(data), {sec: sec}),
  collectionPag: (data, sec) => request.post(`${host}/user/svip/store/shareCard/collection`, json2Form(data), {sec: sec}),
  payMoney: (data, sec) => request.post(`${host}/shop/store/svippay/channel`, json2Form(data), {sec: sec}),
  carderMoney: (data, sec) => request.post(`${host}/user/svip/mian/balance/pay`, json2Form(data), {sec: sec}),
  wxPay: (data, sec) => request.post(`${svipPay_host}/sapi/svip/pubSigPay`, json2Form(data), {sec: sec}),
  recShop: (data, sec) => request.get(`${host}/katao/carouselfigure?`, data, {sec: sec}),
  industrytype: (data, sec) => request.post(`${host}/periphery/industrytype?`, data, {sec: sec}),
  /**
   * 推荐商家列表  /user/svip/store/list
   * 商家列表详情  /user/svip/store/detail
   * 门店共享卡   /user/svip/store/sharecards
   * 获取当前卡主信息  /api/voip/user/svip/main/consume/shop/info
   * 获取当前登录用户信息 /api/voip/userself/info?
   * 分享卡收益明细 /user/svip/share/profit/records
   * */
  recomList: (data, sec) => request.post(`${host}/user/svip/store/list`, json2Form(data), {sec: sec}),
  recomDetail: (data, sec) => request.post(`${host}/user/svip/store/detail`, json2Form(data), {sec: sec}),
  recomShare: (data, sec) => request.post(`${host}/user/svip/store/sharecards`, json2Form(data), {sec: sec}),
  getPerMMss: (data, sec) => request.get(`${host}/userself/info`, data, {sec: sec}),
  getShareMes: (data, sec) => request.post(`${host}/user/svip/share/profit/records`, json2Form(data), {sec: sec}),

  /**
   * qrcode   扫码页面
   * vip中心
   * 跑马灯效果   /voip/user/vip/center/tips
   * 获取页面数据
   * 获取周边商家信息
   * 获取banner图  /voip/goods/allianceplat/type/banners
   * 获取类目商品信息   /zst/muilpart/modules
   * 回去商品banner图 /goods/allianceplat/type/banners
   * **/
  getParCode: (data, sec) => request.get(`${host}/active/barcode`, data, {sec: sec}),
  getVipUser: (data, sec) => request.post(`${host}/user/vip/center/info`, json2Form(data), {sec: sec}),
  getMar: (data, sec) => request.post(`${host}/user/vip/center/tips`, json2Form(data), {sec: sec}),
  getPageBanner: (data, sec) => request.post(`${host}/user/playbill/v3`, json2Form(data), {sec: sec}),
  getNearBy: (data, sec) => request.get(`${host}/periphery/list`, data, {sec: sec}),
  getBannBy: (data, sec) => request.get(`${host}/goods/allianceplat/type/banners`, data, {sec: sec}),
  getBannMod: (data, sec) => request.get(`${host}/zst/muilpart/modules`, data, {sec: sec}),
  //获取热搜词
  getHotpage: (data, sec) => request.post(`${host}/goods/hotSearch/getWords`, json2Form(data), {sec: sec}),

  /***
   * 获取商家中心
   * 获取店主轮播 /shop/homepage
   * 获取小程序码接口  /integral/barcode/state
   * 获取分享卡详情接口
   * 进入支付页面 获取的接口  /offlinerorder/pay/page
   * **/
  getShopCenter: (data, sec) => request.get(`${host}/shop/center`, data, {sec: sec}),
  getShopText: (data, sec) => request.get(`${host}/shop/homepage`, data, {sec: sec}),
  getMinMes: (data, sec) => request.get(`${host}/user/svip/store/shareQr`, data, {sec: sec}),
  getScanState: (data, sec) => request.get(`${host}/integral/barcode/state`, data, {sec: sec}),
  getWorldPage: (data, sec) => request.post(`${host}/recharge/card`, json2Form(data), {sec: sec}),
  getSvipDetail: (data, sec) => request.get(`${host}/user/svip/sharecard/detail`, data, {sec: sec}),
  getPayDetail: (data, sec) => request.get(`${host}/offlinerorder/pay/page`, data, {sec: sec}),
  /*
  * 优惠券列表 /coupon/list
  * 优惠券明细 /coupon/detail
  * 获取商家活动明细 storeactivies
  * 获取订单明细  /get/offlineorder/detail
  * */
  getCouponList: (data, sec) => request.get(`${host}/coupon/list`, data, {sec: sec}),
  getCouDetail: (data, sec) => request.get(`${host}/coupon/detail`, data, {sec: sec}),
  getActiveDetail: (data, sec) => request.get(`${svipPay_host}/sapi/aggregatecode/storeactivies`, data, {sec: sec}),
  getOrderOrder: (data, sec) => request.get(`${host}/get/offlineorder/detail`, data, {sec: sec}),
  goreDiPage: (num, secNum) => request.get(`${svipPay_host}/sapi/voip/mini/scanPay/${num}/${secNum}`),
  getPacket: (data,sec) => request.get(`${host}/redEnvelope/sendRedEnvelope`,data,{sec: sec}),
  getPacketDetail: (data,sec) => request.get(`${host}/redEnvelope/twoWayRedEnvelope`,data,{sec: sec}),
  //获取手机号的接口
  //获取商家信息
  //获取首屏信息
  //获取分享卡的信息
  getPhone: (data, sec) => request.post(`https://zst-test.tenzhao.com:8443/sapi/decrypt/wx/encryptedData`, json2Form(data), {sec: sec}),
  getShopMes: (data, sec) => request.get(`${host}/shop/center`, data, {sec: sec}),
  getInderBanner: (data, sec) => request.get(`${host}/getBannerRegion`, data, {sec: sec}),
  postTimes: (data, sec) => request.get(`${host}/bannerRegionCount`, data, {sec: sec}),
  getShareData: (data, sec) => request.get(`${host}/zst/good/detail`, data, {sec: sec}),
  //得到优惠券
  //使用优惠券
  //判断用户扫码状态
  //获取所有门店信息
  getItCoupon: (data, sec) => request.post(`${host}/coupon/receive`, json2Form(data), {sec: sec}),
  useCoupon: (data, sec) => request.get(`${host}/active/barcode`, data, {sec: sec}),
  couponStatu: (data, sec) => request.get(`${host}/coupon/state`, data, {sec: sec}),
  getcouStoreList: (data, sec) => request.get(`${host}/coupon/morestore`, data, {sec: sec}),
  //关于砍价的相关接口
  //砍价商家列表  /bargain/list
  //用户正在砍价展示  /bargaining/list
  //用户正在砍价详细    /bargain/tasksing/list?
  //开团   /bargain/openBarginTasks
  //砍价  /bargain/barginTaskslog
  //领取核销码  /bargain/barginTaskswrteoff
  //评价  /bargain/bargaincomment
  //活动评价列表  /bargain/bargaincomment/list
  //砍价任务详细   /bargaining/detail
  //可参与砍价列表   bargain/canTasksing/list
  getBargain: (data, sec) => request.get(`${host}/bargain/list`, data, {sec: sec}),
  getBargaining: (data, sec) => request.get(`${host}/bargaining/list`, data, {sec: sec}),
  getTasksing: (data, sec) => request.get(`${host}/bargain/tasksing/list`, data, {sec: sec}),
  openBarginTasks: (data, sec) => request.post(`${host}/bargain/openBargainTasks`, json2Form(data), {sec: sec}),
  barginTaskslog: (data, sec) => request.get(`${host}/bargain/barginTaskslog`, data, {sec: sec}),
  getTaskCode: (data, sec) => request.get(`${host}/bargain/barginTaskswrteoff`, data, {sec: sec}),
  bargaincomment: (data, sec) => request.post(`${host}/bargain/bargaincomment`, json2Form(data), {sec: sec}),
  comList: (data, sec) => request.get(`${host}/bargain/bargaincomment/list`, data, {sec: sec}),
  barDetail: (data, sec) => request.get(`${host}/bargaining/detail`, data, {sec: sec}),
  canTasksing:(data,sec) =>request.get(`${host}/bargain/canTasksing/list`,data,{sec:sec}),
  //查询好友帮任务列表 /bargain/barginTaskslogHelp
  //查询砍价成功的人物信息列表 /bargain/barginTaskslogSuccess
  //砍价  /bargain/bargainTaskslog
  //开团成功的人员信息 /bargain/bargaincomment/list
  //领取核销码  /bargain/bargainTaskswrteoff
  //支付完成之后调用的接口   /bargain/detail/storeId
  //周边活动商家列表  /storeForBargain/list
  lookHelper:(data,sec) => request.get(`${host}/bargain/bargainTaskslogHelp`,data,{sec:sec}),
  lookSucMes:(data,sec) => request.get(`${host}/bargain/bargainTaskslogSuccess`,data,{sec:sec}),
  bargainTaskslog:(data,sec) =>request.post(`${host}/bargain/bargainTaskslog`,json2Form(data),{sec:sec}),
  bargainTaskswrteoff:(data,sec) => request.post(`${host}/bargain/bargainTaskswrteoff`,json2Form(data),{sec:sec}),
  bargainDetail:(data,sec)=>request.get(`${host}/bargain/detail/storeId`,data,{sec:sec}),
  getnearByshop:(data,sec)=>request.post(`${host}/storeForBargain/list`, json2Form(data) ,{sec:sec}),
  //  获取主卡信息 /get/maincard/order/detail
  //  /bargain/getBargainForStore
  //  杭白绑定卡号  /sapi/hangb/shop/svip/binduser
  getMaincard:(data,sec)=>request.get(`${host}/get/maincard/order/detail`,data,{sec:sec}),
  getBargainForStore:(data,sec)=>request.get(`${host}/bargain/getBargainForStore`,data,{sec:sec}),
  scanHBQR: (url,data,sec) => request.get(url,data, {sec: sec}),
  getMiniQr: (data,sec) => request.get(`${host}/get/mini/qrcode`,data,{sec: sec}),
  hangbBinduser:(data,sec)=>request.post(`${svipPay_host}/sapi/hangb/shop/svip/binduser`,json2Form(data),{sec:sec}),
  rechargeHistory:(data,sec)=>request.get(`${host}/user/svip/maincard/recharge/records`,json2Form(data),{sec:sec}),
  getOffCode:(data,sec)=>request.get(`${host}/onlineorder/getWriteOffCode`,json2Form(data),{sec:sec}),
  getpurHistoryduser:(data,sec)=>request.get(`${host}/offlineorder/list/v2`,json2Form(data),{sec:sec}),
  getordermesDetail:(data,sec)=>request.get(`${host}/offlineorder/detail`,json2Form(data),{sec:sec}),
  getLotteryhistory:(data,sec)=>request.get(`${host}/shoplotteryactive/user/records`,json2Form(data),{sec:sec}),
  getTurnRecord:(data,sec)=>request.get(`${host}/user/lotteryRecord`,data,{sec:sec}),
  getTurn:(data,sec)=>request.post(`${host}/lottery/getprize`,json2Form(data),{sec:sec}),
  getConverRecord:(data,sec)=>request.post(`${host}/callfee/zoom/records`,json2Form(data),{sec:sec}),
  getRedEnvelopeList: (data,sec) => request.get(`${host}/redEnvelope/getRedEnvelopeList`,data,{sec: sec})
}




export default {
  install: function(Vue,name="$http") {//自定义名字(vue-resource也使用$http)
    Object.defineProperty(Vue.prototype, name, { value: api });//将组件库挂载在原型对象上
  }
}
