const request = require('./httpUtil');
const {json2Form} = require('./jsBridge');
var config = require("../config")
import qs from 'qs'

 const CONTCAT_DOMAIN = config.CONTCAT_DOMAIN;

const API = {
  facepay:(data) => request.post(`${CONTCAT_DOMAIN}/sapi/voip/facepay/placeorder`,qs.stringify(data)),

  login:(data) => request.post(`${CONTCAT_DOMAIN}/sapi/voip/login`,qs.stringify(data)),

  logout:(data) => request.get(`${CONTCAT_DOMAIN}/sapi/voip/logout`,qs.stringify(data)),

  shopEntry:(data) => request.get(`${CONTCAT_DOMAIN}/sapi/voip/shop/iot/invite/shop/entry`,data),

  order: (data) => request.post(`${CONTCAT_DOMAIN}/sapi/voip/order/statistics/v2`,qs.stringify(data)),

  verifyUser: (data) => request.get(`${CONTCAT_DOMAIN}/sapi/voip/facepay/member/info`,data),

  memberRegister: (data) => request.post(`${CONTCAT_DOMAIN}/sapi/voip/facepay/member/register`,qs.stringify(data)),

  storeActives: (data) => request.get(`${CONTCAT_DOMAIN}/sapi/voip/facepay/member/store/actives`,data),

  getShareCardList: (data) => request.get(`${CONTCAT_DOMAIN}/sapi/voip/shop/svipcard/share/list`,data),

  sendMsCode: (data) => request.post(`${CONTCAT_DOMAIN}/sapi/voip/v2/smsSecurityCode`,qs.stringify(data)),

  placeorderCheck: (data) => request.get(`${CONTCAT_DOMAIN}/sapi/voip/facepay/placeorder/check`,data),

  svipCardList: (data) => request.get(`${CONTCAT_DOMAIN}/sapi/voip/shop/svipcard/recharge/list`,data),

  rechargeList: (data) => request.post(`${CONTCAT_DOMAIN}/sapi/voip/shop/svip/iot/active/list`,qs.stringify(data)),

  recharge: (data) => request.post(`${CONTCAT_DOMAIN}/sapi/voip/facepay/svipcard/recharge`,qs.stringify(data))
  }

module.exports=API