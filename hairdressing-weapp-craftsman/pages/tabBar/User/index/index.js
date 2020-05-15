// pages/tabBar/User/index/index.js
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    info: null,
  },
  onLoad(options) {
    
  },
  onShow() {
    this.getStaffInfo()
  },
  onPullDownRefresh() {
    this.getStaffInfo()
  },
  getStaffInfo() {
    fetch.staffInfo4Server().then(data => {
      wx.stopPullDownRefresh()
      this.$setData({
        info: data
      })
    })
  },
  /**
   * 去我的关注
   */
  touserFocus() {
    wx.navigateTo({
      url: '/pages/UIC/pages/userFocus/userFocus'
    })
  },

  /**
   * 去我的粉丝
   */
  touserFans() {
    wx.navigateTo({
      url: '/pages/UIC/pages/userFans/userFans'
    })
  },

  /**
   * 点击去我的作品
   */
  touserWork() {
    wx.navigateTo({
      url: '/pages/UIC/pages/userWork/userWork'
    })
  },

  /**
   * 点击去个人资料
   */
  toupdateInfo() {
    this.$route('/pages/UIC/pages/userInfo/userInfo')
  },

  /**
   * 点击去服务订单
   */
  toserviceOrderList() {
    wx.navigateTo({
      url: '/pages/UIC/pages/serviceOrderList/serviceOrderList'
    })
  },

  /**
   * 点击去我的评价
   */
  toevaluationList() {
    wx.navigateTo({
      url: '/pages/UIC/pages/evaluationList/evaluationList'
    })
  },

  /**
   * 点击去账号设置
   */
  toaccountSet() {
    wx.navigateTo({
      url: '/pages/UIC/pages/accountSet/accountSet'
    })
  },

  /**
   * 点击去我的收藏
   */
  tocollection() {
    wx.navigateTo({
      url: '/pages/UIC/pages/collection/collection'
    })
  },
})