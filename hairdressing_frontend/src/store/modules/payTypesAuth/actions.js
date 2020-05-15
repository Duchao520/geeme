export default {
  // 微信支付认证
  authWechatPay: ({ commit }, obj) => {
    commit('AUTH_WECHAT_PAY', obj)
  },
  // 支付宝支付认证
  authAliPay: ({ commit }, obj) => {
    commit('AUTH_ALI_PAY', obj)
  },
};