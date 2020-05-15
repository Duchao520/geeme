// 引入地图api封装对象
const util = require('../../../../utils/util.js');
const apiAction = require('../../../../utils/apiAction.js')
//获取应用实例
const app = getApp();
Page({
  data: {
    // 品牌参数
    brand: '',
    abnormal: true,
    // 组件数据(推荐美店)
    likelist: '',
    shopCarCount: '',
    // 作品动态
    dynamicList: [],
    browerStoreList: [],  // 最近浏览的门店前五条
    goodsClass: [],  //分类
    bannerInfoList: [],   //广告列表
    bannerInfoBrandList: [],//品牌中心广告
    groupBuyProducts: [],  //拼团
    productList: [],
    listCardKindBasicInfoSupperRecommend: [],  //推荐卡
    weExpShowGoodsList: [],
    dynamicListTotal: 0,
    shopInfo: null,
    customerRedPacketInfo: null,  //老客红包,
    TAKE_REDPACKET_STATUS: false,     //领取是否成功,
    IS_SHOW_REDPACKET: false,     //是否显示红包
    // 判断动态加载更多，true:加载中 
    flag: false,
    type: 1,   //今日推荐 服务 产品
    currentPage: 1,
    pageSize: 10,
    hasReceiveRed: 1,
    ifShowDefault: false, // 显示动态缺省
    popRedPacket: false, // 是否显示红包
    redPacketList: null, // 红包信息,
    BRAND_HOME_SWITCHER: false,   //首页门店开关
    SHADE_SWITCHER: false,   //遮罩开关,
    BRAND_MODULES_FILTER: null,  //品牌模块配置
    HOME_FIRST_FILTER: null,    //首页顶部菜单模块
    HOME_SECOND_FILTER:{},    //下级分栏菜单模块,
    arrangement: true,   //排列方式
    themeId: 1,
    bg_redPacket1: 'https://image-develop.geeme.cn/images/651b972d245a451fb092f799f61e7b9a',
    bg_redPacket2: 'https://image-develop.geeme.cn/images/495580830a0b41c4b89b1b1454421448',
    bg_redPacket3: "https://image.geeme.cn/images/a923751ae8d340b1a4b8b74f49de6df2"
  },
  onLoad() {
    app.initThemeSkin()
    // 设置主题id
    this.setThemeId()
    wx.$event.once('setThemeId', this.setThemeId)
    wx.$event.on('setAddress', () => {
      this.getShopList('refresh')
    })
    this.init();
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      const tabBarObj = this.getTabBar();
      let tabBar = tabBarObj.data.tabBar.filter(ele => ele.showFlag == 1);
      let index = tabBar.findIndex(value => {
        return value.pagePath == "/pages/tabBar/home/index/index"
      })
      tabBarObj.setData({
        selected: index == -1 ? app.globalData.selected : index
      })
    }
    this.setData({ type: 1 })
    let storeId = this.data.shopInfo ? this.data.shopInfo.id : ''

    this.getShopCartNumber();
    this.getRedPacketForCustomerToTake();
    if ((wx.$getStorage('storeId') != storeId) || !wx.$getStorage('storeId')) {
      this.getaddress().then(res => {
        this.setData(res);
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: util.getSkin(wx.$getStorage('themeId')).color1,
        })
      })
    }
  },
  onShareAppMessage(){
    let userInfo = wx.$getStorage('userInfo'),title,
        {brand} = this.data;
    if(userInfo){
      title = userInfo.nickName + '向你推荐好店:' + brand.name + '-' + brand.title
    }else{
      title = '向你推荐好店:' + brand.name + '-' + brand.title;
    };
    return {
      title: title
    }
  },
  init() {
    let promiseArr = [];
    promiseArr.push(this.getHotSimpleDynamic())
    promiseArr.push(this.getBrandInfo())
    promiseArr.push(this.checkRedPacket())
    util.PromiseAll(promiseArr).then(res => {
      this.setData(res);
      res = null;
      promiseArr = null;
    })
  },
  getShopInfo(shopInfo){
    let browerStoreList = util.setStorageLocalStore(shopInfo);
    let { abnormal } = this.data;
    this.data.shopInfo = shopInfo;
    util.PromiseAll([this.getAdBannerByStoreId(), this.getStoreWholeGoodsClass(), this.getGroupBuyProducts(), this.getShopServiceList(), this.weGetExperiencePriceGoodsList()]).then(res => {
      if (shopInfo.status == 'ONLINE' || shopInfo.status == '营业中') {
        abnormal = true;
      } else {
        abnormal = false;
      }
      Object.assign(res, { BRAND_HOME_SWITCHER: false, shopInfo, browerStoreList, SHADE_SWITCHER: false })
      this.setData(res);
    })
  },
  getShopServiceList() {
    return apiAction.getGoodsForFirstPage().then(data => {
      return { productList: data.goodsForFirstPageInfoList }
    })
  },
  weGetExperiencePriceGoodsList(){
    return apiAction.weGetExperiencePriceGoodsList({ storeId: this.data.shopInfo.id})
  },
  // 获取服务列表
  getServiceList() {
    let params = {
      pageNum: 0,
      pageSize: 200,
      goodsOrderByEnum: 'SMART_ORDER',
      shopId: wx.$getStorage('storeId')
    }


    wx.showLoading()
    return apiAction.getServiceList(params).then(data => {
      wx.hideLoading()
      if (!data.serviceInfoList.length) {
        return {};
      }
      return {
        productList: data.serviceInfoList
      }
    })
  },
  // 获取产品列表
  getProductList() {
    let params = {
      pageNum: 0,
      pageSize: 200,
      goodsOrderByEnum: 'SMART_ORDER',
      storeId: wx.$getStorage('storeId')
    }


    wx.showLoading()
    return apiAction.weGetProductListByCondition(params).then(data => {
      wx.hideLoading()
      if (!data.productInfos.length) {
        return {};
      }
      data.productInfos.forEach(ele => {
        ele.type = 'product'
      })
      return {
        productList: data.productInfos
      }
    })
  },
  getBrandWeAppletColumnSettingSelfApiByBrandId(){
    let BRAND_MODULES = ['会员优惠','推荐美店','客户评价','品牌主页'],
        HOME_FIRST = ['开单码','我的预约','消费账单','会员卡'];
    return apiAction.getBrandWeAppletColumnSettingSelfApiByBrandId(this.data.brand.brandId).then(res => {
      if(res.success){
        let BRAND_MODULES_FILTER = res.columnSettingSelfApiList.filter(ele => BRAND_MODULES.indexOf(ele.name) > -1);
        let HOME_FIRST_FILTER = res.columnSettingSelfApiList.filter(ele => HOME_FIRST.indexOf(ele.name) > -1);
        let HOME_SECOND_FILTER = {};
        res.columnSettingSelfApiList.forEach(ele => {
          switch (ele.name) {
            case '美物拼团':
              HOME_SECOND_FILTER.groupBuy = ele;
              break;
            case '新人专享':
              HOME_SECOND_FILTER.newCustomer = ele;
              break;
          }
        })
        return { BRAND_MODULES_FILTER, HOME_FIRST_FILTER, HOME_SECOND_FILTER}
      }else{
        return {}
      }
    })
  },
  changeArrangement(){
    this.setData({ arrangement: !this.data.arrangement})
  },
  selectGoodsType(e){
    let {type} = e.currentTarget.dataset,
        promise;
    this.$setData({ type, productList: []})
    switch(Number(type)){
      case 1:
        promise = this.getShopServiceList();
        break;
      case 2:
        promise = this.getServiceList();
        break;
      case 3:
        promise = this.getProductList();
        break;
    }
    promise.then(res => {
      this.$setData(res)
    })
  },
  // 设置主题ID
  setThemeId() {
    if (wx.$getStorage('themeId') && wx.$getStorage('themeId') != this.data.themeId) {
      this.$setData({
        themeId: wx.$getStorage('themeId')
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: util.getSkin(wx.$getStorage('themeId')).color1,
      })
    }
  },

  /**
   * 获取用户可领取的红包信息(新人红包除外)
   */
  getRedPacketForCustomerToTake() {
    if (!wx.$getStorage('authorization')) return;

    apiAction.hasPhone().then(hasPhone => {
      if (hasPhone) {
        apiAction.getRedPacketForCustomerToTake().then(res => {
          if (res.redPacketInfo) {
            this.setData({ customerRedPacketInfo: res.redPacketInfo, IS_SHOW_REDPACKET: true })
          }
        })
      }
    })
  },
  // 检查派发红包
  checkRedPacket() {
    // 若已缓存记录领取过红包，则不调用接口
    if (wx.$getStorage('checkedRedPacket')) return Promise.resolve({});
    return apiAction.weGetValidNewerRedPacket().then(data => {
      if (data.listRedPacketDetail && data.listRedPacketDetail.length) {
        let unLogin
        // 若已登录调用领取红包接口
        if (wx.$getStorage('authorization')) {
          unLogin = false
          return this.receiveRedPacket().then(res => {
            let result = {
              unLogin,
              redPacketList: data.listRedPacketDetail,
              redPacketInfo: data.redPacketInfo,
              popRedPacket: true
            };
            Object.assign(result,res)
            return result
          })
        } else {
          return {
            unLogin: true,
            redPacketList: data.listRedPacketDetail,
            redPacketInfo: data.redPacketInfo,
            popRedPacket: true,
            hasReceiveRed: 0
          };
        }
      }
    })
  },
  // 跳转我的红包
  jumpRedPacket() {
    this.$setData({
      popRedPacket: false
    })
    if (this.data.unLogin) {
      wx.$event.on('login', () => {
        this.checkRedPacket()
      })
      app.getPhone(phone => {
        this.receiveRedPacket()
        this.$setData({
          popRedPacket: true,
          unLogin:false
        })
      })
    } else {
      this.$route('/pages/UIC/pages/redPacket/redPacket')
    }
  },

  //领取老客红包
  takeRedPacketById() {
    let params = {
      redPacketId: this.data.customerRedPacketInfo.redPacketId
    };
    apiAction.takeRedPacketById(params).then(res => {
      if (res.success) {
        this.setData({ redPacketTotalMoney: res.totalMoney, IS_SHOW_REDPACKET: false, TAKE_REDPACKET_STATUS: true })
      }
    })
  },
  // 领取红包
  receiveRedPacket(){
    return apiAction.checkSendNewerRedPacket().then(data => {
      if ((data.listCustomerRedPacketInfo && data.listCustomerRedPacketInfo.length) || data.message == '已领取过新人红包'){
        wx.$setStorage('checkedRedPacket', 1)
        return{
          hasReceiveRed: 1
        }
      }else{
        return {
          hasReceiveRed: 0
        }
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      currentPage: 1,
      dynamicList: [],
    })
    this.data.flag = false
    this.data.dynamicListTotal = 0
    this.init()
    util.PromiseAll([this.getAdBannerByStoreId(), this.getStoreWholeGoodsClass(), this.getGroupBuyProducts(), this.getShopServiceList(), this.weGetExperiencePriceGoodsList()]).then(res => {
      this.setData(res);
    })
  },
  //打开下拉最近浏览列表
  showBrowerList(){
    this.setData({ SHADE_SWITCHER: !this.data.SHADE_SWITCHER});
    if (this.data.SHADE_SWITCHER){
      wx.setNavigationBarColor({//设置导航栏颜色
        frontColor: '#000000',//注意frontColor的值只能为000000或者111111
        backgroundColor: "#ffffff"
      });
    }else{
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: util.getSkin(wx.$getStorage('themeId')).color1,
      })
    }
  },
  //切换最近浏览门店或品牌
  selectStore(e){
    let {storeid,type} = e.currentTarget.dataset,
        {shopInfo} = this.data;
    this.data.BRAND_HOME_SWITCHER = false;
    this.data.SHADE_SWITCHER = false;
    if (type == 'selectBrand'){
      this.setData({ BRAND_HOME_SWITCHER: true, SHADE_SWITCHER: false})
    }else if(type == 'selectStore'){
      if(storeid == shopInfo.id){
        this.setData({ BRAND_HOME_SWITCHER: false, SHADE_SWITCHER: false})
      }else{
        app.setShopInfo(storeid, this.getShopInfo)
      }  
    }
    if (this.data.SHADE_SWITCHER) {
      wx.setNavigationBarColor({//设置导航栏颜色
        frontColor: '#000000',//注意frontColor的值只能为000000或者111111
        backgroundColor: "#ffffff"
      });
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: util.getSkin(wx.$getStorage('themeId')).color1,
      })
    }
  },
  // 请求品牌信息
  getBrandInfo() {
    return new Promise(resolve => {
      app.getBrand((brand) => {
        wx.setNavigationBarTitle({
          title: brand.name
        })
        this.data.brand = brand;
        util.PromiseAll([this.getBrandWeAppletColumnSettingSelfApiByBrandId(), this.getAdBannerByBrandId()]).then(res => {
          Object.assign(res,{brand})
          console.log(res)
          resolve(res)
        })
      })
    }).then(res => {
      wx.$event.on('login', () => { apiAction.uvRecord({ brandId: res.brand.brandId })});
      return res;
    })
  },
  getShopCartNumber() {
    if (wx.$getStorage('authorization') && this.data.brand) {
      apiAction.getShopCartNumber(this.data.brand.brandId).then(res => {
        this.setData({ shopCarCount: res.num ? res.num : '' })
      })
    }
  },
  // 美物拼团
  getGroupBuyProducts() {
    return apiAction.getStoreGroupPurchaseGoodsList().then(data => {
      return { groupBuyProducts: data.groupPurchaseGoodsList }
    })
  },
  // 请求推荐美店
  getShopList(type = null) {
    let response = {},
        address = wx.$getStorage('address')
    return apiAction.getRecommendStoreList().then(data => {
      data.storeInfoList.forEach(ele => {
        ele.city = util.replaceCity(ele.city)
      })
      let likelist = data.storeInfoList
      let likelistStr = JSON.stringify(likelist)
      let likelistMd5 = util.getMd5(likelistStr)
      let storeId = wx.$getStorage('storeId')
      let nearbyStoreList;
      if (address) {
        let LOCAL_CITY = util.replaceCity(address.city);
        nearbyStoreList = likelist.filter(ele => ele.city == LOCAL_CITY);
        nearbyStoreList.forEach(ele => {
          ele.distance = util.distance(address.latitude, address.longitude, ele.latitude, ele.longitude);
        })
        nearbyStoreList.sort((a, b) => { return a.distance - b.distance });
        if(storeId){
          app.getShopInfo(this.getShopInfo)
        }else if (nearbyStoreList.length > 0) {
          app.setShopInfo(nearbyStoreList[0].id, this.getShopInfo)
        }else{
          let browerStoreList = wx.$getStorage('browerStoreList');
          this.setData({ BRAND_HOME_SWITCHER: true, browerStoreList })
        }
      }
      // 若有数据更新则重新渲染视图
      if (this.md5Likelist !== likelistMd5) {
        response.likelist = likelist;
        this.md5Likelist = likelistMd5;
        if (type) {
          this.setData(response);
          return null;
        }else{
          return response;
        } 
      }
    }).catch(error => {
      return error
    })
  },
  //获取分类
  getStoreWholeGoodsClass() {
    let { shopInfo } = this.data;
    return apiAction.getStoreWholeGoodsClass({ storeId: shopInfo.id }).then(res => {
      let goodsClass = [];
      if (res.productClassInfo.length > 0) {
        res.productClassInfo.forEach(ele => {
          if (ele.classTwo) {
            goodsClass.push(...ele.classTwo)
          }
        })
      }
      if (res.serviceClassInfo.length > 0) {
        res.serviceClassInfo.forEach(ele => {
          if (ele.classTwo) {
            goodsClass.push(...ele.classTwo)
          }
        })
      }
      goodsClass = goodsClass.sort(function (a, b) {
        return b.orderNo - a.orderNo
      })
      goodsClass = goodsClass.filter((ele, index) => index < 9);
      return { goodsClass }
    })
  },
  //获取广告
  getAdBannerByStoreId(){
    var {shopInfo} = this.data,
        storeId = shopInfo.id;
    return apiAction.getAdBannerByStoreId({storeId}).then(res => {
      if(res.success){
        return { bannerInfoList: res.bannerInfoList}
      }
    })
  },
  //获取品牌中心广告
  getAdBannerByBrandId() {
    return apiAction.getAdBannerByStoreId({ brandId: this.data.brand.brandId, storeId: 0 }).then(res => {
      if (res.success) {
        return { bannerInfoBrandList: res.bannerInfoList }
      }
    })
  },
  // 请求作品动态（现在封面动态就是热门动态）
  getHotSimpleDynamic(type) {
    let params = {
      currentPage: this.data.currentPage,
      pageSize: this.data.pageSize,
      hotS: true
    }
    let response = {};
    return apiAction.getSimpleDynamic(params).then(data => {
      wx.stopPullDownRefresh()
      response.flag = false;
      if (data.weSimpleDynamicList && data.weSimpleDynamicList.length) {
        // 若该动态所在门店已下线，则不显示
        response.dynamicList = this.data.dynamicList.concat(data.weSimpleDynamicList);
        response.ifShowDefault = false;
      } else if (this.data.currentPage == 1) {
        response.ifShowDefault = true;
      }
      response.dynamicListTotal = data.total;
      if (type == 'nextPage') {
        this.setData(response)
      } else {
        return response;
      }
    }).catch(error => {
      return error;
    })
  },

  //进入广告
  getAdDetailByAdId(e){
    let {shopInfo} = this.data,
        {adid} = e.currentTarget.dataset,
        params = {
          storeId: shopInfo.id,
          adId: adid
        };
    apiAction.getAdDetailByAdId(params).then(res => {
      apiAction.switchAdv(res, adid)
    })
  },

  /**
   * 点击号码拨打电话
   */
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.brand.phone
    })
  },

  /**
   * 获取当前用户信息存储到本地
   */
  getaddress() {
    return apiAction.getPosition().then(address => {
      return this.getShopList()
    }).catch(error => {
      return this.getShopList()
    })
  },

  /**
   * 跳转搜索
   */
  jumpSearch() {
    this.$route('/pages/SC/pages/search_purchase/search_purchase')
  },

  //跳转购物车
  jumpShopCar(){
    this.$route('/pages/IC/pages/shopCar/shopCar')
  },

  //跳转切换门店
  jumpShopcate(){
    this.$route('/pages/SC/pages/shopcate/shopcate')
  },

  /**
   * 跳转去过的店
   */
  jumphistory() {
    wx.navigateTo({
      url: '/pages/SC/pages/history/history'
    })
  },

  /**
   * 跳转推荐美店
   */
  jumprecommended() {
    wx.navigateTo({
      url: '/pages/SC/pages/recommended/recommended'
    })
  },
  /**
   * 美物拼团
   */
  jumpProduct_group(){
    wx.navigateTo({
      url: '/pages/IC/pages/product_group/product_group',
    })
  },

  /**
   * 品牌中心页面
   */
  brandJumpTab(e){
    let {url} = e.currentTarget.dataset;
    if (url){
      wx.$route(url);
    }
  },

  /**
   * 跳转作品动态
   */
  jumpWorks() {
    wx.navigateTo({
      url: '/pages/IC/pages/dynamic/dynamic'
    })
  },

  /**
   * 跳转地址
   */
  jumpaddress() {
    if (!this.data.address) {
      return this.getaddress()
    }
    this.$route('/pages/SC/pages/address/address')
  },

  /**
   * 跳转店铺详情
   */
  tostoreDetail(e) {
    this.$route('/pages/SC/pages/details/details', {
      id: e.detail
    })
  },

  // 点击跳转会员卡详情
  jumpVipCardDetail(e) {
    const id = e.currentTarget.dataset.id
    this.$route('/pages/VIP/pages/VipCardDetail/VipCardDetail', { id })
  },
  jumpPurchase() {
    this.$route('/pages/VIP/pages/purchaseRecharge/purchaseRecharge')
  },

  // 跳转全部商品对应分类
  jumpClass(e) {
    const { id, type, name } = e.currentTarget.dataset;
    let page;
    switch(type){
      case 'service':
        page = '/pages/IC/pages/productcatedetails/productcatedetails';
        this.$route(page, {
          classId: id,
          className: name
        });
        break;
      case 'production':
        page = '/pages/IC/pages/goodProduct/goodProduct';
        this.$route(page, {
          classId: id,
          className: name
        });
        break;
      case 'all':
        page = '/pages/IC/pages/productcate/productcate'
        wx.navigateTo({
          url: page,
        })
        break;
    }
    return
  },


  // 快捷入口
  quickEntry(e) {
    const index = e.currentTarget.dataset.index
    switch (index) {
      case 0:
        this.$route('/pages/UIC/pages/QuickOrder/QuickOrder')
        break;
      case 1:
        this.$route('/pages/UIC/pages/myappointment/myappointment')
        break;
      case 2:
        this.$route('/pages/UIC/pages/spendorder/spendorder')
        break;
      case 3:
        this.$route('/pages/VIP/pages/UserVipCard/UserVipCard')
        break;
    }
  },

  jumpVipDiscount() {
    this.$route('/pages/IC/pages/vipDiscount/vipDiscount')
  },

  // 跳转商品详情
  jumpGoodsDetail(e) {
    const { id, type } = e.currentTarget.dataset
    const params = {
      productId: id
    }
    if (type == 'production') params.isProduct = 1
    this.$route('/pages/IC/pages/productdetails/productdetails', params)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.currentPage * this.data.pageSize >= this.data.dynamicListTotal) return
    if (this.data.flag) return;
    this.data.flag = true;
    this.data.currentPage++;
    this.getHotSimpleDynamic('nextPage');
  },
  prevent() {}
})