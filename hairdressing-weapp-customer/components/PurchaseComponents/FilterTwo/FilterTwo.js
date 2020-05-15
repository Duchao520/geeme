// components/Common/FilterSingle/FilterSingle.js
Component({

  /**
   * 组件初次渲染生命周期
   */
  attached: function () {
    this.triggerEvent('setTwoCurrent', this.properties.listTwo[0])
  },

  /**
   * 组件卸载生命周期
   */
  detached: function () {

  },
  /**
   * 组件的属性列表
   */
  properties: {
    flagTwo: {
      type: Boolean,
      value: false
    },
    listTwo: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setTwoCurrent(e) {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      })
      let current = e.currentTarget.dataset.name
      this.triggerEvent('setTwoCurrent', current)
    }
  }
})
