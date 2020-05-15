// pages/UIC/pages/setPayPwd2/setPayPwd2.js
Page({
  data: {
    focus:true,
    password:'',
  },
  input(e){
    const value = e.detail.value
    this.$setData({
      password: value
    })
    if (value.length == 6){
      this.$route("/pages/UIC/pages/setPayPwd3/setPayPwd3", {password:value})
    }
  },
  inputFocus(){
    this.$setData({
      focus:true
    })
  }
})