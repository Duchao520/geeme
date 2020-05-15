const util = require('../utils/util.js')
const app = getApp();

Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    tabBar: [
      {
        pagePath: "/pages/tabBar/home/index/index",
        text: "首页",
        iconPath: "/images/tabbar/tab10.png",
        selectedIconPath: "/images/tabbar/tab11.png",
        showFlag: 1
      },
      {
        pagePath: "/pages/tabBar/appointment/index/index",
        text: "预约",
        iconPath: "/images/tabbar/tab20.png",
        selectedIconPath: "/images/tabbar/tab21.png",
        showFlag: 1
      },
      {
        pagePath: "/pages/tabBar/dynamic/index/index",
        text: "发现",
        iconPath: "/images/tabbar/tab30.png",
        selectedIconPath: "/images/tabbar/tab31.png",
        showFlag: 1
      },
      {
        pagePath: "/pages/tabBar/shopCar/index/index",
        text: "购物车",
        iconPath: "/images/tabbar/tab30.png",
        selectedIconPath: "/images/tabbar/tab31.png",
        showFlag: 1
      },
      {
        pagePath: "/pages/tabBar/my/index/index",
        text: "我的",
        iconPath: "/images/tabbar/tab40.png",
        selectedIconPath: "/images/tabbar/tab41.png",
        showFlag: 1
      }
    ]
  },
  ready() {
    let tabBar = wx.$getStorage('tabBar').length > 0 ? wx.$getStorage('tabBar') : this.data.tabBar, themeId = wx.$getStorage('themeId') ? wx.$getStorage('themeId') : 1;
    this.setData({ tabBar, selectedColor: util.getSkin(themeId).color1 })
    wx.$event.once('setTabBar', () => {
      tabBar = wx.$getStorage('tabBar').length > 0 ? wx.$getStorage('tabBar') : this.data.tabBar, themeId = wx.$getStorage('themeId') ? wx.$getStorage('themeId') : 1;
      this.setData({ tabBar, selectedColor: util.getSkin(themeId).color1 })
    })
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      app.globalData.selected = data.index;
      this.setData({
        selected: data.index
      })
    }
  }
})