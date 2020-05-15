require('/lib/SPage.js')
const apiAction = require('/utils/apiAction.js')
const util = require('/utils/util.js')
const mixinAll = {
  $previewImage(e) {
    const data = e.currentTarget.dataset
    if (!data.hasOwnProperty('urls') || !data.hasOwnProperty('current')) return
    const { urls, current } = data
    wx.previewImage({
      urls,
      current,
    })
  },
  $wait() {
    wx.showToast({
      title: '披星戴月开发中...',
      icon: 'none'
    })
  },
  $set(e) {
    const data = e.currentTarget.dataset
    if (!data.hasOwnProperty('key') || !data.hasOwnProperty('value')) return
    const { key, value } = data
    this.$setData({
      [key]: value
    })
  }
}
App({
  $mixinP: {
    ...mixinAll
  },
  $mixinC:{
    methods:{
      ...mixinAll
    }
  },
  onLaunch() {
    initApp()
    // 进入小程序添加成长值
    // this.initThemeSkin();
    wx.onMemoryWarning(function (level) {
      wx.showToast({
        title: level
      })
    })
    apiAction.addExpAfterAccessStore()
    apiAction.getIndustryList();       //存储行业列表
  },
  // 初始化主题皮肤
  initThemeSkin() {
    // 设置tabBar
    // 获取主题配色
    this.getBrand(brand => {
      util.PromiseAll([apiAction.getBrandThemeByAppId(), apiAction.getBrandWeAppletMenuSettingSelfApiByBrandId(brand.brandId)]).then(data => {
        this.setTheme(data)
      }).catch(error => {
        console.log(error)
      })
    })
  },
  // 设置tabBar
  setTabBar() {
    wx.showTabBar()
    if (wx.$getStorage('tabBar')) {
      const tabBar = wx.$getStorage('tabBar')
      let params
      for (let i = 0; i < tabBar.length; i++) {
        params = {
          index: i,
          text: tabBar[i].text
        }
        if (tabBar[i].iconPath) params.iconPath = tabBar[i].iconPath
        if (tabBar[i].selectedIconPath) params.selectedIconPath = tabBar[i].selectedIconPath
        wx.setTabBarItem(params)
      }
      wx.setTabBarStyle({
        selectedColor: util.getSkin(wx.$getStorage('themeId')).color1
      })
    }
  },
  setShopInfo(storeId, fn) {
    wx.$setStorage('storeId', storeId)
    apiAction.getShopInfo(wx.$getStorage('storeId')).then(data => {
      data.workDays = util.weekListFunc(data.workDays)
      this.globalData.shopInfo = data
      fn && fn(data)
    })
  },
  // 获取当前门店的信息
  getShopInfo(fn) {
    // 若有shopInfo全局变量，则取全局变量
    if (this.globalData.shopInfo) {
      fn && fn(this.globalData.shopInfo)
      return
    } else {
      let promise
      // 若本地缓存storeId
      if (wx.$getStorage('storeId')) {
        promise = new Promise(resolve => {
          apiAction.getShopInfo(wx.$getStorage('storeId')).then(data => {
            // 若缓存的门店已下线，则清空storeId并重新执行该方法
            if (data.status == 'ONLINE' || data.status == 'TRYING'){
              resolve(data)
            }else{
              wx.removeStorageSync('storeId')
              this.getShopInfo(fn)
            }
          })
        })
      // 若本地无缓存storeId
      } else {
        promise = new Promise(resolve => {
          apiAction.getRecommendStoreList().then(data => {
            // 若有推荐门店，则取推荐门店的第一家店赋值全局shopInfo变量，并缓存此门店id
            if (data.storeInfoList && data.storeInfoList.length) {
              const shopInfo = data.storeInfoList[0]
              wx.$setStorage('storeId', shopInfo.id)
              resolve(shopInfo)
              // 若无推荐门店，跳转选择门店页面
            } else {
              apiAction.getSimpleShopList().then(data => {
                if (data._onlineAmount) {
                  wx.$place('shopList', data)
                  wx.reLaunch({
                    url: '/pages/SC/pages/shopcate/shopcate',
                  })
                } else {
                  resolve(null)
                }
              })
            }
          })
        })
      }
      promise.then(shopInfo => {
        if (shopInfo) {
          shopInfo.workDays = util.weekListFunc(shopInfo.workDays)
        }
        this.globalData.shopInfo = shopInfo
        fn && fn(shopInfo)
      })
    }
  },
  setUserInfo() {
    apiAction.getPersonalInfo(wx.$getStorage('storeId')).then(data => {
      this.globalData.userInfo = data
    })
  },
  getUserInfo(fn) {
    if (!this.globalData.userInfo) {
      apiAction.getPersonalInfo(wx.$getStorage('storeId')).then(data => {
        this.globalData.userInfo = data
        fn && fn(this.globalData.userInfo)
      })
    } else {
      fn && fn(this.globalData.userInfo)
    }
  },
  getBrand(fn) {
    if (!this.globalData.brandInfo) {
      apiAction.getBrandInfo().then(data => {
        if (!data.name) {
          wx.showToast({
            title: '获取品牌信息失败，请稍后再试',
            icon: 'none'
          })
          return
        }
        this.globalData.brandInfo = data
        fn && fn(data)
      })
    } else {
      fn && fn(this.globalData.brandInfo)
    }
  },
  getPhone(fn) {
    return new Promise((resolve,reject) => {
      if (!this.globalData.phone) {
        apiAction.getCurrentUserMobile().then(data => {
          this.globalData.phone = data.mobile
          fn && fn(data.mobile)
          resolve(data.mobile)
        })
      } else {
        fn && fn(this.globalData.phone)
        resolve(this.globalData.phone)
      }
    })
  },
  //@type {String} - ['store', 'purchase']
  addSearchHistory(type, keyword) {
    const key = 'searchHistory_' + type
    // 添加到历史搜索中
    const searchHistory = this.getSearchHistory(type)
    if (searchHistory.length >= 10) {
      searchHistory.pop();
    }
    for (const v of searchHistory) {
      if (v === keyword) {
        return false
      }
    }
    searchHistory.unshift(keyword);
    wx.$setStorage(key, searchHistory)
    return true
  },
  getSearchHistory(type) {
    const key = 'searchHistory_' + type
    return wx.$getStorage(key) || []
  },
  clearSearchHistory(type) {
    const key = 'searchHistory_' + type
    wx.$setStorage(key, [])
  },
  globalData: {
    phone: null, // 顾客手机
    shopInfo: null,
    userInfo: null,
    brandInfo: null, // 品牌信息,
    selected: 0,
    channel: {
      type: '',
      storeId: 0
    },
    fromOrderAppointment: {
      orderId: 0
    },
    // 产品或服务确认订单信息
    productConfirm: null,
    // 预约创建订单信息
    appointmentConfirm: null,
    // 预支付账单信息
    payConfirm: null,
    // 账单相关信息
    bill: {
      type: '', // goods:产品 service:服务 appointment:预约 bill:账单 card:购买会员卡 recharge:充值会员卡 
      info: null, // info.promotion --- group:团购
    },
    shopCar: {        //购物车
      infoList: []
    }
  },
  setTheme(data) {
    function formatNumber(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }

    const themeId = data.themeId

    const tabBar = data.menuSettingSelfApiList || new Array(5)

    const iconPath = 'https://image.geeme.cn/icon_nav24_9/icon_nav'

    // 保存icon
    function saveIcon(i) {
      let _themeId
      for (let j = 0; j < 2; j++) {
        _themeId = j == 0 ? '00' : formatNumber(themeId)
        let _iconPath = j == 0 ? 'iconPath' : 'selectedIconPath'
        tabBar[i][_iconPath] = `${iconPath}${_themeId}_${formatNumber(tabBar[i].showIcon)}.png`

        wx.$setStorage('tabBar', tabBar)
        wx.setTabBarItem({
          index: i,
          [_iconPath]: tabBar[i][_iconPath],
          text: tabBar[i].showName
        })
      }
    }

    for (let i = 0; i < tabBar.length; i++) {
      saveIcon(i)
    }


    // 设置tabBar文字颜色
    wx.setTabBarStyle({
      selectedColor: util.getSkin(themeId).color1
    })
    wx.$setStorage('themeId', themeId)
    wx.$event.emit('setThemeId')
    wx.$event.emit('setTabBar')
  }
})

