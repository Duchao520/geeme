// pages/IC/pages/product_group/product_group.js
var apiAction = null
Page({
  data: {
    groupBuyProducts: null,
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    this.fetch()
    this.timePass = 0
    this.t = setInterval(this.countdown, 1000)
  },
  onUnload(){
    apiAction = null;
    this.data = null;
    clearInterval(this.t)
  },
  fetch(){
    apiAction.getStoreGroupPurchaseGoodsList().then(data => {
      wx.stopPullDownRefresh()
      this.$setData({
        groupBuyProducts: data.groupPurchaseGoodsList
      })
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.fetch()
  },
  // 倒计时
  countdown(){
    this.timePass++;
    const list = this.data.groupBuyProducts
    let hour, minute, second, countDown, attr, hourAttr, minuteAttr, secondAttr
    for (let i = 0; i < list.length; i++){
      countDown = parseInt(list[i].countDown / 1000) - this.timePass
      if (countDown < 0) continue; 
      hour = parseInt(countDown / 3600)
      minute = parseInt(countDown / 60) - hour * 60
      second = countDown - hour * 3600 - minute * 60
      attr = `groupBuyProducts[${i}]`
      hourAttr = attr + '.hour'
      minuteAttr = attr + '.minute'
      secondAttr = attr + '.second'
      this.$setData({
        [hourAttr]: hour,
        [minuteAttr]: minute,
        [secondAttr]: second,
      })
    }
  },
  // 跳转商品详情
  jumpGoodsDetail(e) {
    const { id, type } = e.currentTarget.dataset
    const params = {
      productId: id
    }
    if (type == 'production') params.isProduct = 1
    this.$route('/pages/IC/pages/productdetails/productdetails', params)
  },
})