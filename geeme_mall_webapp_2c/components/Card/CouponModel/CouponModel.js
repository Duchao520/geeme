// components/Card/CouponModel/CouponModel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coupon: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    popAll: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    displayAll(e) {
      let { authority } = e.currentTarget.dataset;
      if (authority == 1) return;
      this.$setData({
        popAll: true
      })
    }
  }
})
