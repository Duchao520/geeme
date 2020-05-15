// 引入地图api封装对象
const util = require('../../../../utils/util.js');
const apiAction = require('../../../../utils/apiAction.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandId: null,
    phone: null,
    tabList: ['连锁门店', '关于我们', '品牌相册'],
    storeInfoList: [],
    brandInfo: {
      brandName: null,
      logo: null,
      rate: null,
      staffNum: null,
      score: null,
      storeNum: null,
      total: null
    },
    address: null,
    aboutContent: null,
    photos: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    app.getBrand(brand => {
      this.data.brandId = brand.brandId;
      this.data.phone = brand.phone;
      this.getBrandIntroduction();
      util.PromiseAll([this.weGetBrandCentral(), this.getRecommendStoreList()]).then(res => {
        Object.assign(res, {
          address: wx.$getStorage('address')
        })
        this.$setData(res)
      })
    })
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: app.globalData.selected
      })
    }
  },
  weGetBrandCentral() {
    return apiAction.weGetBrandCentral().then(res => {
      if (res.success) {
        return {
          brandInfo: {
            brandName: res.brandName,
            logo: res.logo,
            rate: res.rate,
            staffNum: res.staffNum,
            score: res.store,
            storeNum: res.storeNum,
            total: res.total
          }
        }
      }
    })
  },
  getRecommendStoreList() {
    return apiAction.getRecommendStoreList().then(res => {
      Object.assign(res, {
        currentTab: 0
      });
      return res;
    })
  },
  replaceDetail(details) {
    var texts = ''; //待拼接的内容
    while (details.indexOf('<img') != -1) { //寻找img 循环
      texts += details.substring('0', details.indexOf('<img') + 4); //截取到<img前面的内容
      details = details.substring(details.indexOf('<img') + 4); //<img 后面的内容
      if (details.indexOf('style=') != -1 && details.indexOf('style=') < details.indexOf('>')) {
        texts += details.substring(0, details.indexOf('style="') + 7) + "max-width:100%;height:auto;margin:0 auto;"; //从 <img 后面的内容 截取到style= 加上自己要加的内容
        details = details.substring(details.indexOf('style="') + 7); //style后面的内容拼接
      } else {
        texts += ' style="max-width:100%;height:auto;margin:0 auto;" ';
      }
    }
    texts += details; //最后拼接的内容
    return texts
  },

  //获取门店介绍-关于我们-品牌相册
  getBrandIntroduction(type = 1) {
    return apiAction.getBrandIntroduction({
      brandId: this.data.brandId,
      type
    }).then(res => {
      if (type == 1) {
        return {
          aboutContent: res.content ? this.replaceDetail(res.content) : res.content,
          currentTab: 1
        }
      } else {
        return {
          photos: res.content ? this.replaceDetail(res.content) : res.content,
          currentTab: 2
        }
      }
    })
  },
  switchTab(e) {
    let {
      index
    } = e.detail, promise;
    switch (index) {
      case 0:
        promise = this.getRecommendStoreList();
        break;
      case 1:
        promise = this.getBrandIntroduction(1);
        break;
      case 2:
        promise = this.getBrandIntroduction(2);
        break;
    }
    promise.then(res => {
      this.$setData(res)
    })
  },
  tel() {
    if (this.data.phone) {
      wx.makePhoneCall({
        phoneNumber: this.data.phone
      })
    } else {
      wx.showToast({
        title: '商家还未设置联系方式',
      })
    }
  }

})