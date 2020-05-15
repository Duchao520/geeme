// pages/UIC/pages/UsersMyAssets/components/WalletAuth/WalletAuth.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    SUBMIT_SWITCHER: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    scrolToLowerEvent(){
      this.setData({SUBMIT_SWITCHER: true})
    },
    close(){
      this.setData({ isShow: false});
    },
    submit(){
      let { SUBMIT_SWITCHER} = this.data;
      if (SUBMIT_SWITCHER){
        this.triggerEvent('submit');
      }else{
        wx.showToast({
          title: '请先阅读本协议至底部',
          icon: 'none'
        })
      }
    }
  }
})
