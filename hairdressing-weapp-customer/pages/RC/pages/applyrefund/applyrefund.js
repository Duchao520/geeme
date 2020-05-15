// pages/RC/pages/applyrefund/applyrefund.js
const apiAction = require('../../../../utils/apiAction.js')
Page({
  data: {
    orderId: null,
    refundOrderId: null, // 修改退款/售后用的退款订单id
    isProduct: false,
    info: null,
    // 退款原因
    reasonList: null,
    // 当前选中退款原因
    refundReason: '',
    images: [],
    // 退款金额
    refundPrice: '',
    // 留言
    note: '',
    // 联系人姓名
    customerName: '',
    // 联系电话
    customerPhone: '',
    // true:售后, false:退款
    isAfterReceive: false,
    // 是否显示退款金额
    showMoney: true,
    // 是否是修改申请
    ifModify: false,
  },
  onLoad(options) {
    if (options.ifModify) {
      let title = options.type == 1 ? '修改售后' : '修改退款'
      if (options.isProduct) {
        this.data.isProduct = true
      }
      this.setData({
        isAfterReceive: options.type == 1,
        ifModify: true
      })
      wx.setNavigationBarTitle({
        title
      })
      this.data.refundOrderId = options.id
      this.getChangeRefundOrderBasicInfo()
      this.getRefundReasonByType()
    } else {
      this.data.orderId = options.orderId
      if (options.isProduct) {
        this.setData({
          isProduct: true,
        })
        this.getProductOrderDetail()
      } else {
        this.getServiceOrderDetail()
      }
    }
  },

  /**
   * 输入金额
   */
  updatePrice(e) {
    this.data.refundPrice = e.detail.value
  },

  /**
   * 输入留言
   */
  updateNote(e) {
    this.data.note = e.detail.value
  },

  /**
   * 输入联系人姓名
   */
  updateName(e) {
    this.data.customerName = e.detail.value
  },

  /**
   * 输入联系电话
   */
  updatePhone(e) {
    this.data.customerPhone = e.detail.value
  },

  /**
   * 上传照片
   */
  uploadImage() {
    wx.chooseImage({
      count: 3 - this.data.images.length,
      success: res => {
        let images = res.tempFilePaths
        for (let i = 0; i < images.length; i++) {
          apiAction.uploadPicture(images[i]).then(image => {
            this.data.images.push(image)
            this.setData({
              images: this.data.images
            })
          })
        }
      }
    })
  },

  /**
   * 预览图片
   */
  previewImage(e) {
    wx.previewImage({
      urls: this.data.images,
      current: e.currentTarget.dataset.url
    })
  },
  /**
   * 弹出退款原因列表ActionSheet
   */
  showReasonList() {
    wx.showActionSheet({
      itemList: this.data.reasonList,
      success: res => {
        this.setData({
          refundReason: this.data.reasonList[res.tapIndex]
        })
      }
    })
  },

  // 获取产品订单详情
  getProductOrderDetail() {
    apiAction.getProductOrderBasicInfoByOrderId(this.data.orderId).then(info => {
      this.setData({
        info
      })
      if ([1, 2].includes(info.deliver)) {
        // Page初始状态即这种情况，不用执行任何操作
      } else {
        wx.setNavigationBarTitle({
          title: '申请售后',
        })
        this.setData({
          isAfterReceive: true,
          showMoney: false,
          info,
        })
      }
      this.getRefundReasonByType()
    })
  },
  // 获取服务订单详情
  getServiceOrderDetail() {
    apiAction.weGetServiceOrderInfoById(this.data.orderId).then(data => {
      this.$setData({
        info: data
      })
      this.getRefundReasonByType()
    })
  },
  /**
   * 获取退款原因集合
   */
  getRefundReasonByType() {
    let refundReasonType = this.data.isAfterReceive ? 'PRODUCT_AFTER_RECEIVE' : 'PRODUCT_BEFORE_RECEIVE'
    apiAction.getRefundReasonByType(refundReasonType).then(list => {
      this.setData({
        reasonList: list
      })
    })
  },

  // 点击下方按钮
  clickButton() {
    if (this.data.ifModify) {
      return this.modifyRefund()
    } else {
      return this.applyRefund()
    }
  },

  // 申请退款/售后
  applyRefund() {
    // 退款
    if (!this.data.isAfterReceive) {
      return this.createProductRefundOrder();
      // 售后
    } else {
      return this.createProductAfterSaleOrder();
    }
  },

  // 修改退款/售后申请
  modifyRefund() {
    // 退款
    if (!this.data.isAfterReceive) {
      return this.changeRefundOrderInfo();
      // 售后
    } else {
      return this.changeAfterSaleOrderInfo();
    }
  },

  // 修改退款订单
  changeRefundOrderInfo() {
    const {
      images,
      note,
      refundPrice,
      refundReason
    } = this.data
    const params = {
      images,
      note,
      refundPrice,
      refundReason,
      refundOrderId: this.data.refundOrderId
    }
    let promise = this.data.isProduct ? apiAction.changeRefundOrderInfo(params) : apiAction.changeServiceRefundOrderInfo(params)
    promise.then(data => {
      if (data.success) {
        wx.showToast({
          title: '修改成功！',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },

  // 修改售后单信息
  changeAfterSaleOrderInfo() {
    const {
      images,
      note,
      refundPrice,
      refundReason
    } = this.data
    const params = {
      images,
      note,
      refundPrice,
      refundReason,
      refundOrderId: this.data.refundOrderId,
      refund: this.data.showMoney
    }
    apiAction.changeAfterSaleOrderInfo(params).then(data => {
      if (data.success) {
        wx.showToast({
          title: '修改成功！',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },

  // 提交申请-创建退款订单
  createProductRefundOrder() {
    const params = {
      images: this.data.images,
      note: this.data.note,
      refundPrice: this.data.refundPrice,
      refundReason: this.data.refundReason
    }
    if (this.data.isProduct) {
      params.productOrderId = this.data.orderId
    } else {
      params.serviceOrderId = this.data.orderId
    }
    let promise = this.data.isProduct ? apiAction.createProductRefundOrder(params) : apiAction.createServiceRefundOrder(params)
    promise.then(data => {
      if (data.success) {
        wx.$event.emit('orderRefund', {
          type: 'refund',
          id: this.data.orderId
        })
        wx.showToast({
          title: '申请退款成功',
        })
        apiAction.requestSubscribeMessage({type: 3})
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 创建售后订单
   */
  createProductAfterSaleOrder() {
    const {
      customerName,
      customerPhone,
      images,
      note,
      refundPrice,
      refundReason
    } = this.data
    const params = {
      customerName,
      customerPhone,
      images,
      note,
      productOrderId: this.data.orderId,
      refund: this.data.showMoney,
      refundPrice,
      refundReason
    }
    apiAction.createProductAfterSaleOrder(params).then(data => {
      if (data.success) {
        wx.$event.emit('orderRefund', {
          type: 'afterSale',
          id: this.data.orderId
        })
        wx.showToast({
          title: '申请售后成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },

  // 从修改申请按钮进来，获取订单基本信息
  getChangeRefundOrderBasicInfo() {
    let promise = this.data.isProduct ?
      apiAction.getChangeRefundOrderBasicInfo(this.data.refundOrderId) :
      apiAction.getChangeRefundServiceOrderBasicInfo(this.data.refundOrderId)
    promise.then(data => {
      this.setData({
        info: data
      })
    })
  },

  /**
   * 售后:是否要求退款
   */
  changeIfNeedMoney(e) {
    this.setData({
      showMoney: e.detail.value
    })
  },

})