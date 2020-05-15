// pages/VIP/pages/VipCardCateDetail/VipCardCateDetail.js
const apiAction = require('../../../../utils/apiAction.js')
const app = getApp()
Page({
  data: {
    queryType: 0, // 0-全部 1-储值卡 2-身份卡
    supperRecommend: null, // 是否超值推荐
    //加载更多
    pageNum: 0,
    pageSize: 10,
    total: 0,
    flag: false,
    // 品牌logo
    logo: null,
    // 卡项列表
    list: [],
    shopInfo: null
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      logo: app.globalData.brandInfo.logo
    })
    let queryType = 0
    switch (Number(options.kindId)) {
      // 超值推荐
      case -1:
        queryType = 0
        this.data.supperRecommend = true
        break;
        // 身份卡
      case 0:
        queryType = 2;
        break;
        // 储值卡
      case 1:
        queryType = 1
        break;
      case 2:
        queryType = 3
        break;
      case 3:
        queryType = 4
        break;
    }
    this.data.queryType = queryType
    app.getShopInfo((shopInfo) => {
      this.data.shopInfo = shopInfo;
      this.fetch()
    })
  },
  fetch() {
    const {
      pageNum,
      pageSize,
      queryType,
      supperRecommend
    } = this.data
    const params = {
      pageNum,
      pageSize,
      queryType,
      supperRecommend,
      upperStatus: 0, // 0-已上架 1-未上架
      storeId: wx.$getStorage('storeId')
    }
    apiAction.weappPagedQueryStoreCardKindBasicInfo(params).then(data => {
      this.data.flag = false;
      data.listCardKindBasicInfo.forEach(ele => {
        ele.address = this.data.shopInfo.shopName;
      })
      this.$setData({
        list: this.data.list.concat(data.listCardKindBasicInfo)
      })
      this.data.total = data.total
    })
  },
  jumpVipCardDetail(e) {
    this.$route('/pages/VIP/pages/VipCardDetail/VipCardDetail', {
      id: e.currentTarget.dataset.id
    })
  },
  // 加载更多
  onReachBottom() {
    if ((this.data.pageNum + 1) * this.data.pageSize >= this.data.total) return
    if (this.data.flag) return
    this.data.pageNum++
    this.data.flag = true
    this.fetch()
  }
})