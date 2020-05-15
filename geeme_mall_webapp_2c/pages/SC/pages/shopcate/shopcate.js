// pages/SC/shopcate/shopcate.js
var apiAction = null, app = null,util = null;
Page({
  $name: 'shopcate',
  data: {
    list: [],
    areaList: [],   //区域列表
    //当前定位城市
    currentCity: '',
    //当前选中城市
    selectCity: '常去的店',
    //经纬度
    latitude:0,
    longitude:0,
    currentStoreId:0,
    selectProviceIndex: 0,   //当前选中省份位置
    selectCityIndex: 0,    //当前选中的城市位置
    selectAreaIndex: 0,     //当前选中的区域位置
    selectStoreIndex: 0     //当前选中的门店位置
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    const address = wx.$getStorage('address')
    this.data.currentCity = address.city
    // this.getFrequently()
    this.getShopList().then(res => {
      Object.assign(res, {
        latitude: address.latitude,
        longitude: address.longitude,
        currentCity: address.city,
        currentStoreId: wx.$getStorage('storeId')
      });
      this.$setData(res);
    })
  },
  onUnload() {          //清内存
    apiAction = null;
    app = null;
    util = null;
    this.data = null;
  },
  // 获取常去的店
  getFrequently() {
    // todo
    this.$setData({
      shopList: []
    })
  },
  /**
   * 获取城市店铺列表
   */
  getShopList(city){
    const data = this.$take('shopList');
    const storeId = wx.$getStorage('storeId');
    let { selectProviceIndex, selectCityIndex, selectAreaIndex, selectStoreIndex, currentCity} = this.data;
    if (data) {
      data.dataList.forEach((province, provinceIndex) => {
        province.cityList.forEach((city, cityIndex) => {
          if (util.replaceCity(currentCity) == util.replaceCity(city.city)) {
            selectProviceIndex = provinceIndex;
            selectCityIndex = cityIndex;
            selectAreaIndex = 0;
            selectStoreIndex = 0;
          }
          city.areaList.forEach((area, areaIndex) => {
            area.ifShowShop = true;
            area.shopList.forEach((shop, shopIndex) => {
              if (storeId == shop.id) {
                selectProviceIndex = provinceIndex;
                selectCityIndex = cityIndex;
                selectAreaIndex = areaIndex;
                selectStoreIndex = shopIndex;
              }
            })
          })
        })
      })
      return Promise.resolve({
        list: data.dataList,
        selectProviceIndex, selectCityIndex, selectAreaIndex, selectStoreIndex
      })
    } else {
      return apiAction.getSimpleShopList(city).then(data => {
        data.dataList.forEach((province,provinceIndex) => {
          province.cityList.forEach((city,cityIndex) => {
            if (util.replaceCity(currentCity) == util.replaceCity(city.city)) {
              selectProviceIndex = provinceIndex;
              selectCityIndex = cityIndex;
              selectAreaIndex = 0;
              selectStoreIndex = 0;
            }
            city.areaList.forEach((area,areaIndex) => {
              area.ifShowShop = true;
              area.shopList.forEach((shop,shopIndex) => {
                if (storeId == shop.id) {
                  selectProviceIndex = provinceIndex;
                  selectCityIndex = cityIndex;
                  selectAreaIndex = areaIndex;
                  selectStoreIndex = shopIndex;
                }
              })
            })
          })
        })
        return {
          list: data.dataList,
          selectProviceIndex, selectCityIndex, selectAreaIndex, selectStoreIndex
        }
      })
    }
  },

  /**
   *选中省
   */
  selectProvince(e){
    let {item,index} = e.currentTarget.dataset,
        { selectProviceIndex, selectCityIndex, selectAreaIndex, selectStoreIndex} = this.data;
    if(selectProviceIndex == index)return;
    this.setData({ selectProviceIndex: index, selectCityIndex: 0, selectAreaIndex: 0, selectStoreIndex: 0})
  },

  /**
   * 点击城市
   */
  selectCity(e) {
    let { index } = e.currentTarget.dataset,
      { selectProviceIndex, selectCityIndex, selectAreaIndex, selectStoreIndex } = this.data;
    if (selectCityIndex == index)return;
    this.setData({
      selectCityIndex: index,
      selectAreaIndex: 0,
      selectStoreIndex: 0
    })
  },

  /**
   * 点击店铺
   */
  setStore(e){
    const {id, operate,index,shopindex} = e.currentTarget.dataset
    if(!operate){
      wx.showToast({
        title: '该门店暂停营业中，换家店试试吧~',
        icon: 'none'
      })
      return
    }
    app.setShopInfo(id, () => {
      wx.navigateBack({
        delta: 1
      })
    })
  },
  hideShop(e){
    const { selectProviceIndex, selectCityIndex} = this.data;
    const {index, ifshow} = e.currentTarget.dataset;
    const attr = `list[${selectProviceIndex}].cityList[${selectCityIndex}].areaList[${index}].ifShowShop`
    this.$setData({
      [attr]: !ifshow
    })
  },
  jumpSearch() {
    this.$route('/pages/SC/pages/search/search')
  }
})