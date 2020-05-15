// pages/SC/pages/customerDetail/customerDetail.js
const app = getApp()
const fetch = require('../../../../utils/fetch.js');
Page({
  data: {
    tabList: ['基本资料', '消费记录', '会员卡', '备注'],
    currentTab:0,
    logo:null,
    Notes: null
  },
  onLoad(options) {
    this.id = options.id
    this.fetchBaseInfo()
    app.getBrandInfo( info => {
      this.$setData({
        logo:info.logo
      })
    })
  },
  onShow(){
    this.getListByStoreCustomerId()
  },
  // 请求基本资料
  fetchBaseInfo(){
    this.$get('/weGetCustomerBaseInfoById/' + this.id).then( data => {
      this.$setData({
        info: data,
        baseInfo:data.baseInfo,
        editable:false
      })
    })
  },
  // 请求消费记录
  getRecords(){
    this.currentPage = this.currentPage || 0
    this.$post('/weCustomerConsumerOrderAchieves', {currentPage:this.currentPage, pageSize:10, customerId:this.id}).then( data => {
      this.flag = false
      const list = this.currentPage == 0 ? data.consumerOrderList : this.data.records.concat(data.consumerOrderList)
      this.$setData({
        records:list
      })
      this.total = data.total
    })
  },
  // 请求会员卡
  getCards(){
    this.$post('/weGetBrandCustomerCardByStoreCustomerId', { brandId: wx.$getStorage('brandId'), storeId: wx.$getStorage('storeId'), customerId:this.id}).then( data => {
      this.$setData({
        cards: data.weCustomerCardInfoList
      })
    })
  },
  // 切换tab
  switchTab(e){
    const {index} = e.detail
    this.$setData({
      currentTab:index
    })
    if(index == 1 && !this.data.records){
      this.getRecords()
    }else if(index == 2 && !this.data.cards){
      this.getCards()
    } else if (index == 3 && !this.data.Notes){
      this.getListByStoreCustomerId()
    }
  },

  /**
   * 请求备注记录
   */
  getListByStoreCustomerId(){
    let _self = this;
    this.notePage = this.notePage || 0
    let _data = {
      storeCustomerId: this.id,
      currentPage: this.notePage,
      pageSize: 10
    };
    fetch.getListByStoreCustomerId(_data).then(res => {
      this.flag = false
      const list = this.notePage == 0 ? res.customerRemarkResponseList : this.data.Notes.concat(res.customerRemarkResponseList)
      console.log(list)
      this.setData({
        Notes: list
      })
      this.noteTotal = res.total
    })
  },
  toAddNotes(){
    this.$route(`/pages/SC/pages/addNotes/addNotes?customerId=${this.id}`)
  },
  onReachBottom(){
    if (this.data.currentTab != 1 && this.data.currentTab != 3) return
    if(this.flag) return
    if (this.data.currentTab == 1){
      if ((this.currentPage + 1) * (this.pageSize || 10) >= this.total) return
      this.flag = true
      this.currentPage++
      this.getRecords()
    } else if (this.data.currentTab == 3){
      if ((this.notePage + 1) * (this.pageSize || 10) >= this.noteTotal) return
      this.flag = true
      this.notePage++
      this.getListByStoreCustomerId()
    }
    
  }
})