// components/choose/choose.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      show:{
        type:Number,
        value:2
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:0,
    trans:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jumpchoose(e) {
      let index = e.currentTarget.dataset.index;
      this.setData({
        show:index
      })
    } 
  } 
})
