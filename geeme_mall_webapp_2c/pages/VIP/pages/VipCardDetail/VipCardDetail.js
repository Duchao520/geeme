// pages/VIP/pages/VipCardDetail/VipCardDetail.js
var apiAction = null, util = null, app = null, myUtil;
Page({
  data: {
    phone: null,
    logo: null,
    id: null,
    info: null, // cardType： 0-身份卡 1-储值卡 2-次卡 3-时间卡
    ifShowInstruction: false,  // 是否展开使用说明
    ifShowNote: false, // 是否展开办卡须知
    ifShowDiscountDetail: false, // 是否展开折扣权益明细
    ifShowCountDetail: false,  // 是否展开可用服务次数明细，
    cardPic: null
  },
  computed: {
    suitStore() {
      if (this.data.info) {
        switch (this.data.info.suitStoreStrategy) {
          case 0:
            return '所有门店'
          case 1:
            return '所有直营店'
          case 2:
            return '指定门店'
        }
      }
    },
    validPeriod() {
      if (this.data.info) {
        const obj = {
          year: '年',
          month: '月',
          day: '天'
        }
        return this.data.info.validNum + obj[this.data.info.validUnit]
      }
    }
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    myUtil = require('../../../../utils/myUtil.js');
    app = getApp();
    if (options.scene) {
      options = util.sceneToJson(options.scene)
    }
    const sellerId = options.SId ? options.SId : '';
    if (wx.$getStorage('authorization') && sellerId) {
      this.bindOldCustomer(sellerId);
    }
    if (sellerId) {
      wx.$setStorage('sellerId', sellerId);
    }
    this.data.id = options.id
    util.PromiseAll([this.getBrand(), this.fetch()]).then(res => {
      this.$setData(res);
      this.drawCardPic();
      return res;
    })
  },
  onShow() {
    // util.PromiseAll([this.getBrand(), this.fetch()]).then(res => {
    //   this.$setData(res);
    //   this.drawCardPic();
    //   return res;
    // })
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    app = null;
    myUtil = null;
    this.data = null;
  },
  onShareAppMessage() {
    let { info } = this.data,
      title;
    switch (info.cardType) {
      case 0:
        title = '身份卡:'; break;
      case 1:
        title = '储值卡:'; break;
      case 2:
        title = "次卡:"; break;
      case 3:
        title = "时间卡:"; break;
      default:
        title = "身份卡:";
    };
    title = title + info.cardName;
    return {
      title: title,
      path: "/pages/VIP/pages/VipCardDetail/VipCardDetail?id=" + this.data.id,
      imageUrl: this.data.cardPic
    }
  },
  //绑定推客
  bindOldCustomer(sellerId) {
    apiAction.bindOldCustomer({ sellerId })
  },
  drawCardPic() {
    let ctx = wx.createCanvasContext('cardPic'),
      { info, logo } = this.data,
      price = info.cardType === 1 ? info.cardFirstRechargeNum : info.cardPrice,
      name = info.cardName,
      bg = info.cardCover;
    myUtil.cardSharePic(ctx, price, name, logo, bg).then(res => {
      this.$setData({ cardPic: res });
    })
  },
  getBrand() {
    return new Promise(resolve => {
      app.getBrand(brand => {
        this.setData()
        resolve({
          logo: brand.logo
        })
      })
    })
  },
  fetch() {
    return apiAction.weappGetCardKindDetailInfo(this.data.id).then(data => {
      return {
        info: data
      }
    })
  },
  // 立即购买-创建会员卡结算单
  payVipCard() {
    app.getPhone((phone) => {
      const params = {
        amount: 1,
        cardKindId: this.data.info.id,
        cardKindSnapshotId: this.data.info.cardKindSnapshotId,
        phone: phone,
        remark: '',
        storeId: wx.$getStorage('storeId'),
        useIntegralDeduction: false,
      }
      apiAction.createCardBill(params).then(data => {
        app.globalData.bill.type = 'card'
        app.globalData.bill.info = {
          billId: data.billId,
          totalCharge: data.totalCharge
        }
        this.$route('/pages/VIP/pages/payVipCard/payVipCard', { info: JSON.stringify(this.data.info) })
      })
    })
  },
  // 展示折扣权益明细
  showDiscountDetail() {
    this.$setData({
      ifShowDiscountDetail: true
    })
  },
  closeDiscount() {
    this.$setData({
      ifShowDiscountDetail: false
    })
  },
  closePop() {
    this.$setData({
      ifShowDiscountDetail: false,
      ifShowCountDetail: false
    })
  },
  // 展示可用服务次数明细
  showCountDetail() {
    this.$setData({
      ifShowCountDetail: true
    })
  },
  closeCount() {
    this.$setData({
      ifShowCountDetail: false
    })
  },
  prevent() { }

})