// components/App/AppHeader/AppHeader.js
var app = getApp(),util = require('../../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    browerStoreList: [],  // 最近浏览的门店前五条
    SHADE_SWITCHER: false,   //遮罩开关,
    shopInfo: null,

  },
  pageLifetimes:{
    show(){
      this.getShopInfo().then(res => {
        this.setData(res)
      })
    }
    
  },
  lifetimes: {
    ready() {
      this.getShopInfo().then(res => {
        this.setData(res)
      })
    }
  },
  

  /**
   * 组件的方法列表
   */
  methods: {
    getShopInfo() {
      return new Promise(resolve => {
        app.getShopInfo(function (shopInfo) {
          let browerStoreList = util.setStorageLocalStore(shopInfo);
          resolve({ browerStoreList,shopInfo})
        })
      })
    },

    //跳转切换门店
    jumpShopcate() {
      this.$route('/pages/SC/pages/shopcate/shopcate')
    },

    //切换最近浏览门店或品牌
    selectStore(e) {
      let { storeid, type } = e.currentTarget.dataset,
        { shopInfo } = this.data;
        let that = this;
      if (storeid == shopInfo.id) {
        this.setData({ BRAND_HOME_SWITCHER: false, SHADE_SWITCHER: false })
      } else {
        app.setShopInfo(storeid, function(){
          that.getShopInfo().then(res => {
            Object.assign(res, { BRAND_HOME_SWITCHER: false, SHADE_SWITCHER: false })
            that.setData(res);
            that.triggerEvent('selectEvent')
          })
        })
      }
    },
    //打开下拉最近浏览列表
    showBrowerList() {
      this.setData({ SHADE_SWITCHER: !this.data.SHADE_SWITCHER });
    }
  }
})
