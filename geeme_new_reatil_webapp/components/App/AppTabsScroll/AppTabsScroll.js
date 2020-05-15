// components/App/AppTabs/AppTabs.js
Component({
  lifetimes: {
    ready() {
      this.moveActiveLine(this.data.currentTab)
    }
  },
  properties: {
    tabs: Array,
    currentTab: {
      type: Number,
      value: 0
    },
    padding: {
      type: String,
      value: '20rpx'
    }
  },
  data: {
    // activeLine的css宽度
    LINEWIDTH: 28,
    // 动态改变activeLine的left属性
    lineLeft: '0px',
    // 防抖用
    timer: null,
  },
  observers: {
    'currentTab'(newValue) {
      if (newValue >= 0) {
        this.moveActiveLine(newValue)
      }
    }
  },
  methods: {
    // 点击切换tab
    switchTab(e) {
      const { index, id, type } = e.currentTarget.dataset
      if (this.data.currentTab == index) return;
      this.emitSwitchTab(index, id, type);
      this.setData({
        currentTab: index
      })
    },
    // 移动activeLine
    moveActiveLine(index) {
      this.createSelectorQuery().selectAll('.hiddenLine').boundingClientRect().exec(res => {
        const lines = res[0]
        if (!lines.length) return
        let lineLeft = lines[index].left
        this.createSelectorQuery().selectAll('.tabs-container').boundingClientRect().exec(res => {
          const containerLeft = res[0][0].left
          this.setData({
            lineLeft: lineLeft - containerLeft + (lines[index].width - 26) / 2 + 'px'
          })
        })
      })
    },
    // 触发监听事件
    emitSwitchTab(index, id, type) {
      // 防抖
      if (this.data.timer) {
        clearTimeout(this.data.timer)
      }
      this.data.timer = setTimeout(() => {
        this.triggerEvent('switchTab', { index, id, type });
      }, 300)
    }
  }
})
