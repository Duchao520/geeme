// components/App/AppDefault/AppDefault.js
Component({
  properties: {
    top: {
      type: String,
      value: '200rpx'
    },
    image: {
      type: String,
      value: '/images/default/default.png'
    },
    text: {
      type: String,
      value: '暂无数据'
    },
    button: String,
  },
  methods: {
    clickBtn() {
      this.triggerEvent('click')
    }
  }
})
