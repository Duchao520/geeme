// 引入地图api封装对象
const util = require('../../../../utils/util.js');
const apiAction = require('../../../../utils/apiAction.js')
//获取应用实例
const app = getApp();
Page({
  data: {
    // 品牌参数
    brand: '',
    // 组件数据(推荐美店)
    likelist: '',
    // 作品动态
    dynamicList: [],
    bannerInfoBrandList: [],//品牌中心广告
    allGoodsClass: [],
    dynamicListTotal: 0,
    // 判断动态加载更多，true:加载中 
    flag: false,
    tabShow: false,
    currentPage: 1,
    pageSize: 10,
    customerRedPacketInfo: null,  //老客红包,
    TAKE_REDPACKET_STATUS: false,     //领取是否成功,
    IS_SHOW_REDPACKET: false,     //是否显示红包
    ifShowDefault: false, // 显示动态缺省
    popRedPacket: false, // 是否显示红包
    redPacketList: null, // 红包信息
    themeId: 1,
    groupBuyProducts: [],
    bg_redPacket1: '651b972d245a451fb092f799f61e7b9a',
    bg_redPacket2: '495580830a0b41c4b89b1b1454421448',
    bg_redPacket3: "https://image.geeme.cn/images/a923751ae8d340b1a4b8b74f49de6df2",
    businessCategoryInfoList: null,
    queryParams:{
      goodsOrderByEnum: "SMART_ORDER",
      pageNum: 0,
      pageSize: 10,
      productLevelTwo: '',
      storeId: '',
      classType: 'production'
    },
    productInfos: [],
    GOODS_SWITCHER: true,
    arrangement: true   //排列方式
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
  onShow(){
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
    this.getRedPacketForCustomerToTake();
  },
  onShareAppMessage(){
    
  },
  init() {
    let promiseArr = [];
    this.getShopInfo().then(res => {
      promiseArr.push(this.getBrandInfo())
      promiseArr.push(this.getaddress())
      promiseArr.push(this.checkRedPacket())
      promiseArr.push(this.getGroupBuyProducts())
      promiseArr.push(this.getShopList('refresh'))
      util.PromiseAll(promiseArr).then(result => {
        wx.stopPullDownRefresh();
        Object.assign(res,result);
        this.setData(res);
        res = null;
        promiseArr = null;
      })
    })
    promiseArr.push(this.getShopInfo())
    
  },
  getShopInfo(){
    return new Promise((resolve, reject) => {
      app.getShopInfo(shopInfo => {
        if (shopInfo) {
          // return this.getHotSimpleDynamic().then(res => {
          //   resolve(res)
          // })
          resolve(shopInfo)
        } else {
          resolve({ abnormal: true })
        }
      })
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
          this.receiveRedPacket()
        } else {
          unLogin = true
        }
        return {
          unLogin,
          redPacketList: data.listRedPacketDetail,
          redPacketInfo: data.redPacketInfo,
          popRedPacket: true
        };
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
  // 领取红包
  receiveRedPacket(){
    console.log('领取')
    apiAction.checkSendNewerRedPacket().then(data => {
      if ((data.listCustomerRedPacketInfo && data.listCustomerRedPacketInfo.length) || data.message == '已领取过新人红包'){
        wx.$setStorage('checkedRedPacket', 1)
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
  },
  // 请求品牌信息
  getBrandInfo() {
    return new Promise(resolve => {
      app.getBrand((brand) => {
        this.data.brand = brand;
        wx.setNavigationBarTitle({
          title: brand.name
        })
        resolve({ brand})
      })
    }).then(res => {
      wx.$event.on('login', () => { apiAction.uvRecord({ brandId: res.brand.brandId })})
      return util.PromiseAll([
        this.getStoreWholeGoodsClass(res.brand.brandId),
        this.getAdBannerByBrandId(res.brand.brandId)
      ]).then(result => {
        Object.assign(res, result);
        return res;
      })
    })
  },
  getCategorySortForApi(brandId){
    return apiAction.getCategorySortForApi({brandId,limit: 10}).then(res => {
      return res;
    })
  },
  // 请求推荐美店
  getShopList(type = null) {
    let response = {}
    return apiAction.getRecommendStoreList().then(data => {
      let likelist = data.storeInfoList
      let likelistStr = JSON.stringify(likelist)
      let likelistMd5 = util.getMd5(likelistStr)
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
  

  //修改商品排列方式
  changeArrangement() {
    this.setData({ arrangement: !this.data.arrangement })
  },

  //获取分类
  getStoreWholeGoodsClass(brandId) {
    let { allGoodsClass } = this.data;
    return util.PromiseAll([
      apiAction.getProductSortList({brandId}),
      apiAction.getStoreSortInfo({brandId})
    ]).then(res => {
      if (res.productSortList.length > 0) {
        res.productSortList.forEach(ele => {
          if (ele.sortTwo) {
            ele.sortTwo.forEach(item => {
              item.goodsTypeScope = 'production'
            })
            allGoodsClass.push(...ele.sortTwo)
          }
        })
      }
      if (res.serviceSortList.length > 0) {
        res.serviceSortList.forEach(ele => {
          if (ele.sortTwo) {
            ele.sortTwo.forEach(item => {
              item.goodsTypeScope = 'service'
            })
            allGoodsClass.push(...ele.sortTwo)
          }
        })
      }
      allGoodsClass = allGoodsClass.sort(function (a, b) {
        return b.orderNo - a.orderNo
      })
      allGoodsClass = allGoodsClass.filter(ele => ele.associateNum > 0)
      let goodsClass = allGoodsClass.filter((ele, index) => index < 9);
      this.data.queryParams.productLevelTwo = allGoodsClass[0].jimeiClassId;
      this.data.queryParams.classType = allGoodsClass[0].goodsTypeScope;
      this.getProductList('firstPage').then(products => {
        this.setData(products)
      })
      return { goodsClass, allGoodsClass, tabShow: true }
    })
  },

  // 获取产品列表
  getProductList(type = 'firstPage') {
    let { queryParams, productInfos, GOODS_SWITCHER} = this.data;
    if (!GOODS_SWITCHER) {return Promise.resolve({})}
    if(type == 'firstPage'){
      this.setData({ productInfos: []})
      queryParams.pageNum = 0;
      queryParams.brandId = this.data.brand.brandId;
    }else{
      if (queryParams.classType == 'service' || queryParams.classType == 'all') { return Promise.resolve({})}
      queryParams.pageNum++;
      queryParams.brandId = this.data.brand.brandId;
      this.data.GOODS_SWITCHER = false;
    };
    this.data.queryParams = queryParams;
    wx.showLoading()
    if (queryParams.classType == 'production'){
      return apiAction.weGetBrandProductListByCondition(queryParams).then(data => {
        wx.hideLoading()
        data.productInfos.forEach(ele => {
          ele.type = 'product'
        })
        if (type == 'firstPage') {
          productInfos = data.productInfos;
        } else {
          productInfos = productInfos.concat(data.productInfos);
        }
        this.data.total = data.total;
        this.data.GOODS_SWITCHER = true;
        return {
          productInfos: productInfos
        }
      })
    } else if (queryParams.classType == 'service'){
      
      return apiAction.getBrandServiceListByStoreIdAndSortInfo(queryParams.brandId,null, queryParams.productLevelTwo).then(res => {
        wx.hideLoading()
        res.serviceInfos.forEach(ele => {
          ele.type = 'service'
        })
        productInfos = res.serviceInfos;
        this.data.GOODS_SWITCHER = true;
        return {
          productInfos: productInfos
        }
      })
    }else{
      wx.hideLoading()
      return apiAction.getGoodsForFirstPage().then(data => {
        return { productInfos: data.goodsForFirstPageInfoList }
      })
    }
    
  },

  switchTab(e){
    let {id,type} = e.detail,
        {queryParams} = this.data;
        console.log(e)
    queryParams.productLevelTwo = id;
    queryParams.classType = type;
    this.data.queryParams = queryParams;
    this.getProductList('firstPage').then(res => {
      this.setData(res)
    })
  },

  //获取品牌中心广告
  getAdBannerByBrandId(brandId) {
    return apiAction.getAdBannerByStoreId({ brandId: brandId, storeId: 0 }).then(res => {
      if (res.success) {
        return { bannerInfoBrandList: res.bannerInfoList }
      }
    })
  },

  // 跳转全部商品对应分类
  jumpClass(e) {
    const { id, type, name } = e.currentTarget.dataset;
    let page;
    switch (type) {
      case 'service':
        page = '/pages/IC/pages/productcateBrand/productcateBrand';
        this.$route(page, {
          classId: id,
          className: name
        });
        break;
      case 'production':
        page = '/pages/IC/pages/goodsProductBrand/goodsProductBrand';
        this.$route(page, {
          classId: id,
          className: name
        });
        break;
      case 'all':
        page = '/pages/IC/pages/brandProductcate/brandProductcate'
        this.$route(page);
        break;
    }
    return
  },

  //进入广告
  getAdDetailByAdId(e) {
    let { shopInfo } = this.data,
      { adid } = e.currentTarget.dataset,
      params = {
        storeId: shopInfo.id,
        adId: adid
      };
    apiAction.getAdDetailByAdId(params).then(res => {
      apiAction.switchAdv(res, adid)
    })
  },

  // 美物拼团
  getGroupBuyProducts() {
    return apiAction.getStoreGroupPurchaseGoodsList().then(data => {
      return { groupBuyProducts: data.groupPurchaseGoodsList }
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
    this.$route('/pages/SC/pages/search/search')
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

  // 跳转美物拼团
  jumpProduct_group() {
    this.$place('groupBuyProducts', this.data.groupBuyProducts)
    this.$route('/pages/IC/pages/product_group/product_group')
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

  // 跳转商品详情
  jumpGoodsDetail(e) {
    const { id, type } = e.currentTarget.dataset
    const params = {
      productId: id
    }
    if (type == 'production') params.isProduct = 1
    this.$route('/pages/IC/pages/productdetails/productdetails', params)
  },

  jumpBrandHome(){
    this.$route('/pages/tabBar/brandCenter/index/index')
  },

  /**
   * 跳转店铺详情
   */
  tostoreDetail(e) {
    this.$route('/pages/SC/pages/details/details', {
      id: e.detail
    })
  },

  // 快捷入口
  quickEntry(e) {
    let {index,id} = e.currentTarget.dataset
    switch (index) {
      case 0:
        let query = {categaryId: id};
        this.$route('/pages/SC/pages/recommended/recommended',query)
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
  // 跳转店铺导航页面
  jumpMaps() {
    this.$route('/pages/SC/pages/maps/maps');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.getProductList('nextPage');
  },
  prevent() {}
})