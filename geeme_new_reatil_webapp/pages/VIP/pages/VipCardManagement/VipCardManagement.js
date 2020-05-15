// pages/VIP//pages/VipCardManagement/VipCardManagement.js
var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: '',
    // 会员卡信息
    cardDetail: {},
    // 会员卡充值
    currentCard: {},
    /* <充值组件中的数据> */
    flagRecharge: false, // 组件是否显示
    rechargeRules: null, //会员卡充值规则
    /* </充值组件中的数据> */
    /* <支付组件中的数据> */
    flagPay: false,
    rechargeNum: null,
    ifShowDiscountDetail: false, // 显示折扣权益明细
    ifShowCountDetail: false, // 显示可用服务次数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    app = getApp();
    util = require('../../../../utils/util.js');
    // console.log(options)
    this.setData({
      cardDetail: JSON.parse(options.cardDetail),
      currentCard: JSON.parse(options.currentCard)
    })
    // this.$setData({
    //   currentCard: JSON.parse(options.currentCard)
    // })
    app.getBrand(brand => {
      this.setData({
        logo: brand.logo
      })
    })
  },

  /**
   * 点击出现充值弹窗
   */
  showRecharge() {
    if (this.data.currentCard.supportRenewal) {
      apiAction.weappGetCardRenewalRules(this.data.currentCard.cardKindId).then(data => {
        this.$setData({
          rechargeRules: data.listCardRenewalRule,
          flagRecharge: true
        })
      })
    } else {
      wx.showToast({
        title: '该卡不允许充值',
        icon: 'none'
      })
    }
  },
  // 查询会员卡消费记录
  onTapRecord() {
    // console.log("111")
    this.$route("../VipCardExpensesRecord/VipCardExpensesRecord", { cardCustomerId: this.data.currentCard.id })
  },
  // 查询会员卡充值记录
  onTapPayment() {
    // console.log("111")
    this.$route("../VipCardPayment/VipCardPayment", { cardCustomerId: this.data.currentCard.id, cardDetail: JSON.stringify(this.data.cardDetail) })
  },
  /**
   * 点击充值弹窗
   */
  closeRecharge() {
    this.$setData({
      flagRecharge: false
    })
  },
  /**
   * 点击关闭支付弹窗
   */
  closePay() {
    this.$setData({
      flagPay: false
    })
  },

  /**
   * 会员卡充值组件的回调函数去支付
   * 关掉flagRecharge,返回充值金额,返回充值卡的id
   */
  bindtoRecharge(res) {
    this.$setData({
      flagRecharge: false,
      flagPay: true,
      rechargeNum: res.detail.rechargeNum
    })
  },

  /**
   * 会员卡支付组件的回调函数调取微信支付的接口
   * 关掉flagPay,返回支付方式,返回支付金额
   */
  bindtoPay(res) {
    app.getPhone(phone => {
      const card = this.data.currentCard
      const params = {
        customerCardId: card.id,
        goodsType: 2,
        phone,
        rechargeNum: this.data.rechargeNum,
        remark: '',
        storeId: wx.$getStorage('storeId'),
      }
      apiAction.createCardRenewalBill(params).then(data => {
        if (data.success) {
          app.globalData.bill.type = 'recharge'
          app.globalData.bill.info = {
            billId: data.billId,
            totalCharge: data.totalCharge
          }
          apiAction.billing(data.billId)
        }
      })

    })

    this.$setData({
      flagPay: false
    }, () => {
      wx.showToast({
        title: '支付成功'
      })
    })
  },
     /**
    * 会员卡支付组件的回调函数,返回充值组件
    */
  bindgoBack() {
    this.$setData({
      flagPay: false,
      flagRecharge: true
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
  closeCount() {
    this.$setData({
      ifShowCountDetail: false
    })
  },
  prevent() { }
})