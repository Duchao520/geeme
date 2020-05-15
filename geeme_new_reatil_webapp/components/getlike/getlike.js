// components/getlike/getlike.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    likeList:{
      type:Array,
      value:[]
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
    clickService(e){
      this.triggerEvent('clickGetLike',e.currentTarget.dataset.id)
    }
  }
})