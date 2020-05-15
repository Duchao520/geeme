// pages/appointment/choose/choose.js
const util = require('../../../../utils/util.js');
const apiAction = require('../../../../utils/apiAction.js');
Page({
  data: {
    // show为1的数据
    show: 2,
    shopid: 0,
    hairlist: [],
    // 时间组件中的数据
    dates: [],
    // 时间(status:1 过期  2 过期满    3  未过期满)
    times: [],
    currentdate: '',
    currenttime: '',
    isShow: true,
    // 页数
    currentPage: 1,
    pageSize: 20,
    // 是否必选服务者
    chooseServer: false,
  },
  onLoad(options) {
    this.setData({
      show: options.index,
      shopid: options.shopid,
      chooseServer: JSON.parse(options.chooseServer),
    })
    if (this.data.show == 1) {
      this.gethairdata()
      wx.setNavigationBarTitle({
        title: '选服务者'
      })
    } else if (this.data.show == 2) {
      this.gettimedata()
      wx.setNavigationBarTitle({
        title: '先选时间'
      })
    } else {
      this.getworksdata()
      wx.setNavigationBarTitle({
        title: '先看作品'
      })
    }
    this.$on('setCalendar', this.gettimedata)
    this.setData({
      isShow: true
    })
  },
  /**
   * hair->点击去员工详情
   */
  tostaffDetail(e) {
    wx.navigateTo({
      url: '/pages/SC/pages/hairdetails/hairdetails?shopId=' + this.data.shopid + '&hairId=' + e.detail
    })
  },

  jumpchoose(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      show: index
    }, () => {
      if (this.data.show == 1) {
        this.gethairdata()
      } else if (this.data.show == 2) {
        this.gettimedata()
      } else {
        this.getworksdata()
      }
    })
  },
  // 请求发型师数据
  gethairdata() {
    wx.setNavigationBarTitle({
      title: '选服务者'
    })
    let data = {
      storeId: this.data.shopid
    }
    apiAction.weListAvailableStaffByStoreId(data).then(data => {
      this.setData({
        hairlist: data.staffInfoForAppointments
      })
    })
  },
  // 请求选时间数据(对所有店铺的服务者进行筛选)
  gettimedata(date) {
    wx.setNavigationBarTitle({
      title: '先选时间'
    })
    let arr;
    if (date) {
      arr = util.getDates(5, date)
    } else {
      arr = util.getDates(5);
    }
    this.setData({
      dates: arr
    })
    let dates = arr[0];
    let str = dates.year + '/' + dates.month + '/' + dates.day;
    this.setData({
      currentdate: str,
    })
    this.publicrequest(str)
  },

  // 请求选时间公共函数给我一个dateStr我给你请求对应日期的状态
  publicrequest(dateStr) {
    dateStr = dateStr.split('/').join('-')
    let params = {
      targetDay: dateStr,
      storeId: this.data.shopid
    }
    apiAction.weListAvailableAppointmentTimeByStoreId(params).then(data => {
      // 成功之后应该把当前时间清空
      this.setData({
        currenttime: '',
        times: data.timeStatuses
      })
    })
  },
  // 设置当前日期时间戳（发送请求）
  setCurrentDate(e) {
    let str = e.detail;
    this.setData({
      currentdate: str,
    })
    this.publicrequest(str)
  },
  // 设置当前时间（不发送请求）
  setCurrentTime(e) {
    this.setData({
      currenttime: e.detail
    })
  },
  // 点击下一步将时间存到本地
  next() {
    if (this.data.currentdate && this.data.currenttime) {
      wx.removeStorageSync('appointment')
      let time = this.data.currentdate + ' ' + this.data.currenttime;
      let storeId = this.data.shopid
      util.addtime(time, storeId)
      wx.navigateTo({
        url: '/pages/TC/pages/choosetimehair/choosetimehair?shopid=' + this.data.shopid + '&chooseServer=' + this.data.chooseServer
      })
    } else {
      wx.showToast({
        title: '亲，你还没有选择时间哦',
        icon: 'none'
      })
    }
  },
  // 请求作品数据
  getworksdata() {
    wx.setNavigationBarTitle({
      title: '先看作品'
    })
  },

  /**
   * 日历点击事件
   */
  clickCalendar() {
    wx.navigateTo({
      url: '/pages/TC/pages/calendarplugin/calendarplugin'
    })
  },
})