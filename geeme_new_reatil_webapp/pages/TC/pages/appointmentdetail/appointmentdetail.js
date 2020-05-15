// pages/TC/pages/appointmentdetail/appointmentdetail.js
var apiAction = null, util = null, app = null;
Page({
  $name:'appointmentdetail',
  data: {
    id: 0, // 预约单id
    // 预约详情数据 
    appointmentInfo: null,
    originServices: [], // 为防止多次修改服务备份的原始服务信息
    //时间差(*天*时*分*秒)
    time: '',
    //控制movebox组件的显示和隐藏
    flag: false,
    //时间组件的数据
    dates: [],
    times: [],
    //movebox组件底部的数据
    currentDate: '',
    currentTime: '',
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    this.data.id = options.appointmentId
    this.getAppointmentInfo()
    this.$on('updateStaff', this.getStaffInfo)
    this.$on('updateService', this.getServiceList)
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    app = null;
    this.data = null;
  },
  // 获取预约信息
  getAppointmentInfo() {
    wx.showLoading()
    apiAction.weGetAppointmentInfoById(this.data.id).then(data => {
      wx.hideLoading()
      data.dueTime = data.dueTime.slice(0, -3) // 去除秒级时间
      this.setData({
        time: util.timeDifference(data.dueTime),
        appointmentInfo: data,
        originServices: Object.assign([], data.serviceInfoForAppointments),
      })
    })
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
    this.requestTimeStatus(str).then(res => {
      Object.assign(res, {
        currentDate: str,
        dates: arr
      });
      this.setData(res);
    })
  },

  /**
   * time组件的回调函数setCurrentDate(设置当前日期)
   */
  setCurrentDate(e) {
    let str = e.detail.split('-').join('/');
    this.requestTimeStatus(e.detail).then(res => {
      Object.assign(res, {
        currentDate: str,
        currentTime: ''
      });
      this.setData(res);
    })
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
    let data = {
      flag: false,
      currentTime: '',
      currentDate: '',
      dates: [],
      times: []
    };
    if (dueTime !== this.data.appointmentInfo.dueTime) {
      this.data.appointmentInfo.dueTime = dueTime;
      this.ifStaffAppointable().then(res => {
        Object.assign(data,res, {
          'appointmentInfo.dueTime': dueTime,
        });
        this.setData(data)
      }).catch(error => {
        Object.assign(data, {
          'appointmentInfo.dueTime': dueTime,
        });
        this.setData(data)
      })
    }else{
      this.setData(data)
    }
  },

  // 修改时间后判断该服务者是否还有空，若没空删去服务者信息
  ifStaffAppointable() {
    const appointmentInfo = this.data.appointmentInfo
    if (!(appointmentInfo.staffInfo && appointmentInfo.staffInfo.id)) {
      return Promise.resolve({})
    }
    const {
      dueTime,
      shopId
    } = appointmentInfo
    const params = {
      appointmentTime: dueTime,
      storeId: shopId
    }
    return apiAction.weListAvailableStaffByAppointTime(params).then(data => {
      for (const v of data.staffInfoForAppointments) {
        if (v.staffId === appointmentInfo.staffInfo.id) {
          if (!v.hasCapacity) {
            return {
              'appointmentInfo.staffInfo': null,
              'appointmentInfo.serviceInfoForAppointments': null
            }
          }
        }
      }
    })
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

  /**
   * 请求时间数据的总函数(传入日期)
   */
  requestTimeStatus(date) {
    if (date.indexOf('/') != -1) {
      date = date.split('/').join('-')
    }
    let promise;
    // 若是已支付状态，根据staffId获取可预约时间
    if (this.data.appointmentInfo.payStatus) {
      promise = apiAction.weListAvailableAppointmentTimeByStaffId(this.data.appointmentInfo.staffInfo.id, date)
      // 未支付状态根据storeId获取可预约时间
    } else {
      const params = {
        targetDay: date,
        storeId: this.data.appointmentInfo.shopId
      }
      promise = apiAction.weListAvailableAppointmentTimeByStoreId(params)
    }
    return promise.then(data => {
      return {
        times: data.timeStatuses,
        flag: true,
      }
    })
  },

  // 点击修改服务者
  updateStaff() {
    const dueTime = this.data.appointmentInfo.dueTime
    const storeId = this.data.appointmentInfo.shopId
    this.$route('/pages/RC/pages/updateStaff/updateStaff', {
      dueTime,
      storeId
    })
  },

  // 修改服务者
  getStaffInfo(res) {
    // 判断该服务者是否能提供当前预约服务
    let item
    if (this.data.appointmentInfo.serviceInfoForAppointments){
      for (let i = 0; i < this.data.appointmentInfo.serviceInfoForAppointments.length; i++) {
        item = this.data.appointmentInfo.serviceInfoForAppointments[i]
        if (!item.allLevels && !item.levelIds.includes(res.levelId)) {
          this.data.appointmentInfo.serviceInfoForAppointments.splice(i, 1)
          i--
        }
      }
    }
    // 获取服务者信息
    apiAction.getWeStaffDetail(res.staffId).then(data => {
      data.level = data.levelName
      this.$setData({
        'appointmentInfo.staffInfo': data,
        'appointmentInfo.serviceInfoForAppointments': this.data.appointmentInfo.serviceInfoForAppointments
      })
    })
  },

  // 点击修改服务
  updateService() {
    const appointmentInfo = this.data.appointmentInfo

    const staff = appointmentInfo.staffInfo
    this.$place('staff', staff)
    // 取出已选择的服务的specificationId
    const specificationIds = []
    if (this.data.appointmentInfo.serviceInfoForAppointments){
      for (const v of this.data.appointmentInfo.serviceInfoForAppointments) {
        specificationIds.push(v.specificationId)
      }
    }
    
    let query = {
      staffId: staff.id,
      shopId: appointmentInfo.shopId,
      specificationIds: JSON.stringify(specificationIds)
    }
    this.$route('/pages/RC/pages/updateService/updateService', query)
  },

  // 监听事件-修改服务
  getServiceList(specificationList) {
    let ids = [];

    for (const i of specificationList) {
      ids.push(i.specificationId)
    }

    apiAction.getServiceInfoBySpecificationIdList(ids).then(data => {
      let arr = util.matching(data.services, specificationList)
      this.$setData({
        'appointmentInfo.serviceInfoForAppointments': data.services
      })
    })
  },

  // 保存修改
  saveAppointment(e) {
    if(this.waitSaved) return
    this.waitSaved = true
    let appointmentInfo = this.data.appointmentInfo
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
      for (let i = 0; i < appointmentInfo.serviceInfoForAppointments.length; i++){
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
      specificationId: specificationId.concat(appointmentInfo.serviceInfoForAppointments),
      dueTime: appointmentInfo.dueTime,
      notes: appointmentInfo.notes,
      form_id:e.detail.formId
    }
    apiAction.weCreateAppointment(params).then(data => {
      this.waitSaved = false
      if (data.success) {
        wx.$event.emit('refreshMyappointment')
        wx.showToast({
          title: '修改成功'
        })
        setTimeout(function() {
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

  // 点击取消预约
  cancelAppointment(e) {
    wx.showModal({
      title: '取消预约',
      content: '您确定要取消本次预约吗',
      success: res => {
        if (res.confirm) {
          const id = this.data.appointmentInfo.id;
          apiAction.weCancelAppoint(id, e.detail.formId).then(data => {
            if (data.success) {
              wx.$event.emit('refreshMyappointment')
              setTimeout(this.getAppointmentInfo.bind(this), 500)
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

  // 点击删除预约
  deleteAppointment(e) {
    wx.showModal({
      title: '删除预约',
      content: '您确定要删除本次预约吗',
      success: (res) => {
        if (res.confirm) {
          const id = this.data.appointmentInfo.id
          apiAction.weDeleteAppointment(id).then(data => {
            if (data.success) {
              wx.$event.emit('removeAppoint', id)
              wx.navigateBack({
                delta: 1
              })
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

  // 点击支付
  clickPay() {
    let appointmentId = this.data.appointmentInfo.id
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
  reAppoint() {
    wx.reLaunch({
      url: '/pages/tabBar/appointment/index/index'
    })
  },

  /**
   * 备注事件
   */
  sernotes(e) {
    if (e.detail.length > 120) return
    this.setData({
      'appointmentInfo.notes': e.detail
    })
  },
  toStaffDetail() {
    this.$route('/pages/SC/pages/hairdetails/hairdetails', {
      hairId: this.data.appointmentInfo.staffInfo.id
    })
  },
  toServiceDetail(e) {
    const id = e.currentTarget.dataset.id
    this.$route('/pages/IC/pages/productdetails/productdetails', {
      productId: id
    })
  },
  showTextarea() {
    this.$setData({
      ifShowTextarea: true,
    })
    wx.nextTick(() => {
      this.$setData({
        focusTextarea: true
      })
    })
  },
  hideTextarea() {
    this.$setData({
      ifShowTextarea: false,
      focusTextarea: false
    })
  }
})