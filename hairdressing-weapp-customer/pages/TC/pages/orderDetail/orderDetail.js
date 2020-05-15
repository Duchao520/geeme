// pages/TC/pages/orderDetail/orderDetail.js
var apiAction = null, util = null, app = null;
Page({
  $name:'orderDetail',
  data: {
    orderId: 0,
    orderInfo: null,
    time: null
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    this.data.orderId = options.id
    this.$on('orderEvaluate', this.getOrderInfoById)
  },
  onShow(){
    this.getOrderInfoById()
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    app = null;
    this.data = null;
  },
  // 支付
  orderPay(e) {
    const orderInfo = this.data.orderInfo
    app.globalData.bill.type = 'service'
    app.globalData.bill.info = {
      billNo: orderInfo.billNo,
      totalCharge: orderInfo.received,
      title: orderInfo.serviceInfo.serviceName,
      count: orderInfo.serviceInfo.count,
      storeId:orderInfo.storeInfo.storeId,
      billingType:orderInfo.prepaidCardId ? 1 : 0,
      customerCardId:orderInfo.prepaidCardId,
    }
    this.$route('/pages/TC/pages/orderpay/orderpay')
  },
  // 点击预约
  addAppointment(e) {
    const orderInfo = this.data.orderInfo
    wx.removeStorageSync('appointment');
    app.globalData.fromOrderAppointment.orderId = orderInfo.id
    let specificationList = [];
    let amount = orderInfo.received
    let obj = {
      count: orderInfo.serviceInfo.count,
      specificationId: orderInfo.serviceInfo.specificationSnapshotId,
      serviceId: orderInfo.serviceInfo.serviceSnapshotId
    };
    specificationList.push(obj)
    util.addservice(specificationList, amount, orderInfo.storeInfo.storeId)
    this.$route('/pages/TC/pages/choosehair/choosehair')
  },
  // 跳转我的评价
  jumpMyEvaluation() {
    const orderInfo = this.data.orderInfo
    const goodsInfo = {
      image: orderInfo.serviceInfo.image,
      title: orderInfo.serviceInfo.serviceName,
      specificationName: orderInfo.serviceInfo.specificationName,
      serverTime: orderInfo.serviceInfo.serverTime
    }
    this.$route('/pages/RC/pages/myEvaluation/myEvaluation', {
      goodsInfo: JSON.stringify(goodsInfo),
      orderId: orderInfo.id
    })
  },
  // 去提交评价页面
  toEvaluation() {
    this.$route('/pages/RC/pages/evaluation/evaluation', {
      info: JSON.stringify(this.data.orderInfo)
    })
  },
  // 申请退款页面
  jumpApplyRefund(){
    this.$route('/pages/RC/pages/applyrefund/applyrefund', { orderId: this.data.orderId })
  },
  /**
   * 请求订单详情数据
   */
  getOrderInfoById() {
    wx.showLoading()
    apiAction.weGetServiceOrderInfoById(this.data.orderId).then(data => {
      wx.hideLoading()
      // 如果状态时预约计算出剩余的时间
      if (data.appointTime) {
        util.timeDifference(data.appointTime, this.setNoPayTime)
      }

      this.$setData({
        orderInfo: data
      })
    })
  },
  // 取消订单
  cancel(){
    wx.showModal({
      title: '提示',
      content: '确认取消订单？',
      success: res => {
        if (res.confirm) {
          apiAction.weCancelServiceOrder(this.data.orderId).then(data => {
            if (data.success) {
              setTimeout(this.getOrderInfoById.bind(this), 500)
              wx.$event.emit('orderCancel', {id:this.data.orderInfo.id})
            }
          })
        }
      }
    })
  },
  // 复制订单编号
  copy() {
    wx.setClipboardData({
      data: this.data.orderInfo.orderSerialCode,
      success() {
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        })
      },
      complete(res){
      }
    })
  },
  /**
   * 回调函数，订单在未付款状态时，设置time
   */
  setNoPayTime(time) {
    this.setData({
      time: time
    })
  },

  /**
   * 拨打电话
   */
  call(e) {
    let phoneNumber = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },

  /**
   * 点击去商品快照
   */
  toproductSpecification() {
    wx.navigateTo({
      url: '/pages/IC/pages/productSpecification/productSpecification'
    })
  },

  // 跳转员工详情
  jumpStaffDetail(e){
    this.$route('/pages/SC/pages/hairdetails/hairdetails', {hairId:this.data.orderInfo.staffInfo.staffId})
  },

  /**
   * 商品下架
   */
  toselvesProduct() {
    this.$route('/pages/IC/pages/productdetails/productdetails', {productId:this.data.orderInfo.serviceInfo.serviceId})
  },
  // 分享拼团
  onShareAppMessage(e) {
    const product = e.target.dataset.item
    let path = `/pages/IC/pages/productdetails/productdetails?productId=${product.serviceInfo.serviceId}`
    return {
      title: product.serviceInfo.serviceName,
      path,
      imageUrl: util.getImageUrl(product.serviceInfo.image),
    }
  },
})