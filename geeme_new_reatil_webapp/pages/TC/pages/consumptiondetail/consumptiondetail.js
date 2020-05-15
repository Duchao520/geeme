// pages/TC/pages/consumptiondetail/consumptiondetail.js
var apiAction = null, app = null;
Page({
  $name:'consumptiondetail',
  data: {
    id: null,
    bill: null,
    NULL_SERVER_MODAL: false
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    app = getApp();
    this.data.id = options.id
    this.fetch()
  },
  onUnload() {          //清内存
    apiAction = null;
    app = null;
    this.data = null;
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.fetch()
  },
  fetch() {
    apiAction.weGetConsumerOrderById(this.data.id).then(data => {
      wx.stopPullDownRefresh()
      this.setData({
        bill: data
      })
    })
  },
  // 立即结算
  billing() {
    const bill = this.data.bill
    for (const v of bill.consumerGoodsOrderInfoList){
      if (!v.serverId && v.goodsType == 'service'){
        this.setData({ NULL_SERVER_MODAL: true})
        return;
      }
    }
    const products = []
    app.globalData.bill.type = 'bill'
    app.globalData.bill.info = {
      products,
      consumerOrderId: bill.id,
      storeId: bill.storeId,
      finalPrice: bill.finalPrice,
      customerCardId: bill.prepaidCardId
    }
    if (bill.countCardId) {
      app.globalData.bill.info.customerCardId = bill.countCardId
    } else if (bill.identityCardId) {
      app.globalData.bill.info.customerCardId = bill.identityCardId
    } else if (bill.prepaidCardId) {
      app.globalData.bill.info.customerCardId = bill.prepaidCardId
    } else if (bill.timeCardId) {
      app.globalData.bill.info.customerCardId = bill.timeCardId
    }
    if (bill.consumerGoodsOrderInfoList && bill.consumerGoodsOrderInfoList.length){
      for (const v of bill.consumerGoodsOrderInfoList) {
        if (!v.paymentStatus) {
          products.push({
            image: v.image,
            title: v.serviceName,
            specificationName: v.specificationName,
            serviceTime: v.serverTime,
            price: v.unitPrice,
            specialPrice: v.unitFinalPrice / v.count,
            count: v.count,
            snapshotId: v.snapshotId,
            type: v.goodsType
          })
        }
        
      }
      if (products.length > 0){
        app.globalData.bill.info.products = products;
        this.$route('/pages/TC/pages/order/order');
        return;
      }else{
        wx.showModal({
          title: '',
          content: '该笔账单已支付，确认要立即结算吗？',
          confirmText: '确定结算',
          cancelText: '再考虑下',
          success: res => {
            if (res.confirm) {
              wx.showLoading()
              apiAction.weVerifyConsumerOrder(bill.id).then(data => {
                wx.hideLoading()
                if (data.success) {
                  wx.showToast({
                    title: '结算成功',
                  })
                  wx.$event.emit('verifyOrder', bill.id)
                  setTimeout(this.fetch, 1000)
                }
              })
            }
          }
        })
        return
      }
    }else{
      app.globalData.bill.info.isCard = true
      for (const v of bill.listConsumerOrderCardInfo){
        products.push({
          image:v.cardCover,
          title:v.cardName,
          specialPrice:v.chargeMoney,
          type:'card',
          count:1
        })
      }
    }
    console.log(app.globalData.bill.info)
    
    this.$route('/pages/TC/pages/order/order')
  },
  // 立即支付
  jumpPay() {
    const billInfo = this.data.bill
    const list = billInfo.consumerGoodsOrderInfoList.length ?
      billInfo.consumerGoodsOrderInfoList :
      billInfo.listConsumerOrderCardInfo

    const products = []
    for (const v of list) {
      if (!v.paymentStatus) {
        products.push({
          title: v.serviceName || v.cardName,
          count: v.count || 1,
        })
      }
    }
    // 若存在未支付商品，跳转支付页面
    if (products.length) {
      app.globalData.bill.type = 'bill'
      app.globalData.bill.info = {
        products,
        totalCharge: billInfo.finalPrice,
        billId: billInfo.billId,
        billingType: 0,
        customerCardId: billInfo.prepaidCardId
      }
      if (billInfo.countCardId){
        app.globalData.bill.info.billingType = 1
        app.globalData.bill.info.customerCardId = billInfo.countCardId
      } else if (billInfo.identityCardId){
        app.globalData.bill.info.billingType = 1
        app.globalData.bill.info.customerCardId = billInfo.identityCardId
      } else if (billInfo.prepaidCardId){
        app.globalData.bill.info.billingType = 1
        app.globalData.bill.info.customerCardId = billInfo.prepaidCardId
      } else if (billInfo.timeCardId){
        app.globalData.bill.info.billingType = 1
        app.globalData.bill.info.customerCardId = billInfo.timeCardId
      }
      this.$route('/pages/TC/pages/orderpay/orderpay')
      // 否则核销
    } else {
      wx.showModal({
        title: '',
        content: '该笔账单已支付，确认要立即结算吗？',
        confirmText: '确定结算',
        cancelText: '再考虑下',
        success: res => {
          if (res.confirm) {
            wx.showLoading()
            apiAction.weVerifyConsumerOrder(billInfo.id).then(data => {
              wx.hideLoading()
              if (data.success) {
                wx.showToast({
                  title: '结算成功',
                })
                wx.$event.emit('verifyOrder', billInfo.id)
                setTimeout(this.fetch, 1000)
              }
            })
          }
        }
      })
    }
  },
  jumpOrder() {
    let { consumerGoodsOrderInfoList} = this.data.bill;
    if (consumerGoodsOrderInfoList[0].goodsType == 'service'){
      this.$route('/pages/UIC/pages/myorder/myorder', {
        index: 3
      })
    }else{
      this.$route('/pages/IC/pages/productOrderList/productOrderList', {
        tabIndex: 4
      })
    }
    
  }
})