// pages/SC/pages/recommended/recommended.js
var apiAction = null, util = null;
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
  },
  computed:{
    tabs(){
      return [this.data.selectCity, this.data.selectArea]
    },
    // 之后再打开注释
    // shopList(){
    //   const list = this.data.area_shopList
    //   if (list && list.length){
    //     for (const v of list){
    //       if(v.cityArea === this.data.selectArea){
    //         return v.shopList
    //       }
    //     }
    //   }else{
    //     return []
    //   }
    // }
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    let location = this.getUserLocation()
    apiAction.getRecommendStoreList().then( data => {
      Object.assign(location, {
        shopList: data.storeInfoList
      })
      this.$setData(location)
    })
    // 之后再打开注释
    // this.getCityList()
    // this.getShopList()
  },
  onReady() {
    // 之后再打开注释
    // wx.createSelectorQuery().select('#header').boundingClientRect().exec(el => {
    //   this.INITIAL_TOP = el[0].top
    // })
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
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
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {

  },
})