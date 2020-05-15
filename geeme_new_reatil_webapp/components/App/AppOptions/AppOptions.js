// components/App/AppOptions/AppOptions.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    options: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeIndex: 0,
    left: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e){
      let { index } = e.currentTarget.dataset;
      this.setData({activeIndex: index,left: index * 25 + '%'});
      this.triggerEvent('switch',{index:index});
    }
  }
})
