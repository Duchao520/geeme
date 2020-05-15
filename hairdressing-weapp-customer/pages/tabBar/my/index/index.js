// pages/my/index/index.js
const util = require('../../../../utils/util.js');
const apiAction = require('../../../../utils/apiAction.js')
const app = getApp()
Page({
  data: {
    phone: '',
    userInfo: '',
    SELL_MODAL: false,
    BIND_PHONE_MODAL:false,
    CUSTOMER_SELLER: false,
    //最近一次预约
    appointmentInfo: null,
    md5: {
      appointmentInfo: ''
    },
    themeId:1,
  },
  onLoad(options) {
    app.getBrand(brand => {
      this.setData({phone: brand.phone})
    })
    wx.$event.on('login', this.initPage)
  },
  onShow(){
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      const tabBarObj = this.getTabBar();
      let tabBar = tabBarObj.data.tabBar.filter(ele => ele.showFlag == 1);
      let index = tabBar.findIndex(value => {
        return value.pagePath == "/pages/tabBar/my/index/index"
      })
      tabBarObj.setData({
        selected: index == -1 ? app.globalData.selected : index
      })
    }
    this.initPage()
  },
  initPage() {
    if (wx.$getStorage('authorization')) {
      let promiseArr = [this.getAppointment(), this.getUserInfo()];
      util.PromiseAll(promiseArr).then(res => {
        wx.stopPullDownRefresh();
        Object.assign(res, {themeId: wx.$getStorage('themeId')});
        this.setData(res);
        res = null;
        promiseArr = null;
      })
    }else{
      wx.stopPullDownRefresh();
    }
  },
  getUserInfo(){
    return apiAction.getPersonalInfo().then(data => {
      return{userInfo: data}
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.initPage()
  },

  getSellerGoodsListForSeller() {
    return apiAction.getSellerGoodsListForSeller().then(res => {
      if (res.sellerId) {
        return { CUSTOMER_SELLER: true }
      } else {
        return { CUSTOMER_SELLER: false }
      }
    })
  },
  // 用户授权
  getuserinfo(e) {
    const userInfo = e.detail.userInfo
    console.log(userInfo)
    if (!userInfo) {
      wx.showToast({
        title: '亲，授权才可以享受服务哦',
        icon: 'none'
      })
      return
    }
    apiAction.login(userInfo)
  },
  // 获取用户最近一次的预约
  getAppointment() {
    return apiAction.weGetClosestAppointment().then(data => {
      wx.stopPullDownRefresh()
      const appointmentInfo = data.closestAppointment;
      if (appointmentInfo) {
        let str = JSON.stringify(appointmentInfo)
        let md5 = util.getMd5(str)
        if (md5 !== this.data.md5.appointmentInfo) {
          return{appointmentInfo}
        }
      }else{
        return { appointmentInfo }
      }
    })
  },
  /**
   * 跳转账户设置
   */
  setaccount: function() {
    wx.navigateTo({
      url: '/pages/UIC/pages/account/setaccount/setaccount'
    })
  },

  tel(){
    wx.makePhoneCall({ phoneNumber: this.data.phone})
  },

  /**
   * 跳转我的预约
   */
  jumpmyappointment: function() {
    wx.navigateTo({
      url: '/pages/UIC/pages/myappointment/myappointment'
    })
  },

  /**
   * 跳转最近一次预约
   */
  jumpAppointmentDetail(e) {
    let appointmentId = e.currentTarget.dataset.appointmentid
    wx.navigateTo({
      url: '/pages/TC/pages/appointmentdetail/appointmentdetail?appointmentId=' + appointmentId,
    })
  },

  /**
   * 跳转服务订单
   */
  jumpmyorder(e) {
    let url
    if (util.IF(this.data.userInfo.hasMobile)) {
      url = `/pages/UIC/pages/myorder/myorder?index=${e.currentTarget.dataset.index}`
    } else {
      url = '/pages/UIC/pages/bindphone/bindphone'
    }
    wx.navigateTo({
      url: url
    })
  },

  /**
   * 点击跳转产品订单
   */
  toproductOrderList(e) {
    let url
    if (!e.currentTarget.dataset.index) return
    if (util.IF(this.data.userInfo.hasMobile)) {
      url = `/pages/IC/pages/productOrderList/productOrderList?tabIndex=${e.currentTarget.dataset.index}`
    } else {
      url = '/pages/UIC/pages/bindphone/bindphone'
    }
    wx.navigateTo({
      url: url
    })
  },

  jumpPoints(){
    wx.$route('/pages/VIP/pages/intergral/intergral')
  },

  /**
   * 点击跳转退款售后
   */
  toRefundList() {
    wx.navigateTo({
      url: '/pages/IC/pages/refundList/refundList',
    })
  },
  
  // 跳转服务订单退款/售后列表
  jumpRefundList_service(){
    this.$route('/pages/IC/pages/refundList_service/refundList_service')
  },

  /**
   * 跳转个人信息
   */
  jumpUserInfo(e) {
    if (e.target.dataset.me === 'getUserInfo') return
    this.$route('/pages/UIC/pages/setUserInfo/setUserInfo')
  },

  /**
   * 跳转我的收藏
   */
  jumpCollection() {
    let url;
    if (util.IF(this.data.userInfo.hasMobile)){
      url = '/pages/UIC/pages/mycollection/mycollection'
    }else{
      url = '/pages/UIC/pages/bindphone/bindphone'
    }
    wx.navigateTo({
      url: url
    })
  },

  /**
   * 跳转消费账单
   */
  jumpConsumptionOrder() {
    this.$route('/pages/UIC/pages/spendorder/spendorder')
  },

  /**
   * 跳转美丽档案
   */
  jumpArchives() {
    wx.navigateTo({
      url: '/pages/UIC/pages/userArchives/userArchives'
    })
  },

  /**
   * 跳转会员卡
   */
  jumpVipCard() {
    wx.navigateTo({
      url: '/pages/VIP/pages/UserVipCard/UserVipCard'
    })
  },

  /**
   * 跳转我的资产
   */
  jumpMyAssets() {
    wx.navigateTo({
      url: '/pages/UIC/pages/UsersMyAssets/UsersMyAssets'
    })
  },
  // 跳转会员身份
  jumpMemberLevel(){
    this.$route('/pages/VIP/pages/memberLevel/memberLevel')
  },
  //我的推广
  jumpDistribution() {
    let { userInfo } = this.data;
    if (!wx.$getStorage('authorization')) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return;
    }
    if (!userInfo.hasMobile) {
      this.$route('/pages/UIC/pages/bindphone/bindphone')
      return;
    }
    this.getSellerGoodsListForSeller().then(res => {
      if (res.CUSTOMER_SELLER) {
        this.$route('/pages/DBS/pages/distribution/distribution')
      } else {
        this.setData({ SELL_MODAL: true })
      }
    })
  },
  //股东分红
  jumpDistribution() {
    let { userInfo } = this.data;
    if (!wx.$getStorage('authorization')) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return;
    }
    if (!userInfo.hasMobile) {
      this.$route('/pages/UIC/pages/bindphone/bindphone')
      return;
    }
    this.getSellerGoodsListForSeller().then(res => {
      if (res.CUSTOMER_SELLER) {
        this.$route('/pages/DBS/pages_2/distribution/distribution')
      } else {
        this.setData({ SELL_MODAL: true })
      }
    })
  },
  //绑定手机号
  bindPhone(){
    this.$route('/pages/UIC/pages/bindphone/bindphone')
  }
})