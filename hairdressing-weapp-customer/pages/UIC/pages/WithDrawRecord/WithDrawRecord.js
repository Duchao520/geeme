var apiAction = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoList: []    ///提现记录列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    this.weGetCashOutApplyRecord().then(res => {
      this.setData(res);
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /** 获取提现记录*/
  weGetCashOutApplyRecord(){
    return apiAction.weGetCashOutApplyRecord().then(res => {
      if (res.infoList){
        return {infoList: res.infoList}
      }else{
        return {}
      }
    })
  },
  navigateToProgress(e){
    let {id} = e.currentTarget.dataset;
    wx.$route('/pages/UIC/pages/WithDrawProgress/WithDrawProgress',{recordId: id})
  }
})