// pages/TC/pages/paySuccess/paySuccess.js
const app = getApp(), util = require('../../../../utils/util.js'), apiAction = require('../../../../utils/apiAction.js');
Page({
  $name:'paySuccess',
  data: {
    type:null,
    promotion:null,
    billInfo: null
  },
  onLoad(){
    let bill = wx.$getStorage('bill');
    this.$setData({
      type:bill.type,
      billInfo: bill.info,
      promotion:bill.info.promotion
    })
    if(this.data.type == 'recharge'){
      apiAction.requestSubscribeMessage({ type: 5 })
    }else{
      if (this.data.promotion) {
        apiAction.requestSubscribeMessage({ type: 7 })
      } else {
        apiAction.requestSubscribeMessage({ type: 4 })
      }
    }
  },
  onShow(){
    if(!this.$status.isFirstShow){
      wx.switchTab({
        url: '/pages/tabBar/my/index/index',
      })
    }
  },
  // 查看订单
  toProductOrderList(){
    const type = this.data.type
    let page
    if(type == 'goods'){
      page = '/pages/IC/pages/productOrderList/productOrderList'
    }else if(type == 'bill'){
      page = '/pages/UIC/pages/spendorder/spendorder'
    } else {
      page = '/pages/UIC/pages/myorder/myorder'
    }
    this.$route(page)
  },
  // 返回美购
  backpurchase(){
    wx.switchTab({
      url: '/pages/tabBar/home/index/index',
    })
  },
  // 返回充值
  backRecharge(){
    wx.switchTab({
      url: '/pages/tabBar/purchase/index/index',
    })
  },
  // 查看会员卡
  jumpUserCard(){
    this.$route('/pages/VIP/pages/UserVipCard/UserVipCard')
  },
  // 邀请好友拼单
  invite(){
    
  },
  onShareAppMessage(){
    let url;
    if(this.data.type == 'service'){
      url = `/pages/IC/pages/productdetails/productdetails?productId=${this.data.billInfo.goodsId}`
    }else{   
      url = `/pages/IC/pages/productdetails/productdetails?productId=${this.data.billInfo.goodsId}&isProduct=1`
    }
    return {
      title: `拼团优惠:${this.data.billInfo.title}`,
      path: url,
      imageUrl: util.getImageUrl(this.data.billInfo.thumb)
    }
  }
})