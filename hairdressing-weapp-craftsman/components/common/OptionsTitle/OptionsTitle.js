// components/common/OptionsTitle/OptionsTitle.js
Component({
  /**
   * 外部样式类
   */
  externalClasses:['options-icon'],
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:null
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
     * 点击事件
     */
    tomoudleList(){
      this.triggerEvent('tomoudleList')
    }
  }
})
