import fetch from './fetch';
import {getSignIn} from "@/assets/js/jsBridge";


/**
 * svip支付宝支付
 * @param storeId
 * @param mercId
 * @param trmNo
 * @param no
 * @param amount
 * @param totalAmount
 * @param subject
 * @param shareuserId
 * @param sharecardId
 * @param userId
 */
const svipDetail = (data, sec) => fetch({
  url: 'https://shopapi.tenzhao.com/sapi/voip/cashier/svip/balance',
  method: 'get',
  params: data,
  sec: sec
});

/**
 *如果微信付款则查找出用户的wxServiceOpenId和账号(账号存在)金额
 */
const getUserInfo = (data) => fetch({
  url: 'https://sy.tenzhao.com/checkstand/api/userinfo/' + data.code,
  method: 'get'
});


/**
 *获取店铺信息
 */
const getStoreInfo = (data) => fetch({
  url: '/sapi/aggregatecode/storeactivies',
  params: data,
  method: 'get'
})


/**
 * 卡充值
 */
const recharge = (data,sec) => fetch({
  url: '/api/voip/recharge/card/v2',
  params: data,
  method: 'post',
  sec: sec
})

/**
 * 获取店铺详情
 * @param data
 * @param sec
 */
const shopDetail = (data,sec) => fetch({
  url: 'https://zst-test.tenzhao.com:8443/minisapi/voip/offlinerorder/pay/page',
  params: data,
  method: 'get',
  sec: sec
})

/**
 * 获取分享卡列表
 * @param data
 * @param sec
 */
const shareCardList = (data,sec) => fetch({
  url: 'https://zst-test.tenzhao.com:8443/minisapi/voip/shop/svipcard/share/list',
  params: data,
  method: 'get',
  sec: sec
});

/**
 * 获取优惠券列表
 * @param data
 * @param sec
 */
const getCouponList = (data,sec) => fetch({
  url: 'https://zst-test.tenzhao.com:8443/minisapi/voip/coupon/list',
  params: data,
  method: 'get',
  sec: sec
});

export {
  svipDetail, getUserInfo , getStoreInfo , recharge , shopDetail , shareCardList , getCouponList
}
