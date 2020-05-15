// pages/IC/pages/refundDetail/refundDetail.js
const apiAction = require('../../../../utils/apiAction.js')
Page({
  data: {
    isProduct: false,
    id: '',
    status: null,
    info: null,
    // 补充留言相关
    images: [],
    note: '',
    // 是否弹框（补充留言）
    ifShowLayer: false
  },
  onLoad(options) {
    this.data.id = options.id
    if (options.isProduct) {
      this.data.isProduct = true
    }
  },
  onShow() {
    this.getRefundOrderDetail()
  },
  getRefundOrderDetail() {
    let promise = this.data.isProduct ? apiAction.getRefundOrderDetail(this.data.id) : apiAction.getUserRefundOrderDetail(this.data.id)
    promise.then(data => {
      wx.hideLoading()
      this.setData({
        info: data
      })
    })
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
   * 提交留言
   */
  leaveMessage() {
    const reqParams = {
      images: this.data.images,
      note: this.data.note,
      refundOrderId: this.data.id
    }
    wx.showLoading()
    let promise = this.data.isProduct ? apiAction.refundOrderMessage(reqParams) : apiAction.refundServiceOrderMessage(reqParams)
    promise.then(data => {
      if (data.success) {
        // 刷新
        this.getRefundOrderDetail();
        this.hideLayer()
      }
    })
  },

  /**
   * 输入留言
   */
  inputNote(e) {
    this.setData({
      note: e.detail.value
    })
  },

  // 控制显示隐藏补充里留言弹框
  hideLayer() {
    this.setData({
      ifShowLayer: false
    })
  },
  showLayer() {
    this.setData({
      ifShowLayer: true
    })
  },
  // 修改申请
  modify() {
    const query = {
      type: this.data.info.type,
      ifModify: 1,
      id: this.data.id
    }
    if(this.data.isProduct){
      query.isProduct = 1
    }
    this.$route('/pages/RC/pages/applyrefund/applyrefund', query)
  },
  // 取消申请
  cancel() {
    wx.showModal({
      title: '确定取消退款吗?',
      content: '取消后,退款进程将关闭.',
      success: res => {
        if (res.confirm) {
          let promise = this.data.isProduct ?
            apiAction.cancelRefundOrder(this.data.info.id) :
            apiAction.cancelServiceRefundOrder(this.data.info.id)
          promise.then(data => {
            if (data.success) {
              wx.showToast({
                title: '取消成功',
                icon: 'success'
              })
              wx.$event.emit('cancelRefundOrder', {
                id: this.data.id,
                type: this.data.info.type
              })
              setTimeout(() => {
                this.getRefundOrderDetail()
              }, 1000)
            } else {
              wx.showToast({
                title: data.message,
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
})