// components/common/SearchInput/SearchInput.js
Component({
  /**
   * 外部样式类
   */
  externalClasses:['input-view'],
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:null
    },
    icon:{
      type:Boolean,
      vlaue:true
    },
    value:{
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
    searchInput(e){
 
      this.triggerEvent('searchInput',e.detail.value)
    }
  }
})
