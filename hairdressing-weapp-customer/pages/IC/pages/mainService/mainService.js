// pages/IC/pages/goodProduct/goodProduct.js
var apiAction = null, util = null;
Page({
  data: {
    goodsList: [],
    keyword: '',
    goodsOrderByEnums: ['SMART_ORDER', 'PRICE_ASC', 'SCORE_DESC', 'ASSESSMENT_DESC',],  // 智能排序、价格最低、评分最高、评价最多
    goodsOrderByEnum: 'SMART_ORDER',
    productLevelOne: null,
    productLevelTwo: null,
    tagId: null,
    pageNum: 0,
    pageSize: 200,
    total: 0,
    flag: false,
    // 筛选条件相关
    tabs: ['全部项目', '智能排序', '筛选'],
    activeTab: -1,
    sortMethods: ['智能排序', '价格最低', '评分最高', '评价最多'],
    sortInfoList: null,  // 从后台请求的分类信息
    tagsInfoList: null,
    activeTagId: 0,  // 活动标签
    // 顶部吸附相关
    scrollTop:null,
    isFixed:false,
    priceRange_from:null, // 价格区间-最低价
    priceRange_to:null, // 价格区间-最高价
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    let renderData = {};
    if (options.classId) {
      Object.assign(renderData, {
        'tabs[0]': options.className
      });
      this.data.productLevelTwo = options.classId
    }
    util.PromiseAll([
      this.getClassInfo(),this.getProductList(),this.getTagsInfo()
      ]).then(res => {
      Object.assign(renderData,res);
      this.$setData(renderData);
      return renderData;
    })
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    this.data = null;
  },
  // 监听屏幕滚动
  onPageScroll(e) {
    this.$setData({
      scrollTop: e.scrollTop
    })
  },
  // 改变吸附状态
  changeFix(e) {
    this.setData({
      isFixed: e.detail
    })
  },
  initPage() {
    this.data.pageNum = 0
    this.$setData({
      goodsList: [],
    })
  },
  popup(e) {
    const index = e.detail.index
    this.$setData({
      activeTab: index
    })
  },
  search(e) {
    this.data.keyword = e.detail
    this.initPage()
    this.getProductList().then(res => {this.$setData(res);return res})
  },
  selectClass(e) {
    const { parentId, parentName, childId, childName } = e.detail

    this.data.productLevelOne = parentId == 0 ? null : parentId
    this.data.productLevelTwo = childId == 0 ? null : childId
    const tab0 = childId == 0 ? parentName : childName
    this.$setData({
      activeTab: -1,
      'tabs[0]': tab0
    })
    this.initPage()
    this.getProductList().then(res => { this.$setData(res); return res })
  },
  selectSort(e) {
    this.setData({
      'tabs[1]': e.detail.item,
      activeTab: -1
    })
    this.data.goodsOrderByEnum = this.data.goodsOrderByEnums[e.detail.index]
    this.initPage()
    this.getProductList().then(res => { this.$setData(res); return res })
  },
  getClassInfo() {
    return apiAction.weGetStoreClassInfoInUsing('service').then(data => {
      // 组织数据结构，使其符合PopDoubleColumn所需格式
      for (const p of data.storeSortInfoList) {
        p.name = p.sortName
        p.children = p.sortTwoList
        p.id = p.jimeiClassId
        for (const c of p.children) {
          c.name = c.sortName
          c.id = c.jimeiClassId
          c.parentId = p.id
        }
        p.children.unshift({
          name: '全部',
          id: 0,
          parentId: p.id
        })
      }
      // 添加全部分类
      data.storeSortInfoList.unshift({
        name: '全部分类',
        id: 0,
        children: [{
          name: '全部分类',
          id: 0,
          parentId: 0,
        }]
      })
      return {
        sortInfoList: data.storeSortInfoList
      }
    })
  },
  // 获取服务列表
  getProductList() {
    const { pageNum, pageSize, goodsOrderByEnum, keyword, productLevelOne, productLevelTwo, tagId } = this.data
    let params = {
      pageNum: pageNum,
      pageSize: pageSize,
      goodsOrderByEnum,
      goodsName:keyword,
      goodsLevelOneId: productLevelOne,
      goodsLevelTwoId: productLevelTwo,
      tagId: tagId == 0 ? null : tagId,
      shopId: wx.$getStorage('storeId'),
    }

    // 判断是否设置价格区间
    if(this.data.priceRange_from || this.data.priceRange_to){
      params.priceRange = {
        from:this.data.priceRange_from || 0,
        to:this.data.priceRange_to
      }
    }

    wx.showLoading()
    return apiAction.getServiceList(params).then(data => {
      wx.hideLoading()
      if (!data.serviceInfoList.length) {
        return {};
      }
      let list = this.data.pageNum == 0 ? data.serviceInfoList : this.data.goodsList.concat(data.serviceInfoList)
      this.data.total = data.total;
      this.data.flag = false;
      return {
        goodsList: list
      }
    })
  },
  getTagsInfo() {
    return apiAction.weGetStoreGoodsTagsInUsing('service').then(data => {
      data.goodsTagInfoList.unshift({
        name: '全部',
        id: 0
      })
      return {
        tagsInfoList: data.goodsTagInfoList
      }
    })
  },
  // 确定-提交筛选表单
  confirmFilter() {
    // 判断价格区间是否合法
    if(this.data.priceRange_from && this.data.priceRange_to){
      if(Number(this.data.priceRange_from) > Number(this.data.priceRange_to)){
        return wx.showToast({
          title: '价格区间设置不合理',
          icon:'none'
        })
      }
    }
    this.$setData({
      activeTab: -1,
      tagId: this.data.activeTagId,
    })
    this.initPage()
    this.getProductList().then(res => { this.$setData(res); return res })
  },
  // 重置筛选条件
  resetFilter() {
    this.$setData({
      activeTab: -1,
      tagId: 0,
      activeTagId: 0,
      priceRange_from:null,
      priceRange_to:null
    })
    this.initPage()
    this.getProductList().then(res => { this.$setData(res); return res })
  },
  // 输入最低价
  inputPriceRange_from(e){
    this.$setData({
      priceRange_from:e.detail.value
    })
  },
  // 输入最高价
  inputPriceRange_to(e){
    this.$setData({
      priceRange_to:e.detail.value
    })
  },
  // 页面上拉触底事件的处理函数
  onReachBottom() {
    if (this.data.flag) return
    if ((this.data.pageNum + 1) * this.data.pageSize >= this.data.total) return
    this.data.flag = true;
    this.data.pageNum++;
    this.getProductList().then(res => { this.$setData(res); return res });
  },
  prevent() { }
})