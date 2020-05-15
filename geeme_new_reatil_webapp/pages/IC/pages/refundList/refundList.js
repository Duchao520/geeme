// pages/IC/pages/productOrderList/productOrderList.js
const apiAction = require('../../../../utils/apiAction.js')
const util = require('../../../../utils/util.js')
const app = getApp()
Page({
  $name: 'refundList',
  data: {
    tabList: ['全部', '退款中', '退款完成', '售后中', '售后完成'],
    orderStatusArr: ['ALL', 'REFUNDING', 'REFUNDED', 'AFTER_SALES_RIGHT', 'AFTER_SALES_CLOSE'],
    // request相关参数
    orderStatus: 'ALL',
    pageNum: 0,
    pageSize: 10,
    keyword: '',
    // response
    refundList: [],
    total: 0,
    // 加载更多相关
    flag: false,
  },
  onLoad(options) {
    app.getPhone(() => {
      this.getRefundList()
    })
    this.$on('cancelRefundOrder', this.onCancelRefundOrder)
  },
  getRefundList() {
    let {
      orderStatus,
      pageNum,
      pageSize,
      keyword
    } = this.data
    const params = {
      orderStatus,
      pageNum,
      pageSize,
      keyword
    }
    wx.showLoading()
    apiAction.getProductRefundOrderList(params).then(data => {
      wx.hideLoading()
      this.data.total = data.total
      this.data.flag = false
      if (data.refundOrders && data.refundOrders.length) {
        let list = pageNum == 0 ? data.refundOrders : this.data.refundList.concat(data.refundOrders)
        this.setData({
          refundList: list
        })
      }
    })
  },
  search(e) {
    this.$setData({
      refundList: [],
      keyword: e.detail
    })
    this.data.pageNum = 0
    this.getRefundList()
  },
  switchTab(e) {
    const index = e.detail.index
    this.data.orderStatus = this.data.orderStatusArr[index]
    this.data.pageNum = 0;
    this.setData({
      refundList: [],
    })
    this.getRefundList()
  },
  // 取消退款 取消售后
  cancelOrder(e) {
    const {
      id,
      index,
      type
    } = e.currentTarget.dataset
    wx.showModal({
      title: '确定取消退款吗?',
      content: '取消后,退款进程将关闭.',
      success: res => {
        if (res.confirm) {
          wx.showLoading()
          apiAction.cancelRefundOrder(id).then(data => {
            wx.hideLoading()
            if (data.success) {
              const varyStatus = type == 0 ? "REFUND_CANCELED" : "AFTER_SALES_CANCELED"
              this.changeOrderStatus(index, varyStatus)
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
  // 监听退款详情中的取消事件
  onCancelRefundOrder(res) {
    const index = this.getIndexById(res.id)
    const varyStatus = res.type == 0 ? "REFUND_CANCELED" : "AFTER_SALES_CANCELED"
    this.changeOrderStatus(index, varyStatus)
  },
  getIndexById(id) {
    for (let i = 0; i < this.data.refundList.length; i++) {
      if (this.data.refundList[i].id == id) {
        return i
      }
    }
  },
  // 改变订单状态
  changeOrderStatus(index, status) {
    if (this.data.orderStatus == 'ALL') {
      const attr1 = `refundList[${index}].orderStatus`
      const attr2 = `refundList[${index}].modifyTime`
      this.$setData({
        [attr1]: status,
        [attr2]: util.formatTime2(new Date())
      })
    } else {
      this.data.refundList.splice(index, 1)
      this.$setData({
        refundList: this.data.refundList
      })
    }
  },
  // 查看进度
  jumpRefundDetail(e) {
    this.$route('/pages/IC/pages/refundDetail/refundDetail', {
      id: e.currentTarget.dataset.id,
      isProduct: 1
    })
  },
  // 页面上拉触底事件的处理函数
  onReachBottom() {
    if ((this.data.pageNum + 1) * this.data.pageSize >= this.data.total) return
    if (this.data.flag) return;
    this.data.flag = true;
    this.data.pageNum++;
    this.getRefundList();
  },
})