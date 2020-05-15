// pages/UIC/pages/getAuthority/getAuthority.js
const apiAction = require('../../../../utils/apiAction.js');
const app = getApp()
Page({
  $name:'getAuthority',
  data: {
    logo:null,
  },
  onLoad(){
    app.getBrand( brand => {
      this.setData({
        logo:brand.logo
      })
    })
  },
  getUserInfo(e) {
    const userInfo = e.detail.userInfo
    if (!userInfo) {
      wx.showToast({
        title: '亲，授权才可以享受服务哦',
        icon: 'none'
      })
      return
    }
    apiAction.login(userInfo).then( data => {
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      },1000)
      
    })
  },
})