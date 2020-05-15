// pages/appointment/index/index.js
const util = require('../../../../utils/util.js')
const apiAction = require('../../../../utils/apiAction.js')
const app = getApp()
Page({
  data: {
    // 店铺数据
    storeId: 0,
    shopInfo: {},
    //店铺服务数据
    serviceInfoList: [],
    showDefault:false,
    groupBuyProducts:null,
  },
  onLoad(options) {
    this.initPage()
  },
  onShow(){
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: app.globalData.selected
      })
    }
    if (!this.$status.isFirstShow) {
      if (wx.$getStorage('storeId') != this.data.storeId) {
        this.initPage()
      }
    }
  },
  initPage() {
    app.getShopInfo(shopInfo => {
      if(shopInfo){
        // let promiseArr = [this.getGroupBuyProducts()];
        let promiseArr = [this.getShopServiceList(), this.getGroupBuyProducts()];
        util.PromiseAll(promiseArr).then(res => {
          wx.stopPullDownRefresh()
          Object.assign(res, {shopInfo,storeId: wx.$getStorage('storeId')});
          this.setData(res);
          res = null;
          promiseArr = null;
        })   
      }else{
        this.$setData({
          abnormal:true
        })
      }
    })
  }, 
  // 下拉刷新
  onPullDownRefresh() {
    this.initPage()
  },
  // 美物拼团
  getGroupBuyProducts(){
    return apiAction.getStoreGroupPurchaseGoodsList().then( data => {
      return {groupBuyProducts: data.groupPurchaseGoodsList}
    })
  },
  //前往个人中心
  jumpUC() {
    wx.switchTab({
      url: '/pages/tabBar/my/index/index',
    })
  },
  // 今日推荐
  getShopServiceList() {
    return apiAction.getGoodsForFirstPage().then( data => {
      return {productList: data.goodsForFirstPageInfoList}
    })
  },
  // 跳转搜索页面
  jumpSearch(){
    this.$route('/pages/SC/pages/search_purchase/search_purchase')
  },

  /**
   * 去主打服务 
   */
  toService() {
    this.$route('/pages/IC/pages/mainService/mainService')
  },

  // 跳转美物拼团
  jumpProduct_group() {
    this.$place('groupBuyProducts', this.data.groupBuyProducts)
    this.$route('/pages/IC/pages/product_group/product_group')
  },

  /**
   * 跳转店铺分类 
   */
  jumpShopCate() {
    this.$route('/pages/SC/pages/shopcate/shopcate')
  },

  /**
   * 跳转全场分类 
   */
  jumpProductCate() {
    this.$route('/pages/IC/pages/productcate/productcate')
  },

  // 跳转商品详情
  jumpGoodsDetail(e) {
    const {id, type} = e.currentTarget.dataset
    const params = {
      productId:id
    }
    if(type == 'production') params.isProduct = 1
    this.$route('/pages/IC/pages/productdetails/productdetails', params)
  },

  // 去充值有礼
  topurchaseRecharge() {
    wx.navigateTo({
      url: '/pages/VIP/pages/purchaseRecharge/purchaseRecharge',
    })
  },

  /**
   * 去优选好物
   */
  togoodProduct() {
    wx.navigateTo({
      url: '/pages/IC/pages/goodProduct/goodProduct'
    })
  },
})