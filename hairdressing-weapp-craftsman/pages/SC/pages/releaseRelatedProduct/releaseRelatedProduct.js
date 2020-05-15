// pages/SC/pages/releaseRelatedProduct/releaseRelatedProduct.js
const app = getApp();
const fetch = require('../../../../utils/fetch.js');
const config = require('../../../../config/index.js');
const request  = new fetch.request();
Page({
  data: {
    // 服务列表
    serviceList:[],
    // 产品列表
    productList:[],
    // 上个页面传来的已选中的服务列表
    selectedServices:[],
    // 上个页面传来的已选中的产品列表
    selectedProducts:[],
    index:0
  },
  onLoad(options) {
    this.data.selectedServices = JSON.parse(options.services)
    this.data.selectedProducts = JSON.parse(options.products)
    this.getServiceListByStoreId();
    this.getProductListByStoreId();
  },
  /**
   * 通过storeId获取门店的服务列表
   */
  getServiceListByStoreId(storeId = wx.getStorageSync('storeId')){
    let url = 'specificationInfoByStoreId/' + storeId;
    request.getrequest(url).then(res => {
      let serviceList = res.data.serviceBasicInfos;
      serviceList = serviceList.map(v => {
        v.selected = this.data.selectedServices.includes(v.id)
        return v
      })
      this.setData({
        serviceList
      })
    })
  },

  /**
   * 通过storeId获取门店的产品列表
   */
  getProductListByStoreId(storeId = wx.getStorageSync('storeId')){
    let url = 'goodsListByStoreId/' + storeId;
    request.getrequest(url).then(res => {
      let productList = res.data.productBasicInfos.map(v => {
        v.selected = this.data.selectedProducts.includes(v.id)
        return v
      })
      this.setData({
        productList
      })
    })
  },  

  // 点击单个服务或者产品
  clickItem(e){
    const {type, index, selected} = e.currentTarget.dataset

    if(!selected){
      let selectedCount = 0;
      for (const v of [...this.data.serviceList, ...this.data.productList]) {
        if (v.selected) {
          selectedCount++
        }
        if (selectedCount == 3) {
          wx.showToast({
            title: '最多只能选三个服务或产品',
            icon: 'none'
          })
          return
        }
      }
    }

    let attr
    if(type == 'service'){
      attr = `serviceList[${index}].selected`
    } else if (type == 'product'){
      attr = `productList[${index}].selected`
    }
    this.$setData({
      [attr]:!selected
    })
  },

  /**
   * 点击完成按钮
   */
  finish(){
    let sap = {
      services:[],
      products:[],
      images:[]
    }

    let selectedCount = 0
    for(const v of this.data.serviceList){
      if(selectedCount == 3) break
      if (v.selected) {
        selectedCount++
        sap.services.push(v.id)
        sap.images.push(v.photos[0])
      }
    }
    for (const v of this.data.productList) {
      if (selectedCount == 3) break
      if (v.selected) {
        selectedCount++
        sap.products.push(v.id)
        sap.images.push(v.photos[0])
      }
    }
    wx.$event.emit('updateServicesAndProducts', sap)
    wx.navigateBack({
      delta: 1
    })
  },
})