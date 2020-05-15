// components/Common/OffLineDefault/OffLineDefault.js
Component({
  properties: {
    top: {
      type: String,
      value: '200rpx'
    }
  },
  methods: {
    jumpUC() {
      wx.switchTab({
        url: '/pages/tabBar/my/index/index',
      })
    }
  }
})
