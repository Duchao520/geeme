// pages/UIC/pages/Recharge/Recharge.js
var apiAction = null;
Page({

  data: {
    amount: null
  },

  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
  },
  onUnload() {          //清内存
    apiAction = null;
    this.data = null;
  },
  bindAmount(event){
    let {value} = event.detail;
    this.setData({
      amount: value
    })
  },
  submit(){
    let {amount} = this.data;
    let params = {};
    if (Number(amount) > 0){
      params.amount = amount;
      apiAction.weCashInByWechat(params).then(res => {
        wx.showToast({
          title: '充值成功'
        })
        wx.navigateBack();
      })
    }
  }
})