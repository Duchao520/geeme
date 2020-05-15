/**
 * 正式接口地址
 */
export const regular_uri = {
  userInfo: 'https://sy.tenzhao.com/checkstand/api/userinfo/',  //获取用户信息
  storeInfo: 'https://shopapi.tenzhao.com/sapi/aggregatecode/storeactivies',  //获取门店信息匹配多个满减活动
  AliPay: 'https://sy.tenzhao.com/checkstand/api/aliScanPay',     //支付宝生成支付订单
  wxPay: 'https://sy.tenzhao.com/checkstand/api/pubSigPay',       //微信生成支付订单
  scanPay: 'https://sy.tenzhao.com/checkstand/api/qr/',            //转链到扫码付款码
  svipWxPay: 'https://shopapi.tenzhao.com/sapi/svip/pubSigPay',     //svip分享卡支付接口
  svipAliPay: 'https://shopapi.tenzhao.com/sapi/svip/aliScanPay'     //svip分享卡支付宝支付接口
};

/**
 * 测试接口地址
 */

// export const regular_uri = {
//   userInfo: 'https://zst-test.tenzhao.com:8443/checkstand/api/userinfo/',  //获取用户信息
//   storeInfo: 'https://zst-test.tenzhao.com:8443/sapi/aggregatecode/storeactivies',  //获取门店信息匹配多个满减活动
//   AliPay: 'https://zst-test.tenzhao.com:8443/checkstand/api/aliScanPay',     //支付宝生成支付订单
//   wxPay: 'https://zst-test.tenzhao.com:8443/checkstand/api/pubSigPay',       //微信生成支付订单
//   scanPay: 'https://zst-test.tenzhao.com:8443/checkstand/api/qr/',            //转链到扫码付款码
//   svipWxPay: 'https://zst-test.tenzhao.com:8443/minisapi/svip/pubSigPay',     //svip分享卡微信支付接口
//   svipAliPay: 'https://zst-test.tenzhao.com:8443/minisapi/svip/aliScanPay'     //svip分享卡支付宝支付接口
// };

export const ctxPath = 'https://shopapi.tenzhao.com';
// export const ctxPath = 'https://zst-test.tenzhao.com:8443';




