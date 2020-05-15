// pages/SC/pages/recommended/recommended.js
var apiAction = null, util = null , app = null;
Page({
  data: {
    // 当前定位
    address: {},
    // header是否吸附在顶部
    isAttach: false,
    // 筛选相关
    area_shopList: [], //getSimpleShopList接口获得的数组
    leftList:['定位城市', '全部城市',],
    activeLeftItem:'定位城市',
    rightList: ['北京市', '上海市', '杭州市', '广州市', ],
    cityList:[],
    areaList:[],
    selectCity:'',
    selectArea:'',
    activeTab: -1,
    // 之后可能要换成下面computed的shopList
    shopList:[],
    tabs: ['全部楼层','全部分类', '全部'],
    sortMethods: ['全部', '热门'],
    businessCategoryInfoList: null,
    floorInformation: null,
    partition: [],
    floorindex: null,
    floorid: null,
    queryParams: {
      brandId: '',
      businessCategory: '',
      floorname: '',
      keyWords: '',
      onlineRecommendation: '',
      currentPage: 0,
      pageSize: 10,
      goodNum: 3
    }
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    let location = this.getUserLocation()
    let {categaryId} = options;
    let { queryParams, tabs } = this.data;
    this.data.queryParams.businessCategory = categaryId;
    this.getBrandInfo().then(res => {
      if (categaryId){
        let categary = res.businessCategoryInfoList.filter(ele => ele.id == categaryId)[0];
        tabs[1] = categary.name;
        Object.assign(res,{tabs:tabs});
      }
      Object.assign(res,location);
      this.$setData(res);
    })
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    app = null;
    this.data = null;
  },
  // 从本地拿出用户的位置
  getUserLocation() {
    let address = wx.$getStorage('address');
    if(!address) return
    return {
      address,
      selectCity: address.city,
      selectArea: address.area,
      rightList: [address.city]
    }
  },
  /** 获取楼层信息*/
  getMallBrandFloorInformation(brandId) {
    return apiAction.getMallBrandFloorInformation({ brandId: brandId }).then(res => {
      if (res.success) {
        let { mallFloorInformationList } = res;
        let partition = mallFloorInformationList.filter(ele => !ele.fatherId);
        partition.forEach(ele => {
          let floorList = [];
          mallFloorInformationList.forEach(item => {
            if (ele.id == item.fatherId) {
              floorList.push(item);
            };
          })
          ele.floorList = floorList;
        })
        let defaultSelect = {
          id: '',
          name: '全部',
          floorList: [{ name: '全部楼层', id: null, fatherId: '' }]
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
      res.businessCategoryInfoList.unshift({ name: '全部分类', id: null })
      return res;
    })
  },
  // 请求城市列表
  getCityList() {
    apiAction.getShopCityList().then(data => {
      const cityList = []
      for(const v of data.cityList){
        cityList.push(v.name)
      }
      this.$setData({
        cityList
      })
    })
  },
  // 请求选中城市下的门店列表
  getShopList(city = this.data.address.city) {
    apiAction.getSimpleShopList(city).then(data => {
      const areaList = []
      for (const v of data.dataList){
        areaList.push(v.cityArea)
      }
      const _data = {
        areaList,
        area_shopList: data.dataList
      }
      if(!areaList.includes(this.data.selectArea)){
        _data.selectArea = areaList[0]
      }
      this.$setData(_data)
    })
  },
  // 选择省、定位城市、热门城市、全部城市
  selectProvince(e){
    let rightList
    switch(e.detail.item){
      case '定位城市':
      rightList = [this.data.address.city]
      break;
      case '全部城市':
      rightList = this.data.cityList
      break;
      default:
      // todo:请求热门城市接口或选择的省下的城市列表
      rightList = []  //暂时
      break;
    }
    this.$setData({
      rightList
    })
  },
  // 选择城市
  selectCity(e){
    const city = e.detail.item
    this.$setData({
      activeTab:-1
    })
    this.getShopList(city)
  },
  // 选择区
  selectArea(e){
    this.$setData({
      selectArea:e.detail.item,
      activeTab:-1
    })
  },
  popup(e) {
    const index = e.detail.index
    this.$setData({
      activeTab: index
    })
  },
  selectIsHot(event){
    let {index,item} = event.detail,
        {queryParams,tabs} = this.data;
    Object.assign(queryParams, { onlineRecommendation: index == 0 ? false : true});
    tabs[2] = item;
    this.$setData({
      queryParams, tabs, activeTab: -1
    })
    this.esMallStoreList().then(res => {
      this.$setData(res)
    })
  },
  selectCategory(event){
    let {item} = event.detail,
      { queryParams,tabs } = this.data;
    Object.assign(queryParams, { businessCategory: item.id});
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
      { queryParams, tabs } = this.data;
    Object.assign(queryParams, { floorId: childId })
    tabs[0] = childName;
    this.$setData({
      floorid: childId, queryParams, activeTab: -1, tabs
    })
    this.esMallStoreList().then(res => {
      this.$setData(res)
    })
  },
  esMallStoreList(page = 'firstPage'){
    let { queryParams} = this.data;
    if(page == 'firstPage'){
      queryParams.currentPage = 0;
    }else{
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
  // 监听页面滑动
  onPageScroll(res) {
    this.$setData({
      isAttach: res.scrollTop >= this.INITIAL_TOP
    })
  },
  // 跳转搜索页面
  jumpSearch() {
    this.$route('/pages/SC/pages/search/search')
  },
  // 跳转店铺导航页面
  jumpMaps(){
    this.$route('/pages/SC/pages/maps/maps');
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    let {shopList} = this.data;
    this.esMallStoreList('nextPage').then(res => {
      shopList = shopList.concat(res.shopList);
      this.$setData({
        shopList
      })
    })
  },
})