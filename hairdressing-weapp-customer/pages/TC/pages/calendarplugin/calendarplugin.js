// pages/TC/pages/calendarplugin/calendarplugin.js
Page({
  data: {
    list: null,
  },
  onLoad(){
    this.getdate()
  },
  
  /**
   * 点击下个月事件
   */
  nextMonth(e){
    let detail = e.detail;
    let clickDate = detail.currentYear + '/' + detail.currentMonth
    let currentDate = new Date().toLocaleDateString();
    currentDate = currentDate.slice(0,6)
    if(clickDate != currentDate){
      this.setData({
        list:[]
      })
    }else{
      this.getdate();
    }
  },


  /**
   * 点击上个月事件
   */
  prevMonth(e){
    let detail = e.detail;
    let clickDate = detail.currentYear + '/' + detail.currentMonth
    let currentDate = new Date().toLocaleDateString();
    currentDate = currentDate.slice(0, 6)
    if (clickDate != currentDate) {
      
      this.setData({
        list: []
      })
    } else {
 
      this.getdate();
    }
  },

  /**
   * 推算日历的今天和明天的日期 
   */
  getdate() {
    let nowdate = new Date().toLocaleDateString();
    let nextdate = new Date(nowdate);
    nextdate = +nextdate + 1000 * 60 * 60 * 24;
    nextdate = new Date(nextdate).toLocaleDateString();
    nowdate = nowdate.slice(7, 9)
    nextdate = nextdate.slice(7, 9)
    let arr = [{
      month: 'current',
      day: nowdate,
      color: '#FE5180',
      background: '#FFEFF4'
    }, 
    // {
    //   month: 'current',
    //   day: nextdate,
    //   color: '#FE5180',
    //   background: '#FFEFF4'
    // }
    ];
    this.setData({
      list: arr
    })
  },

  /**
   * 日历具体某一天的事件 
   */
  dayClick(e) {
    let nowdate = new Date().toLocaleDateString();
    let a = String(nowdate)
    let nowdates = new Date(a).valueOf()
    let event = e.detail;
    let str = event.year + '/' + event.month + '/' + event.day;
    let prevdate = new Date(str).valueOf()
    if (prevdate < nowdates) {
      wx.showToast({
        title: '对不起该时间已过期，请重新选择',
        icon: 'none'
      })
      return
    }
    wx.$event.emit('setCalendar', str)
    wx.navigateBack({
      delta: 1
    })
  },
})