var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: null,   //礼品卡活动ID
    cardKindId: null,   //会员卡ID
    parentBrandCustomerId: null,    //上级分享人品牌客户ID
    shareTime: null,        //分享时间
    splitTimes: null,          //当前分裂次数,下一个人领的时候在这个次数上+1
    brand: null,
    card: null,
    cardKindInfo: null,
    userInfo: null,
    tabIndex: 0,
    sendCardTabIndex: 0,    //可赠送卡领取奖励tab下标,
    ifShowCountDetail: false,
    SUCCESS_MODAL: false,
    tabs: ['权益说明', '领取奖励'],
    shareInfoList: [],
    totalAward: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js')
    util = require('../../../../utils/util.js')
    app = getApp();
    let cardKindInfo;

    if (options.scene) {            //scene不能超过32位，采用顺位截取
      let sceneArr = decodeURIComponent(options.scene).split('&')[0].split(',');
      console.log(sceneArr)
      options.a = sceneArr[0];
      options.k = sceneArr[1];
      options.b = sceneArr[2];
      options.s = sceneArr[3];
      options.t = sceneArr[4];
    }
    this.data.activityId = options.a;
    this.data.cardKindId = options.k;
    this.data.parentBrandCustomerId = options.b;
    this.data.splitTimes = Number(options.s);
    this.data.shareTime = util.timestampTotime(Number(options.t) * 1000);

    util.PromiseAll([this.getGiftCardActivityById(), this.weappGetCardKindDetailInfo()]).then(res => {
      this.setData(res)
    })
    app.getBrand((brand) => {
      this.setData({ brand })
    });
    this.getUserInfo().then(res => {
      this.data.userInfo = res.userInfo
    })
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    apiAction = null;
    util = null;
    app = null;
  },

  /**
   * 获取礼品卡活动
   */
  getGiftCardActivityById() {
    return apiAction.getGiftCardActivityById({ id: this.data.activityId }).then(res => {
      if (res.success) {
        return { card: res.giftCardActivityInfo }
      } else {
        return {}
      }
    })
  },

  /**
   * 获取会员卡详情
   */
  weappGetCardKindDetailInfo() {
    return apiAction.weappGetCardKindDetailInfo(this.data.cardKindId).then(res => {
      return { cardKindInfo: res }
    })
  },


  /**
   * 领取免费礼品卡
   */
  getGiftCardForFree() {
    let { card, userInfo, parentBrandCustomerId, shareTime, splitTimes } = this.data,
      params = {
        activityId: card.id,
        brandCustomerId: userInfo.brandCustomerId,
        parentBrandCustomerId,
        shareTime,
        splitTimes: Number(splitTimes) + 1
      }
    apiAction.getGiftCardForFree(params).then(res => {
      if (res.success) {
        this.setData({ SUCCESS_MODAL: true })
      }
    })
  },

  /**
   * 购买付费礼品卡
   */
  buyGiftCard() {
    let { card, userInfo, parentBrandCustomerId, shareTime, splitTimes, cardKindInfo} = this.data,
      params = {
        activityId: card.id,
        brandCustomerId: userInfo.brandCustomerId,
        parentBrandCustomerId,
        shareTime,
        splitTimes: Number(splitTimes) + 1
      }
    apiAction.buyGiftCard(params).then(res => {
      if (res.success) {
        app.globalData.bill.type = 'card'
        app.globalData.bill.info = {
          billId: res.message,
          totalCharge: card.activityPrice
        }
        this.$route('/pages/VIP/pages/payVipCard/payVipCard', { info: JSON.stringify(cardKindInfo) })
      }
    })
  },


  getUserInfo() {
    return apiAction.getPersonalInfo().then(data => {
      return { userInfo: data }
    })
  },

  switchTab(e) {
    let { index } = e.detail;
    this.setData({ sendCardTabIndex: index })
  },

  // 展示可用服务次数明细
  showCountDetail() {
    this.$setData({
      ifShowCountDetail: true
    })
  },
  closePop() {
    this.$setData({
      ifShowCountDetail: false
    })
  },
  //回到首页
  jumpHome() {
    wx.switchTab({
      url: '/pages/tabBar/home/index/index',
    })
  },
  //查看礼品卡
  jumpGiftCard() {
    wx.redirectTo({
      url: '/pages/UIC/pages/GiftCard/GiftCard',
    })
  }
})