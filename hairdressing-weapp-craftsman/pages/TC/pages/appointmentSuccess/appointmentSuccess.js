// pages/TC/pages/appointemtSuccess/appointemtSuccess.js
Page({
  data: {

  },
  onLoad(options) {

  },
  jumpDailyWork(){
    wx.switchTab({
      url: '/pages/tabBar/DailyWork/index/index',
    })
  }
})