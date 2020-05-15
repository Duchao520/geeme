Component({
  
  properties: {
    list: Array,
    columnSpace: { // 两列之间的间隙
      type: String,
      value: '20rpx'
    },
    key:String
  },
  data: {
    _list: [], // 处理后的数组
    renderIndex: 0, // 下次渲染的数组下标
    isReady: false,
  },
  observers: {
    // 'list'(n) {
    //   this.data.renderIndex = 0;
    //   if (n && this.data.isReady) {
    //     if (n.length) {
    //       this.render(n.length)
    //     } else {
    //       this.data.renderIndex = 0
    //       this.setData({
    //         _list: []
    //       })
    //     }
    //   }
    // }
  },
  methods: {
    // render(length) {
    //   if (this.data.renderIndex === length) {
    //     this.data.isReady = true
    //     return
    //   }
    //   const item = this.data.list[this.data.renderIndex]
    //   if (!item) return
    //   const query = this.createSelectorQuery().in(this)
    //   query.selectAll('.column-inner').boundingClientRect().exec(res => {
    //     res = res[0]
    //     item._columnPosition = res[0].height <= res[1].height ? 'left' : 'right'
    //     const attr = `_list[${this.data.renderIndex}]`
    //     this.setData({
    //       [attr]: item
    //     })
    //     this.data.renderIndex++
    //     wx.nextTick(() => {
    //       this.render(length)
    //     })
    //   })
    // },
  }
})