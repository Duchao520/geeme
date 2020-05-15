// pages/TC/choosepackage/choosepackage.js
const util = require('../../../../utils/util.js');
const apiAction = require('../../../../utils/apiAction.js');
const app = getApp()
Page({
  data: {
    // 修改时间组件的数据
    flag: false,
    currentDate: '',
    currentTime: '',
    dates: '',
    times: '',
    words: '',
    // 发型师信息数据结构
    hairInfo: '',
    // 时间数据结构
    time: '',
    // 发型师界面技能数据结构
    skills: [],
    // 店铺id
    shopid: '',
    // 判断头部究竟显示哪一个
    hairtime: true,
    serviceArr:null,  // 已选择的服务
  },
  computed:{
    _totalPrice() {
      if (!this.data.serviceArr) return 0
      let total = 0
      for (const v of this.data.serviceArr) {
        total += v.selectedSpecification.count * v.selectedSpecification.specialPrice
      }
      return total
    },
  },
  onLoad(options) {
    if (options.shopid) {
      this.data.shopid = options.shopid
    }
    if(options.scene){
      const obj = util.sceneToJson(options.scene)
      util.addhair(obj.staffId, obj.storeId)
    }
    if(options.notes){
      this.$setData({
        words:options.notes
      })
    }
    this.getinfo()
  },
  updateService(e) {
    this.$setData({
      serviceArr: e.detail
    })
  },
  /**
   * 从本地读取发型师Id，取相关服务
   */
  getinfo() {
    let appointment = wx.$getStorage('appointment');
    if(appointment.dueTime){
      this.$setData({
        time: appointment.dueTime
      })
    } 
    if (!appointment.staffId) {
      this.$setData({
        hairtime: false
      })
      this.accordingDueTime()
    } else if (!appointment.dueTime) {
      this.requestStaff(appointment.staffId);
      this.accordingStaff();
    } else {
      this.requestStaff(appointment.staffId);
      this.accordingAll();
    }
  },

  /**
   * 请求时间数据的总函数(传入日期)
   */
  requestTimeStatus(date) {
    if (!date) return
    if (date.indexOf('/') != -1) {
      date = date.split('/').join('-')
    }
    let hairInfo = this.data.hairInfo;
    // 如果有员工的Id，就按照员工来取时间
    if (hairInfo.id) {
      apiAction.weListAvailableAppointmentTimeByStaffId(hairInfo.id, date).then(data => {
        this.$setData({
          times: data.timeStatuses,
          flag: true,
          hidden: false
        })
      })
    } else {
      let params = {
        targetDay: date,
        storeId: wx.getStorageSync('appointment').storeId
      }
      apiAction.weListAvailableAppointmentTimeByStoreId(params).then(data => {
        this.$setData({
          times: data.timeStatuses,
          flag: true,
          hidden: false
        })
      })
    }
  },

  /**
   * 点击修改时间(设置flag的true和false)
   */
  updateTime() {
    let arr;
    if (wx.getStorageSync('Datedata')) {
      arr = util.getDates(7, wx.getStorageSync('Datedata'))
    } else {
      arr = util.getDates(7);
    }
    arr = arr.map(v => {
      v.timestamp = new Date(v.year + '/' + v.month + '/' + v.day).valueOf();
      return v;
    })
    wx.removeStorageSync('Datedata')
    let dates = arr[0];
    let str = dates.year + '/' + dates.month + '/' + dates.day;
    this.$setData({
      currentDate: str,
      dates:arr
    })
    this.requestTimeStatus(str)
  },

  /**
   * 时间组件->关闭
   */
  close() {
    this.$setData({
      flag: false,
      currentTime: '',
      currentDate: '',
      dates: [],
      times: []
    })

  },

  /**
   * 时间组件->setCurrentDate(设置当前日期)
   */
  setCurrentDate(e) {
    let str = e.detail.split('-').join('/');
    this.$setData({
      currentDate: str,
      currentTime: ''
    })
    this.requestTimeStatus(e.detail)
  },


  /**
   * 时间组件->setCurrentTime(设置当前时间)
   */
  setCurrentTime(e) {
    this.$setData({
      currentTime: e.detail
    })
  },

  /**
   * 时间组件->确认修改
   */
  confirmChange() {
    if (!this.data.currentTime) {
      wx.showToast({
        title: '亲，你还没有选择时间哦',
        icon: 'none'
      })
      return;
    }
    this.data.time = this.data.currentDate.split('/').join('-') + ' ' + this.data.currentTime;
    let appointment = wx.getStorageSync('appointment')
    appointment.dueTime = this.data.time;
    wx.setStorageSync('appointment', appointment)
    this.$setData({
      time: this.data.time,
      flag: false,
      currentTime: '',
      currentDate: '',
      dates: [],
      times: []
    })
  },

  // 没有发型师(店铺Id,注意此处需要把上个页面能选的发型师Id数组发过来)
  accordingDueTime() {
    const {
      staffIdList,
      storeId
    } = wx.$getStorage('appointment')
    this.requestService(staffIdList, storeId);
  },

  // 没有时间(给发型师Id)
  accordingStaff() {
    const {
      staffId,
      storeId
    } = wx.$getStorage('appointment')
    this.requestService([staffId], storeId);
  },

  // 时间、发型师都有
  accordingAll() {
    const {
      staffId,
      storeId
    } = wx.$getStorage('appointment')
    this.requestService([staffId], storeId);
  },

  // 请求发型师数据
  requestStaff(staffId) {
    apiAction.getWeStaffDetail(staffId).then(data => {
      this.$setData({
        hairInfo: data
      })
    })
  },

  // 公共请求服务的函数(设置skills)
  requestService(staffIds, shopId) {
    apiAction.getServiceTree(staffIds, shopId).then(data => {
      // 若是重新预约，则勾选上之前的服务
      if (app.globalData.rescheduleService){
        const rescheduleServices = app.globalData.rescheduleService
        for (const v of data.dataList) {
          outer: for (const service of v.serviceList) {
            for (const specification of service.packageList) {
              for (let i = 0; i < rescheduleServices.length; i++) {
                if (specification.id == rescheduleServices[i].specificationId) {
                  service.selected = 1
                  service.selectedSpecification = specification
                  rescheduleServices.splice(i, 1)
                  continue outer;
                }
              }
            }
          }
        }
      }
      data.dataList.unshift({ type: '已办卡项目', serviceList: data.cardServiceList})
      this.$setData({
        skills: data.dataList
      })
    })
  },

  // 点击下一步
  addappointment(e) {
    if (!this.data.serviceArr.length) {
      wx.showToast({
        title: '亲，你还没有选择服务哦',
        icon: 'none'
      })
      return;
    }
    let skills = this.data.skills;
    let arr = [];
    let amount = 0;
    for(const v of this.data.serviceArr){
      amount += v.selectedSpecification.count * v.selectedSpecification.specialPrice
      arr.push({
        count:v.selectedSpecification.count,
        specificationId:v.selectedSpecification.id
      })
    }
    util.addservice(arr, amount)

    if (wx.$getStorage('appointment').dueTime) {
      let appointment = wx.$getStorage('appointment')
      let data = {
        storeId: appointment.storeId,
        staffId: appointment.staffId,
        amount: appointment.amount,
        specificationId: appointment.specificationList,
        dueTime: util.timeFormat(appointment.dueTime),
        notes: this.data.words,
        form_id:e.detail.formId
      }
      apiAction.submitAppointment(data)
    } else {
      wx.navigateTo({
        url: '/pages/TC/pages/choosetime/choosetime?notes=' + this.data.words
      })
    }
  },
  // 跳转服务者主页
  jumpStaffDetail() {
    const hairId = wx.$getStorage('appointment').staffId
    this.$route('/pages/SC/pages/hairdetails/hairdetails', {hairId})
  },
  // 双向绑定（备注）
  setnote(e) {
    if (e.detail.value.length >= 120) {
      wx.showToast({
        title: '超过字数限制',
        icon: 'none'
      })
    }
    this.$setData({
      words: e.detail.value
    })
  },
})