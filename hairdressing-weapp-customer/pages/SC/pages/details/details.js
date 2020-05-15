// pages/home/details/details.js
var apiAction = null, util = null, app = null;
Page({
  $name:'details',
  data: {
    tabList: ['优惠', '评价', '动态', '相册', '简介'],
    currentTab:0,
    shopInfo: {},
    evaluation:{
      pageNum: 1,
      pageSize: 10,
      tagId: -2,
      total:0,
      list:null,
    },
    dynamic:{
      pageNum:1,
      pageSize:10,
      total:0,
      list:null
    },
    TAG_FLAG: false
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    this.storeId = options.id
    this.getBrandInfo();
    util.PromiseAll([this.getShopInfo(),this.fetchProducts()]).then(res => {
      this.$setData(res);
      return res;
    })
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    app = null;
    this.data = null;
  },
  getBrandInfo() {
    return new Promise(resolve => {
      app.getBrand((brand) => {
        wx.setNavigationBarTitle({
          title: brand.name
        })
        resolve({ brand })
      })
    }).then(res => {
      if (wx.$getStorage('authorization')){
        apiAction.uvRecord({ brandId: res.brand.brandId, storeId: this.storeId })
      }
      return res;
    })
  },
  // 获取店铺基本信息
  getShopInfo(){
    return apiAction.getShopInfo(this.storeId).then( data => {
      wx.setNavigationBarTitle({
        title: data.shopName
      })
      data.workDays = this.weekListFunc(data.workDays)
      return {
        shopInfo: data
      }
    })
  },
  TagSwitcher() {
    this.setData({
      TAG_FLAG: !this.data.TAG_FLAG
    })
  },
  // 切换tab
  switchTab(e){
    const { index } = e.detail
    this.getPromise(index).then(res => {
      Object.assign(res, {
        currentTab: index
      })
      this.$setData(res);
    })
  },
  getPromise(index){
    switch (index) {
      case 0:
        return this.fetchProducts()
      case 1:
        return util.PromiseAll([this.fetchAssessment(),this.fetchTags()]).then(res => {return res;})
      case 2:
        return this.getDynamics()
      default: 
        return Promise.resolve({});
    }
  },
  // 获取首页推荐产品
  fetchProducts(){
    return apiAction.getServiceListWithSortOneByStoreId(this.storeId).then(data => {
      wx.stopPullDownRefresh()
      let showDefault = !(data.serviceInfoList && data.serviceInfoList.length)
      return {
        serviceInfoList: data.serviceInfoList,
        showDefault
      }
    })
  },
  // 获取评价
  fetchAssessment() {
    const { pageNum, pageSize, tagId } = this.data.evaluation
    const params = {
      pageNum,
      pageSize,
      storeId:this.storeId,
      tagId,
    }
    wx.showLoading()
    return apiAction.getStoreAssessmentList(params).then(data => {
      wx.hideLoading()
      this.flag = false
      this.data.evaluation.total = data.total
      let list = pageNum == 1 ? data.staffAssessmentList : this.data.assessmentList.concat(data.staffAssessmentList)
      return {
        'evaluation.list': list
      }
    })
  },
  // 获取评价标签
  fetchTags() {
    return apiAction.getStoreAssessmentTagCount(this.storeId).then(data => {
      let tagCounts = data.tagCounts.filter(ele => ele.num > 0)
      return {
        tags: tagCounts
      }
    })
  },
  // 更改评价标签
  changeTagId(e) {
    this.setData({
      'evaluation.tagId': e.currentTarget.dataset.id,
      pageNum: 1
    })
    this.fetchAssessment().then(res => {this.$setData(res);return res})
  },
  // 请求作品动态（现在封面动态就是热门动态）
  getDynamics() {
    const {pageNum, pageSize} = this.data.dynamic
    let _data = {
      currentPage: pageNum,
      pageSize: pageSize,
      storeId: this.storeId
    }
    return apiAction.getSimpleDynamic(_data).then(data => {
      this.flag = false
      let list = pageNum === 1 ? data.weSimpleDynamicList : this.data.dynamic.list.concat(data.weSimpleDynamicList)
      return {
        'dynamic.list': list,
        ifShowDefault: data.total === 0,
      }
    })
  },
  /**
   * 按周n至周n排列工作日
   */
  weekListFunc(weekList) {
    return util.weekListFunc(weekList)
  },
  /** 
   * 导航
   */
  navigation(e) {
    // 用户地址导航
    let latitude = e.currentTarget.dataset.laitude;
    let longitude = e.currentTarget.dataset.longitude;
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      scale: 10,
      address: e.currentTarget.dataset.address,
      name: e.currentTarget.dataset.name
    })
  },

  /**
   * 拨打电话 
   */
  call(e) {
    let phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  // 立即预约
  jumpAppointment() {
    app.setShopInfo(this.data.shopInfo.id, () => {
      wx.switchTab({
        url: '/pages/tabBar/appointment/index/index',
      })
    })
  },

  /**
   * 展示门店简介
   */
  omitDes() {
    this.$setData({
      isEllipsis: !this.data.isEllipsis
    })
  },

  /**
   * 去门店相册页面
   */
  showShopImages() {
    wx.navigateTo({
      url: '/pages/SC/pages/shopImages/shopImages?shopId=' + this.storeId
    })
  },
  onReachBottom() {
    if(this.flag) return
    this.flag = true
    if(this.data.currentTab == 1){
      const {pageNum, pageSize, total} = this.data.evaluation
      if (pageNum * pageSize >= total) return
      this.data.evaluation.pageNum++
      this.fetchAssessment().then(res => { this.$setData(res);return res })
    }else if(this.data.currentTab == 2){
      const { pageNum, pageSize, total } = this.data.dynamic
      if (pageNum * pageSize >= total) return
      this.data.dynamic.pageNum++
      this.getDynamics().then(res => { this.$setData(res); return res })
    }
  },
  onShareAppMessage(){
    let userInfo = wx.$getStorage('userInfo'),title,{shopInfo} = this.data;
    if(userInfo){
      title = userInfo.nickName + '向你推荐好店:' + shopInfo.shopName + '-看评价，享优惠' + shopInfo.phone
    }else{
      title = '向你推荐好店:' + shopInfo.shopName + '-看评价，享优惠' + shopInfo.phone
    }
    return {
      title: title,
      imageUrl: util.getImageUrl(shopInfo.shopImg + '?x-oss-process=image/resize,m_fill,h_376,w_750')
    }
  }
})