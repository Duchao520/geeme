// pages/RC/pages/updateStaff/updateStaff.js
const apiAction = require('../../../../utils/apiAction.js');
Page({
  $name:'updateStaff',
  data: {
    staffList: [],
    currentId: null,
    currentName: '',
    currentLevelId:null,
  },
  onLoad(options) {
    this.fetchData(options)
  },
  // 获取指定时间可预约服务者列表
  fetchData(options) {
    const { dueTime, storeId } = options
    const params = {
      appointmentTime: dueTime,
      storeId
    }
    apiAction.weListAvailableStaffByAppointTime(params).then( data => {
      this.$setData({
        staffList: data.staffInfoForAppointments
      })
    })
  },
  /**
   * 设置当前选中的发型师
   */
  setCurrentId(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      currentId: item.staffId,
      currentName: item.name,
      currentLevelId: item.levelId
    })
  },

  /**
   * 点击确认更换
   */
  clickNext() {
    wx.$event.emit('updateStaff', { staffId: this.data.currentId, levelId:this.data.currentLevelId})
    wx.navigateBack({
      delta:1
    })
  },
})