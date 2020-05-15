const fetch = require('../../../../utils/fetch.js')
const format = require('../../../../utils/format.js')
const util = require('../../../../utils/util.js')
Page({
  data: {
    id:null,
    info:null,
    flag:false, // 控制修改时间弹框
    originServices: [], // 为防止多次修改服务备份的原始服务信息
  },
  onLoad(options) {
    this.data.id = options.id
    this.fetch()
    this.$on('updateService', this.getServiceList)
  },
  computed:{
    _totalPrice(){
      let total = 0
      if(this.data.info){
        for (const v of this.data.info.serviceInfoForAppointments){
          total += v.count * v.price
        }
      }
      return total
    }
  },
  fetch(){
    fetch.staffGetAppointmentInfoById(this.data.id).then( data => {
      data.dueTime = data.dueTime.slice(0, -3) // 去除秒级时间
      format.timeDifference(data.dueTime, this.serCurrentTimeDistance)
      this.$setData({
        info: data,
        originServices: Object.assign([], data.serviceInfoForAppointments),
      })
    })
  },
  serCurrentTimeDistance(time) {
    this.$setData({
      time
    })
  },
  // 快速开单
  createOrder(){
    this.$place('appointment', this.data.info)
    this.$route('/pages/TC/pages/consumptionBillTwo/consumptionBillTwo', { customerId: this.data.info.customerInfo.id})
  },
  // 跳转客户档案详情
  jumpCustomerDetail(){
    this.$route('/pages/SC/pages/customerDetail/customerDetail', { id: this.data.info.customerInfo.id })
  },
  /**
   * 点击修改时间(设置flag的true和false)
   */
  updateTime() {
    let arr = util.getDates(7)
    arr = arr.map(v => {
      v.timestamp = new Date(v.year + '/' + v.month + '/' + v.day).valueOf();
      return v;
    })
    let dates = arr[0];
    let str = dates.year + '/' + dates.month + '/' + dates.day;
    this.setData({
      currentDate: str,
      dates: arr
    })
    this.requestTimeStatus(str)
  },
  /**
   * 请求时间数据的总函数(传入日期)
   */
  requestTimeStatus(date) {
    if (date.indexOf('/') != -1) {
      date = date.split('/').join('-')
    }
    this.$post('/customer/weListAvailableAppointmentTimeByStaffId', {staffId:wx.$getStorage('staffId'), currentDate:date}).then( data => {
      console.log(data)
      this.setData({
        times: data.timeStatuses,
        flag: true,
      })
    })
  },
  /**
   * time组件的回调函数setCurrentDate(设置当前日期)
   */
  setCurrentDate(e) {
    let str = e.detail.split('-').join('/');
    this.setData({
      currentDate: str,
      currentTime: ''
    })
    this.requestTimeStatus(e.detail)
  },
  /**
   * time组件的回调函数setCurrentTime(设置当前时间)
   */
  setCurrentTime(e) {
    this.setData({
      currentTime: e.detail
    })
  },
  // 确认修改预约时间
  confirmChange() {
    if (!this.data.currentTime) {
      wx.showToast({
        title: '亲，你还没有选择时间哦',
        icon: 'none'
      })
      return;
    }
    const dueTime = this.data.currentDate.split('/').join('-') + ' ' + this.data.currentTime
    this.setData({
      flag: false,
      currentTime: '',
      currentDate: '',
      dates: [],
      times: []
    })
    if (dueTime !== this.data.info.dueTime) {
      this.setData({
        'info.dueTime': dueTime,
      })
    }
  },
  // 点击组件关闭按钮
  close() {
    this.setData({
      flag: false,
      currentTime: '',
      currentDate: '',
      dates: [],
      times: []
    })
  },
  // 点击修改服务
  updateService() {
    const info = this.data.info

    const staff = info.staffInfo
    this.$place('staff', staff)
    // 取出已选择的服务的specificationId
    const specificationIds = []
    if (this.data.info.serviceInfoForAppointments) {
      for (const v of this.data.info.serviceInfoForAppointments) {
        specificationIds.push(v.specificationId)
      }
    }

    let query = {
      brandCustomerId:info.customerInfo.brandCustomerId,
      specificationIds: JSON.stringify(specificationIds)
    }
    this.$route('/pages/TC/pages/updateService/updateService', query)
  },

  // 监听事件-修改服务
  getServiceList(specificationList) {
    let ids = [];

    for (const i of specificationList) {
      ids.push(i.specificationId)
    }

    // appId随便传一个
    this.$post('/customer/getServiceInfoBySpecificationIdList', {appId: '1',ids}).then( data => {
      let arr = util.matching(data.services, specificationList)
      this.$setData({
        'info.serviceInfoForAppointments': data.services
      })
    })
  },
  // 保存修改
  saveAppointment(e) {
    if (this.waitSaved) return
    this.waitSaved = true
    let appointmentInfo = this.data.info
    if (!(appointmentInfo.serviceInfoForAppointments && appointmentInfo.serviceInfoForAppointments.length)) {
      wx.showToast({
        title: '请选择服务',
        icon: 'none'
      })
      return
    }

    let specificationId = []
    let flag, item
    outer:
    for (const a of this.data.originServices) {
      flag = false
      for (let i = 0; i < appointmentInfo.serviceInfoForAppointments.length; i++) {
        item = appointmentInfo.serviceInfoForAppointments[i]
        if (a.specificationId == item.specificationId) {
          // 当原来的服务包含在现有服务中，置flag为true
          flag = true
          appointmentInfo.serviceInfoForAppointments.splice(i, 1)
          continue outer
        }
      }
      // 当选择的服务不包含原有服务
      if (!flag) {
        a.status = false
        specificationId.push(a)
      }
    }
    let params = {
      id: appointmentInfo.id,
      storeId: appointmentInfo.shopId,
      staffId: appointmentInfo.staffInfo.id,
      appointmentServiceInfoList: specificationId.concat(appointmentInfo.serviceInfoForAppointments),
      dueTime: appointmentInfo.dueTime,
      notes: appointmentInfo.notes,
      customerId: appointmentInfo.customerInfo.id
    }


    fetch.weStaffCreateAppointment(params).then(data => {
      this.waitSaved = false
      if (data.success) {
        wx.$event.emit('refreshMyappointment')
        wx.showToast({
          title: '修改成功'
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 500)
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
})