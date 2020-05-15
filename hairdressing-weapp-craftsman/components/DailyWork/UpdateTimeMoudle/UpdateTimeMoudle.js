// components/DailyWork/UpdateTimeMoudle/UpdateTimeMoudle.js
Component({

  /**
   * 组件挂载之后执行
   */
  attached:function(){
  },

  /**
   * 组件移除执行
   */
  detached:function(){

  },

  /**
   * 组件的属性列表
   */
  properties: {
    isShow:{
      type:Boolean,
      value:false
    },
    startDate:{
      type:String,
      value:new Date().toLocaleDateString()
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
     * DateHeadAfter->点击返回当前日期
     */
    setCurrentDate(e) {
      this.getCurrentTimeByCurrnetDate();
    },

    /**
     * 请求当前日期对应的时间
     */
    getCurrentTimeByCurrnetDate(e){
      console.log('请求时间成功')
    },

    /**
     * 点击关闭
     */
    close(){
      this.triggerEvent('close')
    }
  }
})
