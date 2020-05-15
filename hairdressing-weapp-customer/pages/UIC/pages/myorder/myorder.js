// pages/UIC/pages/myappointment/myappointment.js
var apiAction = null, util = null, app = null;
Page({
  $name: 'myorder',
  data: {
    currentTab: 0, // 当前tab下标
    orderList: [],
    // 下滑加载更多
    currentPage: 0,
    pageSize: 10,
    total: 0,
    flag: false,
    tabList: ['全部', '待付款', '待服务', '待评价', '待拼单', '已完成'],
    statusArr: ['ALL', 'WAITING_PAY', 'WAITING_SERVICE', 'WAITING_ASSESSMENT', 'GROUP_BUY_WAIT', 'COMPLETED'], // 不在请求参数中的状态：CLOSED-已关闭
    keyword: '',
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    if (options.index) {
      this.$setData({
        currentTab: Number(options.index)
      })
    }
    app.getPhone(() => {
      this.getServiceOrderList()
    })
    this.$on('orderEvaluate', this.orderEvaluate)
    this.$on('orderCancel', this.orderCancel)
    this.$on('orderRefund', this.orderRefund)
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    app = null;
    this.data = null;
  },
  search(e) {
    this.$setData({
      currentPage: 0,
      keyword: e.detail,
      orderList: []
    })
    this.getServiceOrderList()
  },
  // 请求列表
  getServiceOrderList() {
    const status = this.data.statusArr[this.data.currentTab]
    const {
      currentPage,
      pageSize,
      keyword
    } = this.data
    const params = {
      status,
      pageParam: {
        currentPage,
        pageSize,
      },
      keyword
    }
    wx.showLoading()
    apiAction.esWeServiceOrderList(params).then(data => {
      wx.hideLoading()
      this.data.flag = false
      this.data.total = data.total
      this.$setData({
        orderList: this.data.orderList.concat(data.orderList),
      })
    })
  },
  // 评价订单
  orderEvaluate(res) {
    const i = this.getIndexById(res.id)
    if (this.data.currentTab == 0) {
      this.data.orderList[i].orderStatus = "COMPLETED"
      this.$setData({
        orderList: this.data.orderList
      })
    } else {
      this.spliceItem(i)
    }
  },
  orderCancel(res) {
    const i = this.getIndexById(res.id)
    if (this.data.currentTab == 0) {
      this.data.orderList[i].orderStatus = "CLOSED"
      this.data.orderList[i].cancelTime = util.formatTime2(new Date())
      this.$setData({
        orderList: this.data.orderList
      })
    } else {
      this.spliceItem(i)
    }
  },
  orderRefund(res) {
    const i = this.getIndexById(res.id)
    this.data.orderList[i][res.type] = true
    this.$setData({
      orderList: this.data.orderList
    })
  },
  // 根据id获取订单对应下标
  getIndexById(id) {
    for (let i = 0; i < this.data.orderList.length; i++) {
      if (this.data.orderList[i].id == id) {
        return i
      }
    }
  },
  // 使index下标的订单从视图中删除
  spliceItem(index) {
    this.data.orderList.splice(index, 1)
    this.$setData({
      orderList: this.data.orderList
    })
  },
  // 取消订单
  cancel(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认取消订单？',
      success: res => {
        if (res.confirm) {
          apiAction.weCancelServiceOrder(id).then(data => {
            if (data.success) {
              this.orderCancel({
                id
              })
            }
          })
        }
      }
    })
  },
  // 支付
  orderPay(e) {
    const item = e.currentTarget.dataset.item
    app.globalData.bill.type = 'service'
    app.globalData.bill.info = {
      billNo: item.billNo,
      totalCharge: item.serviceInfoForOrder.price * item.serviceInfoForOrder.count,
      title: item.serviceInfoForOrder.serviceName,
      count: item.serviceInfoForOrder.count,
      storeId: item.storeId,
      finalTotalCharge: item.received,
      billingType: item.prepaidCardId ? 1 : 0,
      customerCardId: item.prepaidCardId
    }
    this.$route('/pages/TC/pages/orderpay/orderpay')
  },
  // 切换tab
  switchTab(e) {
    this.setCurrentTab(e.detail.index)
  },
  // 设置当前选中状态
  setCurrentTab(currentTab) {
    this.setData({
      currentPage: 0,
      currentTab,
      orderList: []
    })
    this.getServiceOrderList(currentTab)
  },
  // 跳转订单详情
  jumpOrderDetail(e) {
    let id = e.currentTarget.dataset.id
    this.$route('/pages/TC/pages/orderDetail/orderDetail', {
      id
    })
  },

  // 申请退款
  jumpApplyRefund(e) {
    const {
      id,
      refund
    } = e.currentTarget.dataset
    if (refund) {
      this.$route('/pages/IC/pages/refundList_service/refundList_service')
    } else {
      this.$route('/pages/RC/pages/applyrefund/applyrefund', {
        orderId: e.currentTarget.dataset.id
      })
    }
  },

  // 去评价
  toEvaluation(e) {
    const info = e.currentTarget.dataset.info
    this.$route('/pages/RC/pages/evaluation/evaluation', {
      info: JSON.stringify(info)
    })
  },

  // 点击预约
  addAppointment(e) {
    wx.removeStorageSync('appointment');
    const item = e.currentTarget.dataset.item
    app.globalData.fromOrderAppointment.orderId = item.id
    let specificationList = [];
    let obj = {
      count: item.serviceInfoForOrder.count,
      specificationId: item.serviceInfoForOrder.specificationSnapshotId,
      serviceId: item.serviceInfoForOrder.serviceSnapshotId
    };
    specificationList.push(obj)

    let amount = item.received;
    util.addservice(specificationList, amount, item.storeId)
    this.$route('/pages/TC/pages/choosehair/choosehair')
  },
  // 分享拼团
  onShareAppMessage(e) {
    const product = e.target.dataset.item
    let path = `/pages/IC/pages/productdetails/productdetails?productId=${product.serviceInfoForOrder.serviceId}`
    return {
      title: product.serviceInfoForOrder.serviceName,
      path,
      imageUrl: util.getImageUrl(product.serviceInfoForOrder.image),
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if ((this.data.currentPage + 1) * this.data.pageSize >= this.data.total) return
    if (this.data.flag) return
    this.data.flag = true
    this.data.currentPage++;
    this.getServiceOrderList()
  },
})