// pages/UIC/pages/QuickOrder/QuickOrder.js
var apiAction = null,util = null,app = null;
Page({
  data: {
    userInfo: null,
    qrcode: null,
    countdown: 60, // 倒计时
    themeId: 1,
    brandId: null  //品牌ID
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    if (wx.$getStorage('themeId') && wx.$getStorage('themeId') != this.data.themeId) {
      this.$setData({
        themeId: wx.$getStorage('themeId')
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: util.getSkin(wx.$getStorage('themeId')).color1,
      })
    }
  },
  onShow(){
    this.getUserInfo()
  },
  onUnload(){          //清内存
    apiAction = null; 
    util = null; 
    app = null;
    clearInterval(this.interval);
    this.data = null;
  },
  getUserInfo() {
    // 检查是否绑定手机号
    app.getPhone(phone => {
      app.getUserInfo(userInfo => {
        this.data.userInfo = userInfo;
        app.getShopInfo(shopInfo => {
          this.data.brandId = shopInfo.brandId;
          this.getQrcode('init').then(res => {
            Object.assign(res, { userInfo, brandId: shopInfo.brandId});
            this.setData(res);
            this.startCountdown();
            res = null;
            return null;
          })
        })
      })
    })
  },
  getQrcode(type = null) {
    if (this.interval) {
      clearInterval(this.interval)
    }
    const page = 'pages/TC/pages/consumptionBillOne/consumptionBillOne' // 跳转的服务版的页面
    const scene = `id:${this.data.userInfo.brandCustomerId}&brandId:${this.data.brandId}`
    const appId = 'wxec7589fa231cb498' // 服务版appId
    wx.$showLoading()
    return apiAction.commonQrCode(page, scene, 60, appId).then(data => {
      wx.$hideLoading()
      if(type == 'init'){
        return { qrcode: data.fileKey, countdown: 60 }        
      }else{
        this.setData({ qrcode: data.fileKey, countdown: 60 })
        this.startCountdown()
      }
    })
  },
  // 开始倒计时
  startCountdown() {
    this.interval = setInterval(() => {
      this.$setData({
        countdown: --this.data.countdown
      })
      if (this.data.countdown == 0) {
        clearInterval(this.interval)
      }
    }, 1000)
  }
})