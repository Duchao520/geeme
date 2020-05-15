// pages/TC//pages/chooseTime/chooseTime.js
const util = require('../../../../utils/util.js')
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    times: null,
    dates: null,
    currentDate:null,
    currentTime:null,
    customerId:null,
  },
  onLoad(options) {
    this.data.customerId = options.customerId
    this.gettimedata()
    this.$on('setCalendar', this.gettimedata)
  },
  // 请求选时间数据(对所有店铺的服务者进行筛选)
  gettimedata(date) {
    let arr;
    if (date) {
      arr = util.getDates(5, date)
    } else {
      arr = util.getDates(5);
    }
    let str = arr[0].year + '/' + arr[0].month + '/' + arr[0].day;
    this.setData({
      currentDate: str,
      dates:arr
    })
    this.getTimes(str)
  },
  // 获取时间日历
  getTimes(date){
    date = date.split('/').join('-')
    fetch.weStaffAvailableAppointmentTime(date).then( data => {
      this.$setData({
        times:data.timeStatuses
      })
    })
  },
  // 点击日期
  setCurrentDate(e) {
    let str = e.detail;
    this.setData({
      currentDate: str,
    })
    this.getTimes(str)
  },
  // 点击时间
  setCurrentTime(e) {
    this.setData({
      currentTime: e.detail
    })
  },
  // 下一步
  jumpChooseService(){
    if(!this.data.currentTime){
      return wx.showToast({
        title: '请选择时间',
        icon:'none'
      })
    }
    const customerId = this.data.customerId
    const dueTime = this.data.currentDate.split('/').join('-') + ' ' + this.data.currentTime
    this.$route('/pages/TC/pages/chooseService/chooseService', {customerId, dueTime})
  }
})