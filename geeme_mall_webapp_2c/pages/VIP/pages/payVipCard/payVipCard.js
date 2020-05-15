// pages/VIP/pages/payVipCard/payVipCard.js
var apiAction = null, app = null;
Page({
  data: {
    logo: null,
    info: null,
    totalCharge: null,
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    app = getApp();
    app.getBrand((brand) => {
      this.$setData({
        logo: brand.logo,
        info: JSON.parse(options.info),
        totalCharge: app.globalData.bill.info.totalCharge
      })
    })
  },
  onUnload() {          //清内存
    apiAction = null;
    app = null;
    this.data = null;
  },
  /**
   * 确认支付
   */
  pay() {
    wx.$setStorage('bill',app.globalData.bill)
    apiAction.billing(app.globalData.bill.info.billId)
  },

})