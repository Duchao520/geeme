var app = null,apiAction = null,util = null
Page({
  data: {
    brandId: null,
    commonCustomerCouponInfoList: [],
    productSpecificationList: [],
    serviceSpecificationList: [],
    goodsList: [],
    storeList: [],
    // STORE_LIST: [],
    SELECTED_ITEMS: ""
  },
  computed: {
    _totalMoney() {
      let { goodsList, SELECTED_ITEMS} = this.data,totalPrice = 0,
        SELECTED_ITEMS_ARR = SELECTED_ITEMS.split(",").filter(ele => ele != "")
      goodsList.forEach(ele => {
        if (SELECTED_ITEMS_ARR.includes(String(ele.id))){
          totalPrice += ele.memberPrice ? util.AccMul(ele.memberPrice, ele.number) : util.AccMul(ele.shopPrice,ele.number);
        }
      });
      return totalPrice;
    },
    STORE_LIST(){
      let {goodsList} = this.data;
      let STORE_LIST = goodsList.map(ele => {
        return JSON.stringify({ storeId: ele.storeId, storeName: ele.storeName, storeImage: ele.storeImage })
      })
      STORE_LIST = Array.from(new Set(STORE_LIST))
      STORE_LIST = STORE_LIST.map(ele => {
        ele = JSON.parse(ele);
        ele.goodsList = goodsList.filter(item => item.storeId == ele.storeId)
        return ele
      })
      return STORE_LIST
    }
  },
  onLoad: function () {
    app = getApp();
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js')
    app.getBrand((brand) => {
      this.data.brandId = brand.brandId;
      this.getShoppingCartInfo();
    })
  },
  onShow(){
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      const tabBarObj = this.getTabBar();
      let tabBar = tabBarObj.data.tabBar.filter(ele => ele.showFlag == 1);
      let index = tabBar.findIndex(value => {
        return value.pagePath == "/pages/tabBar/shopCar/index/index"
      })
      tabBarObj.setData({
        selected: index == -1 ? app.globalData.selected : index
      })
    }
    if (this.data.brandId && wx.$getStorage('authorization')){
      this.getShoppingCartInfo();
    }
  },
  getShoppingCartInfo(){
    let params = {
      brandId: this.data.brandId
    };
    apiAction.getShoppingCartInfo(params).then(res => {
      res.productSpecificationList.forEach(ele => {
        ele.goodsTypeScope = "production"
      })
      res.serviceSpecificationList.forEach(ele => {
        ele.goodsTypeScope = "service"
      })
      let goodsList = res.productSpecificationList.concat(res.serviceSpecificationList);
      
      Object.assign(res, { goodsList, brandId: this.data.brandId})
      this.$setData(res);
    })
  },
  setList(e){
    let {list} = e.detail;
    console.log(list)
    this.setData({goodsList: list})
  },
  //与组件通信勾选项目
  getItem(e){
    let {id} = e.detail,
        {SELECTED_ITEMS,goodsList} = this.data,
        goods = goodsList.filter(ele => ele.id == id)[0],
        SELECTED_ITEMS_ARR = SELECTED_ITEMS.split(','),
        SELECTED_GOODS_ARR = goodsList.filter(ele => SELECTED_ITEMS_ARR.includes(String(ele.id))),
        SELECTED_GOODS_ARR_LENGTH = SELECTED_GOODS_ARR.filter(ele => ele.storeId == goods.storeId).length;
        
    if (SELECTED_ITEMS_ARR.length > 0 && SELECTED_GOODS_ARR_LENGTH !== SELECTED_GOODS_ARR.length){
      wx.showToast({
        title: '暂不支持多门店结算',
        icon: 'none'
      })
      return;
    }
    if (SELECTED_ITEMS_ARR.includes(String(id))){
      SELECTED_ITEMS_ARR = SELECTED_ITEMS_ARR.filter(ele => ele != String(id))
    }else{
      SELECTED_ITEMS_ARR.push(id);
    }
    SELECTED_ITEMS_ARR = SELECTED_ITEMS_ARR.filter(function (s) {
      if(s) return s;
    });
    this.$setData({ SELECTED_ITEMS: SELECTED_ITEMS_ARR.join(',')});
  },
  //全选
  selectAll(){
    let SELECTED_ITEMS_ARR = new Array,
      { goodsList, SELECTED_ITEMS} = this.data;
    console.log(this.data.STORE_LIST);
    if (this.data.STORE_LIST.length > 1){
      wx.showToast({
        title: '暂不支持多门店结算',
        icon: 'none'
      })
      return;
    }
    let SELECTED_ITEMS_ARR_A = SELECTED_ITEMS.split(',').filter(ele => ele!='');
    if (SELECTED_ITEMS_ARR_A.length < goodsList.length){
      goodsList.forEach(ele => {
        SELECTED_ITEMS_ARR.push(ele.id);
      });
      SELECTED_ITEMS = SELECTED_ITEMS_ARR.join(',');
    }else{
      SELECTED_ITEMS = ""
    }
    this.$setData({ SELECTED_ITEMS})
  },
  //删除商品
  deleteGoods(e){
    let { index } = e.detail,
      { goodsList, brandId, SELECTED_ITEMS } = this.data,
      SELECTED_ITEMS_ARR = SELECTED_ITEMS.split(',').filter(ele => ele != ''),
      goods = goodsList[index],
      params = {
        brandId: Number(brandId),
        deleteShoppingCartGoodList: [
          { goodsTypeScope: goods.goodsTypeScope,specificationId: goods.id}
        ]
      }
    apiAction.deletedShoppingCart(params).then(res => {
      if (res.success) {
        SELECTED_ITEMS_ARR = SELECTED_ITEMS_ARR.filter(ele => ele != goods.id);
        SELECTED_ITEMS = SELECTED_ITEMS_ARR.join(',');
        goodsList = goodsList.filter(ele => ele.id != goods.id);
        this.$setData({ SELECTED_ITEMS, goodsList});
        wx.showToast({
          title: '已删除',
        })
      }
    })
  },
  submit(){
    let { SELECTED_ITEMS, goodsList } = this.data, 
        SELECTED_ITEMS_ARR = SELECTED_ITEMS.split(',').filter(ele => ele != ''),
        infoList = goodsList.filter(ele => SELECTED_ITEMS_ARR.includes(String(ele.id)));  //筛选已选商品
        
        if(infoList.length > 0){
          app.globalData.shopCar.infoList = infoList;
          wx.$route('/pages/TC/pages/shopCarOrder/shopCarOrder')
        }else{
          wx.showToast({
            title: '您还没有选择宝贝哦',
            icon: 'none'
          })
        }

  }
})