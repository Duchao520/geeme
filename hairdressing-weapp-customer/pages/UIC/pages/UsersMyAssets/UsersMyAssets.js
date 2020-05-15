// pages/UIC/pages/UsersMyAssets/UsersMyAssets.js
var apiAction = null, app = null, util = null;
Page({
  data: {
    brandCustomerId: '',
    brandId: '',
    totalPreMoney: '',
    cardAmount: 0,
    redPacketAmount: 0,
    cardCount: 0,
    packetCount: 0,
    couponCount: 0,
    giftCardCount: 0,
    USER_WALLET_PUT: false,             //是否开通钱包
    walletMoney: null,
    walletAuthModal: false,
    AUTHOR_SWITCHER: false,
    DETAIL_SWITCHER: false
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    this.fetch();
  },
  onShow(){
    if (wx.$getStorage('authorization')){
      this.fetch();    
    }
    this.bindPhone()
  },
  onUnload() {          //清内存
    apiAction = null;
    app = null;
    this.data = null;
  },
  fetch() {
    return apiAction.weGetMyTreasure().then(res => {
      let { cardCount, isActive, packetCount, walletMoney, couponCount, giftCardCount} = res;
      this.$setData({
        cardCount, USER_WALLET_PUT: isActive, packetCount, walletMoney, couponCount, giftCardCount
      })
      return {
        cardCount, USER_WALLET_PUT: isActive, packetCount, walletMoney, couponCount, giftCardCount
      }
    })
  },
  // 验证是否绑定手机号
  bindPhone() {
    app.getPhone().then(phone => {
      if (!phone) return;
      util.PromiseAll([
        this.getUserInfo(), this.getBrand()
      ]).then(res => {
        // console.log(res)
        this.data.brandCustomerId = res.userInfo.brandCustomerId
        this.data.brandId = res.brand.brandId
        // Object.assign(renderData, res);
        // 权益金查询
        this.weGetPreMoney()
      })
    })
  },
  // 权益金查询
  weGetPreMoney() {
    // console.log(this.data)
    let { brandCustomerId, brandId } = this.data
    let params = {
      brandCustomerId,
      brandId,
      pageNum: 0,
      pageSize: 10
    }
    return apiAction.weGetPreMoney(params).then(res => {
      // console.log(res)
      this.$setData({
        totalPreMoney: res.totalPreMoney
      })
    })
  },
  // 获取brandCustomerId
  getUserInfo() {
    return new Promise(resolve => {
      app.getUserInfo(userInfo => {
        resolve({ userInfo })
      })
    })
  },
  // 获取门店列表
  getBrand() {
    return new Promise(resolve => {
      app.getBrand(brand => {
        resolve({ brand })
      })
    })
  },
  // 开通钱包
  WeActiveWallet(){
    return apiAction.WeActiveWallet().then(res => {
      if(res.success){
        wx.showToast({
          title: '已开通钱包',
        })
        this.setData({ walletAuthModal: false, USER_WALLET_PUT: true});
        return {success: res}
      }
    })
  },
  //同意或否定钱包协议
  authorSwitch(){
    this.data.AUTHOR_SWITCHER = !this.data.AUTHOR_SWITCHER
  },
  authorize(){
    this.data.AUTHOR_SWITCHER = true;
    this.setData({
      DETAIL_SWITCHER: false,
      AUTHOR_SWITCHER: true,
      walletAuthModal: true
    })
  },
  putNext(){
    if(this.data.AUTHOR_SWITCHER){
      this.WeActiveWallet()
    }else{
      wx.showToast({
        title: '请先同意协议',
        icon: 'none'
      })
    }
  },
  cancle(){
    this.setData({ walletAuthModal: false })
  },
  tovipCard() {
    wx.navigateTo({
      url: '/pages/VIP/pages/UserVipCard/UserVipCard'
    })
  },
  jumpRedPacket() {
    this.$route('/pages/UIC/pages/redPacket/redPacket')
  },
  navigateToRecharge() {
    if(this.data.USER_WALLET_PUT)
    {this.$route('/pages/UIC/pages/Recharge/Recharge')}
    else
    { this.setData({ DETAIL_SWITCHER: true})};
  },
  navgateToWallet() {
    if (this.data.USER_WALLET_PUT) 
    { this.$route('/pages/UIC/pages/Wallet/Wallet') }
    else 
    { this.setData({ DETAIL_SWITCHER: true })}
  },
  navgateToWithdraw() {
    if (this.data.USER_WALLET_PUT)
    { this.$route('/pages/UIC/pages/Withdraw/Withdraw') }
    else 
    { this.setData({ DETAIL_SWITCHER: true }) }
  },
  navgateToCoupon(){
    this.$route('/pages/UIC/pages/Coupon/Coupon')
  },
  navgateToGiftCard() {
    this.$route('/pages/UIC/pages/GiftCard/GiftCard')
  },
  // 权益金明细
  onTapEquityDetails() {
    // brandCustomerId: '',
    //   brandId: '',
    const params = {
      brandCustomerId: this.data.brandCustomerId,
      brandId: this.data.brandId
    }
    this.$route('/pages/UIC/pages/equityDetails/equityDetails', params)
  },
  // 权益金提现
  navigateToEquity() {
    const params = {
      brandCustomerId: this.data.brandCustomerId,
      brandId: this.data.brandId
    }
    this.$route('/pages/UIC/pages/equityTransfer/equityTransfer', params)
  },
})