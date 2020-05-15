// pages/TC/pages/choosehair/choosehair.js
const util = require('../../../../utils/util.js');
const apiAction = require('../../../../utils/apiAction.js');
Page({
  data: {
    //服务的信息
    serviceInfo: {},
    currentId: null,
    hairname: '',
    hairList: []
  },
  onLoad(options) {
    // this.getService();
    this.getStaffList();
  },
  /**
   * 请求服务数据
   */
  getService() {
    let appointment = wx.$getStorage('appointment');
    apiAction.getServiceInfoBySpecificationIdList([appointment.specificationList[0].specificationId]).then( data => {
      this.setData({
        serviceInfo: data.services[0]
      })
    })
  },
  /**
   * 请求发型师数据
   */
  getStaffList() {
    let appointment = wx.$getStorage('appointment');
    apiAction.weListAvailableStaffByServiceId(appointment.storeId, appointment.specificationList[0].serviceId).then( data => {
      this.setData({
        hairList: data.staffInfoForAppointments
      })
    })
  },

  /**
   * 选中服务者
   */
  sethair(res) {
    const {id, name} = res.currentTarget.dataset
    this.setData({
      currentId: id,
      hairname: name
    })
  },

  /**
   * 点击下一步
   */
  clickNext() {
    if(!this.data.currentId){
      wx.showToast({
        title: '请选择服务者',
        icon:'none'
      })
      return
    }
    const appointment = wx.$getStorage('appointment')
    util.addhair(this.data.currentId, appointment.storeId)
    wx.navigateTo({
      url: '/pages/TC/pages/choosetime/choosetime'
    })
  },


})