// pages/IC/pages/works/works.js
const apiAction = require('../../../../utils/apiAction.js')
Page({
  data: {
    tabList: ['热门', '关注', '视频'],
    worksList:[],
    // 加载更多用
    flag:false,
    total:0,
    currentPage: 1,
    pageSize: 10,
    // 当前tab
    currentTab:0,
    // 搜索关键字
    keyWord:'',
  },

  search(e) {
    this.data.keyWord = e.detail
    this.data.currentPage = 1
    this.$setData({
      worksList: []
    })
    this.getDynamic()
  },

  // 切换tab
  switchTab(e){
    this.setCurrentTab(e.detail.index)
  },

  // 设置当前tab
  setCurrentTab(index){
    this.setData({
      worksList:[],
      currentPage:1,
      currentTab:index,
    })
    this.data.keyWord = ''
    this.getDynamic()
  },

  // 获取动态
  getDynamic(){
    if(this.data.keyWord){
      return this.weCustomerSearchDynamics()
    }else{
      switch (this.data.currentTab) {
        case 0:
          return this.getHotSimpleDynamic()
        case 1:
          return this.getAttentiveSimpleDynamic();
        case 2:
          // todo:视频
          return;
        default:
          return;
      }
    }
  },

  // 搜索动态
  weCustomerSearchDynamics() {
    const { keyWord, currentPage, pageSize } = this.data
    const params = {
      keyWord,
      pageNum: currentPage,
      pageSize
    }
    apiAction.weCustomerSearchDynamics(params).then( data => {
      if (data.simpleStaffDynamicWork){
        this.setData({
          worksList: this.data.worksList.concat(data.simpleStaffDynamicWork),
          total: data.total
        })
      }  
      this.data.flag = false
    })
  },

  // 获取热门动态
  getHotSimpleDynamic(){
    apiAction.getHotSimpleDynamic(this.data.currentPage, this.data.pageSize).then( data => {
      if (data.weSimpleDynamicList){
        this.setData({
          total: data.total,
          worksList: this.data.worksList.concat(data.weSimpleDynamicList)
        })
      }
      this.data.flag = false
    })
  },

  // 获取关注动态
  getAttentiveSimpleDynamic(){
    apiAction.getAttentiveSimpleDynamic(this.data.currentPage, this.data.pageSize).then( data => {
      if (data.weSimpleDynamicList){
        this.setData({
          total: data.total,
          worksList: this.data.worksList.concat(data.weSimpleDynamicList)
        })
      }
      this.data.flag = false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDynamic();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.flag) return
    if (this.data.currentPage * this.data.pageSize >= this.data.total) return
    this.data.flag = true
    this.data.currentPage++
    this.getDynamic();
  },
})