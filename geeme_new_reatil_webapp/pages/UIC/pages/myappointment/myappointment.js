// pages/UIC/pages/myappointment/myappointment.js
var apiAction = null, util = null, app = null;
Page({
  $name: 'myappointment',
  data: {
    tabList: ['全部', '待服务', '已服务', '已超时', '已取消'],
    // 当前tab
    tabIndex: 0,
    orderList: [],
    status: '',
    //页数
    currentPage: 1,
    pageSize: 10,
    total: 0,
    // 是否正在加载更多
    isLoading: false,
    // 是否显示缺省
    isDefault: false
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    app.getPhone(() => {
      this.getAllOrderList().then(res => {
        this.setData(res);
        res = null;
      })
    })
    this.$on('refreshMyappointment', this.setCurrentTab)
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    app = null;
    this.data = null;
  },
  /**
   * 请求预约列表
   */
  getAllOrderList() {
    let {
      currentPage,
      pageSize
    } = this.data,
    tabName = this.data.tabList[this.data.tabIndex],
    params = {
      status: tabName,
      currentPage,
      pageSize
    }
    wx.showLoading()
    return apiAction.weListAppointmentByStatus(params).then(data => {
      wx.hideLoading();
      params = null; currentPage = null;pageSize = null;tabName = null;
      this.data.isLoading = false
      if (!data.appointmentInfoList.length) {
        return {isDefault: true};
      }
      return {
        orderList: this.data.orderList.concat(data.appointmentInfoList),
        total: data.total,
        isDefault:false
      };
    })

  },
  // 点击请求对应状态的订单
  switchTab(e) {
    this.setCurrentTab(e.detail.index)
  },
  setCurrentTab(index = 0) {
    this.data.tabIndex = index;
    this.data.orderList = [];
    this.getAllOrderList().then(res => {
      let data = Object.assign({
        tabIndex: index,
        currentPage: 1,
        orderList: []
      },res);
      this.setData(data);
      res = null;
      data = null;
      return null;
    })
  },
  // 点击删除预约
  deleteAppointment(e) {
    wx.showModal({
      title: '删除预约',
      content: '您确定要删除本次预约吗',
      success: (res) => {
        if (res.confirm) {
          const id = e.currentTarget.dataset.id
          const index = e.currentTarget.dataset.index
          apiAction.weDeleteAppointment(id).then(data => {
            if (data.success) {
              this.removeItem(index, true)
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

  // 点击取消预约
  cancelAppointment(e) {
    wx.showModal({
      title: '取消预约',
      content: '您确定要取消本次预约吗',
      success: res => {
        if (res.confirm) {
          const id = e.currentTarget.dataset.id
          const index = e.currentTarget.dataset.index
          apiAction.weCancelAppoint(id, e.detail.formId).then(data => {
            if (data.success) {
              this.removeItem(index)
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

  /**
   * 若在全部状态下，改变订单状态；否则在界面中删去该订单
   */
  removeItem(index, isDelete) {
    let orderList = this.data.orderList
    if (this.data.tabIndex == 0 && !isDelete) {
      orderList[index].status = '已取消'
      let attr = `orderList[${index}]`
      this.$setData({
        [attr]: orderList[index]
      })
    } else {
      orderList.splice(index, 1)
      this.$setData({
        orderList
      })
    }
  },

  // 监听来自别的页面的删去订单信息的操作，比如预约详情页面
  listenRemoveItem(id) {
    for (let i = 0; i < this.data.orderList.length; i++) {
      if (this.data.orderList[i].id == id) {
        return this.data.removeItem(i)
      }
    }
  },

  // 点击支付
  clickPay(e) {
    let appointmentId = e.currentTarget.dataset.id
    app.globalData.bill.type = 'appointment'
    let params = { appointmentId: appointmentId };
    apiAction.getAppointmentBilling(params).then(res => {
      if (res.openConsumerOrder) {
        wx.navigateTo({
          url: '/pages/TC/pages/consumptiondetail/consumptiondetail?id=' + res.consumerOrderId
        })
      } else {
        wx.navigateTo({
          url: '/pages/TC/pages/order/order?appointmentId=' + appointmentId + '&storeId=' + this.data.storeId
        })
      }
    })
  },

  // 重新预约
  againAppointment(e) {
    wx.removeStorageSync('appointment')
    const item = e.currentTarget.dataset.item;
    const arr = []
    for (const v of item.serviceInfoForAppointments){
      arr.push({
        count: v.count,
        specificationId: v.specificationId
      })
    }
    util.addhair(item.staffId)
    app.globalData.rescheduleService = arr
    this.$route('/pages/TC/pages/choosetime/choosetime')
  },

  // 跳转预约详情
  jumpdetail(e) {
    let appointmentId = e.currentTarget.dataset.appointmentid
    this.$route('/pages/TC/pages/appointmentdetail/appointmentdetail', {
      appointmentId
    })
  },

  // 跳转服务订单列表
  jumpServiceOrderList() {
    this.$route('/pages/UIC/pages/myorder/myorder')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.currentPage * this.data.pageSize >= this.data.total) {
      wx.showToast({
        title: '没有更多预约啦',
        icon: 'none'
      })
      return;
    }
    if (this.data.isLoading) return
    this.data.isLoading = true
    this.data.currentPage++;
    this.getAllOrderList().then(res => {
      this.setData(res);
      res = null;
    })
  },
})