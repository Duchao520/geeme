const app = getApp();
Page({
  data: {
    brandPhone: '4008000650'
  },
  outLogin() {
    wx.showModal({
      title: '提示',
      content: '确认退出登录？',
      success:res => {
        if(res.confirm){
          app.globalData.userInfo = null
          wx.removeStorageSync('authorization');
          wx.removeStorageSync('brandId');
          wx.removeStorageSync('storeId');
          wx.removeStorageSync('staffId');
          wx.removeStorageSync('storeInfo');
          wx.reLaunch({
            url: '/pages/Login/loginIndex/loginIndex'
          })
        }
      }
    })
  },
  jumpChoose(){
    this.$route('/pages/Login/chooseBrandStore/chooseBrandStore')
  },
  jumpForgetPwd(){
    this.$route('/pages/Login/loginForgetPassword/loginForgetPassword')
  },
  /**
   * 点击修改手机号
   */
  updatePhone() {
    wx.navigateTo({
      url: '/pages/UIC/pages/validationPhone/validationPhone'
    })
  },

  /**
   * 点击提交意见反馈
   */
  tofeedBack() {
    wx.navigateTo({
      url: '/pages/IC/pages/feedBack/feedBack'
    })
  },

  /**
   * 点击拨打电话
   */
  makePhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.brandPhone
    })
  },
})