const apiAction = require('../../../../utils/apiAction.js');
const app = getApp()
Page({
  $name:'searchresults_purchase',
  data: {
    logo:null,
    keyword: '',
    currentPage:0,
    pageSize:10,
    total:0,
    flag:false,
    goodsName:'',
    goodsType:'service',  // service, production, card
    list:null,
    currentTab:0,
    goodsTypeArr:['service', 'production', 'card'],
  },
  onLoad(options) {
    this.$setData({
      keyword: options.keyword
    })
    app.getBrand( brand => {
      this.$setData({
        logo:brand.logo
      })
    })
    this.search()
  },
  switchTab(e){
    this.$setData({
      currentTab:e.detail.index,
      list:[]
    })
    this.data.goodsType = this.data.goodsTypeArr[e.detail.index]
    this.search()
  },
  confirm(e) {
    const keyword = e.detail
    if (!keyword.length) {
      return;
    }
    this.data.keyword = keyword
    this.$setData({
      list:[]
    })
    app.addSearchHistory('purchase', keyword)
    this.search(keyword)
  },
  search() {
    const {currentPage, pageSize, goodsType} = this.data
    const params = {
      currentPage,
      pageSize,
      storeId: wx.$getStorage('storeId'),
      goodsName:this.data.keyword,
      goodsType,
    }
    wx.$showLoading()
    apiAction.weGetStoreGoodsInfoByGoodsName(params).then(data => {
      wx.$hideLoading()
      let list = this.data.currentTab == 2 ? data.cardInfoList : data.goodsInfoList
      list = this.data.currentPage == 0 ? list : this.data.list.concat(list)
      this.$setData({
        list
      })
      this.data.total = data.total
      this.data.flag = false
    })
  },
  onReachBottom(){
    if(this.data.flag) return
    if((this.data.currentPage + 1) * this.data.pageSize >= this.data.total) return
    this.data.flag = true
    this.data.currentPage++
    this.search()
  }
})