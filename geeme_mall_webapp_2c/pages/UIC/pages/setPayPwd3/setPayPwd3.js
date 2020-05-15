// pages/UIC/pages/setPayPwd2/setPayPwd2.js
const apiAction = require('../../../../utils/apiAction.js')
Page({
  data: {
    focus: true,
    password: '',
  },
  onLoad(options){
    this._password = options.password
  },
  input(e) {
    this.$setData({
      password: e.detail.value
    })
  },
  inputFocus() {
    this.$setData({
      focus: true
    })
  },
  confirm(){
    if(this._password == this.data.password){
      apiAction.brandCustomerCommitPayPassword(this.data.password).then( data => {
        if(data.success){
          wx.showToast({
            title: '设置支付密码成功',
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 3
            })
          }, 1000)
        }else{
          wx.showToast({
            title: data.message,
            icon:'none'
          })
        }
      })
    }else{
      wx.showToast({
        title: '输入密码不一致',
        icon:'none'
      })
    }
  }
})