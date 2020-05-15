// pages/UIC/pages/Recharge/Recharge.js
var apiAction = null;
Page({
  data: {
    FormData: {
      accountName: null,
      accountNum: null,
      bankName: null,
      cashAmount: null,
      openingBank: null
    },
    submitSwitcher: false
  },

  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
  },
  onUnload() {          //清内存
    apiAction = null;
    this.data = null;
  },
  bindValue(event) {
    let { key } = event.target.dataset ,
        { value } = event.detail,
        { FormData } = this.data;
    FormData[key] = value.replace(/\s/g, "");  //过滤空格
    this.setData({
      FormData: FormData,
      submitSwitcher: this.valiData()
    });
  },
  valiData(){
    let {FormData} = this.data;
    for (var i in FormData){
      if(FormData[i] == 'null' || !FormData[i]) {
        return false
      };
      switch(FormData[i]){
        case 'cashAmount':
          if(Number(FormData[i]) <= 0) return false;
      }
    }
    return true;
  },
  submit() {
    let { submitSwitcher , FormData} = this.data;
    if(!submitSwitcher) return;
    this.setData({submitSwitcher: false})
    try{
      apiAction.weCreateCashOutApplyRecord(FormData).then(res => {
        if (res.success) {
          wx.showToast({
            title: '提现申请已提交',
            success(){
              setTimeout(() => {
                wx.navigateBack();
              },1500)
            }
          })
        }else{
          wx.showToast({
            title: '余额不足',
            image: '/images/icon_warning.png'
          })
        }
      })
    }finally{
      this.setData({ submitSwitcher: true })
    }
  },
  navigateToWithdrawRecord(){
    wx.$route('/pages/UIC/pages/WithDrawRecord/WithDrawRecord')
  }
})