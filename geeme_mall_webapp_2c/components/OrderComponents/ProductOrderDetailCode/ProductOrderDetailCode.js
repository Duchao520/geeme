// components/OrderComponents/ProductOrderDetailCode/ProductOrderDetailCode.js
Component({
  properties: {
    info:{
      type:Object,
      value:null
    }
  },
  data: {
    
  },
  methods: {
    copy(){
      wx.setClipboardData({
        data: this.data.info.code,
        success(){
          wx.showToast({
            title: '复制成功',
            icon:'none'
          })
        }
      })
    }
  }
})
