var apiAction = null,
  util = null,
  myUtil = null,
  app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand: null,
    card: null,
    cardKindInfo: null,
    userInfo: null,
    tabIndex: 0,
    sendCardTabIndex: 0, //可赠送卡领取奖励tab下标,
    ifShowCountDetail: false,
    ifShowSharePop: false,      //分享MODAL
    SUCCESS_MODAL: false,
    tabs: ['权益说明', '领取奖励'],
    shareInfoList: [],
    totalAward: 0,
    cardPic: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    apiAction = require('../../../../utils/apiAction.js')
    util = require('../../../../utils/util.js')
    myUtil = require('../../../../utils/myUtil.js')
    app = getApp();
    let cardKindInfo;


    app.getBrand((brand) => {
      this.setData({
        brand
      })
    });
    const {
      tabIndex
    } = options;
    let card = wx.$take('card');
    this.getUserInfo().then(res => {
      this.data.userInfo = res.userInfo
      this.getGiftCardShareRecord().then(res => {
        this.setData(res)
      })
    })
    if (tabIndex == 0) {
      cardKindInfo = card;
      this.data.cardKindInfo = card;
    } else {
      cardKindInfo = card.cardKindInfo;
      this.data.cardKindInfo = card.cardKindInfo;
    }
    this.drawCardPic();
    this.setData({
      card,
      cardKindInfo,
      tabIndex
    })
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    apiAction = null;
    util = null;
    myUtil = null;
    app = null;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let {
      tabIndex,
      card,
      userInfo,
      cardKindInfo
    } = this.data,
      title = null,
      url = null;
    if (tabIndex == 1) {
      if (((card.shareInfo.splitNum - card.shareInfo.shareOrder) > 0)) {
        this.addShareTimesForActivity();
        if (card.free) {
          title = userInfo.nickName + '送你1张' + card.giftCardName + ',原价' + card.cardPrice + '元现免费领取!'
        } else {
          title = userInfo.nickName + '送你1张' + card.giftCardName + ',原价' + card.cardPrice + '元现仅需' + card.activityPrice + '元!'
        }
        let dateObj = new Date(),
          url = `/pages/UIC/pages/ShareGiftCard/ShareGiftCard?a=${card.id}&k=${cardKindInfo.id}&b=${userInfo.brandCustomerId}&t=${Date.parse(dateObj) / 1000}&s=${card.shareInfo.splitTimes}`;
        return {
          title: title,
          path: url,
          imageUrl: this.data.cardPic
        }
      }else{
        return {}
      }
    }else{
      return {}
    }

  },

  /**
   * 绘制分享图片
   */
  drawCardPic() {
    console.log(this.data.cardKindInfo)
    let ctx = wx.createCanvasContext('cardPic'),
      { cardKindInfo, brand } = this.data,
      price = cardKindInfo.cardType === 1 ? cardKindInfo.cardFirstRechargeNum : cardKindInfo.cardPrice,
      name = cardKindInfo.cardName,
      bg = cardKindInfo.cardCover;
    myUtil.cardSharePic(ctx, price, name, brand.logo, bg).then(res => {
      this.$setData({ cardPic: res });
    })
  },

  /**
   * 增加分享次数
   */
  addShareTimesForActivity(){
    let {userInfo,card} = this.data;
    let params = {
      activityId: card.id,
      brandCustomerId: userInfo.brandCustomerId
    };
    apiAction.addShareTimesForActivity(params)
  },
  /**
   * 领取免费礼品卡
   */
  getGiftCardForFree() {
    let {
      card,
      userInfo
    } = this.data,
      params = {
        activityId: card.id,
        brandCustomerId: userInfo.brandCustomerId,
        parentBrandCustomerId: 0,
        splitTimes: 0
      }
    apiAction.getGiftCardForFree(params).then(res => {
      if (res.success) {
        this.setData({
          SUCCESS_MODAL: true
        })
      }
    })
  },

  /**
   * 购买付费礼品卡
   */
  buyGiftCard() {
    let {
      card,
      userInfo
    } = this.data,
      params = {
        activityId: card.id,
        brandCustomerId: userInfo.brandCustomerId,
        parentBrandCustomerId: 0,
        splitTimes: 0
      }
    apiAction.buyGiftCard(params).then(res => {
      if (res.success) {
        app.globalData.bill.type = 'card'
        app.globalData.bill.info = {
          billId: res.message,
          totalCharge: card.activityPrice
        }
        wx.$setStorage('bill', app.globalData.bill)
        apiAction.billing(app.globalData.bill.info.billId)
      }
    })
  },

  /**
   * 获取活动卡片的领取记录
   */
  getGiftCardShareRecord() {
    let {
      card,
      userInfo,
      totalAward
    } = this.data,
      params = {
        activityId: card.id,
        brandCustomerId: userInfo.brandCustomerId
      };
    return apiAction.getGiftCardShareRecord(params).then(res => {
      if (res.shareInfoList) {
        res.shareInfoList.forEach(ele => {
          totalAward += ele.award;
        })
        return {
          shareInfoList: res.shareInfoList,
          totalAward
        }
      } else {
        return {}
      }
    })
  },

  getUserInfo() {
    return apiAction.getPersonalInfo().then(data => {
      return {
        userInfo: data
      }
    })
  },

  switchTab(e) {
    let {
      index
    } = e.detail;
    this.setData({
      sendCardTabIndex: index
    })
  },

  // 展示可用服务次数明细
  showCountDetail() {
    this.$setData({
      ifShowCountDetail: true
    })
  },
  showShareModal() {
    this.$setData({
      ifShowSharePop: true
    })
  },
  closePop() {
    this.$setData({
      ifShowCountDetail: false,
      ifShowSharePop: false
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
  },
  //前往分享海报
  jumpSharePic(){
    wx.$place('card',this.data.card);
    wx.$place('userInfo',this.data.userInfo)
    wx.$route('/pages/UIC/pages/GiftCardPic/GiftCardPic')
  }
})