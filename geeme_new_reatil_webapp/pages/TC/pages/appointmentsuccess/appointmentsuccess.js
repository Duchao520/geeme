// pages/TC/appointmentsuccess/appointmentsuccess.js
const apiAction = require('../../../../utils/apiAction.js');
const app = getApp();
Page({
  data: {
    serviceList: [],
    payStatus:false,
  },
  onLoad(options) {
    this.getService();
    this.getMessageTempList();
  },
  // onShow() {
  //   if (!this.$status.isFirstShow) {
  //     wx.switchTab({
  //       url: '/pages/tabBar/my/index/index',
  //     })
  //   }
  // },
  /**
   * 从本地请求此次预约id下的服务
   */
  getService() {
    apiAction.weGetAppointmentInfoById(wx.$getStorage('appointmentId')).then( data => {
      this.setData({
        serviceList: data.serviceInfoForAppointments,
        payStatus:data.payStatus,
      })
    })
  },

  //订阅预约消息
  getMessageTempList(){ 
    console.log(1)
    let params = {type: 1};
    apiAction.requestSubscribeMessage(params);
  },

  /**
   * 跳转确认订单页面
   * 
   */
  jumpPay(){
    app.globalData.bill.type = 'appointment';
    let params = { appointmentId: wx.getStorageSync('appointmentId')};
    apiAction.getAppointmentBilling(params).then(res => {
      if (res.openConsumerOrder){
        wx.navigateTo({
          url: '/pages/TC/pages/consumptiondetail/consumptiondetail?id=' + res.consumerOrderId
        })
      }else{
        wx.navigateTo({
          url: '/pages/TC/pages/order/order?appointmentId=' + wx.getStorageSync('appointmentId') + '&storeId=' + this.data.storeId
        })
      }
    })
  },

  /**
   * 返回首页
   */
  jumpIndex(){
    wx.switchTab({
      url: '/pages/tabBar/home/index/index'
    })
  },

  /**
   * 查看预约
   */
  jumpAppointment(){
    wx.navigateTo({
      url: '/pages/TC/pages/appointmentdetail/appointmentdetail?appointmentId=' + wx.getStorageSync('appointmentId')
    })
  },

  /**
   * 点击继续预约
   */
  toappointment(){
    wx.switchTab({
      url: '/pages/tabBar/appointment/index/index'
    })
  },
})