// pages/UIC//pages/myFocus/myFocus.js
var apiAction = null, util = null;
Page({
  data: {
    keyword:'',
    list:null,
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    this.fetch().then(res => {
      this.$setData(res)
    })
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    this.data = null;
  },
  fetch(){
    const params = {
      nickName:this.data.keyword,
      storeId: wx.$getStorage('storeId')
    }

    wx.$showLoading()
    return apiAction.weListAvailableStaffAttentived(params).then( data => {
      wx.$hideLoading()
      return {
        list: data.staffInfoForAppointments
      }
    })
  },
  search(e){
    this.data.keyword = e.detail
    this.setData({
      list:[]
    })
    this.fetch().then(res => {
      this.$setData(res)
    })
  }
})