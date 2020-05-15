// components/VipComponents/VipCardPay/VipCardPay.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 弹框的显示
    flagPay:{
      type:Boolean,
      value:false
    },
    // 支付金额
    payNumber:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * moveBox的回调函数，关闭弹窗
     */
    close(){
      this.triggerEvent('closePay')
    },
    /**
     * 点击确认支付
     * 返回支付方式和充值金额
     */
    toPay(){
      let payType = 'WEI_XIN';
      let payNumber = this.data.payNumber;
      this.triggerEvent('toPay',{payType,payNumber})
    },

    /**
     * moveBox的回调函数，返回
     */
    bindgoBack(){
      this.triggerEvent('goBack')
    }

  }
})