function initApp() {
  let loadingFlag = false
  wx.$showLoading = function () {
    if (!loadingFlag) {
      loadingFlag = true
      wx.showLoading()
    }
  }

  wx.$hideLoading = function () {
    if (loadingFlag) {
      loadingFlag = false
      wx.hideLoading()
    }
  }

  wx.$toast = function (msg, type) {
    wx.showToast({
      title: msg,
      icon: type || 'none'
    })
  }

  wx.$setStorage = function (key, data) {
    wx.setStorageSync(key, data)
  }
  wx.$getStorage = function (key) {
    return wx.getStorageSync(key)
  }

  wx.$http.config.baseUrl = wx.baseUrl

  wx.$http.interceptors.request.use(config => {
    if (wx.$getStorage('authorization')) {
      config.header.Authorization = wx.$getStorage('authorization')
    }
    return config
  })

  wx.$http.interceptors.response.use(res => {
    if (res.header.Authorization) {
      wx.$setStorage('authorization', res.header.Authorization)
    }
    return res
  }, res => {
    let errmsg
    if (res && res.statusCode) {
      switch (res.statusCode) {
        case 400: errmsg = '请求错误'; break;
        case 401: break;
        case 403: errmsg = '拒绝访问'; break;
        case 404: errmsg = '请求出错'; break;
        case 408: errmsg = '请求超时'; break;
        case 500: errmsg = '服务器错误'; break;
        case 501: errmsg = '服务未实现'; break;
        case 502: errmsg = '网络错误'; break;
        case 503: errmsg = '服务不可用'; break;
        case 504: errmsg = '网络超时'; break;
        case 505: errmsg = 'HTTP版本不受支持'; break;
        default: errmsg = `连接出错(${res.errMsg})!`;
      }
    } else {
      errmsg = '连接服务器失败！'
    }
    wx.$toast(errmsg)
    return res
  })
}