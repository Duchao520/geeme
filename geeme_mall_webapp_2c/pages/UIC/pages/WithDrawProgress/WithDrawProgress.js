var apiAction = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordId: null,
    infoList: []     //提现进度列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');

    this.data.recordId = options.recordId;
    this.weGetApplyProgress().then(res => {
      this.setData(res)
    })
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    apiAction = null;
    this.data = null;
  },
  
  /**
   * 根据申请记录Id获取申请进度
   */
  weGetApplyProgress(){
    return apiAction.weGetApplyProgress(this.data.recordId).then(res => {
      if(res.infoList){
        return { infoList: res.infoList.reverse()}
      }else{
        return {}
      }
    })
  }
})