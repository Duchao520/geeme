// pages/TC/choosetime/choosetime.js
const util = require('../../../../utils/util.js');
const apiAction = require('../../../../utils/apiAction.js');
const myUtil = require('../../../../utils/myUtil.js');
const app = getApp();
Page({
  data: {
    // 发型师信息 
    hairInfo: null,
    // 服务信息
    service: [],
    words: '',
    // 应付总钱数
    amount: 0,
    // 时间组件中的数据
    // 时间(status:1 过期  2 过期满    3  未过期满)
    times: [],
    currenttime: '',
    currentdate: '',
    dates: [],
    isShow: true,
    // 今天的日期时间戳
    nowDate: '',
    // 是否使用了日历功能
    Datedata: '',
    // 避免多次点击提交预约
    isAddAppointment: true
  },
  onLoad(options) {
    if (options.notes) {
      this.setData({
        words: options.notes
      })
    }
    this.showdate()
    this.$on('setCalendar', this.showdate)

    // 从本地拿出选择的选择的发型师和服务
    this.getappointmentinfo();

    /**
     * 为了触发组件的生命周期
     */
    this.setData({
      isShow: true
    })
  },
  onShareAppMessage() {
    let { hairInfo } = this.data, title, userInfo = wx.$getStorage('userInfo');
    if (userInfo) {
      title = `快速预约:${hairInfo.name}  ${hairInfo.levelName}-不用问，不用等，约我只需点一点`
    } else {
      title = `快速预约:${hairInfo.name}  ${hairInfo.levelName}-不用问，不用等，约我只需点一点`
    }
    return {
      title: title,
      path: 'pages/SC/pages/hairdetails/hairdetails?hairId=' + hairInfo.id,
      imageUrl: this.data.sharePic
    }
  },
  serverPic() {
    let ctx = wx.createCanvasContext('serverPic'),
      { hairInfo } = this.data;

    myUtil.serverSharePic(ctx, hairInfo.score, hairInfo.appointmentMount, hairInfo.worksMount, hairInfo.avatar).then(res => {
      this.data.sharePic = res;
    })
  },
  /**
   * 从本地拿出预约标识请求相应的数据
   */
  getappointmentinfo() {
    let amount = 0;
    let appointment = wx.$getStorage('appointment');
    if (appointment && appointment.staffId) {
      this.requestStaff(appointment.staffId);
    }
    let specificationIdList = [];
    if (appointment.specificationList && appointment.specificationList.length){
      appointment.specificationList.forEach(v => {
        specificationIdList.push(v.specificationId)
      })
      this.requestService(specificationIdList);
    }
  },

  /**
   * 请求发型师信息
   */
  requestStaff(staffId) {
    apiAction.getWeStaffDetail(staffId).then(data => {
      this.setData({
        hairInfo: data
      });
      this.serverPic();
    })
  },

  /**
   * 请求服务的信息
   */
  requestService(specificationIdList) {
    apiAction.getServiceInfoBySpecificationIdList(specificationIdList).then(data => {
      let service = data.services;
      service = util.matching(service, wx.getStorageSync('appointment').specificationList);
      this.setData({
        service
      })
    })
  },

  /**
   * 请求时间使用的公共函数
   */
  publicrequest(time) {
    if (time.indexOf('/') != -1) {
      time = time.split('/').join('-')
    }
    let promise;
    let url, data;
    if (wx.getStorageSync('appointment').staffId) {
      promise = apiAction.weListAvailableAppointmentTimeByStaffId(wx.$getStorage('appointment').staffId, time)
    } else {
      promise = apiAction.weListAvailableAppointmentTimeByStoreId({
        targetDay: time,
        storeId: wx.$getStorage('appointment').storeId
      })
    }
    promise.then(data => {
      let timeStatuses = data.timeStatuses;
      // 成功之后应该把当前时间清空
      this.setData({
        currenttime: '',
        times: timeStatuses,
      })
    })
  },

  /**
   * 请求时间的信息
   */
  showdate(date) {
    var arr;
    if (date) {
      arr = util.getDates(5, date);
    } else {
      arr = util.getDates(5)
    }
    arr = arr.map(v => {
      v.timestamp = new Date(v.year + '/' + v.month + '/' + v.day).valueOf();
      return v;
    })
    this.setData({
      dates: arr
    }, () => {
      // 生成今天的时间戳
      let dates = this.data.dates[0];
      let str = dates.year + '/' + dates.month + '/' + dates.day;
      this.setData({
        currentdate: str
      })
      this.publicrequest(str)
    })
  },


  /**
   * 点击设置当前日期(请求对应日期下的时间状态)
   */
  setCurrentDate(e) {
    let currentdate = e.detail
    this.setData({
      currentdate: currentdate
    }, () => {
      this.publicrequest(currentdate);
    })
  },


  /**
   * 点击设置当前时间
   */
  setCurrentTime(e) {
    let currenttime = e.detail;
    this.setData({
      currenttime: currenttime
    })
  },
  // 下一步
  nextStep(){
    if (!this.data.currenttime) {
      wx.showToast({
        title: '亲,你还没有选择服务时间哦',
        icon: 'none'
      })
      return;
    }
    let currentdate = this.data.currentdate.split('/').join('-')
    let time = currentdate + ' ' + this.data.currenttime;
    // 存到本地
    util.addtime(time)

    this.$route('/pages/TC/pages/choosepackage/choosepackage', { notes: this.data.words})
  },
  // 提交预约
  submitappointment(e) {
    if (!this.data.currenttime) {
      wx.showToast({
        title: '亲,你还没有选择服务时间哦',
        icon: 'none'
      })
      return;
    }
    if (this.data.isAddAppointment) {
      this.data.isAddAppointment = false

      let currentdate = this.data.currentdate.split('/').join('-')
      let time = currentdate + ' ' + this.data.currenttime;
      // 存到本地
      util.addtime(time)

      let appointment = wx.$getStorage('appointment');

      let specificationId = [];
      this.data.service.map(v => {
        specificationId.push({
          count: v.count,
          specificationId: v.specificationId,
          status: true, //todo:修改预约，并且删除已选服务时传false
          id: v.serviceId
        })
      })
      let data = {
        storeId: appointment.storeId,
        staffId: appointment.staffId,
        specificationId: specificationId,
        dueTime: appointment.dueTime,
        notes: this.data.words,
        orderId: app.globalData.fromOrderAppointment.orderId ? app.globalData.fromOrderAppointment.orderId : null,
        form_id:e.detail.formId
      }
      apiAction.submitAppointment(data, () => {
        this.data.isAddAppointment = true
      })
    }
  },

  // 备注事件
  setnote(e) {
    if (this.data.words.length >= 119) {
      wx.showToast({
        title: '超过字数限制',
        icon: 'none'
      })
    }
    let word = e.detail.value;
    this.setData({
      words: word
    })
  },
  navigateToPerson(){
    wx.navigateTo({
      url: '/pages/SC/pages/hairdetails/hairdetails?hairId=' + this.data.hairInfo.id
    })
  }
})