//app.js
require('/lib/SPage.js')
const fetch = require('./utils/fetch.js')
const mixinAll = {
  $previewImage(e) {
    const data = e.currentTarget.dataset
    if (!data.hasOwnProperty('urls') || !data.hasOwnProperty('current')) return
    const { urls, current } = data
    console.log(current, urls)
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
  $mixinC: {
    methods: {
      ...mixinAll
    }
  },
  onLaunch() {
    initApp()
    Date.prototype.Format = function(fmt) {
      var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
  },
  // 获取服务者信息
  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
  },
  getUserInfo(fn) {
    if (!this.globalData.userInfo) {
      fetch.personalData4Edit().then(data => {
        this.globalData.userInfo = data
        fn && fn(data)
      })
    } else {
      fn && fn(this.globalData.userInfo)
    }
  },
  setBrandInfo(fn) {
    fetch.getBrandInfoByStoreId().then(data => {
      this.globalData.brandInfo = data
      fn && fn()
    })
  },
  getBrandInfo(fn) {
    if (!this.globalData.brandInfo) {
      fetch.getBrandInfoByStoreId().then(data => {
        this.globalData.brandInfo = data
        fn && fn(data)
      })
    } else {
      fn && fn(this.globalData.brandInfo)
    }
  },
  // 登录并选择门店后初始化信息
  initStorage(store){
    wx.$setStorage('brandId', store.brandId);
    wx.$setStorage('storeId', store.storeId)
    wx.$setStorage('staffId', store.staffId)
    wx.$setStorage('storeInfo', store)
  },
  globalData: {
    brandInfo: null,
    userInfo: null,
    // 日历插件模块
    dateInfo: {
      startDate: null, //开始时间
      clickBefore: false //是否可以选择以前时间
    },
    // 提交预约模块
    appointment: {

    },
    // 修改预约模块
    updateAppointment: {

    },
    // 开单模块
    consumptionBill: {
      customerId: null
    },
    // 发布作品模块
    releaseWorksMoudle: {
      tags: [],
      storeId: wx.getStorageSync('storeId'),
      services: 0,
      products: [],
      photos: [],
      orders: [],
      description: null
    },
  },
})

function initApp(){
  console.log('initApp')
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
    if(!msg) return
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
        case 404: errmsg = ''; break;
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