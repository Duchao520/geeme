export default {
  // 红包
  setRedPacketInfo: ({ commit }, obj) => {
    commit('SET_RED_PACKET_INFO', obj)
  },
  // 优惠券
  setCouponsInfo: ({ commit }, obj) => {
    commit('SET_COUPONS_INFO', obj)
  },
};