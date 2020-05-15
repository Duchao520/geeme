// pages/TC/pages/choosehair/choosehair.js
const util = require('../../../../utils/util.js');
const apiAction = require('../../../../utils/apiAction.js');
Page({
  data: {
    currentid: null,
    hairname: '',
    hairlist: [],
    // 店铺id
    shopId: 1,
    // 当前时间
    dueTime: '',
    // 是否必选服务者
    chooseServer: false,
  },
  onLoad(options) {
    // this.data.shopId = wx.$getStorage('storeId')
    this.setData({
      chooseServer: JSON.parse(options.chooseServer),
    })
    this.gethairlist()
  },

  /**
   * 从本地拿出时间给后台，筛选出这个时间段的所有发型师
   */
  gethairlist() {
    let appointment = wx.getStorageSync('appointment')
    this.setData({
      dueTime: appointment.dueTime
    }, () => {
      let currenttime = appointment.dueTime.split(' ');
      let timeDate = currenttime[0].split('/').join('-');
      let timeMin = currenttime[1];
      let time = timeDate + ' ' + timeMin;
      let params = {
        storeId: appointment.storeId,
        appointmentTime: time
      }
      wx.showLoading()
      apiAction.weListAvailableStaffByAppointTime(params).then(data => {
        wx.hideLoading()
        if (!data.staffInfoForAppointments.length) {
          this.nextnohair()
        } else {
          this.setData({
            hairlist: data.staffInfoForAppointments
          })
        }
      })
    })
  },

  /**
   * 点击发型师列表
   */
  setcurrenthair(e) {
    let item = e.currentTarget.dataset.item
    let id = item.staffId
    let hairname = item.name
    this.setData({
      currentid: id,
      hairname: hairname
    })
  },

  /**
   * 点击下一步
   */
  next() {
    if (this.data.currentid) {
      util.addhair(this.data.currentid)
      wx.navigateTo({
        url: '/pages/TC/pages/choosepackage/choosepackage?shopid=' + this.data.shopid
      })
    } else {
      wx.showToast({
        title: '亲，还没选择服务者哦',
        icon: 'none'
      })
    }

  },
  // 不知道选谁
  nextnohair() {
    let appointment = wx.$getStorage('appointment');
    delete appointment.staffId
    appointment.staffIdList = []
    for(const v of this.data.hairlist){
      appointment.staffIdList.push(v.staffId)
    }
    wx.$setStorage('appointment', appointment);
    this.$route('/pages/TC/pages/choosepackage/choosepackage', {
      shopid: this.data.shopid
    })
  },
})