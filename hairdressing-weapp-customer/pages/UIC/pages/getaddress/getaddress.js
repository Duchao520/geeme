// pages/config/pages/getaddress/getaddress.js
Page({
  // 调起设置权限页面
  callback(){
    wx.openSetting({
      success(res){
        if(res.authSetting['scope.userLocation']){
            wx.reLaunch({
              url: '/pages/tabBar/home/index/index'
            })
        }
      }
    })
  }
})