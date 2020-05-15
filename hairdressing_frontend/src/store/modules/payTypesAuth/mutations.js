export default {
  AUTH_WECHAT_PAY(state, obj) {
    for (let key in obj) {
      state.wechatPay[key] = obj[key]
    }
  },
  AUTH_ALI_PAY(state, obj) {
    for (let key in obj) {
      state.aliPay[key] = obj[key]
    }
  }
};