// pages/Login/chooseBrandStore/chooseBrandStore.js
const fetch = require('../../../utils/fetch.js')
const app = getApp()
Page({
  $name:'chooseBrandStore',
  data: {
    brandList: [],
    currentStoreId:0,
  },
  onLoad(options) {
    this.$setData({
      currentStoreId: wx.$getStorage('storeId')
    })
    // 若从登录页面来则已保存brandList
    const brandList = this.$take('brandList')
    if(brandList){
      this.$setData({
        brandList
      })
    }else{
      fetch.getBrandAndStroeByUserId().then(data => {
        this.setData({
          brandList: data.brandList || data
        })
      })
    }
  },
  // 选择品牌/门店
  setBrandAndStore(e) {
    const store = e.currentTarget.dataset.store
    if(store.status != 'ONLINE' && store.status != 'TRYING'){
      return wx.showToast({
        title: '该门店已暂停营业',
        icon:'none'
      })
    }
    app.initStorage(store)
    app.setBrandInfo( () => {
      wx.reLaunch({
        url: '/pages/tabBar/Home/index/index'
      })
    })
  },
})