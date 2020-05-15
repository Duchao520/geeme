// components/App/AppNavigationBar/AppNavigationBar.js
Component({
  pageLifetimes:{
    show(){
      let __navBarInfo
      if (wx.__navBarInfo) {
        this.setData(wx.__navBarInfo)
      } else {
        function getNavBarInfo(){
          let rect = wx.getMenuButtonBoundingClientRect()
          if(rect.top === 0 || rect.height === 0) return false
          let statusBarHeight = wx.getSystemInfoSync().statusBarHeight
          let gap = rect.top - statusBarHeight //动态计算每台手机状态栏到胶囊按钮间距
          let navBarHeight = 2 * gap + rect.height //导航栏高度

          wx.__navBarInfo = {
            navBarHeight: navBarHeight,
            statusBarHeight: statusBarHeight,
            gap,
            menuBtnHeight: rect.height,
          }
          return true
        }
        // 以下处理都是为了解决坑爹的微信bug。(wx.getMenuButtonBoundingClientRect接口获取到的数值有时为0)
        setTimeout( () => {
          while (!getNavBarInfo()){}
          this.setData(wx.__navBarInfo)
        }, 100)
      }
      this.setData({
        isHome: getCurrentPages().length === 1
      })
    }
  },
  properties: {
    onNavigateBack:{
      type:Boolean,
      value:false
    },
    title:String,
  },
  data: {
    navBarHeight:0,
    statusBarHeight:0,
    gap:0,
    menuBtnHeight:0,
  },
  methods: {
    navigateBack(){
      if(this.data.onNavigateBack){
        this.triggerEvent('navigateBack')
      }else{
        wx.navigateBack({
          delta:1
        })
      }
    }
  }
})
