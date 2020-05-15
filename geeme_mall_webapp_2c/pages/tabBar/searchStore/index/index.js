var apiAction = require('../../../../utils/apiAction.js'),
    util = require('../../../../utils/util.js'),
    app = getApp();
Page({
  data: {
    floorInformation: null,
    floorid: 0,
    shopList: [],
    address: null,
    queryParams: {
      brandId: '',
      floorId: null,
      keyWords: '',
      currentPage: 0,
      pageSize: 10,
      goodNum: 3,
      recommendInFirstPage: true,
      onlineRecommendation: false
    },
    tabs: ['全部楼层', '全部分类','智能排序'],
    hots: ['智能排序', '热门'],
    businessCategoryInfoList: null,
    activeTab: -1
  },
  onLoad(options) {
    let location = this.getUserLocation()
    this.getBrandInfo().then(res => {
      Object.assign(res, location);
      this.$setData(res);
    })
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      const tabBarObj = this.getTabBar();
      let tabBar = tabBarObj.data.tabBar.filter(ele => ele.showFlag == 1);
      let index = tabBar.findIndex(value => {
        return value.pagePath == "/pages/tabBar/searchStore/index/index"
      })
      tabBarObj.setData({
        selected: index == -1 ? app.globalData.selected : index
      })
    }
  },

  onPullDownRefresh() {
    this.getBrandInfo().then(res => {
      wx.stopPullDownRefresh();
      Object.assign(res, location);
      this.$setData(res);
    })
  },

  
  onReachBottom() {
    this.esMallStoreList(nextPage).then(res => {
      shopList = shopList.concat(res.shopList);
      this.$setData({
        shopList
      })
    })
  },

  // 从本地拿出用户的位置
  getUserLocation() {
    let address = wx.$getStorage('address');
    if (!address) return
    return {
      address
    }
  },
  getBrandInfo() {
    return new Promise(resolve => {
      app.getBrand((brand) => {
        resolve({ brand })
      })
    }).then(res => {
      this.data.queryParams.brandId = res.brand.brandId;
      return util.PromiseAll([
        this.getMallBrandFloorInformation(res.brand.brandId),
        this.getCategorySortForApi(res.brand.brandId),
        this.esMallStoreList()
      ])
    })
  },

  getCategorySortForApi(brandId) {
    return apiAction.getCategorySortForApi({ brandId, limit: 10 }).then(res => {
      res.businessCategoryInfoList.unshift({name: '全部分类',id: null})
      return res;
    })
  },
  /** 获取楼层信息*/
  getMallBrandFloorInformation(brandId) {
    return apiAction.getMallBrandFloorInformation({ brandId: brandId }).then(res => {
      if (res.success) {
        let { mallFloorInformationList} = res;
        let partition = mallFloorInformationList.filter(ele => !ele.fatherId);
        partition.forEach(ele => {
          let floorList = [];
          mallFloorInformationList.forEach(item => {
            if(ele.id == item.fatherId){
              floorList.push(item);
            };
          })
          ele.floorList = floorList;
        })
        let defaultSelect = {
          id: '',
          name: '全部',
          floorList: [{ name: '全部楼层', id: null, fatherId: ''}]
        }
        partition.unshift(defaultSelect)
        return {
          partition: partition
        }
      } else {
        return {}
      }
    })
  },
  esMallStoreList(page = 'firstPage') {
    let { queryParams } = this.data;
    if (page == 'firstPage') {
      queryParams.currentPage = 0;
    } else {
      queryParams.currentPage++;
    }
    this.data.queryParams.currentPage = queryParams.currentPage;
    return apiAction.esMallStoreList(queryParams).then(res => {
      res.storeInfoList.forEach(ele => {
        ele.latitude = ele.location.split(',')[0]
        ele.longitude = ele.location.split(',')[1]
      })
      return {
        shopList: res.storeInfoList
      }
    })
  },
  selectCategory(event) {
    let { item } = event.detail,
      { queryParams, tabs } = this.data;
    Object.assign(queryParams, { businessCategory: item.id });
    tabs[1] = item.name;
    this.$setData({
      queryParams,
      activeTab: -1,
      tabs
    })
    this.esMallStoreList().then(res => {
      this.$setData(res)
    })
  },
  selectFloor(event) {
    let { childId, parentName, childName } = event.detail,
      { queryParams,tabs } = this.data;
    Object.assign(queryParams, { floorId: childId })
    tabs[0] = childName;
    this.$setData({
      floorid: childId, queryParams, activeTab: -1,tabs
    })
    this.esMallStoreList().then(res => {
      this.$setData(res)
    })
  },
  selectHots(e){
    let {index,item} = e.detail,
      { queryParams, tabs } = this.data;
    if(index == 0){
      Object.assign(queryParams, { onlineRecommendation: false });
    }else{
      Object.assign(queryParams, { onlineRecommendation: true });
    }
    tabs[2] = item;
    this.$setData({
      queryParams, activeTab: -1, tabs
    })
    this.esMallStoreList().then(res => {
      this.$setData(res)
    })
  },
  //门店名称搜索
  search(event){
    let {value} = event.detail,
        {queryParams} = this.data;
    queryParams.keyWords = value;
    this.data.queryParams = queryParams;
    this.esMallStoreList().then(res => {
      this.$setData(res)
    })
  },

  popup(e){
    let {index} = e.detail;
    this.setData({
      activeTab: index
    })
  },

  hideShade(){
    this.setData({
      activeTab: -1
    })
  },

  // 跳转店铺导航页面
  jumpMaps() {
    this.$route('/pages/SC/pages/maps/maps');
  }
})