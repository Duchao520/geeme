export default {
  // 红包详情-id等
  SET_RED_PACKET_INFO(state, obj) {
    for (let key in obj) {
      state.redPacket[key] = obj[key]
    }
  },
  // 优惠券详情-id等
  SET_COUPONS_INFO(state, obj) {
    for (let key in obj) {
      state.coupons[key] = obj[key]
    }
  },
};