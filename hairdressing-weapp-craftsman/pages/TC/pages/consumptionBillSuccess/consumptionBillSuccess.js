// pages/TC/pages/consumptionBillSuccess/consumptionBillSuccess.js
Page({
  data: {

  },
  onLoad(options) {

  },
  onShow(){
    if(!this.$status.isFirstShow){
      wx.switchTab({
        url: '/pages/tabBar/User/index/index',
      })
    }
  },
  backHome() {
    wx.switchTab({
      url: '/pages/tabBar/Home/index/index'
    })
  },
  jumpOrders(){
    this.$route('/pages/UIC/pages/serviceOrderList/serviceOrderList')
  }
})