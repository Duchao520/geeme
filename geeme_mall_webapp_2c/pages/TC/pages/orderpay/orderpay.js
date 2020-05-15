// pages/TC/pages/orderpay/orderpay.js
const apiAction = require('../../../../utils/apiAction.js')
const app = getApp()
Page({
  $name: 'orderPay',
  data: {
    payInfo: {},
    paySwitcher: true,
    CAN_USE_WALLET: false,    //钱包是否可用
    type: 'shopCar',
    walletMoney: 0
  },
  onLoad(options) {
    this.from = options.from
    const bill = app.globalData.bill
    bill.info.billingType = bill.info.billingType || 0  // 0-微信支付 1-会员卡支付 2 -钱包支付
    this.$setData({
      type: bill.type,
      payInfo: bill.info
    })
    this.weGetMyTreasure();
  },
  weGetMyTreasure(){
    let { payInfo, CAN_USE_WALLET} = this.data;
    let price = payInfo.finalTotalCharge || payInfo.totalCharge
    apiAction.weGetMyTreasure().then(res => {
      if (res.walletMoney > price){
        CAN_USE_WALLET = true
      }
      this.$setData({ walletMoney: res.walletMoney, CAN_USE_WALLET})
    })
  },
  // 确认支付
  pay() {
    if (this.data.paySwitcher) {
      const info = this.data.payInfo
      this.setData({
        paySwitcher: false
      })
      wx.$setStorage('bill', app.globalData.bill)
      if (info.billingType == 1) {
        const params = {
          customerCardId: info.customerCardId
        }
        if (info.billId) {
          params.billId = info.billId
        } else {
          params.billNo = info.billNo
        }
        apiAction.weappBillingByPrepaidCard(params).then(data => {
          this.setData({
            paySwitcher: true
          })
          if (data.success) {
            wx.$event.emit('refreshMyappointment')
            wx.reLaunch({
              url: '/pages/TC/pages/paySuccess/paySuccess',
            })
          } else {
            wx.showToast({
              title: data.message,
              icon: 'none'
            })
          }
        })
      }else if(info.billingType == 2){
        let params;
        if (info.billId){
          params = {
            billId: info.billId
          }
        }else{
          params = {
            billNo: info.billNo
          }
        }
        apiAction.weBillingByWalletMoney(params).then(data => {
          this.setData({
            paySwitcher: true
          })
          if (data.success) {
            wx.$event.emit('refreshMyappointment')
            wx.reLaunch({
              url: '/pages/TC/pages/paySuccess/paySuccess',
            })
          } else {
            wx.showToast({
              title: data.message,
              icon: 'none'
            })
          }
        })
      } else if (info.billId) {
        apiAction.billing(info.billId).then(res => {
          apiAction.requestSubscribeMessage({ type: 8 })
          this.setData({
            paySwitcher: true
          })
        }).catch(error => {
          this.setData({
            paySwitcher: true
          })
        })
      } else if (info.billNo) {
        apiAction.billingByBillNo(info.billNo).then(res => {
          apiAction.requestSubscribeMessage({ type: 8 })
          this.setData({
            paySwitcher: true
          })
        }).catch(error => {
          this.setData({
            paySwitcher: true
          })
        })
      }
    }
  },
  payWayEvent(event){
    let {payway} = event.currentTarget.dataset,
        { payInfo , CAN_USE_WALLET} = this.data;

    if (payInfo.billingType == 1) return;
    if (payway == 2 && !CAN_USE_WALLET) return;
    payInfo.billingType = payway;
    this.$setData({
      payInfo
    })

  },
  // 监听后退事件
  onNavigateBack(){
    this.$setData({
      ifShowModal: true
    })
  },
  modalAction(e) {
    switch (e.detail.from) {
      case 'button2':
        if (this.from === 'consumptiondetail') {
          wx.navigateBack({
            delta: 1
          })
        }else{
          if (this.data.payInfo.billNo){
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.navigateBack({
              delta: 2
            })
          }
        }
        return
      default:
        this.$setData({
          ifShowModal: false
        })
        break;
    }
  }
})