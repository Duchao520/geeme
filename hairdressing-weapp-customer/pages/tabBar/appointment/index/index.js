// pages/appointment/index/index.js
const util = require('../../../../utils/util.js');
const apiAction = require('../../../../utils/apiAction.js')
const app = getApp()
Page({
  // 0 未关注 
  data: {
    // 店铺信息数据
    shopInfo: {},
    // 推荐发型师数据 
    firsthair: '',
    // 发信师列表数据
    hairlist: [],
    // 店铺Id
    storeId: '',
    STORE_DUE_STATUS: false,
    // 页数
    page: 1,
    pageSize: 20,
    // 是否固定
    isFixed: false
  },
  onLoad() {
    this.initPage()
  },
  onShow(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      const tabBarObj = this.getTabBar();
      let tabBar = tabBarObj.data.tabBar.filter(ele => ele.showFlag == 1);
      let index = tabBar.findIndex(value => {
        return value.pagePath == "/pages/tabBar/appointment/index/index"
      })
      tabBarObj.setData({
        selected: index == -1 ? app.globalData.selected : index
      })
    }
    if(!this.$status.isFirstShow){
      if (wx.$getStorage('storeId') != this.data.storeId){
        this.initPage()
      }
    }
  },
  initPage() {
    app.getShopInfo(shopInfo => {
      if (shopInfo) {
        this.data.storeId = shopInfo.id
        let { STORE_DUE_STATUS} = this.data;
        let promiseArr = [];
        promiseArr.push(this.getHairInfo());
        promiseArr.push(this.getHairList());
        util.PromiseAll(promiseArr).then(res => {
          if (shopInfo.status == 'ONLINE' || shopInfo.status == '营业中'){
            STORE_DUE_STATUS = false;
          }else{
            STORE_DUE_STATUS = true;
          }
          Object.assign(res, { shopInfo, STORE_DUE_STATUS});
          this.setData(res);
          res = null;
          promiseArr = null;
        })
      } else {
        this.$setData({
          abnormal: true
        })
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.initPage()
  },
  /**
   * 拨打电话
   */
  makePhone(e) {
    let phoneNumber = e.currentTarget.dataset.number;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },

  /**
   * 请求推荐发型师信息
   */
  getHairInfo() {
    let data = {
      currentPage: this.data.page,
      pageSize: this.data.pageSize,
      shopId: this.data.storeId
    }
    // 请求推荐发型师
    return apiAction.getRecommendHairdresserList(data).then( data => {
      wx.stopPullDownRefresh()
        // 推荐发型师数据
      return {firsthair: data.hairdresserList}
    })
  },

  // 请求发型师列表
  getHairList() {
    return apiAction.weListAvailableStaffByStoreId({storeId:this.data.storeId}).then( data => {
      // 按作品数量降序排序
      data.staffInfoForAppointments.sort((v1, v2) => {
        return v2.works.length - v1.works.length
      })
      return {hairlist: data.staffInfoForAppointments}
    })
  },

  /**
   * 去发型师详情
   */
  tostaffDetail(e) {
    const id = e.currentTarget.dataset.id
    this.$route('/pages/SC/pages/hairdetails/hairdetails', {hairId:id})
  },

  // 监听屏幕滚动
  onPageScroll(e) {
    const query = wx.createSelectorQuery();
    query.select('.choose-head').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(res => {
      if (res[0].top <= 0 && e.scrollTop >= 370 && !this.data.isFixed) {  //防止重复setData
        this.setData({
          isFixed: true
        })
      } else if (e.scrollTop < 370 && this.data.isFixed) {
        this.setData({
          isFixed: false
        })
      }
    })
  },

  // 用户地址导航
  location(e) {

    let latitude = e.currentTarget.dataset.latitude;
    let longitude = e.currentTarget.dataset.longitude;
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      scale: 10,
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address
    })
  },
  //跳转sc中的店铺页面
  jumpSCcate() {
    wx.navigateTo({
      url: '/pages/SC/pages/shopcate/shopcate'
    })
  },
  jumpMyFocus(){
    this.$route('/pages/UIC/pages/myFocus/myFocus')
  }
})