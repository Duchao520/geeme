// components/Card/VipSingleCard/VipSingleCard.js
Component({
  lifetimes: {
    attached() {
      getApp().getBrand(brand => {
        this.$setData({
          logo: brand.logo
        })
      })
    }
  },
  properties: {
    item: Object,
    logo: String
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
    jumpCardDetail() {
      this.$route('/pages/VIP/pages/VipCardDetail/VipCardDetail', { id: this.data.item.id })
    }
  }
})
