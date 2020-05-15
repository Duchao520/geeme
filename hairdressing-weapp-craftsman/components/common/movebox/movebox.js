// components/movebox/movebox.js
Component({
  /**
   * 启用多slot支持
   */
  options:{
    multipleSlots:true
  },
  properties: {
    flag:{
      type:Boolean,
      value:false
    },
    title:{
      type:String,
      value:'修改预约时间'
    }
  },
  data: {

  },
  methods: {
    close(){
      this.triggerEvent('close')
    },
    canendar(){
      wx.navigateTo({
        url: '/pages/TC/pages/calendarplugin/calendarplugin'
      })
    },
    /**
     * 选择支付方式的返回icon的回调函数
     */
    goBack(){
      this.triggerEvent('goBack')
    }
  }
})
