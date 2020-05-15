// pages/tabBar/DailyWork/index/index.js
const app = getApp();
const base = require('../../../../utils/base.js');
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    // DateTitle组件的数据
    startDate: '',
    storeInfo: null,
    // AppointmentItem组件中的数据
    capacity: 0,
    appointmentList: null,
    // 当前选中的日期
    selectedDate: '',
    // 消息icon
    messageIcon: base.DailyWork.messageIcon,
    scrollTop:null,
    isFixed:false,  // 选择预约时间顶部吸附用
  },
  computed:{
    isToday(){
      const now = new Date()
      return now.Format('yyyy-MM-dd') == this.data.selectedDate
    }
  },
  onLoad(options) {

  },
  onShow() {
    if (app.globalData.dateInfo.startDate) {
      this.setData({
        startDate: app.globalData.dateInfo.startDate
      })
      app.globalData.dateInfo.startDate = null
    }
    this.setStoreInfo()
    if(!this.$status.isFirstShow){
      this.getMyAppointment()
    }
  },
  onPullDownRefresh() {
    this.getMyAppointment()
  },
  // 监听屏幕滚动
  onPageScroll(e) {
    this.$setData({
      scrollTop: e.scrollTop
    })
  },
  // 改变吸附状态
  changeFix(e) {
    this.setData({
      isFixed: e.detail
    })
  },
  // 获取门店信息
  setStoreInfo() {
    this.$setData({
      storeInfo: wx.$getStorage('storeInfo')
    })
  },

  // 选择日期
  setCurrentDate(e) {
    this.$setData({
      selectedDate: e.detail
    })
    this.getMyAppointment()
  },

  // 获取我的预约
  getMyAppointment() {
    const {
      staffId,
      storeId
    } = this.data.storeInfo
    const params = {
      dueDate: this.data.selectedDate,
      staffId,
      storeId
    }
    fetch.getMineAppointment(params).then(data => {
      wx.stopPullDownRefresh()
      this.$setData({
        appointmentList: data.appointmentList,
        capacity: data.capacity
      })
    })
  },

  // 占用
  takeUp(e) {
    let obj = e.detail;

    const params = {
      dueTime: this.data.selectedDate + ' ' + obj.time,
      staffId: this.data.storeInfo.staffId,
      status: obj.status
    }

    // 占用
    if (obj.status) {
      wx.showModal({
        title: '',
        content: `确认占用${obj.time}吗`,
        cancelText: '再考虑下',
        confirmText: '确认占用',
        success: (res) => {
          if (res.confirm) {
            fetch.handleAppointmentOccupation(params).then(data => {
              if (data.success) {
                let _appointmentList = this.data.appointmentList.map(v => {
                  if (v.time == obj.time) {
                    v.disabled = v.disabled + 1
                  }
                  return v
                })
                this.$setData({
                  appointmentList: _appointmentList
                })
              }
            })    
          }
        }
      })
    // 取消占用
    } else {
      fetch.handleAppointmentOccupation(params).then( data => {
        if(data.success){
          let _appointmentList = this.data.appointmentList.map(v => {
            if (v.time == obj.time) {
              v.disabled = v.disabled - 1
            }
            return v
          })
          wx.showToast({
            title: '成功解除占用',
          })
          this.$setData({
            appointmentList: _appointmentList
          })
        }
      })
    }
  },
  // 添加预约
  reserve(e){
    const dueTime = this.data.selectedDate + ' ' + e.detail.time
    this.$route('/pages/SC/pages/customerList/customerList', { select: 1, dueTime})
  },

  // AppointmentItem->去看预约详情
  toappointmentDetail() {
    wx.navigateTo({
      url: '/pages/TC/pages/appointmentDetail/appointmentDetail'
    })
  },

  /**
   * 点击跳转日历插件
   */
  toCanendar() {
    wx.navigateTo({
      url: '/pages/TC/pages/calendar/calendar'
    })
  },

  /**
   * 点击跳转当月业绩
   */
  tocurrentMonthResults() {
    wx.navigateTo({
      url: '/pages/UIC/pages/currentMonthResults/currentMonthResults'
    })
  },

  /**
   * 点击切换门店
   */
  toswitchStore() {
    this.$route('/pages/Login/chooseBrandStore/chooseBrandStore')
  },
  // 跳转我的客户
  jumpCustomerList(){
    this.$route('/pages/SC/pages/customerList/customerList')
  }
})