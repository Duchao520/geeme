// pages/UIC/pages/GetAddressPermission/GetAddressPermission.js
const fetch = require('../../../../utils/fetch.js');
const app = getApp();
Page({
  data: {
    brand: null,
    // 封面动态加载更多相关
    currentPage: 1,
    pageSize: 10,
    flag: false,
    total: 0,
    worksList: [],
    brandId:null, // 当前brandId
  },
  onLoad(options) {
    if (!wx.$getStorage('authorization')) {
      wx.reLaunch({
        url: '/pages/Login/loginIndex/loginIndex'
      })
      return
    }
    if (!wx.$getStorage('brandId')) {
      wx.reLaunch({
        url: '/pages/Login/chooseBrandStore/chooseBrandStore'
      })
      return
    }
    this.data.brandId = wx.$getStorage('brandId')
    this.init()
  },
  onShow(){
    if(!this.$status.isFirstShow){
      if(this.data.brandId != wx.$getStorage('brandId')){
        this.data.brandId = wx.$getStorage('brandId')
        this.init()
      }
    }
  },
  init() {
    this.getStaffHotSimpleDynamic()
    this.getBrandInfo()
  },
  onPullDownRefresh() {
    this.$setData({
      worksList: []
    })
    this.data.currentPage = 1
    this.data.flag = false
    this.init()
  },
  getBrandInfo() {
    app.getBrandInfo((brandInfo) => {
      wx.setNavigationBarTitle({
        title: brandInfo.name,
      })
      this.$setData({
        brand: brandInfo
      })
    })
  },
  /**
   * 快捷入口
   */
  quickEntry(e) {
    let funcName = e.currentTarget.dataset.title;
    const index = e.currentTarget.dataset.index
    switch (index) {
      // 预约码
      case 0:
        this.$route('/pages/UIC/pages/appointmentCode/appointmentCode')
        break;
      // 我的预约
      case 1:
        wx.switchTab({
          url: '/pages/tabBar/DailyWork/index/index',
        })
        break;
      // 扫码开单
      case 2:
        wx.scanCode({
          success:res => {
            console.log('扫码', res)
            if(res.path){
              wx.navigateTo({
                url: '/' + res.path,
              })
            }else{
              wx.showToast({
                title: '错误的开单码',
                icon:'none'
              })
            }
          }
        })
        break;
      // 我的服务单
      case 3:
        this.$route('/pages/UIC/pages/serviceOrderList/serviceOrderList')
        break;
    }
  },
  /**
   * 去服务者榜单
   */
  tostaffList() {
    wx.navigateTo({
      url: '/pages/SC/pages/staffList/staffList'
    })
  },

  /**
   * 去门店榜单
   */
  tostoreList() {
    wx.navigateTo({
      url: '/pages/IC/pages/storeList/storeList'
    })
  },

  /**
   * HomeList->去发型师详情
   */
  tostaffDetail() {
    wx.navigateTo({
      url: '/pages/SC/pages/staffDetail/staffDetail'
    })
  },

  /**
   * WorksList->去作品详情
   */
  toworksDetail() {
    wx.navigateTo({
      url: '/pages/SC/pages/worksDetail/worksDetail'
    })
  },

  /**
   * HomeStoreList->去店铺详情
   */
  tostoreDetail() {
    wx.navigateTo({
      url: '/pages/IC/pages/storeDetail/storeDetail'
    })
  },

  // 封面动态暂时等于热门动态
  getStaffHotSimpleDynamic() {
    fetch.getStaffHotSimpleDynamic(this.data.currentPage, this.data.pageSize).then(data => {
      wx.stopPullDownRefresh()
      this.data.flag = false
      if (data.weStaffSimpleDynamicList && data.weStaffSimpleDynamicList.length) {
        let worksList = this.data.currentPage == 1 ? data.weStaffSimpleDynamicList : this.data.worksList.concat(data.weStaffSimpleDynamicList)
        this.$setData({
          worksList,
          total: data.total,
        })
      }
    })
  },
  // 拨打品牌热线
  makePhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.brand.hotline,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.flag) return
    if (this.data.currentPage * this.data.pageSize >= this.data.total) return
    this.data.flag = true
    this.data.currentPage++;
    this.getStaffHotSimpleDynamic()
  },

})