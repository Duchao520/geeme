// pages/UIC/pages/setaccount/setaccount.js
const app = getApp();
Page({
  data: {
    brandPhone:'',
    isLogin:false,
  },
  onLoad(options) {
    let isLogin = false
    if (wx.$getStorage('authorization')){
      isLogin = true
    }
    app.getBrand(brand => {
      this.$setData({
        brandPhone: brand.phone,
        isLogin
      })
    })
  },
  // 点击退出登录
  outLogin(){
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('authorization');
    app.globalData.userInfo = null
    app.globalData.phone = null
    wx.reLaunch({
      url: '/pages/tabBar/my/index/index'
    })
  },

  // 点击修改手机号
  updatePhone(){
    wx.navigateTo({
      url: '/pages/UIC/pages/updatephone/updatephone'
    })
  },
  // 跳转设置支付密码
  jumpSetPayPwd(){
    this.$route('/pages/UIC/pages/setPayPwd/setPayPwd')
  },
  // 跳转收货地址
  jumpShippingAddress(){
    this.$route('/pages/UIC/pages/shippingAddress/shippingAddress')
  },

  // 点击提交意见反馈
  tofeedBack(){
    wx.navigateTo({
      url: '/pages/RC/pages/feedBack/feedBack'
    })
  },

  // 点击拨打电话
  makePhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.brandPhone
    })
  },
})